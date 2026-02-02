import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Activity,
    Smile,
    Wind,
    ClipboardCheck,
    User,
    Phone,
    LogOut,
    MessageSquare,
    X
} from 'lucide-react';
import { authService } from '../services/authService';

const Sidebar = ({ isOpen, toggleSidebar, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        if (setUser) setUser(null);
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: MessageSquare, label: 'AI Companion', path: '/chat' },
        { icon: CheckSquare, label: 'To-Do List', path: '/todo' },
        { icon: Activity, label: 'Habit Tracker', path: '/habits' },
        { icon: Smile, label: 'Mood Tracker', path: '/mood' },
        { icon: Wind, label: 'Breathing', path: '/breathing' },
        { icon: ClipboardCheck, label: 'Self-Assessment', path: '/assessment' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Phone, label: 'Emergency', path: '/emergency' },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>MentAlly</h1>
                    <button className="mobile-only" onClick={toggleSidebar} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                        <X />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => { if (window.innerWidth <= 1024) toggleSidebar(); }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="sidebar-link"
                    style={{ marginBottom: '1.5rem', border: 'none', background: 'none', width: 'calc(100% - 1.5rem)', textAlign: 'left', cursor: 'pointer' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
