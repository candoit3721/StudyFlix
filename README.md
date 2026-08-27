# 🎬 STUDYFLIX: Kids Multi-Profile Learning Portal 🌟

A consolidated, **Netflix-style multi-profile web portal** that unifies all children's learning studios and practice systems in one place!

---

## 🚀 Quick Start (One-Click Launch)

### Option 1: 1-Click Python Launcher (Auto-opens in your default browser)
```bash
python3 /Users/henryw/project/workdir/kids/start_kids_hub.py
```

### Option 2: Open Directly in Browser
Double-click or open [**`index.html`**](file:///Users/henryw/project/workdir/kids/index.html) in Chrome, Safari, or Edge!

---

## 👥 Multi-Profile Experience ("Who's Learning Today?")

Pick your profile and step into a personalized learning studio:

```
                  ┌────────────────────────────────────────┐
                  │          🎬  S T U D Y F L I X         │
                  │         Who's learning today?          │
                  └──────────────────┬─────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
     👧 OLIVIA                   👩‍🔬 SOPHIA                    🧑‍🎓 YAYA
   (Grade 3 Explorer)      (Grade 5 & 6 Champion)      (Calculus & Statistics)
   • Operations & Math     • Ancient Rome & Engineering • AP Calculus AB/BC
   • Times Table Blitz     • Science & Chemistry Quest • Probability & Stats
   • Clocks & Money        • Grade 5/6 Math Studio     • 高考压轴与考前冲刺
   • Geometry & Shapes     • Periodic Table & Physics  • 导数积分与假设检验
```

---

## 🌟 Key Features

1. 🎭 **Netflix-Style Profile Switcher**:
   * Switch between **Olivia**, **Sophia**, and **Yaya** at any time with a click on the top navbar avatar.
   * Edit profile names, grades, and pick custom emoji avatars with the **"⚙️ Manage Profiles"** tool.
2. 📺 **Hero Billboard & Personalized Sliders**:
   * Features high-impact interactive topic rows:
     * **Core Subjects & Studios** (Full interactive practice web apps).
     * **Trending Topics & Super Quests** (Direct-to-topic launch cards).
     * **Printable Worksheets & Master Workbooks** (Paper-ready PDF generators and comprehensive study guides).
3. 🎮 **Seamless Fullscreen Studio Viewer**:
   * Play any learning app directly inside StudyFlix with a top navigation bar to return to the hub or pop out into a new tab!
4. ⭐ **Independent XP, Streaks & Trophies**:
   * Each kid's progress, answer streaks, and achievements are tracked and saved separately in `localStorage`.

## 🍁 Ontario, Canada Curriculum & Enriched Standards

All subjects and learning modules adhere to our master design system:
* 📖 [**`CURRICULUM_STYLE_GUIDE.md`**](./CURRICULUM_STYLE_GUIDE.md) — *Unified visual design tokens, Ontario Ministry of Education Curriculum alignment (Math 2020, Science 2022 & Social Studies), Canadian metric & cultural conventions, and the 3-Tier Enriched / Waterloo CEMC Contest difficulty framework.*

---

## 🖼️ Free Image Service APIs Reference

| API Service | Best For | Rate Limit (Free Tier) | Core Advantage |
|---|---|---|---|
| [**Pexels API**](https://www.pexels.com/api/) | All-purpose apps & video | 200 requests/hour (10k/month) | Easiest to use, includes free video files |
| [**Unsplash API**](https://unsplash.com/developers) | Premium visual aesthetics | 50 requests/hour (Demo) / 5k (Production) | Widest variety of stunning, high-quality photos |
| [**Pixabay API**](https://pixabay.com/api/docs/) | Asset caching & downloads | 5,000 requests/hour | Very generous limits, allows direct file downloading |
| [**Lorem Picsum**](https://picsum.photos/) | Fast UI placeholders | Unlimited (No key needed) | Perfect for quick prototyping without an account |

---

## 📂 Project Structure

```
kids/
├── index.html                   <-- Unified Netflix-Style Multi-Profile Portal
├── style.css                    <-- Netflix Dark Theme & Slider Animations
├── app.js                       <-- Multi-Profile Engine & Topic Registry
├── start_kids_hub.py            <-- 1-Click Local Server & Browser Launcher
├── olivia-math/                 <-- Olivia's Grade 3 Math Studio
├── sophia-math/                 <-- Sophia's Grade 5/6 Math Studio
├── sophia-science/              <-- Sophia's Science & Chemistry Quest
├── sophia-rome/                 <-- Sophia's Ancient Rome & Engineering Quest
└── yaya/                        <-- Yaya's Calculus & Statistics Exam Studio
```
