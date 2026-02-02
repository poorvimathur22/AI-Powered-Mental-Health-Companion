import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Heart } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.register(name, email, password);
            if (data.message === 'User registered successfully') {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '1.5rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--gradient)',
                        borderRadius: '1.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        marginBottom: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Heart size={32} fill="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Join MentAlly</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Start your journey to better mental health.</p>
                </div>

                {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: '#94a3b8' }} size={18} />
                        <input className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '3rem' }} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: '#94a3b8' }} size={18} />
                        <input className="input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '3rem' }} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: '#94a3b8' }} size={18} />
                        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '3rem' }} required />
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '1rem', marginTop: '0.5rem' }}>
                        {loading ? 'Creating account...' : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
