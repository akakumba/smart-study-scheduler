const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import the plan generator
const generateStudyPlan = require('./.kiro/generatePlan');

// Data storage paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PLANS_FILE = path.join(__dirname, 'data', 'plans.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    
    // Initialize users file if it doesn't exist
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize plans file if it doesn't exist
    try {
      await fs.access(PLANS_FILE);
    } catch {
      await fs.writeFile(PLANS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error setting up data directory:', error);
  }
}

// Helper functions for data management
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readPlans() {
  try {
    const data = await fs.readFile(PLANS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePlans(plans) {
  await fs.writeFile(PLANS_FILE, JSON.stringify(plans, null, 2));
}

// API Routes

// Generate study plan
app.get('/api/plan', async (req, res) => {
  try {
    const { subject, level, timeframe } = req.query;
    
    if (!subject || !level) {
      return res.status(400).json({ 
        error: 'Subject and level are required parameters' 
      });
    }

    const plan = await generateStudyPlan(subject, level, timeframe || '7 days');
    res.json(plan);
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ 
      error: 'Failed to generate study plan',
      details: error.message 
    });
  }
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    const users = await readUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(409).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In production, hash this!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    // Don't send password back
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ 
      message: 'User registered successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Don't send password back
    const { password: _, ...userResponse } = user;
    res.json({ 
      message: 'Login successful',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      details: error.message 
    });
  }
});

// Save study plan
app.post('/api/savePlan', async (req, res) => {
  try {
    const { userId, planData, title } = req.body;
    
    if (!userId || !planData) {
      return res.status(400).json({ 
        error: 'User ID and plan data are required' 
      });
    }

    const plans = await readPlans();
    
    const savedPlan = {
      id: Date.now().toString(),
      userId,
      title: title || `${planData.subject} - ${planData.level}`,
      planData,
      savedAt: new Date().toISOString()
    };

    plans.push(savedPlan);
    await writePlans(plans);

    res.status(201).json({ 
      message: 'Plan saved successfully',
      plan: savedPlan 
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ 
      error: 'Failed to save plan',
      details: error.message 
    });
  }
});

// Get user's saved plans
app.get('/api/plans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await readPlans();
    
    const userPlans = plans.filter(plan => plan.userId === userId);
    res.json(userPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ 
      error: 'Failed to fetch plans',
      details: error.message 
    });
  }
});

// Delete a saved plan
app.delete('/api/plans/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const plans = await readPlans();
    
    const filteredPlans = plans.filter(plan => plan.id !== planId);
    
    if (filteredPlans.length === plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    await writePlans(filteredPlans);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ 
      error: 'Failed to delete plan',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from frontend build (for production)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch-all handler for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Initialize data directory and start server
ensureDataDirectory().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api/plan`);
    console.log(`👤 Auth endpoints: /api/login, /api/register`);
    console.log(`💾 Save plans: /api/savePlan`);
  });
}).catch(error => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});