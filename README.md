# 📚 Smart Study Scheduler

**Category**: Educational Apps  
**Team**: Solo — Angelo K.

---

## 🚀 Overview

Smart Study Scheduler is an AI-powered learning assistant that builds **personalized study plans** and finds **curated learning resources** based on the user’s:
- Subject of interest
- Available time
- Skill level (Beginner, Intermediate, Advanced)

Whether you're brushing up on Python, diving into history, or preparing for exams, this Kiro-powered agent builds a step-by-step plan to help you learn effectively and efficiently.

---

## 🧠 What It Does

1. 📝 **Takes user input**:
   - Subject (e.g., "Intro to Python")
   - Duration (e.g., "7 days")
   - Skill level (e.g., "Beginner")

2. ⚙️ **Kiro agent generates**:
   - Daily learning plan tailored to the time and level
   - Resource recommendations (videos, tutorials, online courses)

3. 📄 **Outputs a structured plan**:
   - Easy-to-follow schedule
   - Clickable learning links
   - Friendly, motivating tone

---

## 💡 How Kiro Was Used

### `studyScheduler.kiro`
- Defined a Kiro **agent** that takes three inputs and handles three key tasks:
  1. `generatePlan`: Uses prompt engineering to create a day-by-day study schedule
  2. `getResources`: Calls a custom `fetchResources.js` hook to get online resources
  3. `combine`: Formats the study plan and links into a final user-friendly output

### `fetchResources.js`
- A Node.js hook that simulates fetching resources from learning platforms like Coursera, Khan Academy, and edX.

### `.kiro/spec.yaml`
- Provides example input and structure for the agent’s execution.

---

## 📂 Project Structure
