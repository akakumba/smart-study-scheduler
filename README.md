# 📚 Smart Study Scheduler

**Category:** Educational Apps  
**Hackathon:** Kiro Build July 2025  
**Solo project by:** @akakumba

---

## 🧠 What It Does

Smart Study Scheduler is an AI-powered learning assistant that generates personalized study plans based on:  
- The subject you want to learn  
- Your skill level (Beginner / Intermediate / Advanced)  
- Your available time (in days or hours)  

It also finds tailored learning resources like videos, docs, and courses to go with your plan — all in one clean, friendly format.

---

## 💡 Why I Built It

Learning something new is overwhelming without a clear structure.

This agent solves that by:  
- Breaking learning into small, daily goals  
- Matching your pace and level  
- Suggesting trusted learning materials (e.g. MDN, FreeCodeCamp, W3Schools)

---

## 🚀 How It Works (Under the Hood)

Built using Kiro Agent Framework, the project uses a 3-task agent pipeline:  
1. **generatePlan**  
   → Uses input like subject, level, and time to generate a motivational study plan  
2. **getResources**  
   → Calls a local function (`fetchResources.js`) to find quality links  
3. **combine**  
   → Merges the plan and resources into a user-friendly guide  

**Example Output (truncated):**

1. Day 1: Introduction to JavaScript  
   - Set up your IDE and environment  
   - Read: https://developer.mozilla.org/.../Guide  

2. Day 2: DOM Manipulation  
   - Watch: https://youtu.be/0ik6X4DJKCc  

---

## 📂 Project Structure
```
smart-study-scheduler/
├── .kiro/
│   ├── hooks/
│   │   ├── agent/
│   │   │   └── studyScheduler.kiro
│   │   └── fetchResources.js
│   └── testFetch.js
├── README.md
└── LICENSE
```
---

## 🛠️ Technologies

- JavaScript (Node.js)  
- Kiro Agent SDK  
- GitHub Codespaces for development

---

## 🧪 Test Locally

To test the `fetchResources.js` function:  
```bash
node .kiro/testFetch.js```
