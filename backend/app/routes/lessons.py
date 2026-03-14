"""
routes/lessons.py
Serves lesson/chapter data from the backend.

GET /api/lessons        → list all chapters (without answers)
GET /api/lessons/{slug} → get one chapter (without answers)

WHY serve from backend: In Phase 1, chapter data was hardcoded in the
                        frontend. Now it comes from the server.
                        Phase 5: admins can add lessons via API — no
                        code changes needed.

SECURITY: We strip correct answers before sending to frontend.
          Never trust the client with answer data.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])


# ── DATA ──────────────────────────────────────────────────────────
# Same data as frontend/src/data/chapters.js but answers stripped in response

CHAPTERS_DATA = [
    {
        "id": 1, "slug": "variables", "title": "The Kingdom of Varindel",
        "concept": "Variables", "emoji": "📜", "xp": 100,
        "story": [
            "The ancient kingdom of <strong>Varindel</strong> is in trouble! The Royal Spellbook has been shattered into five pieces.",
            "<span class='text-magic-light'>Sage Mirela</span> greets you: <em>\"Welcome! Learn how wizards store information — we call these <strong>variables</strong>.\"</em>",
            "Think of each variable like a <strong>labeled jar</strong> that holds a value.",
        ],
        "lesson_code": """# A variable is like a labeled jar that holds a value.
hero_name = "Lyra"    # text value (string)
health    = 100       # number value
has_sword = True      # True or False (boolean)

# Update a variable:
health = health - 10  # now health is 90""",
        "tip": "💡 Python variables have no fixed type — the same variable can hold a number today and text tomorrow!",
        "question": "Lyra finds a healing potion! Which line correctly gives her 20 more health points?",
        "choices": [
            {"id": "a", "text": 'health = "20"'},
            {"id": "b", "text": "health = health + 20"},
            {"id": "c", "text": "health + 20 = health"},
            {"id": "d", "text": "heal(health, 20)"},
        ],
        "correct_id": "b",   # ← stripped before sending to frontend
        "feedback_success": "✦ Correct! Python reads the right side first, adds 20, saves back.",
        "feedback_fail": "Python reads the RIGHT side first. 'health = health + 20' is correct.",
    },
    {
        "id": 2, "slug": "conditionals", "title": "The Whispering Forest",
        "concept": "Conditionals", "emoji": "🌲", "xp": 100,
        "story": [
            "Lyra steps into the <strong>Whispering Forest</strong>. Every path is blocked by a stone sentinel.",
            "<span class='text-magic-light'>Sentinel Gryx</span> rumbles: <em>\"We use <strong>if-statements</strong> — IF something is true, we do one thing. Otherwise, something else.\"</em>",
            "Think of it like a fork in the road.",
        ],
        "lesson_code": """if has_torch == True:
    print("You may enter.")     # runs if True
elif magic_level > 50:
    print("Your magic helps!")  # checked if first was False
else:
    print("Turn back!")         # runs if nothing matched

# ==  equal to    !=  not equal to
# >   greater     <   less than""",
        "tip": "💡 Indentation (spaces at start of line) is required in Python — it defines what's inside the if block!",
        "question": "Lyra has health = 30. Which code prints a warning ONLY when health drops below 25?",
        "choices": [
            {"id": "a", "text": 'if health > 25:\n    print("Low health!")'},
            {"id": "b", "text": 'if health == 25:\n    print("Low health!")'},
            {"id": "c", "text": 'if health < 25:\n    print("Low health!")'},
            {"id": "d", "text": 'if health = 25:\n    print("Low health!")'},
        ],
        "correct_id": "c",
        "feedback_success": "✦ Precisely! < means less than. Health is 30 now, warning triggers when it drops below 25.",
        "feedback_fail": "> means greater than. == checks equality. Single = is assignment. Only < works here.",
    },
    {
        "id": 3, "slug": "loops", "title": "The Dragon's Hoard",
        "concept": "Loops", "emoji": "🐉", "xp": 100,
        "story": [
            "Lyra arrives at <strong>Ignaroth the Dragon's</strong> volcano lair. A hundred enchanted locks block the way.",
            "<span class='text-magic-light'>Ignaroth</span> chuckles: <em>\"Use a <strong>loop</strong> — repeat an action without copy-pasting!\"</em>",
            "Write the action once and tell Python how many times to repeat it.",
        ],
        "lesson_code": """# for-loop repeats a set number of times
for i in range(5):           # counts 0,1,2,3,4
    print("Lock", i, "opened!")

# range(start, stop):
for i in range(1, 4):   # counts 1,2,3
    print(i)

# while-loop runs while condition is True:
while locks > 0:
    locks -= 1""",
        "tip": "💡 The variable 'i' is just a counter. You can name it anything — 'i' is programmer tradition!",
        "question": "Lyra needs to shout 'Attack!' exactly 3 times. Which loop is correct?",
        "choices": [
            {"id": "a", "text": 'for i in range(3):\n    print("Attack!")'},
            {"id": "b", "text": 'for i in range(1, 3):\n    print("Attack!")'},
            {"id": "c", "text": 'while 3:\n    print("Attack!")'},
            {"id": "d", "text": 'for i in 3:\n    print("Attack!")'},
        ],
        "correct_id": "a",
        "feedback_success": "✦ Yes! range(3) gives [0,1,2] — exactly 3 steps.",
        "feedback_fail": "range(1,3) gives only 2 steps. while 3 loops forever. for i in 3 crashes.",
    },
    {
        "id": 4, "slug": "functions", "title": "The Wizard's Tower",
        "concept": "Functions", "emoji": "🔮", "xp": 100,
        "story": [
            "<strong>Archmagus Torvald</strong> wrote the same healing spell on 20 scrolls — terrible waste!",
            "<span class='text-magic-light'>Torvald</span>: <em>\"Use <strong>functions</strong> — write once, call anywhere!\"</em>",
            "A function is like a recipe: write the steps once, name it, call it whenever.",
        ],
        "lesson_code": """def heal(target_hp, amount):
    \"\"\"Returns new HP after healing.\"\"\"
    new_hp = target_hp + amount
    return new_hp  # sends result back

# Call it anywhere:
lyra_health = heal(40, 20)  # → 60
goblin_hp   = heal(15, 5)   # → 20""",
        "tip": "💡 Text in triple quotes (\"\"\" \"\"\") is a docstring — describes what the function does. Always write them!",
        "question": "Which code correctly DEFINES a function that takes a name and prints a greeting?",
        "choices": [
            {"id": "a", "text": "function greet(name):"},
            {"id": "b", "text": 'def greet(name):\n    print("Hello,", name)'},
            {"id": "c", "text": "greet = function(name):"},
            {"id": "d", "text": "define greet(name):"},
        ],
        "correct_id": "b",
        "feedback_success": "✦ Excellent! 'def' (short for define) starts every Python function.",
        "feedback_fail": "Python uses 'def'. 'function' is JavaScript. 'define' isn't a Python keyword.",
    },
    {
        "id": 5, "slug": "lists", "title": "The Archive of Lists",
        "concept": "Lists", "emoji": "📚", "xp": 100,
        "story": [
            "The final fragment is hidden in the <strong>Archive of Infinite Lists</strong>.",
            "<span class='text-magic-light'>Librarian Asha</span>: <em>\"We call these <strong>lists</strong>. Every item has an <strong>index</strong> — starting from <strong>zero</strong>!\"</em>",
            "First item = position 0, second = position 1, and so on.",
        ],
        "lesson_code": """spells = ["fireball", "frost", "lightning"]
#  index →   0            1          2

print(spells[0])        # → "fireball"
print(spells[2])        # → "lightning"

spells.append("heal")  # add to end
print(len(spells))      # → 4""",
        "tip": "💡 Zero-based indexing exists in almost every language — it traces back to how computers calculate memory addresses!",
        "question": "inventory = ['sword', 'shield', 'potion']\nWhat does inventory[1] return?",
        "choices": [
            {"id": "a", "text": '"sword"  — first item'},
            {"id": "b", "text": '"shield" — index 1 is second item'},
            {"id": "c", "text": '"potion" — last item'},
            {"id": "d", "text": "Error — invalid index"},
        ],
        "correct_id": "b",
        "feedback_success": "✦ Spot on! index 0='sword', index 1='shield', index 2='potion'.",
        "feedback_fail": "Lists start at 0! index 0='sword', index 1='shield', index 2='potion'.",
    },
]


# ── SCHEMAS ───────────────────────────────────────────────────────

class ChoiceOut(BaseModel):
    id: str
    text: str

class ChapterSummary(BaseModel):
    id: int
    slug: str
    title: str
    concept: str
    emoji: str
    xp: int

class ChapterDetail(ChapterSummary):
    story: list[str]
    lesson_code: str
    tip: str
    question: str
    choices: list[ChoiceOut]
    feedback_success: str
    feedback_fail: str
    # correct_id is intentionally NOT in this schema


# ── ROUTES ────────────────────────────────────────────────────────

@router.get("/", response_model=list[ChapterSummary])
async def list_chapters():
    """Returns all chapters — summary only, no answers."""
    return [ChapterSummary(**{k: v for k, v in ch.items() if k in ChapterSummary.model_fields})
            for ch in CHAPTERS_DATA]


@router.get("/{slug}", response_model=ChapterDetail)
async def get_chapter(slug: str):
    """Returns full chapter detail — answers stripped."""
    chapter = next((ch for ch in CHAPTERS_DATA if ch["slug"] == slug), None)
    if not chapter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found.")
    # Strip correct_id before returning
    return ChapterDetail(**{k: v for k, v in chapter.items() if k != "correct_id"})


@router.post("/{slug}/verify")
async def verify_answer(slug: str, answer: dict):
    """
    Verify if the submitted answer is correct.
    WHY on backend: If we sent correct_id to frontend, users could cheat
                    by reading network responses.
    """
    chapter = next((ch for ch in CHAPTERS_DATA if ch["slug"] == slug), None)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found.")

    submitted = answer.get("choice_id", "").strip().lower()
    is_correct = submitted == chapter["correct_id"]

    return {
        "correct": is_correct,
        "feedback": chapter["feedback_success"] if is_correct else chapter["feedback_fail"],
        "xp_earned": chapter["xp"] if is_correct else round(chapter["xp"] * 0.3),
    }
