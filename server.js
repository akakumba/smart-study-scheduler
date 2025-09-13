const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 5175;

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

// Generate study plan - supports both GET and POST
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

app.post('/api/plan', async (req, res) => {
  try {
    const { subject, level, days } = req.body;
    
    if (!subject || !level) {
      return res.status(400).json({ 
        error: 'Subject and level are required parameters' 
      });
    }

    const timeframe = days ? `${days} days` : '7 days';
    const planData = await generateStudyPlan(subject, level, timeframe);
    
    // Transform the response to match frontend expectations
    const response = {
      plan: planData.plan.map((dayText, index) => ({
        day: `Day ${index + 1}`,
        task: dayText.replace(/^Day \d+: /, ''),
        duration: 60, // Default 60 minutes per day
        goal: `Complete ${dayText.replace(/^Day \d+: /, '').toLowerCase()}`
      })),
      resources: planData.resources.map(resource => ({
        title: resource.title,
        url: resource.url,
        description: resource.description || `Learn ${subject} with this ${resource.type} resource`,
        type: resource.type || 'general'
      })),
      metadata: {
        subject: planData.subject,
        level: planData.level,
        totalDays: planData.totalDays,
        generatedAt: planData.generatedAt
      }
    };
    
    res.json(response);
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

// Get all saved plans (for demo purposes)
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await readPlans();
    // Return simplified format for frontend
    const simplifiedPlans = plans.map(plan => ({
      id: plan.id,
      subject: plan.planData?.subject || 'Unknown',
      level: plan.planData?.level || 'Unknown',
      days: plan.planData?.totalDays || 0,
      savedAt: plan.savedAt
    }));
    res.json(simplifiedPlans);
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

// Fetch external resources from APIs
app.get('/api/resources/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const { level = 'Beginner' } = req.query;
    
    const externalResources = [];
    
    // Add YouTube search URL (simulated API response)
    externalResources.push({
      title: `YouTube: ${subject} ${level} Tutorials`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' ' + level + ' tutorial')}`,
      description: `Search YouTube for ${subject} tutorials at ${level} level`,
      type: 'video',
      source: 'YouTube'
    });
    
    // Add Wikipedia URL (simulated API response)
    externalResources.push({
      title: `Wikipedia: ${subject}`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(subject)}`,
      description: `Learn about ${subject} on Wikipedia`,
      type: 'article',
      source: 'Wikipedia'
    });
    
    // Add Khan Academy search
    externalResources.push({
      title: `Khan Academy: ${subject}`,
      url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(subject)}`,
      description: `Free ${subject} courses on Khan Academy`,
      type: 'interactive',
      source: 'Khan Academy'
    });
    
    // Add Coursera search
    externalResources.push({
      title: `Coursera: ${subject} Courses`,
      url: `https://www.coursera.org/search?query=${encodeURIComponent(subject)}&index=prod_all_launched_products_term_optimization`,
      description: `University-level ${subject} courses on Coursera`,
      type: 'video',
      source: 'Coursera'
    });
    
    res.json({
      subject,
      level,
      resources: externalResources,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching external resources:', error);
    res.status(500).json({ 
      error: 'Failed to fetch external resources',
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