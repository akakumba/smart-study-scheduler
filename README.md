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

**New Features:**
- 👤 **User Authentication** - Register and login to save your progress
- 💾 **Save Study Plans** - Keep your favorite plans for later reference
- 📱 **Responsive Design** - Works great on desktop and mobile
- 🔄 **Plan Management** - Load, view, and delete saved plans
- ⏱️ **Custom Duration** - Set your own study timeline (1-365 days)
- 📚 **Enhanced Resources** - Multiple resource types: videos, articles, interactive platforms
- 🔍 **YouTube Search** - Automatic YouTube search links for your subject and level

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
│   ├── generatePlan.js          # CLI script for generating plans
│   └── spec.yaml
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Main app with auth & plan saving
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/                        # JSON storage (auto-created)
│   ├── users.json              # User accounts
│   └── plans.json              # Saved study plans
├── server.js                    # Express backend API
├── package.json
├── README.md
└── LICENSE
```
---

## 🛠️ Technologies

- **Backend:** Node.js + Express (port 3001)
- **Frontend:** React + Vite (port 3000)  
- **CLI:** Node.js script for direct plan generation
- Kiro Agent SDK  

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Run the Application

**Option A: Run both frontend and backend**
```bash
# Terminal 1: Start backend server
npm start

# Terminal 2: Start frontend dev server  
npm run frontend
```

**Option B: Test the planner script directly**
```bash
# Generate a study plan via CLI
node .kiro/generatePlan.js "Math" "Beginner"
node .kiro/generatePlan.js "JavaScript" "Intermediate" "10"
node .kiro/generatePlan.js "Python" "Advanced" "30 days"
```

### 3. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/plan
- **Health Check:** http://localhost:3001/api/health

### 4. Using the Application
1. **Generate Plans:** Enter a subject, level, and optional duration, then click "Generate Study Plan"
2. **Custom Duration:** Leave duration empty for defaults (7/14/21 days) or specify 1-365 days
3. **Create Account:** Click "Login / Register" to create an account
4. **Save Plans:** Once logged in, use the "💾 Save Plan" button on generated plans
5. **Manage Plans:** Click "My Plans" to view, load, or delete saved plans

---

## 🧪 API Endpoints

### Authentication
```bash
# Register new user
POST /api/register
Body: { "username": "john", "email": "john@example.com", "password": "password123" }

# Login user  
POST /api/login
Body: { "email": "john@example.com", "password": "password123" }
```

### Study Plans
```bash
# Generate study plan (with optional custom duration)
GET /api/plan?subject=Math&level=Beginner&timeframe=10%20days

# Save a plan
POST /api/savePlan
Body: { "userId": "123", "planData": {...}, "title": "Math - Beginner" }

# Get user's saved plans
GET /api/plans/:userId

# Delete a saved plan
DELETE /api/plans/:planId
```

**Plan Response Example:**
```json
{
  "subject": "Math",
  "level": "Beginner", 
  "timeframe": "7 days",
  "plan": [
    "Day 1: Basic arithmetic and number operations",
    "Day 2: Introduction to fractions and decimals",
    "..."
  ],
  "resources": [
    {
      "title": "YouTube: Math Beginner Tutorials",
      "url": "https://www.youtube.com/results?search_query=Math+Beginner+tutorial",
      "type": "video"
    },
    {
      "title": "Khan Academy Math Courses",
      "url": "https://www.khanacademy.org/math",
      "type": "video"
    },
    {
      "title": "Paul's Online Math Notes", 
      "url": "https://tutorial.math.lamar.edu/",
      "type": "article"
    },
    {
      "title": "Brilliant Math & Science",
      "url": "https://brilliant.org/courses/",
      "type": "interactive"
    }
  ],
  "generatedAt": "2025-09-05T23:10:00.000Z",
  "totalDays": 7
}
```
