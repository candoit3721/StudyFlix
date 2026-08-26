#!/usr/bin/env python3
"""
====================================================================
🚀 SOPHIA'S SUPER SCIENCE & PERIODIC TABLE QUEST! 🧪✨
An interactive terminal quiz game for Grade 5 & Grade 6 readiness.
====================================================================
"""

import sys
import time
import random

# Color formatting for terminal
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    ENDC = '\033[0m'

def print_banner():
    banner = f"""
{Colors.OKCYAN}{Colors.BOLD}
================================================================================
   🌟  S O P H I A ' S   S U P E R   S C I E N C E   Q U E S T  !  🌟
       🧪 Chemistry & Periodic Table  •  🌍 Grade 5  •  🚀 Grade 6 Prep
================================================================================{Colors.ENDC}
"""
    print(banner)

def celebratory_art():
    arts = [
        f"""{Colors.OKGREEN}
        ✨  🎉  🌟  FANTASTIC JOB, SOPHIA!  🌟  🎉  ✨
             \\ (•◡•) /   SCIENCE SUPERSTAR!
        {Colors.ENDC}""",
        f"""{Colors.OKGREEN}
        🧪 💥 🧠 BRAIN POWER LEVEL 9000! 🧠 💥 🧪
        {Colors.ENDC}""",
        f"""{Colors.OKCYAN}
        🚀 🛸 🌟 YOU ARE A MASTER OF SCIENCE! 🌟 🛸 🚀
        {Colors.ENDC}"""
    ]
    return random.choice(arts)

# Question banks
PERIODIC_QUESTIONS = [
    {
        "q": "What is the very first and lightest element on the Periodic Table?",
        "options": ["Helium (He)", "Hydrogen (H)", "Oxygen (O)", "Lithium (Li)"],
        "answer": 2,
        "explanation": "Hydrogen (H) has Atomic #1 and makes up ~75% of all matter in the universe!"
    },
    {
        "q": "Which element is used to fill party balloons and makes voices sound squeaky and high-pitched?",
        "options": ["Nitrogen (N)", "Argon (Ar)", "Helium (He)", "Neon (Ne)"],
        "answer": 3,
        "explanation": "Helium (He, #2) is lighter than air and super calm/noble!"
    },
    {
        "q": "Which element is in pencil graphite, but can also turn into a sparkling diamond under high pressure?",
        "options": ["Silicon (Si)", "Carbon (C)", "Iron (Fe)", "Gold (Au)"],
        "answer": 2,
        "explanation": "Carbon (C, #6) is the shape-shifting building block of all living things!"
    },
    {
        "q": "Why is the chemical symbol for Gold 'Au' instead of 'G'?",
        "options": [
            "It stands for 'Awesome Universe'",
            "It comes from the Latin word 'Aurum' meaning shining dawn",
            "It was named after King Austin",
            "It was an accidental spelling mistake"
        ],
        "answer": 2,
        "explanation": "Ancient Romans spoke Latin: Gold is 'Aurum' (Au), Silver is 'Argentum' (Ag)!"
    },
    {
        "q": "Which element in milk and cheese makes your bones, teeth, and seashells rock-hard?",
        "options": ["Sodium (Na)", "Calcium (Ca)", "Potassium (K)", "Magnesium (Mg)"],
        "answer": 2,
        "explanation": "Calcium (Ca, #20) is essential for strong bones, teeth, and chalk!"
    },
    {
        "q": "Which element is packed in bananas and keeps your muscles from cramping?",
        "options": ["Potassium (K)", "Phosphorus (P)", "Fluorine (F)", "Boron (B)"],
        "answer": 1,
        "explanation": "Potassium (K, #19 from Latin Kalium) is the King of bananas!"
    },
    {
        "q": "Table salt (NaCl) is made from Sodium (Na) bonded with which pool-cleaning element?",
        "options": ["Chlorine (Cl)", "Carbon (C)", "Calcium (Ca)", "Copper (Cu)"],
        "answer": 1,
        "explanation": "Sodium (Na) + Chlorine (Cl) = Sodium Chloride (NaCl), everyday table salt!"
    },
    {
        "q": "Which noble gas glows a bright reddish-orange when electricity passes through it in signs?",
        "options": ["Neon (Ne)", "Nitrogen (N)", "Nickel (Ni)", "Hydrogen (H)"],
        "answer": 1,
        "explanation": "Neon (Ne, #10) lights up city store signs with a cool reddish-orange glow!"
    },
    {
        "q": "Which element is found inside beach sand and is used to build computer chips for iPads and game consoles?",
        "options": ["Silver (Ag)", "Silicon (Si)", "Sulfur (S)", "Sodium (Na)"],
        "answer": 2,
        "explanation": "Silicon (Si, #14) is the semiconductor heart of modern electronics!"
    },
    {
        "q": "Which element is added to toothpaste to fight off sugar bugs and protect tooth enamel?",
        "options": ["Fluorine (F)", "Iron (Fe)", "Aluminum (Al)", "Helium (He)"],
        "answer": 1,
        "explanation": "Fluorine (F, #9) strengthens teeth enamel against acid and cavities!"
    }
]

DECODER_QUESTIONS = [
    {
        "q": "Decode this secret word made of elements: Carbon (C) + Argon (Ar) =",
        "options": ["CAR", "CAT", "CAN", "CAP"],
        "answer": 1,
        "explanation": "C + Ar = CAR! 🚗"
    },
    {
        "q": "Decode this secret word: Sodium (Na) + Phosphorus (P) =",
        "options": ["NO", "NAP", "NUT", "NET"],
        "answer": 2,
        "explanation": "Na + P = NAP! 😴"
    },
    {
        "q": "Decode this secret word: Boron (B) + Oxygen (O) + Sulfur (S) + Sulfur (S) =",
        "options": ["BEEP", "BOSS", "BOAT", "BASS"],
        "answer": 2,
        "explanation": "B + O + S + S = BOSS! 👑"
    },
    {
        "q": "Which elements spell the word 'TaCo'?",
        "options": [
            "Tantalum (Ta) and Cobalt (Co)",
            "Tin (Sn) and Copper (Cu)",
            "Titanium (Ti) and Carbon (C)",
            "Tellurium (Te) and Oxygen (O)"
        ],
        "answer": 1,
        "explanation": "Ta (Tantalum #73) + Co (Cobalt #27) = TaCo! 🌮"
    },
    {
        "q": "Decode this secret word: Tungsten (W) + Silver (Ag) + Sulfur (S) =",
        "options": ["WAGS", "WARS", "WAVE", "WASH"],
        "answer": 1,
        "explanation": "W (Tungsten) + Ag (Silver) + S (Sulfur) = WAGS! 🐕"
    }
]

GRADE5_QUESTIONS = [
    {
        "q": "Which of the following is a CHEMICAL change (makes a brand new substance)?",
        "options": [
            "Melting an ice cube into water",
            "Baking a cake in the oven",
            "Cutting a piece of paper in half",
            "Dissolving sugar into warm tea"
        ],
        "answer": 2,
        "explanation": "Baking causes heat reactions creating new gas bubbles and tasty compounds!"
    },
    {
        "q": "In a forest ecosystem, which organism is a PRODUCER (makes its own food via sunlight)?",
        "options": ["Mushroom", "Red Fox", "Oak Tree", "Robin Bird"],
        "answer": 3,
        "explanation": "Plants like Oak Trees use photosynthesis to produce glucose from sunlight!"
    },
    {
        "q": "If you mix 10g of sugar into 100g of water, how much will the sweet solution weigh?",
        "options": ["90 grams", "100 grams", "110 grams", "150 grams"],
        "answer": 3,
        "explanation": "Conservation of Mass: 10g + 100g = 110g! Matter cannot be destroyed!"
    },
    {
        "q": "When water vapor cools in the atmosphere to form clouds, what step of the water cycle is this?",
        "options": ["Evaporation", "Condensation", "Precipitation", "Transpiration"],
        "answer": 2,
        "explanation": "Condensation turns water vapor gas into tiny liquid cloud droplets!"
    },
    {
        "q": "Which Earth sphere includes all rocks, mountains, sand, and tectonic plates?",
        "options": ["Atmosphere", "Hydrosphere", "Geosphere", "Biosphere"],
        "answer": 3,
        "explanation": "'Geo' means Earth/Rock — the Geosphere includes all solid ground and rocks!"
    }
]

GRADE6_PREP_QUESTIONS = [
    {
        "q": "Which cell organelle is known as the 'Powerhouse of the Cell' because it makes energy?",
        "options": ["Nucleus", "Mitochondria", "Cell Wall", "Vacuole"],
        "answer": 2,
        "explanation": "Mitochondria convert sugar and oxygen into usable ATP energy for the cell!"
    },
    {
        "q": "What TWO special structures do Plant Cells have that Animal Cells do NOT have?",
        "options": [
            "Cell Wall & Chloroplasts",
            "Nucleus & Mitochondria",
            "Cell Membrane & Cytoplasm",
            "Bones & Muscles"
        ],
        "answer": 1,
        "explanation": "Plants have a rigid Cell Wall (fortress) and Chloroplasts (solar panels)!"
    },
    {
        "q": "On a roller coaster, where is POTENTIAL ENERGY (stored energy) at its absolute highest?",
        "options": [
            "At the bottom of the fastest drop",
            "At the very top of the highest hill",
            "In the middle of a loop-the-loop",
            "When the coaster is stopped at the end"
        ],
        "answer": 2,
        "explanation": "The higher you go, the more gravitational potential energy is stored!"
    },
    {
        "q": "In an experiment testing which fertilizer makes flowers grow tallest, what is the INDEPENDENT VARIABLE?",
        "options": [
            "The height of the flowers measured in cm",
            "The type/brand of fertilizer tested",
            "The amount of water given to every flower",
            "The kind of flower seed used"
        ],
        "answer": 2,
        "explanation": "Independent Variable is what 'I' change on purpose (the fertilizer type)!"
    },
    {
        "q": "When you push backward with your foot on a skateboard and your board zooms forward, which law is this?",
        "options": [
            "Newton's 1st Law (Inertia)",
            "Newton's 2nd Law (F = ma)",
            "Newton's 3rd Law (Action & Reaction)",
            "The Law of Gravity"
        ],
        "answer": 3,
        "explanation": "Newton's 3rd Law: For every action, there is an equal and opposite reaction!"
    }
]

def run_quiz_round(question_list, category_name):
    print(f"\n{Colors.HEADER}{Colors.BOLD}--- 🌟 Starting: {category_name} 🌟 ---{Colors.ENDC}\n")
    score = 0
    total = len(question_list)
    streak = 0

    # Shuffle questions for replayability
    questions = list(question_list)
    random.shuffle(questions)

    for i, item in enumerate(questions, 1):
        print(f"{Colors.BOLD}Question {i}/{total}:{Colors.ENDC} {item['q']}")
        for opt_idx, opt in enumerate(item['options'], 1):
            print(f"   {Colors.OKBLUE}{opt_idx}){Colors.ENDC} {opt}")
        
        while True:
            try:
                user_input = input(f"\n{Colors.BOLD}👉 Sophia's Choice (1-{len(item['options'])} or Q to quit): {Colors.ENDC}").strip()
                if user_input.upper() == 'Q':
                    print("\nReturning to main menu...")
                    return score, i - 1
                choice = int(user_input)
                if 1 <= choice <= len(item['options']):
                    break
                else:
                    print(f"{Colors.WARNING}Please choose a number between 1 and {len(item['options'])}!{Colors.ENDC}")
            except ValueError:
                print(f"{Colors.WARNING}Please enter a valid number (1-{len(item['options'])})!{Colors.ENDC}")

        if choice == item['answer']:
            streak += 1
            score += 1
            print(f"{Colors.OKGREEN}🎉 CORRECT! ✨{Colors.ENDC}")
            if streak >= 3:
                print(f"{Colors.WARNING}🔥 ON FIRE! {streak} In A Row Streak! 🔥{Colors.ENDC}")
            print(f"💡 {item['explanation']}\n")
        else:
            streak = 0
            correct_text = item['options'][item['answer'] - 1]
            print(f"{Colors.FAIL}❌ Oops! The correct answer was: {item['answer']}) {correct_text}{Colors.ENDC}")
            print(f"💡 {item['explanation']}\n")
        
        time.sleep(0.5)

    print(f"\n{Colors.BOLD}================================================={Colors.ENDC}")
    print(f"{Colors.HEADER}🎯 Final Score for {category_name}: {score} out of {total} ({(score/total)*100:.0f}%){Colors.ENDC}")
    if score == total:
        print(celebratory_art())
    elif score >= total * 0.7:
        print(f"{Colors.OKGREEN}🌟 Awesome score! You're a certified science champ! 🌟{Colors.ENDC}\n")
    else:
        print(f"{Colors.OKCYAN}Great try! Review the cheatsheets and try again to get 100%! 🚀{Colors.ENDC}\n")
    
    return score, total

def periodic_table_explorer():
    print(f"\n{Colors.HEADER}{Colors.BOLD}--- 🔍 PERIODIC TABLE QUICK EXPLORER 🔍 ---{Colors.ENDC}")
    elements_db = {
        1: ("Hydrogen", "H", "Lightest gas in universe, fuels stars!"),
        2: ("Helium", "He", "Noble gas, makes balloons float and squeaky voices!"),
        3: ("Lithium", "Li", "Lightest metal, powers smartphone and Tesla batteries!"),
        4: ("Beryllium", "Be", "Space shield metal used in James Webb telescope!"),
        5: ("Boron", "B", "Heatproof glassmaker (Pyrex) & silly putty ingredient!"),
        6: ("Carbon", "C", "The basis of life; forms graphite pencils & diamonds!"),
        7: ("Nitrogen", "N", "78% of air, keeps potato chip bags fresh & crisp!"),
        8: ("Oxygen", "O", "The life giver gas we breathe, makes up water (H2O)!"),
        9: ("Fluorine", "F", "The cavity crusher in toothpaste protecting enamel!"),
        10: ("Neon", "Ne", "Noble gas glowing reddish-orange in city storefronts!"),
        11: ("Sodium", "Na", "Soft silver metal that bonds with Chlorine to make table salt!"),
        12: ("Magnesium", "Mg", "Burns with blinding white sparks in fireworks!"),
        13: ("Aluminum", "Al", "Lightweight, recyclable metal for soda cans and planes!"),
        14: ("Silicon", "Si", "Found in sand, sliced into computer microchips!"),
        15: ("Phosphorus", "P", "Strikes matches on matchboxes, helps build strong bones!"),
        16: ("Sulfur", "S", "Yellow volcanic crystal smelling like rotten eggs/onions!"),
        17: ("Chlorine", "Cl", "Greenish-yellow gas that cleans swimming pools & makes salt!"),
        18: ("Argon", "Ar", "Noble gas that protects hot light bulb filaments from burning!"),
        19: ("Potassium", "K", "The King of bananas, keeps muscles and nerves healthy!"),
        20: ("Calcium", "Ca", "Makes teeth, bones, and seashells super rock-solid!")
    }
    
    while True:
        print(f"\n{Colors.OKCYAN}Enter an Atomic Number (1-20), Element Symbol (e.g. He, Na, Au), or 'Q' to return:{Colors.ENDC}")
        user_in = input("👉 Search Element: ").strip()
        if user_in.upper() == 'Q':
            break
        
        found = False
        # Search by number
        if user_in.isdigit():
            num = int(user_in)
            if num in elements_db:
                name, sym, desc = elements_db[num]
                print(f"\n{Colors.OKGREEN}⚡ Element #{num}: {name} ({sym}){Colors.ENDC}")
                print(f"🦸 Superpower: {desc}\n")
                found = True
        else:
            # Search by symbol or name
            for num, (name, sym, desc) in elements_db.items():
                if user_in.upper() == sym.upper() or user_in.upper() == name.upper():
                    print(f"\n{Colors.OKGREEN}⚡ Element #{num}: {name} ({sym}){Colors.ENDC}")
                    print(f"🦸 Superpower: {desc}\n")
                    found = True
                    break
        if not found:
            print(f"{Colors.WARNING}Element not found in Top 20 quick list. Try numbers 1 to 20 or symbols like H, C, O, Na, K!{Colors.ENDC}")

def main():
    while True:
        print_banner()
        print(f"{Colors.BOLD}Select a Quest for Sophia:{Colors.ENDC}")
        print(f"  {Colors.OKCYAN}1){Colors.ENDC} 🧪 Periodic Table Superhero Quiz (First 20 Elements)")
        print(f"  {Colors.OKCYAN}2){Colors.ENDC} 🕶️ Secret Agent Chemical Word Decoder")
        print(f"  {Colors.OKCYAN}3){Colors.ENDC} 🌍 Grade 5 Science Core (Matter, Ecosystems, Earth Spheres)")
        print(f"  {Colors.OKCYAN}4){Colors.ENDC} 🚀 Grade 6 Science Readiness (Cells, Physics, Variables)")
        print(f"  {Colors.OKCYAN}5){Colors.ENDC} 🏆 Grand Science Marathon (All Topics Mixed!)")
        print(f"  {Colors.OKCYAN}6){Colors.ENDC} 🔍 Interactive Element Superpower Explorer")
        print(f"  {Colors.OKCYAN}7){Colors.ENDC} 🚪 Exit Quest")

        choice = input(f"\n{Colors.BOLD}Choose Quest (1-7): {Colors.ENDC}").strip()

        if choice == '1':
            run_quiz_round(PERIODIC_QUESTIONS, "Periodic Table Superheroes")
        elif choice == '2':
            run_quiz_round(DECODER_QUESTIONS, "Secret Chemical Decoders")
        elif choice == '3':
            run_quiz_round(GRADE5_QUESTIONS, "Grade 5 Science Core")
        elif choice == '4':
            run_quiz_round(GRADE6_PREP_QUESTIONS, "Grade 6 Science Readiness")
        elif choice == '5':
            all_q = PERIODIC_QUESTIONS + DECODER_QUESTIONS + GRADE5_QUESTIONS + GRADE6_PREP_QUESTIONS
            run_quiz_round(all_q, "Grand Science Marathon")
        elif choice == '6':
            periodic_table_explorer()
        elif choice == '7':
            print(f"\n{Colors.OKGREEN}Keep exploring the universe, Sophia! See you next time! 🌟🚀{Colors.ENDC}\n")
            sys.exit(0)
        else:
            print(f"{Colors.WARNING}Invalid choice. Please select 1 through 7.{Colors.ENDC}")
        
        input(f"\n{Colors.OKBLUE}Press Enter to return to main menu...{Colors.ENDC}")

if __name__ == '__main__':
    main()
