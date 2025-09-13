import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [days, setDays] = useState('');
  const [plan, setPlan] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const [savedPlans, setSavedPlans] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // --- AUTH ---
  const handleRegister = async () => {
    if (!email || !password) {
      alert('❌ Please enter both email and password');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.split('@')[0], // Use email prefix as username
          email,
          password
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ Account created successfully! You can now log in.');
        setPassword(''); // Clear password for security
      } else {
        // Better error messages
        if (res.status === 409) {
          alert('❌ An account with this email already exists');
        } else if (res.status === 400) {
          alert('❌ Please fill in all required fields');
        } else {
          alert(data.error || '❌ Registration failed');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('fetch')) {
        alert('❌ Cannot connect to server. Make sure backend is running on port 5175.');
      } else {
        alert('❌ Registration error. Please try again.');
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('❌ Please enter both email and password');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        alert(`✅ Welcome back, ${data.user.username || data.user.email}!`);
        fetchSavedPlans();
        setPassword(''); // Clear password for security
      } else {
        // Better error messages
        if (res.status === 401) {
          alert('❌ Invalid email or password. Please check your credentials.');
        } else if (res.status === 400) {
          alert('❌ Please enter both email and password');
        } else {
          alert(data.error || '❌ Login failed');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('fetch')) {
        alert('❌ Cannot connect to server. Make sure backend is running on port 5175.');
      } else {
        alert('❌ Login error. Please try again.');
      }
    }
  };

  // --- SAVED PLANS ---
  const fetchSavedPlans = async () => {
    if (!user) return;

    setLoadingSaved(true);
    try {
      const res = await fetch(`/api/plans/${user.id}`);
      const data = await res.json();
      setSavedPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch saved plans", e);
    } finally {
      setLoadingSaved(false);
    }
  };

  const loadSavedPlan = (savedPlan) => {
    const planData = savedPlan.planData;
    setSubject(planData.subject || '');
    setLevel(planData.level || 'Beginner');
    setDays(planData.totalDays?.toString() || '');
    setPlan(planData.plan || []);
    setResources(planData.resources || []);
    alert(`✅ Loaded plan: ${savedPlan.title}`);
  };

  const deleteSavedPlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("✅ Plan deleted successfully!");
        fetchSavedPlans(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.error || "❌ Failed to delete plan");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("❌ Error deleting plan. Please try again.");
    }
  };

  // --- PLAN GENERATOR ---
  const generatePlan = async () => {
    if (!subject) {
      alert("Please enter a subject");
      return;
    }
    const d = parseInt(days, 10);
    const daysToUse = Number.isFinite(d) && d > 0 ? d : 7;

    setLoading(true);
    setPlan([]);
    setResources([]);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, level, days: daysToUse }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");

      const data = await response.json();
      setPlan(data.plan || []);
      setResources(data.resources || []);
    } catch (err) {
      console.error("Error fetching plan:", err);
      alert("❌ Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE PLAN ---
  const savePlan = async () => {
    if (!user) {
      alert("❌ Please log in to save plans");
      return;
    }
    if (!plan.length) {
      alert("❌ Generate a plan first");
      return;
    }

    try {
      const planData = {
        subject,
        level,
        totalDays: days || 7,
        plan,
        resources,
        generatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/savePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planData,
          title: `${subject} - ${level} (${days || 7} days)`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Plan saved successfully!");
        fetchSavedPlans(); // Refresh the saved plans list
      } else {
        alert(data.error || "❌ Failed to save plan");
      }
    } catch (err) {
      console.error("Error saving plan:", err);
      alert("❌ Error saving plan. Please try again.");
    }
  };

  return (
    <div className="App">

      {/* --- LOGIN TOP BAR --- */}
      <div className="login-bar">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>

      <h1>Smart Study Scheduler</h1>

      {/* --- PLAN GENERATOR --- */}
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          generatePlan();
        }}
      >
        <input
          type="text"
          placeholder="Enter subject (e.g., Math)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <input
          type="number"
          min="1"
          placeholder="Enter number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
        <button type="button" onClick={savePlan} disabled={!plan.length}>
          💾 Save Plan
        </button>
      </form>

      {/* --- GENERATED PLAN --- */}
      {plan.length > 0 && (
        <div className="plan">
          <h2>📅 Your Study Plan</h2>
          <ul>
            {plan.map((day) => (
              <li key={day.day}>
                <strong>{day.day}:</strong> {day.task} — {day.duration} mins
                <br />
                🎯 <em>{day.goal}</em>
              </li>
            ))}
          </ul>

          <h2>📚 Learning Resources</h2>

          {/* Video Resources */}
          {resources.filter(r => r.type === 'video').length > 0 && (
            <div className="resource-category">
              <h3>🎥 Video Tutorials</h3>
              <ul>
                {resources.filter(r => r.type === 'video').map((r, i) => (
                  <li key={`video-${i}`} className="resource-item">
                    <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                      <strong>{r.title}</strong>
                    </a>
                    <p className="resource-description">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Resources */}
          {resources.filter(r => r.type === 'article').length > 0 && (
            <div className="resource-category">
              <h3>📖 Articles & Tutorials</h3>
              <ul>
                {resources.filter(r => r.type === 'article').map((r, i) => (
                  <li key={`article-${i}`} className="resource-item">
                    <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                      <strong>{r.title}</strong>
                    </a>
                    <p className="resource-description">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Resources */}
          {resources.filter(r => r.type === 'interactive').length > 0 && (
            <div className="resource-category">
              <h3>🎮 Interactive Platforms</h3>
              <ul>
                {resources.filter(r => r.type === 'interactive').map((r, i) => (
                  <li key={`interactive-${i}`} className="resource-item">
                    <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                      <strong>{r.title}</strong>
                    </a>
                    <p className="resource-description">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fallback for uncategorized resources */}
          {resources.filter(r => !['video', 'article', 'interactive'].includes(r.type)).length > 0 && (
            <div className="resource-category">
              <h3>🔗 Other Resources</h3>
              <ul>
                {resources.filter(r => !['video', 'article', 'interactive'].includes(r.type)).map((r, i) => (
                  <li key={`other-${i}`} className="resource-item">
                    <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                      <strong>{r.title}</strong>
                    </a>
                    <p className="resource-description">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- SAVED PLANS --- */}
      {user && (
        <div className="plan">
          <h2>📂 My Saved Plans</h2>
          <button onClick={fetchSavedPlans} disabled={loadingSaved}>
            {loadingSaved ? "Loading..." : "Refresh Plans"}
          </button>

          {savedPlans.length > 0 ? (
            <div className="saved-plans-grid">
              {savedPlans.map((savedPlan) => (
                <div key={savedPlan.id} className="saved-plan-card">
                  <h3>{savedPlan.title}</h3>
                  <p><strong>Subject:</strong> {savedPlan.planData?.subject}</p>
                  <p><strong>Level:</strong> {savedPlan.planData?.level}</p>
                  <p><strong>Duration:</strong> {savedPlan.planData?.totalDays || 'N/A'} days</p>
                  <p><strong>Saved:</strong> {new Date(savedPlan.savedAt).toLocaleDateString()}</p>

                  <div className="plan-actions">
                    <button
                      onClick={() => loadSavedPlan(savedPlan)}
                      className="load-plan-btn"
                    >
                      📋 Load Plan
                    </button>
                    <button
                      onClick={() => deleteSavedPlan(savedPlan.id)}
                      className="delete-plan-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved plans yet. Generate and save your first plan!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;