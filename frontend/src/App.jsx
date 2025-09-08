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
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Registered successfully, you can now log in');
      } else {
        alert(data.message || '❌ Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Registration error');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        alert(`✅ Logged in as ${data.user.email}`);
        fetchSavedPlans();
      } else {
        alert(data.message || '❌ Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Login error');
    }
  };

  // --- SAVED PLANS ---
  const fetchSavedPlans = async () => {
    setLoadingSaved(true);
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      setSavedPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch saved plans", e);
    } finally {
      setLoadingSaved(false);
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

  // --- SAVE PLAN (stub only) ---
  const savePlan = async () => {
    if (!user) {
      alert("❌ Please log in to save plans");
      return;
    }
    if (!plan.length) {
      alert("Generate a plan first");
      return;
    }
    alert("💾 Save Plan clicked (not yet connected to backend)");
  };

  return (
    <div className="App">

      {/* --- LOGIN TOP BAR --- */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '8px',
        padding: '10px',
        backgroundColor: '#f4f4f4'
      }}>
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

          <h2>📚 Resources</h2>
          <ul>
            {resources.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.title}
                </a> — {r.description} ({r.type})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- SAVED PLANS --- */}
      <div className="plan">
        <h2>📂 Saved Plans</h2>
        <button onClick={fetchSavedPlans} disabled={loadingSaved}>
          {loadingSaved ? "Refreshing..." : "Refresh List"}
        </button>
        <ul>
          {savedPlans.map((p) => (
            <li key={p.id}>
              <strong>#{p.id}</strong> — {p.subject} ({p.level}) — {p.days || 0} days
            </li>
          ))}
          {!savedPlans.length && <li>No saved plans yet</li>}
        </ul>
      </div>
    </div>
  );
}

export default App;