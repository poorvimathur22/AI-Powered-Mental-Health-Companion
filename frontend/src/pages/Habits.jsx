import React, { useState, useEffect } from 'react'
import { habitService } from '../services/wellnessService'
import { Trophy, Plus, CheckCircle2 } from 'lucide-react'

const Habits = () => {
    const [habits, setHabits] = useState([])
    const [newHabit, setNewHabit] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const h = await habitService.getHabits()
        if (Array.isArray(h)) setHabits(h)
    }

    const handleCreateHabit = async (e) => {
        e.preventDefault()
        if (!newHabit) return
        await habitService.createHabit(newHabit)
        setNewHabit('')
        loadData()
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Habit Tracker</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <Trophy style={{ color: 'var(--accent)' }} />
                        <h3 style={{ margin: 0 }}>Active Habits</h3>
                    </div>

                    <form onSubmit={handleCreateHabit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        <input
                            className="input"
                            placeholder="Add a new habit (e.g. Meditation)..."
                            value={newHabit}
                            onChange={(e) => setNewHabit(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit"><Plus size={20} /></button>
                    </form>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {habits.map((h, idx) => (
                            <div key={idx} className="glass" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                background: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ color: 'var(--secondary)' }}><CheckCircle2 size={24} /></div>
                                    <span style={{ fontWeight: 500 }}>{h.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{h.streak}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</div>
                                </div>
                            </div>
                        ))}
                        {habits.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No habits tracked yet. Consistency is key!
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--gradient)', color: 'white' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Why Track Habits?</h3>
                    <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                        Consistent daily habits are the building blocks of mental well-being. Small wins every day lead to big changes over time.
                    </p>
                    <ul style={{ marginTop: '1.5rem', opacity: 0.9, paddingLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Reduces decision fatigue</li>
                        <li style={{ marginBottom: '0.5rem' }}>Builds self-confidence</li>
                        <li>Promotes mental clarity</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Habits
