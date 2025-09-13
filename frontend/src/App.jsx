import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [subject, setSubject] = useState('')
    const [level, setLevel] = useState('Beginner')
    const [duration, setDuration] = useState('')
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // Auth state
    const [user, setUser] = useState(null)
    const [showAuth, setShowAuth] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [authForm, setAuthForm] = useState({
        username: '',
        email: '',
        password: ''
    })
    
    // Saved plans state
    const [savedPlans, setSavedPlans] = useState([])
    const [showSavedPlans, setShowSavedPlans] = useState(false)

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    // Load saved plans when user changes
    useEffect(() => {
        if (user) {
            loadSavedPlans()
        }
    }, [user])

    const loadSavedPlans = async () => {
        if (!user) return
        
        try {
            const response = await fetch(`/api/plans/${user.id}`)
            if (response.ok) {
                const plans = await response.json()
                setSavedPlans(plans)
            }
        } catch (err) {
            console.error('Error loading saved plans:', err)
        }
    }

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const endpoint = isLogin ? '/api/login' : '/api/register'
            const body = isLogin 
                ? { email: authForm.email, password: authForm.password }
                : authForm

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            setShowAuth(false)
            setAuthForm({ username: '', email: '', password: '' })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        setSavedPlans([])
        setPlan(null)
    }

    const generatePlan = async () => {
        if (!subject.trim()) {
            setError('Please enter a subject')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const timeframe = duration ? `${duration} days` : undefined;
            const url = `/api/plan?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}${timeframe ? `&timeframe=${encodeURIComponent(timeframe)}` : ''}`;
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error('Failed to generate plan')
            }

            const data = await response.json()
            setPlan(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const savePlan = async () => {
        if (!user || !plan) return

        try {
            const response = await fetch('/api/savePlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    planData: plan,
                    title: `${plan.subject} - ${plan.level}`
                })
            })

            if (response.ok) {
                await loadSavedPlans()
                alert('Plan saved successfully!')
            } else {
                throw new Error('Failed to save plan')
            }
        } catch (err) {
            setError(err.message)
        }
    }

    const deletePlan = async (planId) => {
        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                await loadSavedPlans()
            } else {
                throw new Error('Failed to delete plan')
            }
        } catch (err) {
            setError(err.message)
        }
    }

    const loadSavedPlan = (savedPlan) => {
        setPlan(savedPlan.planData)
        setSubject(savedPlan.planData.subject)
        setLevel(savedPlan.planData.level)
        // Extract duration from timeframe if available
        const timeframeDays = savedPlan.planData.timeframe?.match(/(\d+)/);
        setDuration(timeframeDays ? timeframeDays[1] : '')
        setShowSavedPlans(false)
    }

    // Handle Enter key press in form inputs
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            generatePlan()
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>📚 Smart Study Scheduler</h1>
                <p>Generate personalized study plans with AI</p>
                
                <div className="auth-section">
                    {user ? (
                        <div className="user-info">
                            <span>Welcome, {user.username}!</span>
                            <button onClick={() => setShowSavedPlans(!showSavedPlans)} className="saved-plans-btn">
                                My Plans ({savedPlans.length})
                            </button>
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuth(true)} className="login-btn">
                            Login / Register
                        </button>
                    )}
                </div>
            </header>

            {/* Auth Modal */}
            {showAuth && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isLogin ? 'Login' : 'Register'}</h2>
                        <form onSubmit={handleAuth}>
                            {!isLogin && (
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={authForm.username}
                                    onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                                    required
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                value={authForm.email}
                                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={authForm.password}
                                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                            </button>
                        </form>
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                type="button" 
                                onClick={() => setIsLogin(!isLogin)}
                                className="link-btn"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                        <button onClick={() => setShowAuth(false)} className="close-btn">Close</button>
                        {error && <div className="error">{error}</div>}
                    </div>
                </div>
            )}

            {/* Saved Plans Modal */}
            {showSavedPlans && user && (
                <div className="modal-overlay">
                    <div className="modal large">
                        <h2>My Saved Plans</h2>
                        {savedPlans.length === 0 ? (
                            <p>No saved plans yet. Generate and save your first plan!</p>
                        ) : (
                            <div className="saved-plans-list">
                                {savedPlans.map((savedPlan) => (
                                    <div key={savedPlan.id} className="saved-plan-item">
                                        <h3>{savedPlan.title}</h3>
                                        <p>Saved: {new Date(savedPlan.savedAt).toLocaleDateString()}</p>
                                        <div className="plan-actions">
                                            <button onClick={() => loadSavedPlan(savedPlan)} className="load-btn">
                                                Load Plan
                                            </button>
                                            <button onClick={() => deletePlan(savedPlan.id)} className="delete-btn">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setShowSavedPlans(false)} className="close-btn">Close</button>
                    </div>
                </div>
            )}

            <main className="main-content">
                <div className="form-container">
                    <div className="input-group">
                        <label htmlFor="subject">Subject:</label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., Math, JavaScript, Python"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="level">Level:</label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            onKeyPress={handleKeyPress}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="duration">Study Duration (days):</label>
                        <input
                            id="duration"
                            type="number"
                            min="1"
                            max="365"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Leave empty for default (7/14/21 days based on level)"
                        />
                        <small className="input-hint">
                            Default: Beginner (7 days), Intermediate (14 days), Advanced (21 days)
                        </small>
                    </div>

                    <button
                        onClick={generatePlan}
                        disabled={loading}
                        className="generate-btn"
                    >
                        {loading ? 'Generating...' : 'Generate Study Plan'}
                    </button>

                    {error && <div className="error">{error}</div>}
                </div>

                {plan && (
                    <div className="plan-container">
                        <div className="plan-header">
                            <h2>Your {plan.subject} Study Plan ({plan.level})</h2>
                            {user && (
                                <button onClick={savePlan} className="save-btn">
                                    💾 Save Plan
                                </button>
                            )}
                        </div>

                        <div className="plan-section">
                            <h3>📅 Daily Schedule</h3>
                            <ul className="plan-list">
                                {plan.plan.map((day, index) => (
                                    <li key={index} className="plan-item">{day}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="resources-section">
                            <h3>📖 Learning Resources</h3>
                            <ul className="resources-list">
                                {plan.resources.map((resource, index) => (
                                    <li key={index} className="resource-item">
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            {resource.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="plan-meta">
                            <p>Generated on: {new Date(plan.generatedAt).toLocaleDateString()}</p>
                            <p>Total duration: {plan.totalDays} days</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App