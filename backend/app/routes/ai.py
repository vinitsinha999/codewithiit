from groq import Groq
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import json
import re
import asyncio
from sqlalchemy import text

from app.core.config import settings
from app.core.dependencies import get_current_user
from app.db.database import AsyncSessionLocal
from app.models.user import User

router = APIRouter(prefix="/api/ai", tags=["AI"])

POOL_TARGET = 100
SEND_COUNT = 20
MIN_IN_DB = 20
BATCH_SIZE = 10  # Smaller batch to avoid token limit truncation
RETRY_DELAY = 60


# -------------------------
# CHAPTER DETAILS
# -------------------------

CHAPTER_DETAILS = {
    "what-is-python": {
        "topic": "What is Python? History, features, use cases, print() function, comments, running .py files",
        "allowed": [
            "Python definition and history",
            "Guido van Rossum",
            "Interpreted and high-level language",
            "Python use cases (web, AI, data science)",
            "print() function",
            "Comments with #",
            "Running python files with python filename.py",
            "Interactive mode",
        ],
        "code_sample": """
# Your first Python spells!
print("Hello, Codoria!")    # displays text
print(42)                   # displays a number
print(2 + 3)                # displays result: 5
print(10 / 2)               # displays: 5.0
print(2 ** 8)               # 2 to the power 8 = 256

# Comments — Python ignores these
# Run with: python filename.py
""",
    },

    "variables-datatypes": {
        "topic": "Variables and Data Types — int, float, str, bool, type conversion, f-strings",
        "allowed": [
            "Variable declaration and assignment",
            "int data type",
            "float data type",
            "str data type",
            "bool data type (True/False)",
            "type() function",
            "Type conversion: int(), float(), str(), bool()",
            "f-strings",
            "Dynamic typing",
            "Variable naming rules",
        ],
        "code_sample": """
hero_name = "Lyra"        # str
health    = 100           # int
mana      = 85.5          # float
has_sword = True          # bool

print(type(hero_name))    # <class 'str'>
print(type(health))       # <class 'int'>

age_text   = "25"
age_number = int(age_text)   # "25" -> 25

level = 42
print(f"Hero {hero_name} is level {level}")
""",
    },

    "strings": {
        "topic": "Strings — indexing, slicing, string methods, split/join, f-strings",
        "allowed": [
            "String indexing (0-based)",
            "Negative indexing",
            "String slicing [start:end:step]",
            "len() function",
            "String methods: strip, upper, lower, title, replace, find",
            "split() and join()",
            "f-strings and expressions inside {}",
            "String immutability",
        ],
        "code_sample": """
name = "Lyra the Wizard"

print(len(name))          # 15
print(name[0])            # 'L'
print(name[-1])           # 'd'
print(name[0:4])          # 'Lyra'
print(name.upper())       # 'LYRA THE WIZARD'
print(name.replace("Wizard", "Mage"))
print(name.split(" "))    # ['Lyra', 'the', 'Wizard']

level = 42
print(f"Hero {name} is level {level}")
""",
    },

    "lists-tuples": {
        "topic": "Lists and Tuples — creating, indexing, slicing, list methods, tuples, list comprehension",
        "allowed": [
            "List creation with []",
            "List indexing and slicing",
            "append, insert, remove, pop, clear",
            "sort, reverse, count, index",
            "in operator for membership",
            "Tuple creation with ()",
            "Tuple immutability",
            "Tuple unpacking",
            "List comprehension",
            "len() with lists",
        ],
        "code_sample": """
inventory = ["sword", "shield", "potion"]

print(inventory[0])        # 'sword'
print(inventory[-1])       # 'potion'

inventory.append("map")
inventory.remove("shield")
inventory.insert(1, "bow")
print(len(inventory))

print(inventory[1:3])

coords = (28.6, 77.2)
lat, lng = coords

squares = [x**2 for x in range(5)]
""",
    },

    "dictionaries-sets": {
        "topic": "Dictionaries and Sets — key-value pairs, dict methods, sets, set operations",
        "allowed": [
            "Dictionary creation with {}",
            "Accessing values with [] and .get()",
            "Adding, updating, deleting keys",
            "Looping with .keys(), .values(), .items()",
            "in operator for keys",
            "Set creation and uniqueness",
            "set.add(), discard(), remove()",
            "Set operations: union |, intersection &, difference -",
            "Removing duplicates with set()",
            "O(1) lookup in dicts and sets",
        ],
        "code_sample": """
wizard = {
    "name":  "Lyra",
    "level": 42,
    "guild": "Storm Circle"
}

print(wizard["name"])
wizard["level"] = 43
wizard["weapon"] = "staff"
del wizard["guild"]

for key, value in wizard.items():
    print(f"{key}: {value}")

spells = {"fireball", "frost", "fireball"}
print(spells)   # {'fireball', 'frost'}
spells.add("lightning")
""",
    },

    "conditionals": {
        "topic": "Conditionals — if, elif, else, comparison operators, logical operators, ternary expression",
        "allowed": [
            "if / elif / else",
            "Comparison operators: ==, !=, >, <, >=, <=",
            "Logical operators: and, or, not",
            "Truthy and falsy values",
            "Ternary expression (one-liner if-else)",
            "Indentation in Python",
            "Nested conditions",
        ],
        "code_sample": """
health = 75
mana   = 20

if health > 80:
    print("Healthy!")
elif health > 40:
    print("Wounded — use a potion")
else:
    print("Critical! Retreat!")

if health > 50 and mana > 10:
    print("Ready to cast!")

status = "alive" if health > 0 else "defeated"
print(status)
""",
    },

    "loops": {
        "topic": "Loops — for loop, while loop, range(), break, continue, enumerate, zip, list comprehension",
        "allowed": [
            "for loop over sequences",
            "range(stop), range(start, stop), range(start, stop, step)",
            "while loop",
            "break statement",
            "continue statement",
            "enumerate() — index + value",
            "zip() — loop two lists",
            "List comprehension with condition",
            "Infinite loop warning",
            "_ as throwaway variable",
        ],
        "code_sample": """
spells = ["fireball", "frost", "lightning"]
for spell in spells:
    print(f"Casting: {spell}")

for i in range(5):
    print(i)

locks = 5
while locks > 0:
    print(f"{locks} locks remaining")
    locks -= 1

for i in range(10):
    if i == 3: continue
    if i == 7: break
    print(i)

squares = [x**2 for x in range(5)]
""",
    },

    "functions": {
        "topic": "Functions — def, parameters, return values, default params, *args, **kwargs, lambda, scope",
        "allowed": [
            "def keyword",
            "Parameters vs arguments",
            "return statement",
            "Default parameter values",
            "*args (variable positional arguments)",
            "**kwargs (variable keyword arguments)",
            "Lambda functions",
            "Local vs global scope",
            "global keyword",
            "Docstrings",
        ],
        "code_sample": """
def greet(name, title="Wizard"):
    return f"Hail, {title} {name}!"

print(greet("Lyra"))
print(greet("Torin", "Arch"))

def total_damage(*attacks):
    return sum(attacks)
print(total_damage(10, 25, 8))  # 43

def create_spell(**props):
    for k, v in props.items():
        print(f"{k}: {v}")

double = lambda x: x * 2
""",
    },

    "file-io": {
        "topic": "File I/O — open(), read, write, append, with statement, JSON files",
        "allowed": [
            "open() with modes: r, w, a, x",
            "with statement (context manager)",
            "f.read(), f.readline(), f.readlines()",
            "f.write(), f.writelines()",
            "Iterating lines with for loop",
            "json.dump() and json.load()",
            "json.dumps() and json.loads()",
            "Closing files automatically",
            "strip() to remove newlines",
        ],
        "code_sample": """
with open("quest_log.txt", "w") as f:
    f.write("Day 1: Entered the forest\\n")
    f.write("Day 2: Defeated the goblin\\n")

with open("quest_log.txt", "r") as f:
    for line in f:
        print(line.strip())

with open("quest_log.txt", "a") as f:
    f.write("Day 3: Found the treasure\\n")

import json
data = {"hero": "Lyra", "level": 42}
with open("save.json", "w") as f:
    json.dump(data, f, indent=2)
""",
    },

    "oops-basics": {
        "topic": "OOP Basics — classes, objects, __init__, self, instance vs class variables, dunder methods",
        "allowed": [
            "class keyword and CamelCase naming",
            "__init__ constructor",
            "self parameter",
            "Instance variables (self.x)",
            "Class variables (shared by all instances)",
            "Instance methods",
            "__str__ method",
            "__repr__ method",
            "__len__ method",
            "Creating objects (instantiation)",
            "isinstance()",
        ],
        "code_sample": """
class Hero:
    realm = "Codoria"   # class variable

    def __init__(self, name, health=100):
        self.name      = name
        self.health    = health
        self.inventory = []

    def attack(self, damage):
        print(f"{self.name} attacks for {damage}!")

    def pick_up(self, item):
        self.inventory.append(item)

    def __str__(self):
        return f"Hero({self.name}, HP:{self.health})"

lyra = Hero("Lyra", 120)
lyra.attack(25)
lyra.pick_up("Sword")
print(lyra)
""",
    },

    "inheritance": {
        "topic": "Inheritance and Polymorphism — parent/child classes, super(), method overriding, isinstance",
        "allowed": [
            "Inheriting from a parent class",
            "super().__init__()",
            "Method overriding",
            "Polymorphism — same method name, different behavior",
            "isinstance(obj, Class)",
            "issubclass(Child, Parent)",
            "Method Resolution Order (MRO)",
            "Calling parent methods with super()",
        ],
        "code_sample": """
class Hero:
    def __init__(self, name, health):
        self.name   = name
        self.health = health

    def attack(self):
        print(f"{self.name} attacks!")

class Warrior(Hero):
    def __init__(self, name, health, armor):
        super().__init__(name, health)
        self.armor = armor

    def attack(self):
        print(f"{self.name} swings sword!")

class Mage(Hero):
    def __init__(self, name, health, mana):
        super().__init__(name, health)
        self.mana = mana

    def attack(self):
        print(f"{self.name} casts fireball!")

party = [Warrior("Torin", 150, 80), Mage("Lyra", 100, 200)]
for member in party:
    member.attack()
""",
    },

    "advanced-python": {
        "topic": "Advanced Python — try/except, custom exceptions, decorators, generators, yield, map, filter",
        "allowed": [
            "try / except / finally",
            "Catching specific exceptions",
            "Custom exception classes",
            "raise keyword",
            "Decorators with @",
            "Writing decorator functions",
            "yield and generators",
            "next() with generators",
            "map() function",
            "filter() function",
            "functools.wraps",
            "Memory efficiency of generators",
        ],
        "code_sample": """
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
finally:
    print("Always runs")

def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_call
def cast_spell(name):
    print(f"Casting {name}!")

cast_spell("Fireball")

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(8)])
""",
    },
}


# -------------------------
# PROMPT BUILDER
# -------------------------

def build_prompt(slug: str, batch: int, existing: list):

    topic    = CHAPTER_DETAILS[slug]["topic"]
    allowed  = "\n".join(f"- {c}" for c in CHAPTER_DETAILS[slug]["allowed"])
    code     = CHAPTER_DETAILS[slug]["code_sample"]

    avoid = ""
    if existing:
        avoid = "\n".join(f"- {q}" for q in existing[:20])

    import random
    seed = random.randint(1000, 9999)   # forces AI to generate different questions each time

    return f"""
You are a strict Python quiz generator for a beginner coding platform called "Code with IIT".

CHAPTER: {slug}
TOPIC: {topic}

ALLOWED CONCEPTS — you may ONLY ask questions about these specific topics:
{allowed}

EXAMPLE CODE from this chapter (use this as reference for question style):
{code}

STRICT RULES — violating any rule makes the output invalid:
1. ONLY ask about the allowed concepts listed above. Do NOT ask about imports, modules, classes, OOP, loops, functions, files, or ANY other Python topic not listed above.
2. Generate EXACTLY {BATCH_SIZE} questions. No more, no less.
3. Mix question types: ~8 code-output questions (what does this print?), ~6 conceptual questions (what is X?), ~4 error-spotting questions (what is wrong?), ~2 fill-in-the-blank questions.
4. Each question must have exactly 4 choices: a, b, c, d.
5. Exactly ONE correct answer per question.
6. Difficulty mix: 8 easy, 8 medium, 4 hard.
7. All questions must be unique — do NOT repeat any question from this list:
{avoid if avoid else "  (none yet)"}
8. Randomness seed: {seed} — use this to vary your questions every time.

Return ONLY raw JSON — no markdown, no explanation, no extra text before or after:
{{
  "questions": [
    {{
      "question": "What does print('Hello') output?",
      "choices": [
        {{"id": "a", "text": "Hello"}},
        {{"id": "b", "text": "'Hello'"}},
        {{"id": "c", "text": "print Hello"}},
        {{"id": "d", "text": "Error"}}
      ],
      "correct_id": "a",
      "explanation": "print() outputs the value without quotes.",
      "difficulty": "easy"
    }}
  ]
}}
"""


# -------------------------
# AI CALLS
# -------------------------

def call_groq(prompt: str):
    """Try multiple Groq models — if one hits rate limit, try next."""
    

    client = Groq(api_key=settings.GROQ_API_KEY)

    # Try models in order — if rate limit hit, try next
    models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
    ]

    last_err = None
    for model in models:
        try:
            res = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON-only API. Return ONLY valid JSON, no markdown, no explanation."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4000,
                temperature=0.7,
            )
            print(f"[groq] Used model: {model}")
            return res.choices[0].message.content
        except Exception as e:
            print(f"[groq] Model {model} failed: {e}")
            last_err = e
            continue

    raise Exception(f"All Groq models failed. Last error: {last_err}")


def call_gemini(prompt: str):
    """Try multiple Gemini models — fallback if one fails."""
    import google.generativeai as genai

    genai.configure(api_key=settings.GEMINI_API_KEY)

    # Only use free-tier available models
    models = [
      "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-8b",
    ]

    last_err = None
    for model_name in models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 4000,
                    "temperature": 0.7,
                }
            )
            print(f"[gemini] Used model: {model_name}")
            return response.text
        except Exception as e:
            print(f"[gemini] Model {model_name} failed: {e}")
            last_err = e
            continue

    raise Exception(f"All Gemini models failed. Last error: {last_err}")


def ai_generate(prompt: str):

    try:
        return call_groq(prompt)
    except Exception:
        return call_gemini(prompt)


# -------------------------
# JSON CLEAN
# -------------------------

def clean_json(text: str) -> str:
    """
    Robustly extract and clean JSON from AI response.
    Handles: markdown fences, trailing commas, Python booleans,
    and extra text before/after JSON.
    """
    # 1. Strip markdown code fences
    text = re.sub(r'```(?:json)?\s*', '', text)
    text = text.strip()

    # 2. Extract only the JSON object
    start = text.find('{')
    end   = text.rfind('}')
    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in AI response. Raw: {text[:300]}")
    text = text[start:end+1]

    # 3. Replace Python True/False/None with JSON true/false/null
    text = re.sub(r'\bTrue\b',  'true',  text)
    text = re.sub(r'\bFalse\b', 'false', text)
    text = re.sub(r'\bNone\b',  'null',  text)

    # 4. Remove trailing commas before } or ]
    text = re.sub(r',\s*([}\]])', r'\1', text)

    # 5. Validate
    try:
        json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}. Snippet: {text[:300]}")

    return text


# -------------------------
# DATABASE
# -------------------------

async def db_count(slug: str):

    async with AsyncSessionLocal() as session:

        result = await session.execute(
            text("SELECT COUNT(*) FROM chapter_questions WHERE chapter_slug=:slug"),
            {"slug": slug}
        )

        return result.scalar() or 0


async def db_fetch(slug: str, count: int, exclude_texts: list = None):
    """
    Fetch random questions for a chapter.
    exclude_texts: list of question_text strings to exclude (already seen by user)
    """
    async with AsyncSessionLocal() as session:

        if exclude_texts:
            # Build parameterized exclude list
            placeholders = ", ".join(f":ex{i}" for i in range(len(exclude_texts)))
            params = {"slug": slug, "count": count}
            for i, t in enumerate(exclude_texts):
                params[f"ex{i}"] = t

            result = await session.execute(
                text(f"""
                    SELECT DISTINCT ON (question_text)
                        question_text, choices, correct_id, explanation, difficulty
                    FROM chapter_questions
                    WHERE chapter_slug=:slug
                      AND question_text NOT IN ({placeholders})
                    ORDER BY question_text, RANDOM()
                    LIMIT :count
                """),
                params
            )
        else:
            result = await session.execute(
                text("""
                    SELECT DISTINCT ON (question_text)
                        question_text, choices, correct_id, explanation, difficulty
                    FROM chapter_questions
                    WHERE chapter_slug=:slug
                    ORDER BY question_text, RANDOM()
                    LIMIT :count
                """),
                {"slug": slug, "count": count}
            )

        return result.fetchall()


async def db_save(slug: str, questions: list):
    """Save questions, skipping any duplicates (same chapter_slug + question_text)."""

    async with AsyncSessionLocal() as session:

        for q in questions:
            # Check if this exact question already exists
            existing = await session.execute(
                text("""
                    SELECT id FROM chapter_questions
                    WHERE chapter_slug=:slug AND question_text=:q
                    LIMIT 1
                """),
                {"slug": slug, "q": q["question"]}
            )
            if existing.fetchone():
                continue  # skip duplicate

            await session.execute(
                text("""
                    INSERT INTO chapter_questions
                    (chapter_slug, question_text, choices, correct_id, explanation, difficulty)
                    VALUES (:slug, :q, :c, :cid, :e, :d)
                """),
                {
                    "slug": slug,
                    "q": q["question"],
                    "c": json.dumps(q["choices"]),
                    "cid": q["correct_id"],
                    "e": q["explanation"],
                    "d": q["difficulty"]
                }
            )

        await session.commit()


# -------------------------
# BACKGROUND POOL FILLER
# -------------------------

# Tracks which slugs are currently being filled — prevents duplicate background tasks
_filling_slugs: set = set()


async def generate_batch(slug: str) -> list:
    """
    Generate one batch of questions using Groq first, then Gemini as fallback.
    Returns list of question dicts, or empty list if both APIs fail.
    """
    existing_rows = await db_fetch(slug, 20)
    existing      = [r[0] for r in existing_rows]
    prompt        = build_prompt(slug, 1, existing)

    # Try Groq first
    try:
        raw     = call_groq(prompt)
        cleaned = clean_json(raw)
        data    = json.loads(cleaned)
        if "questions" in data and isinstance(data["questions"], list):
            print(f"[pool] Groq OK for {slug} — {len(data['questions'])} questions")
            return data["questions"]
    except Exception as groq_err:
        print(f"[pool] Groq failed for {slug}: {groq_err}")

    # Fallback to Gemini
    try:
        raw     = call_gemini(prompt)
        cleaned = clean_json(raw)
        data    = json.loads(cleaned)
        if "questions" in data and isinstance(data["questions"], list):
            print(f"[pool] Gemini OK for {slug} — {len(data['questions'])} questions")
            return data["questions"]
    except Exception as gemini_err:
        print(f"[pool] Gemini also failed for {slug}: {gemini_err}")

    return []  # both failed


async def fill_pool(slug: str):
    """
    Background worker:
    - Fills DB until POOL_TARGET (100) questions reached
    - Uses Groq → Gemini fallback for each batch
    - Retries after RETRY_DELAY seconds if both APIs fail
    - Prevents duplicate concurrent runs for same slug
    """
    if slug in _filling_slugs:
        print(f"[pool] Already filling {slug}, skipping duplicate")
        return

    _filling_slugs.add(slug)
    print(f"[pool] Started background fill for: {slug}")

    try:
        while True:
            count = await db_count(slug)

            if count >= POOL_TARGET:
                print(f"[pool] Pool full for {slug} ({count}/{POOL_TARGET}). Done.")
                return

            print(f"[pool] {slug}: {count}/{POOL_TARGET} — generating {BATCH_SIZE} more...")

            questions = await generate_batch(slug)

            if questions:
                await db_save(slug, questions)
                print(f"[pool] Saved {len(questions)} questions for {slug}. Total: {count + len(questions)}")
                await asyncio.sleep(2)  # small delay between batches to avoid rate limits
            else:
                print(f"[pool] Both APIs failed for {slug}. Retrying in {RETRY_DELAY}s...")
                await asyncio.sleep(RETRY_DELAY)

    finally:
        _filling_slugs.discard(slug)
        print(f"[pool] Background filler stopped for: {slug}")


# -------------------------
# MODELS
# -------------------------

class QuestionRequest(BaseModel):
    chapter_slug: str
    count: int = SEND_COUNT
    seen_questions: list = []   # question texts already seen by this user


class Choice(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: int
    question: str
    choices: List[Choice]
    correct_id: str
    difficulty: str
    explanation: str


class QuestionsResponse(BaseModel):
    questions: List[Question]
    source: str
    pool_size: int


# -------------------------
# MAIN ENDPOINT
# Rule:
#   1. Check DB first
#   2. If >= MIN_IN_DB questions → serve instantly from DB (shuffle for variety)
#   3. If < MIN_IN_DB → generate live via AI, save to DB, then serve
#   4. Always kick background filler if pool < POOL_TARGET
# -------------------------

@router.post("/questions", response_model=QuestionsResponse)
async def get_questions(
    payload: QuestionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    import random

    slug = payload.chapter_slug

    if slug not in CHAPTER_DETAILS:
        raise HTTPException(status_code=404, detail=f"Chapter '{slug}' not found")

    pool = await db_count(slug)

    # ── CASE 1: DB has enough questions → serve instantly, no AI wait ─────────
    if pool >= MIN_IN_DB:

        seen   = payload.seen_questions or []
        unseen_count = pool - len(seen)

        # If user has seen most questions, reset their seen list
        if unseen_count < payload.count:
            print(f"[questions] User seen {len(seen)}/{pool} questions for {slug}. Resetting seen list.")
            seen = []

        # Fetch 3x needed, excluding already-seen questions
        fetch_count = min(payload.count * 3, pool)
        rows        = await db_fetch(slug, fetch_count, exclude_texts=seen if seen else None)

        # If not enough unseen rows, fall back to any random rows
        if len(rows) < payload.count:
            rows = await db_fetch(slug, fetch_count, exclude_texts=None)

        all_qs = []
        for r in rows:
            # Neon JSONB returns already-parsed list; SQLite returns string
            choices = r[1] if isinstance(r[1], list) else json.loads(r[1])
            all_qs.append({
                "question":    r[0],
                "choices":     choices,
                "correct_id":  r[2],
                "explanation": r[3],
                "difficulty":  r[4]
            })

        random.shuffle(all_qs)
        qs     = [{"id": i + 1, **q} for i, q in enumerate(all_qs[:payload.count])]
        source = "db"

    # ── CASE 2: DB empty or too few → generate live, save, then return ────────
    else:
        print(f"[questions] Only {pool} questions in DB for '{slug}'. Generating live...")

        questions = await generate_batch(slug)

        if not questions:
            raise HTTPException(
                status_code=502,
                detail="Could not generate questions. Both Groq and Gemini failed. Please try again shortly."
            )

        # Save all generated to DB for future users
        await db_save(slug, questions)

        random.shuffle(questions)
        qs     = [{"id": i + 1, **q} for i, q in enumerate(questions[:payload.count])]
        source = "ai_live"

        # Refresh pool count after saving
        pool = await db_count(slug)

    # ── Always: start background filler if pool not yet at target ─────────────
    if pool < POOL_TARGET:
        background_tasks.add_task(fill_pool, slug)

    return {
        "questions": qs,
        "source":    source,
        "pool_size": pool
    }

# -------------------------
# VERIFY
# -------------------------

class VerifyRequest(BaseModel):
    submitted_id: str
    correct_id: str


@router.post("/verify")
async def verify(payload: VerifyRequest):

    correct = payload.submitted_id == payload.correct_id

    return {
        "correct": correct,
        "xp": 10 if correct else 3
    }


# -------------------------
# AI HINT
# -------------------------

class HintRequest(BaseModel):
    chapter_slug: str
    question: str
    user_answer: str = ""


@router.post("/hint")
async def get_hint(
    payload: HintRequest,
    current_user: User = Depends(get_current_user)
):
    chapter_info = CHAPTER_DETAILS.get(payload.chapter_slug, {})
    topic = chapter_info.get("topic", payload.chapter_slug)

    prompt = f"""You are a friendly Python tutor for "Code with IIT" platform.

A student is stuck on this question:
Question: {payload.question}

{"Student's current answer: " + payload.user_answer if payload.user_answer else "Student hasn't answered yet."}

Topic: {topic}

Give a SHORT, helpful hint (2-3 sentences max):
- DO NOT give the direct answer
- Guide them toward the right thinking
- Use simple language, friendly tone
- You can use a small code example if helpful

Reply in plain text only, no markdown."""

    try:
        hint = call_groq(prompt)
    except Exception as groq_err:
        print(f"[hint] Groq failed: {groq_err}")
        try:
            hint = call_gemini(prompt)
        except Exception as e:
            print(f"[hint] Gemini failed: {e}")
            raise HTTPException(
                status_code=502,
                detail="AI hint unavailable right now. Try again shortly."
            )

    return {"hint": hint.strip()}