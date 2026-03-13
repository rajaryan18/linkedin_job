import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const res = await login(formData.email, formData.password);
            if (!res.success) setError(res.error);
        } else {
            const res = await signup(formData);
            if (res.success) {
                setIsLogin(true);
                setError('Signup successful! Please login.');
            } else {
                setError(res.error);
            }
        }
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'fixed',
            color: 'white'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel animate-fade-in"
                style={{
                    padding: '3rem',
                    width: '450px',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <div className="brand" style={{ fontSize: '2rem', marginBottom: '1rem' }}>JOBTRACKER</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>
                        {isLogin ? 'Authenticating...' : 'Join Intel'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? 'Welcome back to your career command center.' : 'Initialize your job search tracking system.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key="name-field"
                            >
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>FULL NAME</label>
                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Identity Label"
                                        required
                                        style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                required
                                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SECURITY ACCESS</label>
                        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ 
                          padding: '0.75rem', 
                          background: 'rgba(244, 63, 94, 0.1)', 
                          border: '1px solid rgba(244, 63, 94, 0.2)', 
                          borderRadius: '12px',
                          color: '#fb7185',
                          fontSize: '0.8rem',
                          textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="primary" style={{ marginTop: '1rem', height: '52px' }}>
                        {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                        {isLogin ? 'ACCESS DASHBOARD' : 'INITIALIZE PROFILE'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "New to the platform?" : "Already registered?"}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, padding: 0 }}
                    >
                        {isLogin ? 'Request Access' : 'Secure Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
