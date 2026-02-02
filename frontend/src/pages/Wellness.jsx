import React, { useState } from 'react'
import { wellnessService } from '../services/wellnessService'
import { moodService } from '../services/apiService'
import { Wind, Activity, Heart, Smile, Send } from 'lucide-react'

const Wellness = ({ type }) => {
    const [breathing, setBreathing] = useState(false)
    const [timer, setTimer] = useState(0)
    const [assessmentScore, setAssessmentScore] = useState(0)
    const [step, setStep] = useState(0)
    const [moodText, setMoodText] = useState('')
    const [selectedEmoji, setSelectedEmoji] = useState('😊')

    const startBreathing = () => {
        setBreathing(true)
        let count = 0
        const interval = setInterval(() => {
            count++
            setTimer(count)
            if (count >= 60) {
                clearInterval(interval)
                setBreathing(false)
                wellnessService.logBreathing(60)
                alert('Well done! You have completed 1 minute of deep breathing.')
            }
        }, 1000)
    }

    const questions = [
        "How often have you been bothered by feeling down, depressed, or hopeless in the last 2 weeks?",
        "How often have you been bothered by little interest or pleasure in doing things?",
        "How often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        "How often have you been bothered by feeling tired or having little energy?"
    ]

    const handleAnswer = (val) => {
        setAssessmentScore(prev => prev + val)
        if (step < questions.length - 1) {
            setStep(step + 1)
        } else {
            finishAssessment()
        }
    }

    const finishAssessment = async () => {
        await wellnessService.saveAssessment(assessmentScore)
        setStep(-1) // Completion flag
    }

    const logMood = async () => {
        if (!moodText) return;
        await moodService.logMood(moodText, selectedEmoji);
        setMoodText('');
        alert('Mood logged successfully!');
    }

    const renderContent = () => {
        if (type === 'breathing') {
            return (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                    <Wind size={64} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Mindful Breathing</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Center yourself with 1 minute of focused breathing.</p>
                    {breathing ? (
                        <div style={{ animation: 'pulse 4s infinite' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
                                {timer % 10 < 5 ? 'Inhale...' : 'Exhale...'}
                            </div>
                            <div style={{ fontSize: '1.25rem', marginTop: '1rem', color: 'var(--text-muted)' }}>{timer}s</div>
                        </div>
                    ) : (
                        <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }} onClick={startBreathing}>
                            Start Session
                        </button>
                    )}
                </div>
            );
        }

        if (type === 'assessment') {
            return (
                <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem' }}>
                    <Activity size={48} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Self-Assessment</h2>
                    {step === -1 ? (
                        <div style={{ textAlign: 'center' }}>
                            <Heart size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                            <h3>Assessment Complete</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Your results have been saved. We recommend practicing mindfulness daily.</p>
                            <button className="btn btn-primary" onClick={() => setStep(0)}>Retake Assessment</button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '3rem' }}>
                                <div style={{ height: '100%', background: 'var(--secondary)', borderRadius: '4px', width: `${((step + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }}></div>
                            </div>
                            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', fontWeight: 500 }}>{questions[step]}</p>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((opt, i) => (
                                    <button key={i} className="btn" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', justifyContent: 'flex-start' }} onClick={() => handleAnswer(i)}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'mood') {
            return (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
                    <Smile size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Mood Tracker</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How are you feeling right now?</p>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '2.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                        {['😊', '😔', '😠', '😨', '😐', '🤩'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => setSelectedEmoji(emoji)}
                                style={{
                                    border: 'none',
                                    background: selectedEmoji === emoji ? 'rgba(99, 102, 241, 0.1)' : 'none',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="input"
                        placeholder="What's on your mind?..."
                        rows="4"
                        value={moodText}
                        onChange={(e) => setMoodText(e.target.value)}
                        style={{ resize: 'none', marginBottom: '1.5rem' }}
                    />

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={logMood}>
                        <Send size={18} /> Log Mood
                    </button>
                </div>
            )
        }
    }

    return (
        <div>
            {renderContent()}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </div>
    )
}

export default Wellness
