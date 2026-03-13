import React from 'react';
import { LayoutDashboard, Search, Trello, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'search', label: 'Job Search', icon: <Search size={18} /> },
    { id: 'tracked', label: 'Tracked Jobs', icon: <LayoutDashboard size={18} /> },
    { id: 'kanban', label: 'Kanban Board', icon: <Trello size={18} /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="app-container">
      <header>
        <div className="brand">LINKEDIN JOB TRACKER</div>
        
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
          <button 
            onClick={logout}
            className="tab-btn" 
            style={{ padding: '0.5rem', borderRadius: '12px' }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="glass-panel animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
