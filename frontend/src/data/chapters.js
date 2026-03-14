/**
 * src/data/chapters.js
 * 12 chapters — full storytelling + concept teaching before MCQ
 * Each chapter has: story slides → concept slides → code lesson → quiz
 */

export const CHAPTERS = [
  {
    id: 1,
    slug: "what-is-python",
    title: "The Origin of Magic",
    concept: "What is Python?",
    emoji: "🐍",
    xp: 100,
    level: "Beginner",

    // 🎭 STORY — fantasy narrative (3 slides)
    story: [
      "In the ancient realm of <strong>Codoria</strong>, knowledge was locked away in ancient scrolls written in complex runes — only a chosen few could read them. Then one day, a sage named <strong>Guido</strong> discovered a new language: simple, powerful, and readable by anyone. He called it <strong>Python</strong>.",
      "Python spread across the realm like wildfire. Warriors used it to automate battles. Scholars used it to analyze ancient data. Artificers built intelligent golems with it. <strong>Every great wizard today knows Python</strong> — it powers Google, NASA, Netflix, Instagram, and every AI laboratory in the world.",
      "Today, <em>you</em> begin your journey. You will learn Python from scratch — starting with the most basic spell: telling the computer what to display. By the end of this chapter, you will cast your <strong>first Python spell</strong>. 🐍✨"
    ],

    // 📚 CONCEPTS — teach before quiz (key ideas, one per slide)
    concepts: [
      {
        title: "🐍 What is Python?",
        body: "Python is a <strong>programming language</strong> — a way to give instructions to a computer. It was created in 1991 by Guido van Rossum. Python is special because it reads almost like plain English. You don't need to type complex symbols — just clear, simple commands.",
        example: null,
        tip: "Python is used for: Web Development, Artificial Intelligence, Data Science, Automation, Cybersecurity, Game Development — literally everything!"
      },
      {
        title: "🖨️ The print() Function",
        body: "The most basic Python command is <strong>print()</strong>. It displays text or values on the screen. Whatever you put inside the brackets gets shown. Text must be in quotes. Numbers don't need quotes.",
        example: `print("Hello, World!")    # Output: Hello, World!
print("I am learning Python")
print(42)              # Output: 42
print(2 + 3)           # Output: 5`,
        tip: "print() is always lowercase in Python. Python is case-sensitive — Print() or PRINT() will give an error!"
      },
      {
        title: "💬 Comments in Python",
        body: "A <strong>comment</strong> starts with <strong>#</strong>. Python completely ignores everything after # on that line. Comments are notes for humans — they explain what the code does. Good programmers always write comments!",
        example: `# This is a comment — Python ignores this line
print("Hello")   # This comment is after code

# Comments help others understand your code
# They also help YOU when you read it later`,
        tip: "There are no multi-line comments in Python. Use # at the start of each line you want to comment out."
      },
      {
        title: "📁 Python Files & Running Code",
        body: "Python code is saved in files ending with <strong>.py</strong>. You run a Python file by typing <code>python filename.py</code> in the terminal. Python reads your file line by line, from top to bottom, and executes each command.",
        example: `# File: hello.py
print("Welcome to Python!")
print("This runs line by line")
print("Top to bottom, always")

# In terminal: python hello.py`,
        tip: "Python also has interactive mode — just type 'python' in terminal and you can run commands one by one instantly!"
      }
    ],

    lesson_code: `# Your first Python spells!

print("Hello, Codoria!")    # displays text
print(42)                   # displays a number
print(2 + 3)                # displays result: 5
print(10 / 2)               # displays: 5.0
print(2 ** 8)               # 2 to the power 8 = 256

# Comments — Python ignores these
# They are notes for humans

# Run with: python filename.py`,
    tip: "💡 Python was created by Guido van Rossum in 1991. It's now the #1 language in the world — used by Google, NASA, Netflix, and every AI lab!"
  },

  {
    id: 2,
    slug: "variables-datatypes",
    title: "The Kingdom of Varindel",
    concept: "Variables & Data Types",
    emoji: "📜",
    xp: 100,
    level: "Beginner",

    story: [
      "In the Kingdom of <strong>Varindel</strong>, every wizard kept a magical notebook. Each page had a label and a value: 'hero name: Lyra', 'health: 100', 'gold: 850'. These labeled containers were called <strong>variables</strong>.",
      "Variables are how Python remembers information. Without variables, a program cannot store anything — every calculation would be lost immediately. A hero without a health variable cannot be tracked. A game without score variables cannot keep score.",
      "<span class='text-magic-light'>Sage Mirela</span> teaches: <em>\"Python has 4 basic types of data — whole numbers, decimal numbers, text, and true/false values. Every piece of information in your program will be one of these types.\"</em>"
    ],

    concepts: [
      {
        title: "📦 What is a Variable?",
        body: "A <strong>variable</strong> is a named container that stores a value. You create one by writing a name, then <strong>=</strong>, then a value. The name is on the left, the value is on the right. You can change the value later — that's why it's called a <em>variable</em>.",
        example: `hero_name = "Lyra"     # storing text
health = 100           # storing a number
mana = 85.5            # storing a decimal
is_alive = True        # storing yes/no

# You can update variables:
health = 90            # health is now 90
health = health - 10   # health is now 80`,
        tip: "Variable names: use lowercase, use underscores for spaces (hero_name not heroname), never start with a number."
      },
      {
        title: "🔢 Data Type: int (Integer)",
        body: "An <strong>int</strong> is a whole number — no decimal point. Used for counting, indexing, and any number that should never be fractional. Examples: age, score, quantity, level.",
        example: `level = 42
score = 1500
enemies_defeated = 7
max_health = 100

print(type(level))   # <class 'int'>
print(level + 8)     # 50
print(level * 2)     # 84`,
        tip: "Integer math: + add, - subtract, * multiply, // floor divide (no decimals), % remainder, ** power"
      },
      {
        title: "🌊 Data Type: float (Decimal)",
        body: "A <strong>float</strong> is a number with a decimal point. Used when precision matters — prices, coordinates, percentages, measurements.",
        example: `mana = 85.5
price = 9.99
latitude = 28.6139    # New Delhi lat

print(type(mana))    # <class 'float'>
print(mana / 2)      # 42.75
print(round(mana, 1))  # 85.5`,
        tip: "Dividing two ints with / always gives a float in Python 3. Use // for integer division."
      },
      {
        title: "💬 Data Type: str (String)",
        body: "A <strong>str</strong> (string) is text — any characters inside quotes. You can use single quotes or double quotes. Strings can be joined with + or formatted with f-strings.",
        example: `name = "Lyra"
title = 'Wizard'
greeting = "Hello, " + name    # joins strings

# f-string — modern way to embed variables:
level = 42
msg = f"Hero {name} is level {level}"
print(msg)   # Hero Lyra is level 42`,
        tip: "Always prefer f-strings (f\"...\") over + concatenation. They're cleaner and faster!"
      },
      {
        title: "✅ Data Type: bool (Boolean)",
        body: "A <strong>bool</strong> is either <strong>True</strong> or <strong>False</strong> — that's it, only two possible values. Used for conditions, flags, on/off switches. In Python, True and False are capitalized.",
        example: `is_alive = True
has_sword = False
game_over = False

print(type(is_alive))  # <class 'bool'>

# These all become False (falsy):
print(bool(0))         # False
print(bool(""))        # False
print(bool([]))        # False

# These are True (truthy):
print(bool(1))         # True
print(bool("hello"))   # True`,
        tip: "0, empty string '', empty list [], None — all are False in Python. Everything else is True!"
      },
      {
        title: "🔄 Type Conversion",
        body: "You can convert between types using <strong>int()</strong>, <strong>float()</strong>, <strong>str()</strong>, <strong>bool()</strong>. This is called <em>type casting</em>. Very useful when reading user input (which is always a string).",
        example: `# str to int:
age_text = "25"
age_num = int(age_text)   # "25" → 25
print(age_num + 5)        # 30

# int to str:
score = 1500
msg = "Score: " + str(score)  # must convert!

# float to int (cuts decimal):
pi = 3.14
print(int(pi))            # 3  (not rounded!)

# Check type:
print(type(42))           # <class 'int'>`,
        tip: "int(3.9) gives 3, NOT 4. It truncates, doesn't round. Use round() if you want rounding."
      }
    ],

    lesson_code: `# Variables — labeled containers
hero_name = "Lyra"        # str
health    = 100           # int
mana      = 85.5          # float
has_sword = True          # bool

# Check types:
print(type(hero_name))    # <class 'str'>
print(type(health))       # <class 'int'>

# Type conversion:
age_text   = "25"
age_number = int(age_text)   # "25" → 25
pi_text    = str(3.14)       # 3.14 → "3.14"

# f-string:
level = 42
print(f"Hero {hero_name} is level {level}")`,
    tip: "💡 Python is dynamically typed — you don't declare types. Python figures it out automatically!"
  },

  {
    id: 3,
    slug: "strings",
    title: "The Scrolls of Language",
    concept: "Strings",
    emoji: "📝",
    xp: 100,
    level: "Beginner",

    story: [
      "The ancient <strong>Scrolls of Language</strong> held the secrets of text manipulation. Every message, every name, every spell description was stored as a string. The wizard who mastered strings could read, transform, and search any text in an instant.",
      "In Python, a <strong>string</strong> is a sequence of characters. Each character has a position — starting from <strong>0</strong>. You can access any character, slice sections, search for words, or transform the entire text.",
      "<span class='text-magic-light'>Librarian Asha</span>: <em>\"Strings are immutable — once created, you cannot change individual characters. But you can always create a new string based on the old one. Think of them as sealed scrolls that can be copied and modified.\"</em>"
    ],

    concepts: [
      {
        title: "📍 String Indexing",
        body: "Each character in a string has a position called an <strong>index</strong>. Indexing starts at <strong>0</strong> (not 1!). Use negative indices to count from the end — -1 is the last character.",
        example: `name = "Python"
#        P  y  t  h  o  n
# index: 0  1  2  3  4  5
#       -6 -5 -4 -3 -2 -1

print(name[0])    # 'P'  (first)
print(name[3])    # 'h'
print(name[-1])   # 'n'  (last)
print(name[-2])   # 'o'`,
        tip: "Always remember: Python indexing starts at 0, not 1. This is a very common beginner mistake!"
      },
      {
        title: "✂️ String Slicing",
        body: "Slicing extracts a <strong>substring</strong> using [start:end]. The start is included, the end is excluded. You can also add a step: [start:end:step].",
        example: `lang = "Python"

print(lang[0:3])   # 'Pyt'  (0,1,2 — 3 excluded)
print(lang[2:])    # 'thon' (from index 2 to end)
print(lang[:4])    # 'Pyth' (from start to index 3)
print(lang[::-1])  # 'nohtyP' (reversed!)

name = "Lyra the Wizard"
print(name[5:8])   # 'the'`,
        tip: "[::- 1] is the Pythonic way to reverse a string. Very commonly asked in interviews!"
      },
      {
        title: "📏 len() and String Methods",
        body: "<strong>len()</strong> gives the number of characters. String <strong>methods</strong> are built-in functions that transform strings. They always return a new string — the original is unchanged.",
        example: `name = "  Lyra the Wizard  "

print(len(name))           # 20 (includes spaces)
print(name.strip())        # "Lyra the Wizard" (removes spaces)
print(name.upper())        # "  LYRA THE WIZARD  "
print(name.lower())        # "  lyra the wizard  "
print(name.strip().title())# "Lyra The Wizard"

# Find and Replace:
msg = "Hello World"
print(msg.replace("World", "Python"))  # "Hello Python"
print(msg.find("World"))   # 6 (index where found)`,
        tip: "String methods never modify the original — they return a new string. Always assign: name = name.upper()"
      },
      {
        title: "🔀 split() and join()",
        body: "<strong>split()</strong> breaks a string into a list by a separator. <strong>join()</strong> combines a list into a string with a separator. These two are extremely useful for processing text data.",
        example: `# split() — string to list
sentence = "Python is awesome"
words = sentence.split(" ")    # split by space
print(words)  # ['Python', 'is', 'awesome']

csv = "Lyra,42,Wizard"
parts = csv.split(",")
print(parts)  # ['Lyra', '42', 'Wizard']

# join() — list to string
words = ['Hello', 'World']
result = " ".join(words)    # "Hello World"
result2 = "-".join(words)   # "Hello-World"`,
        tip: "split() and join() are inverse operations. split() breaks apart, join() puts together!"
      },
      {
        title: "✨ f-Strings (Formatted Strings)",
        body: "<strong>f-strings</strong> let you embed variables and expressions directly inside a string using curly braces {}. Always prefix with <strong>f</strong>. This is the modern, preferred way to format strings in Python.",
        example: `name = "Lyra"
level = 42
health = 95.5

# Old way (messy):
msg = "Hero " + name + " is level " + str(level)

# f-string (clean!):
msg = f"Hero {name} is level {level}"
print(msg)   # Hero Lyra is level 42

# Expressions inside {}:
print(f"Double level: {level * 2}")  # 84
print(f"Health: {health:.1f}%")      # 95.5%`,
        tip: "f-strings can contain any Python expression inside {}. You can do math, call functions, even conditional expressions!"
      }
    ],

    lesson_code: `name = "Lyra the Wizard"

print(len(name))          # 15
print(name[0])            # 'L'
print(name[-1])           # 'd'
print(name[0:4])          # 'Lyra'
print(name.upper())       # 'LYRA THE WIZARD'
print(name.replace("Wizard", "Mage"))
print(name.split(" "))    # ['Lyra', 'the', 'Wizard']

level = 42
print(f"Hero {name} is level {level}")`,
    tip: "💡 f-strings are the modern way to embed variables. Always prefer them over + concatenation!"
  },

  {
    id: 4,
    slug: "lists-tuples",
    title: "The Archive of Collections",
    concept: "Lists & Tuples",
    emoji: "📚",
    xp: 150,
    level: "Beginner",

    story: [
      "One jar holds one potion. But a hero needs to carry many items — a sword, a shield, three potions, two scrolls, and a map. That's where <strong>collections</strong> come in. Python's most powerful collection is the <strong>list</strong>.",
      "A list is an ordered container that can hold multiple values. You can add items, remove items, sort them, search them. Lists are <strong>mutable</strong> — you can change them after creation. The second collection, the <strong>tuple</strong>, is like a sealed chest — ordered but locked forever.",
      "<span class='text-magic-light'>Collector Bram</span>: <em>\"Lists are your adventure bag — add and remove freely. Tuples are sealed treasure chests — perfect for data that should never change, like coordinates or database records.\"</em>"
    ],

    concepts: [
      {
        title: "📋 Creating Lists",
        body: "A <strong>list</strong> is created with square brackets []. It can hold any mix of types. Lists are ordered (they remember the order you added items) and mutable (you can change them).",
        example: `# Creating lists
inventory = ["sword", "shield", "potion"]
numbers   = [1, 2, 3, 4, 5]
mixed     = [42, "hello", True, 3.14]
empty     = []

print(inventory)        # ['sword', 'shield', 'potion']
print(len(inventory))   # 3
print(type(inventory))  # <class 'list'>`,
        tip: "Lists can hold ANY type — strings, numbers, booleans, even other lists! This makes them extremely flexible."
      },
      {
        title: "🎯 Indexing and Slicing Lists",
        body: "List indexing works exactly like strings — starts at 0, negative indices count from end. Slicing extracts sublists.",
        example: `items = ["sword", "shield", "potion", "map", "key"]

print(items[0])     # 'sword'   (first)
print(items[-1])    # 'key'     (last)
print(items[1:3])   # ['shield', 'potion']
print(items[:2])    # ['sword', 'shield']
print(items[2:])    # ['potion', 'map', 'key']

# Check if item exists:
print("sword" in items)   # True
print("axe" in items)     # False`,
        tip: "'in' operator checks membership in O(n) time for lists. For fast lookups, use sets or dicts!"
      },
      {
        title: "➕ Adding and Removing Items",
        body: "Lists have built-in methods to add and remove items. <strong>append()</strong> adds to end, <strong>insert()</strong> adds at a specific position, <strong>remove()</strong> deletes by value, <strong>pop()</strong> removes by index.",
        example: `bag = ["potion", "map"]

bag.append("sword")        # add to end
print(bag)  # ['potion', 'map', 'sword']

bag.insert(0, "shield")    # add at index 0
print(bag)  # ['shield', 'potion', 'map', 'sword']

bag.remove("map")          # remove by value
print(bag)  # ['shield', 'potion', 'sword']

last = bag.pop()           # removes & returns last item
print(last)  # 'sword'

bag.clear()                # remove everything`,
        tip: "remove() raises ValueError if item not found. Use 'if item in list' first to check safely!"
      },
      {
        title: "🔄 List Methods",
        body: "Lists have many useful methods: <strong>sort()</strong> to sort, <strong>reverse()</strong> to flip order, <strong>count()</strong> to count occurrences, <strong>index()</strong> to find position.",
        example: `scores = [85, 42, 91, 67, 55]

scores.sort()              # ascending
print(scores)  # [42, 55, 67, 85, 91]

scores.sort(reverse=True)  # descending
print(scores)  # [91, 85, 67, 55, 42]

spells = ["fire", "ice", "fire", "light"]
print(spells.count("fire"))  # 2
print(spells.index("ice"))   # 1 (position)`,
        tip: "sort() modifies the list in place. sorted() returns a new list and leaves the original unchanged."
      },
      {
        title: "📦 Tuples — Immutable Collections",
        body: "A <strong>tuple</strong> is like a list but <strong>immutable</strong> — you cannot add, remove, or change items after creation. Created with parentheses (). Use tuples for data that should never change.",
        example: `# Tuple creation
coordinates = (28.6, 77.2)   # lat, long of New Delhi
rgb_red = (255, 0, 0)        # colors never change
days = ("Mon", "Tue", "Wed", "Thu", "Fri")

# Indexing works same as lists:
print(coordinates[0])   # 28.6
print(days[-1])         # 'Fri'

# Tuple unpacking — very useful!
lat, lng = coordinates
print(lat)   # 28.6
print(lng)   # 77.2

# This would ERROR — tuples are immutable:
# coordinates[0] = 99   # TypeError!`,
        tip: "Tuples are faster than lists and use less memory. Use them when data should never change!"
      },
      {
        title: "⚡ List Comprehension",
        body: "List comprehension is Python's most elegant feature — create a new list in one line using a compact for loop syntax. It's faster than a regular loop and considered very Pythonic.",
        example: `# Regular loop way:
squares = []
for x in range(5):
    squares.append(x ** 2)
print(squares)   # [0, 1, 4, 9, 16]

# List comprehension way (same result!):
squares = [x ** 2 for x in range(5)]
print(squares)   # [0, 1, 4, 9, 16]

# With a condition:
evens = [x for x in range(10) if x % 2 == 0]
print(evens)   # [0, 2, 4, 6, 8]

# Transform strings:
names = ["lyra", "torin", "mira"]
upper = [n.upper() for n in names]`,
        tip: "List comprehensions are a hallmark of Pythonic code. Senior developers use them constantly!"
      }
    ],

    lesson_code: `inventory = ["sword", "shield", "potion"]

print(inventory[0])        # 'sword'
print(inventory[-1])       # 'potion'

inventory.append("map")    # add to end
inventory.remove("shield") # remove by value
inventory.insert(1, "bow") # insert at index 1
print(len(inventory))

# Slicing
print(inventory[1:3])

# Tuple — immutable
coords = (28.6, 77.2)
lat, lng = coords

# List comprehension
squares = [x**2 for x in range(5)]`,
    tip: "💡 Use tuples for data that should NEVER change. Python runs tuples faster than lists!"
  },

  {
    id: 5,
    slug: "dictionaries-sets",
    title: "The Map of Many Keys",
    concept: "Dictionaries & Sets",
    emoji: "🗺️",
    xp: 150,
    level: "Beginner",

    story: [
      "The great Archive of Codoria had thousands of scrolls — but finding one by position was madness. The Archivists created a <strong>Map of Keys</strong>: give the title, get the scroll instantly. This is exactly how Python's <strong>dictionary</strong> works.",
      "A dictionary stores data as <strong>key-value pairs</strong>. Give it a key, it returns the value in O(1) time — instant lookup regardless of how large the dictionary is. This makes dictionaries one of the most important data structures in programming.",
      "<span class='text-magic-light'>Archivist Deva</span>: <em>\"And then there are Sets — collections that store only unique values, with no order. Perfect for tracking which items exist, removing duplicates, or doing set math like union and intersection.\"</em>"
    ],

    concepts: [
      {
        title: "🗂️ Creating Dictionaries",
        body: "A <strong>dictionary</strong> is created with curly braces {}. Each entry is a <strong>key: value</strong> pair separated by a colon. Keys must be unique and immutable (strings or numbers). Values can be anything.",
        example: `# Creating a dictionary
wizard = {
    "name":   "Lyra",
    "level":  42,
    "guild":  "Storm Circle",
    "alive":  True
}

print(wizard)
print(type(wizard))    # <class 'dict'>
print(len(wizard))     # 4 (number of key-value pairs)

# Empty dictionary:
empty_dict = {}
also_empty = dict()`,
        tip: "Dictionary keys must be unique! If you add the same key twice, the second value overwrites the first."
      },
      {
        title: "🔍 Accessing and Modifying",
        body: "Access values using the key in square brackets. If the key doesn't exist, you get a KeyError. Use <strong>.get()</strong> for safe access — it returns None if key not found.",
        example: `wizard = {"name": "Lyra", "level": 42}

# Access values:
print(wizard["name"])          # 'Lyra'
print(wizard.get("level"))     # 42
print(wizard.get("age", 0))    # 0 (default if missing)

# Add new key:
wizard["weapon"] = "Staff"

# Update existing key:
wizard["level"] = 43

# Delete key:
del wizard["guild"]            # KeyError if not found

# Check if key exists:
if "name" in wizard:
    print("Found!")`,
        tip: "Always use .get() when you're not sure if the key exists. It's safer than direct [] access!"
      },
      {
        title: "🔄 Looping Through Dictionaries",
        body: "You can loop through a dictionary's keys, values, or both. The <strong>.items()</strong> method returns key-value pairs as tuples — the most useful way to iterate.",
        example: `hero = {"name": "Lyra", "level": 42, "hp": 100}

# Loop through keys only:
for key in hero:
    print(key)          # name, level, hp

# Loop through values only:
for value in hero.values():
    print(value)        # Lyra, 42, 100

# Loop through both (most useful):
for key, value in hero.items():
    print(f"{key}: {value}")

# Convert to list:
keys = list(hero.keys())    # ['name', 'level', 'hp']`,
        tip: "Python dicts maintain insertion order since Python 3.7. So looping gives keys in the order you added them."
      },
      {
        title: "🎯 Sets — Unique Values Only",
        body: "A <strong>set</strong> stores only unique values — duplicates are automatically removed. Sets are unordered (no indexing). Created with curly braces {} or set(). Used for membership testing and removing duplicates.",
        example: `# Creating sets
spells = {"fireball", "frost", "lightning"}
nums = {1, 2, 3, 2, 1}    # duplicates removed!
print(nums)    # {1, 2, 3}

# Add and remove:
spells.add("thunder")      # add one item
spells.discard("frost")    # remove (no error if missing)
spells.remove("frost")     # remove (KeyError if missing)

# Membership test (very fast!):
print("fireball" in spells)   # True

# Remove duplicates from list:
items = [1, 2, 2, 3, 3, 3]
unique = list(set(items))     # [1, 2, 3]`,
        tip: "Sets have O(1) lookup — much faster than lists for checking if something exists!"
      },
      {
        title: "⚙️ Set Operations",
        body: "Sets support mathematical set operations: <strong>union</strong> (all items from both), <strong>intersection</strong> (items in both), <strong>difference</strong> (items in one but not other).",
        example: `team_a = {"Lyra", "Torin", "Mira"}
team_b = {"Torin", "Kael", "Lyra"}

# Union — all members combined:
all_members = team_a | team_b
print(all_members)    # {'Lyra', 'Torin', 'Mira', 'Kael'}

# Intersection — members in BOTH teams:
common = team_a & team_b
print(common)         # {'Lyra', 'Torin'}

# Difference — in team_a but NOT in team_b:
only_a = team_a - team_b
print(only_a)         # {'Mira'}`,
        tip: "Set operations are used heavily in data science and algorithm problems. Very commonly tested in interviews!"
      }
    ],

    lesson_code: `wizard = {
    "name":  "Lyra",
    "level": 42,
    "guild": "Storm Circle"
}

print(wizard["name"])         # 'Lyra'
wizard["level"] = 43          # update
wizard["weapon"] = "staff"    # add new key
del wizard["guild"]           # delete

for key, value in wizard.items():
    print(f"{key}: {value}")

# SET — unique values only
spells = {"fireball", "frost", "fireball"}
print(spells)   # {'fireball', 'frost'}
spells.add("lightning")`,
    tip: "💡 Dictionary lookup is O(1) — instant, regardless of size. This is why they're used everywhere!"
  },

  {
    id: 6,
    slug: "conditionals",
    title: "The Whispering Forest",
    concept: "Conditionals",
    emoji: "🌲",
    xp: 150,
    level: "Beginner",

    story: [
      "Every path through the Whispering Forest had a gate. A gate that would open only <strong>if</strong> the traveler spoke the right words. Otherwise, it remained shut. This is the essence of <strong>conditionals</strong> — making decisions based on whether something is true or false.",
      "Without conditionals, every program would run the same way every time, regardless of input. With conditionals, your code can respond to different situations, make decisions, and branch into different paths — just like the choices you make in real life.",
      "<span class='text-magic-light'>Sentinel Gryx</span>: <em>\"Remember — indentation is sacred in Python. The code inside an if block must be indented by 4 spaces. This is how Python knows what belongs inside the condition versus what comes after it.\"</em>"
    ],

    concepts: [
      {
        title: "🔀 if / elif / else",
        body: "The <strong>if</strong> statement checks a condition. If it's True, the indented block runs. <strong>elif</strong> (else if) checks another condition if the first was False. <strong>else</strong> runs if nothing else matched.",
        example: `health = 75

if health > 80:
    print("Healthy!")          # runs if health > 80
elif health > 50:
    print("Wounded")           # runs if health 51-80
elif health > 20:
    print("Critical!")         # runs if health 21-50
else:
    print("Dead!")             # runs if health <= 20

# Output: Wounded`,
        tip: "You can have as many elif blocks as you need. Only ONE block runs — the first condition that's True."
      },
      {
        title: "⚖️ Comparison Operators",
        body: "Comparisons return True or False. Use them inside if statements. <strong>==</strong> checks equality (not = which is assignment). <strong>!=</strong> checks inequality.",
        example: `x = 10
y = 20

print(x == 10)    # True   (equal)
print(x != y)     # True   (not equal)
print(x > y)      # False  (greater than)
print(x < y)      # True   (less than)
print(x >= 10)    # True   (greater or equal)
print(x <= 9)     # False  (less or equal)

# COMMON MISTAKE:
# x = 10   → assignment (sets x to 10)
# x == 10  → comparison (checks if x equals 10)`,
        tip: "Never use = inside an if condition. Use == for comparison. This is one of the most common Python bugs!"
      },
      {
        title: "🔗 Logical Operators: and, or, not",
        body: "Combine multiple conditions using <strong>and</strong> (both must be True), <strong>or</strong> (at least one must be True), <strong>not</strong> (flips True to False).",
        example: `health = 75
mana = 30

# and — BOTH conditions must be True:
if health > 50 and mana > 20:
    print("Ready to fight!")    # prints this

# or — AT LEAST ONE must be True:
if health < 10 or mana < 5:
    print("Danger!")            # doesn't print

# not — flips the condition:
is_dead = False
if not is_dead:
    print("Still alive!")       # prints this

# Combining:
if health > 0 and (mana > 50 or health > 90):
    print("Can cast big spell!")`,
        tip: "Operator precedence: not → and → or. Use parentheses to make complex conditions clear!"
      },
      {
        title: "✅ Truthy and Falsy Values",
        body: "In Python, not just True/False can be used in conditions. Many values are automatically <strong>falsy</strong> (treated as False) or <strong>truthy</strong> (treated as True).",
        example: `# FALSY values (treated as False):
print(bool(0))      # False
print(bool(0.0))    # False
print(bool(""))     # False (empty string)
print(bool([]))     # False (empty list)
print(bool({}))     # False (empty dict)
print(bool(None))   # False

# TRUTHY values (treated as True):
print(bool(1))       # True
print(bool(-5))      # True (any non-zero)
print(bool("hi"))    # True
print(bool([1,2]))   # True (non-empty)

# Useful in practice:
inventory = []
if not inventory:
    print("Bag is empty!")`,
        tip: "This is why you can write 'if my_list:' instead of 'if len(my_list) > 0:'. Both work, first is more Pythonic!"
      },
      {
        title: "⚡ Ternary Expression (One-liner if)",
        body: "Python has a compact one-line if-else called a <strong>ternary expression</strong>. Format: <code>value_if_true if condition else value_if_false</code>. Great for simple assignments.",
        example: `health = 75

# Regular if-else:
if health > 50:
    status = "alive"
else:
    status = "defeated"

# Ternary (same result, one line!):
status = "alive" if health > 50 else "defeated"
print(status)    # 'alive'

# In print directly:
print("Win!" if health > 0 else "Game Over")

# For numbers:
ticket_price = 100 if health > 50 else 50`,
        tip: "Use ternary for simple one-line assignments. For complex logic, always use the full if-else block — readability matters!"
      }
    ],

    lesson_code: `health = 75
mana   = 20

if health > 80:
    print("Healthy!")
elif health > 40:
    print("Wounded — use a potion")
else:
    print("Critical! Retreat!")

# Logical operators
if health > 50 and mana > 10:
    print("Ready to cast!")

# Ternary
status = "alive" if health > 0 else "defeated"
print(status)`,
    tip: "💡 Python uses indentation (4 spaces) to define code blocks — NOT curly braces. This forces readable code!"
  },

  {
    id: 7,
    slug: "loops",
    title: "The Dragon's Hoard",
    concept: "Loops",
    emoji: "🐉",
    xp: 150,
    level: "Intermediate",

    story: [
      "Ignaroth the Dragon had <strong>ten thousand golden coins</strong> in his hoard. The young wizard needed to count each one. Writing print() ten thousand times was obviously impossible. <strong>Loops</strong> were the answer.",
      "A loop lets you repeat a block of code multiple times. Python has two types: <strong>for loops</strong> (repeat a set number of times or over a collection) and <strong>while loops</strong> (repeat until a condition becomes False).",
      "<span class='text-magic-light'>Ignaroth</span> roars: <em>\"Master loops and you master time itself! No task is too repetitive, no list too long. And with list comprehensions — you can do in one line what takes others ten!\"</em>"
    ],

    concepts: [
      {
        title: "🔁 for Loop — Iterating Over Sequences",
        body: "A <strong>for loop</strong> goes through each item in a sequence one by one. The loop variable takes each value in turn. Works on lists, strings, tuples, dictionaries, and more.",
        example: `spells = ["fireball", "frost", "lightning"]

for spell in spells:
    print(f"Casting: {spell}")

# Output:
# Casting: fireball
# Casting: frost
# Casting: lightning

# Works on strings too:
for char in "Python":
    print(char)    # P, y, t, h, o, n (one per line)`,
        tip: "The loop variable name (spell, char, item) is completely up to you. Choose a name that makes sense!"
      },
      {
        title: "🔢 range() — Generating Numbers",
        body: "<strong>range()</strong> generates a sequence of numbers. It has 3 forms: range(stop), range(start, stop), range(start, stop, step). The stop is always excluded.",
        example: `for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8
    print(i)

for i in range(5, 0, -1): # 5, 4, 3, 2, 1 (countdown)
    print(i)

# Common pattern — loop N times:
for _ in range(10):       # _ means "I don't need the value"
    print("Hello!")`,
        tip: "range() is lazy — it doesn't create a list in memory. It generates numbers one at a time, very memory efficient!"
      },
      {
        title: "🔄 while Loop",
        body: "A <strong>while loop</strong> repeats as long as a condition is True. Use it when you don't know in advance how many times to loop — when the loop count depends on user input or changing data.",
        example: `# Count down:
count = 5
while count > 0:
    print(f"{count} seconds left...")
    count -= 1         # IMPORTANT: update the variable!
print("Blast off!")

# Wait for correct input:
answer = ""
while answer != "quit":
    answer = input("Type 'quit' to exit: ")

print("Goodbye!")`,
        tip: "Always make sure your while loop's condition eventually becomes False! Otherwise you get an infinite loop (program freezes). Always update the variable inside the loop."
      },
      {
        title: "⏹️ break and continue",
        body: "<strong>break</strong> immediately exits the loop — no more iterations. <strong>continue</strong> skips the rest of the current iteration and moves to the next one.",
        example: `# break — exit loop early:
for i in range(10):
    if i == 5:
        break           # stop when i reaches 5
    print(i)            # prints 0, 1, 2, 3, 4

# continue — skip current iteration:
for i in range(10):
    if i % 2 == 0:
        continue        # skip even numbers
    print(i)            # prints 1, 3, 5, 7, 9

# Searching with break:
items = ["sword", "potion", "key", "map"]
for item in items:
    if item == "key":
        print("Key found!")
        break`,
        tip: "Use break when you've found what you're looking for and don't need to continue. Use continue to skip unwanted iterations."
      },
      {
        title: "📋 enumerate() and zip()",
        body: "<strong>enumerate()</strong> gives you both the index AND the value while looping. <strong>zip()</strong> loops over two lists simultaneously, pairing elements together.",
        example: `# enumerate — get index + value:
spells = ["fireball", "frost", "lightning"]
for i, spell in enumerate(spells):
    print(f"{i}: {spell}")
# 0: fireball
# 1: frost
# 2: lightning

# zip — loop two lists together:
names = ["Lyra", "Torin", "Mira"]
roles = ["Mage", "Warrior", "Ranger"]

for name, role in zip(names, roles):
    print(f"{name} is a {role}")`,
        tip: "enumerate(list, start=1) makes the index start at 1 instead of 0. Very useful for numbered lists!"
      },
      {
        title: "⚡ List Comprehension with Loops",
        body: "List comprehensions replace simple for loops that build a list. They're faster than regular loops and more readable. The syntax is: [expression for item in iterable if condition].",
        example: `# Instead of this:
squares = []
for x in range(10):
    squares.append(x ** 2)

# Write this (same result):
squares = [x ** 2 for x in range(10)]

# With filter condition:
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)   # [0, 4, 16, 36, 64]

# Transform strings:
names = ["lyra", "torin"]
caps = [n.capitalize() for n in names]`,
        tip: "If the comprehension gets complex (3+ conditions), switch back to a regular for loop for readability!"
      }
    ],

    lesson_code: `spells = ["fireball", "frost", "lightning"]
for spell in spells:
    print(f"Casting: {spell}")

for i in range(5):         # 0,1,2,3,4
    print(i)

# WHILE loop
locks = 5
while locks > 0:
    print(f"{locks} locks remaining")
    locks -= 1

# break and continue
for i in range(10):
    if i == 3: continue
    if i == 7: break
    print(i)

# List comprehension
squares = [x**2 for x in range(5)]`,
    tip: "💡 List comprehensions are Python's superpower — faster than loops AND more readable!"
  },

  {
    id: 8,
    slug: "functions",
    title: "The Wizard's Tower",
    concept: "Functions",
    emoji: "🔮",
    xp: 200,
    level: "Intermediate",

    story: [
      "The Archmagus had a problem. He wrote the same healing spell on 50 different scrolls. When he discovered a mistake, he had to fix all 50. It took him a week. <strong>Functions</strong> were invented to solve exactly this problem.",
      "A <strong>function</strong> is a named, reusable block of code. You write it once and call it anywhere. Functions accept inputs (parameters) and return outputs. They make code organized, testable, and maintainable.",
      "<span class='text-magic-light'>Archmagus Torvald</span>: <em>\"The best functions do ONE thing and do it well. They're like specialized tools — a hammer for nails, a saw for wood. When you need to change how something works, you change it in ONE place.\"</em>"
    ],

    concepts: [
      {
        title: "🏗️ Defining and Calling Functions",
        body: "Use <strong>def</strong> to define a function. Give it a name, optional parameters in parentheses, and a colon. The body is indented. Call the function by writing its name with parentheses.",
        example: `# Defining a function:
def greet():
    print("Hello, Wizard!")
    print("Welcome to Codoria!")

# Calling the function:
greet()      # Hello, Wizard!
greet()      # Call it again — runs again!
greet()      # Call it as many times as you want!`,
        tip: "Function names should be lowercase with underscores: calculate_damage, not CalculateDamage (that's for classes)."
      },
      {
        title: "📥 Parameters and Arguments",
        body: "<strong>Parameters</strong> are the variables listed in the function definition. <strong>Arguments</strong> are the actual values passed when calling the function. They give functions flexibility.",
        example: `def greet(name, title):         # name, title are parameters
    print(f"Hail, {title} {name}!")

greet("Lyra", "Wizard")         # arguments
greet("Torin", "Warrior")

# Default parameter values:
def greet(name, title="Wizard"): # title defaults to "Wizard"
    print(f"Hail, {title} {name}!")

greet("Lyra")                    # Hail, Wizard Lyra!
greet("Torin", "Warrior")        # Hail, Warrior Torin!`,
        tip: "Default parameters must come AFTER required parameters. def greet(title='Wizard', name) is a SyntaxError!"
      },
      {
        title: "📤 Return Values",
        body: "Functions can <strong>return</strong> a value using the <strong>return</strong> statement. The caller can store or use this value. A function without return implicitly returns None.",
        example: `def add(a, b):
    return a + b

result = add(10, 20)   # result = 30
print(result)          # 30
print(add(5, 7))       # 12

def calculate_damage(base, multiplier=1.5):
    damage = base * multiplier
    return damage

dmg = calculate_damage(100)       # 150.0
crit = calculate_damage(100, 2.5) # 250.0

# Return multiple values (as a tuple):
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([5, 2, 8, 1, 9])`,
        tip: "return immediately exits the function. Any code after return in the same block is unreachable."
      },
      {
        title: "📦 *args and **kwargs",
        body: "<strong>*args</strong> lets a function accept any number of positional arguments as a tuple. <strong>**kwargs</strong> accepts any number of keyword arguments as a dictionary.",
        example: `# *args — variable positional arguments:
def total(*numbers):
    return sum(numbers)

print(total(10, 20, 30))        # 60
print(total(1, 2, 3, 4, 5))    # 15

# **kwargs — variable keyword arguments:
def create_hero(**traits):
    for key, value in traits.items():
        print(f"{key}: {value}")

create_hero(name="Lyra", level=42, guild="Storm")`,
        tip: "The names *args and **kwargs are convention — you can name them anything. But stick to the convention for readability!"
      },
      {
        title: "⚡ Lambda Functions",
        body: "A <strong>lambda</strong> is a small anonymous function defined in one line. Syntax: <code>lambda parameters: expression</code>. Used for simple operations, especially as arguments to other functions.",
        example: `# Regular function:
def double(x):
    return x * 2

# Equivalent lambda:
double = lambda x: x * 2
print(double(5))   # 10

# Lambda with multiple parameters:
add = lambda a, b: a + b
print(add(3, 7))   # 10

# Common use — sorting with custom key:
heroes = [("Lyra", 42), ("Torin", 38), ("Mira", 45)]
heroes.sort(key=lambda h: h[1])  # sort by level
print(heroes)`,
        tip: "Use lambda for simple one-line functions. For anything more complex, use a regular def function."
      },
      {
        title: "🔭 Variable Scope",
        body: "Variables have <strong>scope</strong> — where in the code they're accessible. Variables inside a function are <strong>local</strong> (only accessible inside). Variables outside are <strong>global</strong>.",
        example: `# Local scope:
def heal():
    heal_amount = 50    # local — only exists inside heal()
    print(heal_amount)

heal()
# print(heal_amount)   # NameError! Not accessible outside!

# Global scope:
MAX_MANA = 200   # global — accessible everywhere

def cast():
    print(MAX_MANA)   # can READ global variables

# To MODIFY a global inside a function:
counter = 0
def increment():
    global counter      # must declare global
    counter += 1`,
        tip: "Avoid using global variables when possible — they make code hard to debug. Pass values as parameters instead!"
      }
    ],

    lesson_code: `def greet(name, title="Wizard"):
    """Returns a greeting string."""
    return f"Hail, {title} {name}!"

print(greet("Lyra"))            # Hail, Wizard Lyra!
print(greet("Torin", "Arch"))

# *args
def total_damage(*attacks):
    return sum(attacks)
print(total_damage(10, 25, 8))  # 43

# **kwargs
def create_spell(**props):
    for k, v in props.items():
        print(f"{k}: {v}")

# Lambda
double = lambda x: x * 2`,
    tip: "💡 Every recursive function MUST have a base case — the condition where it stops calling itself!"
  },

  {
    id: 9,
    slug: "file-io",
    title: "The Hall of Records",
    concept: "File I/O",
    emoji: "📂",
    xp: 200,
    level: "Intermediate",

    story: [
      "The great <strong>Hall of Records</strong> stored the history of every quest, every battle, every hero. Data written here survived for centuries. But data stored only in memory? It vanished the moment a wizard fell asleep.",
      "Python can <strong>read and write files</strong> — text files, CSV spreadsheets, JSON configs, and more. This is how programs save state, exchange data, and communicate with other systems. Every real application needs file I/O.",
      "<span class='text-magic-light'>Keeper Nara</span>: <em>\"Always use the 'with' keyword to open files. It creates a context manager that automatically closes the file — even if your program crashes. Never open without 'with'!\"</em>"
    ],

    concepts: [
      {
        title: "📖 Opening Files — Modes",
        body: "Use <strong>open(filename, mode)</strong> to open a file. The mode tells Python what you want to do with the file. The most important modes are r (read), w (write), a (append).",
        example: `# File modes:
# 'r'  — read (file must exist)
# 'w'  — write (creates file, OVERWRITES if exists!)
# 'a'  — append (adds to end, won't overwrite)
# 'x'  — create (fails if file already exists)
# 'rb' — read binary (images, PDFs, etc.)

# Opening a file:
f = open("quest.txt", "r")   # opens for reading
content = f.read()
f.close()                     # MUST close manually!`,
        tip: "Without closing, the file stays locked. That's why 'with' is better — it closes automatically!"
      },
      {
        title: "🛡️ The 'with' Statement",
        body: "The <strong>with</strong> statement (context manager) automatically closes the file when the block ends — even if an exception occurs. This is the correct way to work with files.",
        example: `# CORRECT way — with statement:
with open("quest.txt", "w") as f:
    f.write("Day 1: Entered the forest\n")
    f.write("Day 2: Defeated the goblin\n")
# File is automatically closed here!

# Reading a file:
with open("quest.txt", "r") as f:
    content = f.read()        # entire file as one string
    print(content)

# Reading line by line (memory efficient):
with open("quest.txt", "r") as f:
    for line in f:
        print(line.strip())   # strip removes \n`,
        tip: "'with open()' is the only correct way to open files in professional Python code. Never use open() without with!"
      },
      {
        title: "✍️ Writing and Appending",
        body: "<strong>write()</strong> writes a string to a file. Mode 'w' overwrites the entire file. Mode 'a' adds to the end without destroying existing content.",
        example: `# Write mode — creates/overwrites file:
with open("log.txt", "w") as f:
    f.write("Quest log started\n")
    f.write("Day 1: Enter forest\n")

# Append mode — adds to existing file:
with open("log.txt", "a") as f:
    f.write("Day 2: Fight goblin\n")
    f.write("Day 3: Find treasure\n")

# Write multiple lines at once:
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("data.txt", "w") as f:
    f.writelines(lines)`,
        tip: "write() doesn't add newlines automatically! You must add \\n yourself at the end of each line."
      },
      {
        title: "📦 JSON Files",
        body: "<strong>JSON</strong> (JavaScript Object Notation) is the most common format for exchanging data between programs and APIs. Python's json module converts between Python objects and JSON text.",
        example: `import json

# Python dict → JSON file:
hero = {
    "name":  "Lyra",
    "level": 42,
    "spells": ["fireball", "frost"],
    "alive": True
}

with open("hero.json", "w") as f:
    json.dump(hero, f, indent=2)   # indent=2 for pretty print

# JSON file → Python dict:
with open("hero.json", "r") as f:
    loaded = json.load(f)

print(loaded["name"])    # 'Lyra'
print(loaded["spells"])  # ['fireball', 'frost']`,
        tip: "json.dump() writes to a file. json.dumps() returns a string. json.load() reads from a file. json.loads() parses a string."
      },
      {
        title: "🔍 Reading Methods",
        body: "There are several ways to read file content. Choose based on file size and whether you need all the content or just specific lines.",
        example: `with open("quest.txt", "r") as f:
    # Read entire file as one string:
    content = f.read()

with open("quest.txt", "r") as f:
    # Read all lines as a list:
    lines = f.readlines()
    print(lines[0])      # first line (includes \n)

with open("quest.txt", "r") as f:
    # Read one line at a time (memory efficient):
    first_line = f.readline()
    second_line = f.readline()

# Best for large files — iterate directly:
with open("quest.txt", "r") as f:
    for line in f:       # reads one line at a time
        print(line.strip())`,
        tip: "For large files (GBs), never use read() — it loads everything into memory! Always iterate line by line."
      }
    ],

    lesson_code: `# Writing a file
with open("quest_log.txt", "w") as f:
    f.write("Day 1: Entered the forest\n")
    f.write("Day 2: Defeated the goblin\n")

# Reading a file
with open("quest_log.txt", "r") as f:
    for line in f:
        print(line.strip())

# Appending
with open("quest_log.txt", "a") as f:
    f.write("Day 3: Found the treasure\n")

# JSON
import json
data = {"hero": "Lyra", "level": 42}
with open("save.json", "w") as f:
    json.dump(data, f, indent=2)`,
    tip: "💡 'with open()' is a context manager. It closes the file automatically — even if an exception occurs!"
  },

  {
    id: 10,
    slug: "oops-basics",
    title: "The Forge of Classes",
    concept: "OOP — Classes & Objects",
    emoji: "⚒️",
    xp: 250,
    level: "Intermediate",

    story: [
      "In the Forge of Classes, Forgemaster Kael created blueprints. Not just one hero — a <strong>blueprint for all heroes</strong>. From this one blueprint, he could forge thousands of unique heroes, each with their own name, health, and abilities.",
      "This is <strong>Object-Oriented Programming (OOP)</strong>. A <strong>class</strong> is the blueprint. An <strong>object</strong> (or instance) is something built from that blueprint. One class, unlimited objects — each with their own data.",
      "<span class='text-magic-light'>Forgemaster Kael</span>: <em>\"OOP lets you model the real world in code. A Hero class. An Enemy class. A Spell class. Each knows its own data and behavior. This is how ALL large applications are built.\"</em>"
    ],

    concepts: [
      {
        title: "🏗️ Creating a Class",
        body: "A <strong>class</strong> is defined with the <strong>class</strong> keyword, followed by the name (CamelCase), a colon, and an indented body. By convention, class names start with a capital letter.",
        example: `class Hero:
    """Blueprint for a hero character."""
    pass    # empty class for now

# Create objects (instances):
lyra  = Hero()    # create a Hero object
torin = Hero()    # another Hero object

print(type(lyra))        # <class '__main__.Hero'>
print(isinstance(lyra, Hero))   # True`,
        tip: "Class names use CamelCase (Hero, DatabaseConnection). Function names use snake_case (get_hero, calculate_damage)."
      },
      {
        title: "🎬 __init__ — The Constructor",
        body: "<strong>__init__</strong> is a special method called automatically when you create a new object. It initializes the object's data. The first parameter is always <strong>self</strong> — which refers to the object being created.",
        example: `class Hero:
    def __init__(self, name, health=100):
        """Runs automatically when Hero() is called."""
        self.name   = name      # instance variable
        self.health = health    # instance variable
        self.inventory = []     # starts empty

# Creating objects:
lyra  = Hero("Lyra", 120)
torin = Hero("Torin")      # uses default health=100

print(lyra.name)    # 'Lyra'
print(lyra.health)  # 120
print(torin.health) # 100`,
        tip: "__init__ is NOT the constructor in the traditional sense — __new__ is. But think of __init__ as 'setup that runs at creation time'."
      },
      {
        title: "🤖 self — The Object's Reference",
        body: "<strong>self</strong> refers to the current instance — the specific object calling the method. Every method in a class must have self as its first parameter. Python passes it automatically.",
        example: `class Hero:
    def __init__(self, name):
        self.name = name      # self.name belongs to THIS object

    def greet(self):          # self is passed automatically
        print(f"I am {self.name}!")

    def heal(self, amount):
        self.health += amount
        print(f"{self.name} healed {amount} HP!")

lyra  = Hero("Lyra")
torin = Hero("Torin")

lyra.greet()    # I am Lyra!    (self = lyra)
torin.greet()   # I am Torin!   (self = torin)`,
        tip: "You NEVER pass self when calling methods — Python does it automatically! lyra.greet() NOT lyra.greet(lyra)"
      },
      {
        title: "📊 Instance vs Class Variables",
        body: "<strong>Instance variables</strong> (self.name) are unique to each object. <strong>Class variables</strong> are shared by ALL objects of that class. Defined outside __init__, at the class level.",
        example: `class Hero:
    realm = "Codoria"    # CLASS variable — shared by all
    count = 0            # tracks total heroes created

    def __init__(self, name):
        Hero.count += 1          # increment class var
        self.name = name         # INSTANCE var — unique per object
        self.health = 100

lyra  = Hero("Lyra")
torin = Hero("Torin")

print(lyra.realm)     # 'Codoria'  (from class)
print(torin.realm)    # 'Codoria'  (same shared value)
print(lyra.name)      # 'Lyra'    (unique to lyra)
print(Hero.count)     # 2          (class variable)`,
        tip: "If you change a class variable through self (self.realm = 'X'), it creates an instance variable instead — doesn't affect others!"
      },
      {
        title: "🪄 Special Methods (__str__, __len__)",
        body: "Python has <strong>dunder (double underscore) methods</strong> that define how objects behave with built-in operations. <strong>__str__</strong> defines what print() shows. <strong>__len__</strong> defines what len() returns.",
        example: `class Hero:
    def __init__(self, name, health):
        self.name = name
        self.health = health
        self.inventory = []

    def __str__(self):       # called by print()
        return f"Hero({self.name}, HP:{self.health})"

    def __len__(self):       # called by len()
        return len(self.inventory)

    def __repr__(self):      # developer representation
        return f"Hero(name={self.name!r})"

h = Hero("Lyra", 100)
print(h)          # Hero(Lyra, HP:100)
print(len(h))     # 0 (empty inventory)`,
        tip: "There are dozens of dunder methods: __add__ for +, __eq__ for ==, __lt__ for <. They let your objects work with Python operators!"
      }
    ],

    lesson_code: `class Hero:
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
print(lyra)`,
    tip: "💡 'self' is like 'this' in Java/JavaScript. Python requires writing it explicitly — it makes code clear!"
  },

  {
    id: 11,
    slug: "inheritance",
    title: "The Dynasty of Classes",
    concept: "Inheritance & Polymorphism",
    emoji: "👑",
    xp: 250,
    level: "Advanced",

    story: [
      "The Hero class was the ancestor of all fighters in Codoria. Warriors, Mages, Rangers — they were all heroes at heart, but each had unique powers. Writing a separate class for each from scratch would be madness.",
      "<strong>Inheritance</strong> solves this. A child class <strong>extends</strong> a parent class — inheriting all its attributes and methods. Then it adds its own unique features. Warriors have armor. Mages have mana. But both are Heroes.",
      "<span class='text-magic-light'>Queen Elara</span>: <em>\"Polymorphism means many forms. A Warrior's attack() and a Mage's attack() have the same name but completely different behavior. You can treat them both as Heroes — yet each acts according to its true nature.\"</em>"
    ],

    concepts: [
      {
        title: "🧬 Basic Inheritance",
        body: "To inherit from a class, put the parent class name in parentheses after the child class name. The child class gets ALL methods and attributes of the parent automatically.",
        example: `class Animal:
    def __init__(self, name):
        self.name = name

    def breathe(self):
        print(f"{self.name} breathes")

    def eat(self):
        print(f"{self.name} eats")

class Dog(Animal):        # Dog inherits from Animal
    def bark(self):       # Dog's OWN new method
        print(f"{self.name} barks: Woof!")

rex = Dog("Rex")
rex.breathe()   # inherited from Animal
rex.eat()       # inherited from Animal
rex.bark()      # Dog's own method`,
        tip: "Python checks methods in order: first the child class, then the parent. This is called Method Resolution Order (MRO)."
      },
      {
        title: "🔑 super() — Calling Parent Methods",
        body: "<strong>super()</strong> gives you access to the parent class. Most importantly, use it to call the parent's __init__ so its setup runs before you add the child's own setup.",
        example: `class Hero:
    def __init__(self, name, health):
        self.name   = name
        self.health = health

class Warrior(Hero):
    def __init__(self, name, health, armor):
        super().__init__(name, health)   # run Hero's init first!
        self.armor = armor               # then add Warrior's stuff

class Mage(Hero):
    def __init__(self, name, health, mana):
        super().__init__(name, health)
        self.mana = mana

w = Warrior("Torin", 150, 80)
m = Mage("Lyra", 100, 200)

print(w.name, w.health, w.armor)   # Torin 150 80
print(m.name, m.health, m.mana)    # Lyra 100 200`,
        tip: "ALWAYS call super().__init__() in child classes. If you skip it, the parent's setup code won't run and you'll get bugs!"
      },
      {
        title: "🔄 Method Overriding",
        body: "A child class can <strong>override</strong> a parent method by defining a method with the same name. The child's version completely replaces the parent's version for objects of that class.",
        example: `class Hero:
    def attack(self):
        print(f"{self.name} punches for 10 damage")

class Warrior(Hero):
    def attack(self):       # OVERRIDES Hero's attack
        print(f"{self.name} swings sword for 50 damage!")

class Mage(Hero):
    def attack(self):       # OVERRIDES with completely different behavior
        print(f"{self.name} casts fireball for 80 damage!")

torin = Warrior("Torin", 150, 80)
lyra  = Mage("Lyra", 100, 200)

torin.attack()    # Torin swings sword for 50 damage!
lyra.attack()     # Lyra casts fireball for 80 damage!`,
        tip: "You can call the parent's original method inside the override: super().attack() — useful when you want to extend, not replace."
      },
      {
        title: "🌀 Polymorphism",
        body: "<strong>Polymorphism</strong> means 'many forms'. Different objects can have methods with the same name, and each responds in its own way. This lets you write code that works with ANY type of Hero — without knowing the specific type.",
        example: `class Hero:
    def attack(self): print("Generic attack")

class Warrior(Hero):
    def attack(self): print("Sword slash!")

class Mage(Hero):
    def attack(self): print("Fireball!")

class Ranger(Hero):
    def attack(self): print("Arrow shot!")

# Polymorphism in action:
party = [Warrior(), Mage(), Ranger()]

for member in party:
    member.attack()   # each calls its OWN version!
# Sword slash!
# Fireball!
# Arrow shot!`,
        tip: "Polymorphism is what makes frameworks and libraries powerful — they can work with your custom classes as long as you implement the right methods!"
      },
      {
        title: "🔍 isinstance() and issubclass()",
        body: "<strong>isinstance(obj, Class)</strong> checks if an object is an instance of a class (or its subclass). <strong>issubclass(Child, Parent)</strong> checks if one class is a subclass of another.",
        example: `class Animal: pass
class Dog(Animal): pass
class Cat(Animal): pass

rex = Dog()

print(isinstance(rex, Dog))      # True
print(isinstance(rex, Animal))   # True  (Dog IS an Animal)
print(isinstance(rex, Cat))      # False

print(issubclass(Dog, Animal))   # True
print(issubclass(Cat, Animal))   # True
print(issubclass(Dog, Cat))      # False

# Useful in practice:
def treat(animal):
    if isinstance(animal, Dog):
        print("Give a bone!")
    elif isinstance(animal, Cat):
        print("Give fish!")`,
        tip: "isinstance() is better than type() for checking types — it respects inheritance relationships!"
      }
    ],

    lesson_code: `class Hero:
    def __init__(self, name, health):
        self.name   = name
        self.health = health

    def attack(self):
        print(f"{self.name} attacks!")

class Warrior(Hero):
    def __init__(self, name, health, armor):
        super().__init__(name, health)
        self.armor = armor

    def attack(self):     # override
        print(f"{self.name} swings sword!")

class Mage(Hero):
    def __init__(self, name, health, mana):
        super().__init__(name, health)
        self.mana = mana

    def attack(self):     # polymorphism
        print(f"{self.name} casts fireball!")

party = [Warrior("Torin", 150, 80), Mage("Lyra", 100, 200)]
for member in party:
    member.attack()`,
    tip: "💡 super().__init__() calls the parent constructor. Always call it — otherwise parent setup won't run!"
  },

  {
    id: 12,
    slug: "advanced-python",
    title: "The Grand Archives",
    concept: "Advanced Python",
    emoji: "🌟",
    xp: 300,
    level: "Advanced",

    story: [
      "You have come far, apprentice. From your first print() to classes, inheritance, and file handling — you have mastered the foundations. Now we enter the <strong>Grand Archives</strong>, where the deepest Python magic lives.",
      "Decorators, generators, exception handling — these are the tools that separate good programmers from <strong>great</strong> ones. They appear in every professional Python codebase. Every Django app, every data pipeline, every AI model uses these concepts.",
      "<span class='text-magic-light'>The Ancient One</span>: <em>\"Master these, and you are ready to build real applications. Not toy scripts — real, production-grade software that runs on servers, processes millions of records, and never crashes unexpectedly.\"</em>"
    ],

    concepts: [
      {
        title: "🛡️ Exception Handling — try/except",
        body: "Errors (exceptions) crash programs. <strong>try/except</strong> lets you catch errors and handle them gracefully instead of crashing. The <strong>finally</strong> block always runs — for cleanup code.",
        example: `try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(f"Result: {result}")

except ValueError:
    print("That's not a valid number!")

except ZeroDivisionError:
    print("Can't divide by zero!")

except Exception as e:    # catch any other error
    print(f"Unexpected error: {e}")

finally:
    print("This ALWAYS runs — use for cleanup!")`,
        tip: "Catch specific exceptions, not just 'except Exception'. Catching everything hides bugs!"
      },
      {
        title: "🎭 Raising Custom Exceptions",
        body: "You can <strong>raise</strong> your own exceptions to signal errors in your code. Create custom exception classes by inheriting from Exception. This makes your code's errors descriptive and meaningful.",
        example: `# Custom exception class:
class InsufficientManaError(Exception):
    pass

class LowHealthError(Exception):
    def __init__(self, health, message="Health too low"):
        self.health = health
        super().__init__(f"{message}: {health} HP")

def cast_spell(mana_cost, current_mana):
    if current_mana < mana_cost:
        raise InsufficientManaError(
            f"Need {mana_cost} mana, have {current_mana}"
        )

try:
    cast_spell(100, 30)
except InsufficientManaError as e:
    print(f"Cannot cast: {e}")`,
        tip: "Custom exceptions make your API expressive. Users know exactly what went wrong and why!"
      },
      {
        title: "🎀 Decorators",
        body: "A <strong>decorator</strong> wraps a function to add extra behavior. Syntax: @decorator_name above the function definition. Decorators are used for logging, timing, authentication, caching, and more.",
        example: `import time

# A decorator function:
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)        # run original function
        end = time.time()
        print(f"{func.__name__} took {end-start:.3f}s")
        return result
    return wrapper

@timer                          # apply the decorator
def calculate(n):
    return sum(range(n))

calculate(1000000)
# Output: calculate took 0.045s`,
        tip: "Common built-in decorators: @staticmethod, @classmethod, @property. Frameworks like Flask use @app.route as decorators!"
      },
      {
        title: "⚡ Generators and yield",
        body: "A <strong>generator</strong> is a function that uses <strong>yield</strong> instead of return. It pauses execution and resumes when next() is called. Generators produce values one at a time — extremely memory efficient.",
        example: `# Regular function — creates all values in memory:
def squares_list(n):
    return [x**2 for x in range(n)]    # creates full list

# Generator — produces one value at a time:
def squares_gen(n):
    for x in range(n):
        yield x ** 2    # pauses here each time!

gen = squares_gen(5)
print(next(gen))    # 0
print(next(gen))    # 1
print(next(gen))    # 4

# Or use in a for loop:
for sq in squares_gen(5):
    print(sq)   # 0, 1, 4, 9, 16`,
        tip: "A generator of 1 million numbers uses ~100 bytes of memory vs ~8MB for a list. Use generators for large data!"
      },
      {
        title: "🗺️ map() and filter()",
        body: "<strong>map()</strong> applies a function to every item in an iterable. <strong>filter()</strong> keeps only items where the function returns True. Both return lazy iterators — convert with list() to see results.",
        example: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map — apply function to each item:
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)   # [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# filter — keep items where function returns True:
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)     # [2, 4, 6, 8, 10]

# With real functions:
def is_passing(score):
    return score >= 60

scores = [45, 72, 88, 51, 95, 63]
passing = list(filter(is_passing, scores))
print(passing)   # [72, 88, 95, 63]`,
        tip: "map() and filter() are equivalent to list comprehensions. Most Pythonistas prefer comprehensions — they're more readable!"
      },
      {
        title: "🏆 Putting It All Together",
        body: "Professional Python code combines all these concepts. Here's a real example combining classes, exceptions, decorators, and file I/O — the kind of code you'll write in real jobs.",
        example: `import json
from functools import wraps

def log_action(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[LOG] Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

class QuestSystem:
    def __init__(self):
        self.quests = []

    @log_action
    def add_quest(self, name, reward):
        self.quests.append({"name": name, "reward": reward})

    def save(self, filename):
        with open(filename, "w") as f:
            json.dump(self.quests, f, indent=2)

qs = QuestSystem()
qs.add_quest("Slay Dragon", 500)`,
        tip: "You now have the foundation to build real Python applications. Keep building projects — that's the only way to truly master programming!"
      }
    ],

    lesson_code: `# Exception Handling
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
finally:
    print("Always runs")

# Decorator
def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_call
def cast_spell(name):
    print(f"Casting {name}!")

cast_spell("Fireball")

# Generator
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(8)])`,
    tip: "💡 Generators use 'yield' — they generate values one at a time. A generator of 1M numbers uses almost NO memory!"
  }
]

export default CHAPTERS
