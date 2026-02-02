import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children, setUser }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setUser={setUser} />
            <main className="main-content" style={{ flex: 1 }}>
                <header className="mobile-only" style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleSidebar} style={{ border: 'none', background: 'none' }}>
                        <Menu />
                    </button>
                    <span style={{ fontWeight: 'bold' }}>MentAlly</span>
                </header>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
