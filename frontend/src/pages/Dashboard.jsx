import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Smile,
    Calendar,
    CheckCircle2,
    Flame,
    ArrowRight,
    TrendingUp,
    Brain
} from 'lucide-react';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        mood: 'Neutral',
        tasksDone: 0,
        totalTasks: 0,
        streak: 0,
        assessmentScore: null
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        // In a real app, these would be separate API calls or a single summary call
        try {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

            // Simulating data fetching
            const tasksRes = await fetch('http://localhost:5000/api/habits/tasks', { headers });
            const tasks = await tasksRes.json();

            const habitsRes = await fetch('http://localhost:5000/api/habits/habits', { headers });
            const habits = await habitsRes.json();

            const moodRes = await fetch('http://localhost:5000/api/mood/history', { headers });
            const moods = await moodRes.json();

            const assessmentRes = await fetch('http://localhost:5000/api/wellness/assessment/latest', { headers });
            const assessment = await assessmentRes.json();

            const latestMood = moods.length > 0 ? moods[0].sentiment : 'No data';
            const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

            setStats({
                mood: latestMood,
                tasksDone: tasks.filter(t => t.completed).length,
                totalTasks: tasks.length,
                streak: maxStreak,
                assessmentScore: assessment.score || 0
            });
        } catch (err) {
            console.error(err);
        }
    };

    const cards = [
        { title: 'Current Mood', value: stats.mood, icon: Smile, color: '#6366f1', path: '/mood' },
        { title: 'Tasks Completed', value: `${stats.tasksDone}/${stats.totalTasks}`, icon: CheckCircle2, color: '#10b981', path: '/todo' },
        { title: 'Habit Streak', value: `${stats.streak} Days`, icon: Flame, color: '#f59e0b', path: '/habits' },
        { title: 'Wellness Score', value: stats.assessmentScore || 'N/A', icon: Brain, color: '#a855f7', path: '/assessment' },
    ];

    return (
        <div>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Hello, {user?.name || 'User'}! 👋
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>How are you feeling today?</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {cards.map((card, i) => (
                    <div key={i} className="card" onClick={() => navigate(card.path)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '1rem', background: `${card.color}15`, color: card.color }}>
                                <card.icon size={24} />
                            </div>
                            <ArrowRight size={18} color="#cbd5e1" />
                        </div>
                        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{card.title}</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ background: 'var(--gradient)', color: 'white' }}>
                    <h2 style={{ marginBottom: '1rem' }}>AI Companion</h2>
                    <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Talk to our AI to express your thoughts and get empathetic support.</p>
                    <button className="btn" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => navigate('/chat')}>
                        Start Chatting
                    </button>
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={24} /> Recent Mood Trend
                    </h2>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '1rem 0' }}>
                        {/* Simple bar visual */}
                        {[40, 70, 50, 90, 60, 80, 75].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: 'var(--primary)', height: `${h}%`, borderRadius: '4px', opacity: 0.3 + (i * 0.1) }}></div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>Your mood has been improving over the last week!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
