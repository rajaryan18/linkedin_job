import React from 'react';
import { Briefcase, Search, Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, activeTab, onTabChange }) => {
    const { user, logout } = useAuth();

    return (
        <div className="app-container">
            <header className="glass-header">
                <div className="header-content">
                    <div className="logo">
                        <Briefcase className="logo-icon" />
                        <h1>LinkedIn<span>JobTrack</span></h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                            <User size={18} />
                            <span style={{ fontWeight: 500 }}>{user?.name}</span>
                        </div>
                        <button className="icon-btn" onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => onTabChange('search')}
                    >
                        <Search size={18} /> Search
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'tracked' ? 'active' : ''}`}
                        onClick={() => onTabChange('tracked')}
                    >
                        <Activity size={18} /> Tracker
                    </button>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
