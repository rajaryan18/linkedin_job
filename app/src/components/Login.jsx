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
            background: 'var(--bg-gradient)',
            color: 'white'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
                style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    width: '400px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                        {isLogin ? 'Login to continue your job search' : 'Join us to track your applications'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                key="name-field"
                            >
                                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(0, 0, 0, 0.4)' }} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        style={{ paddingLeft: '2.5rem', background: 'rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0, 0, 0, 0.1)', color: 'black', width: '100%' }}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(0, 0, 0, 0.4)' }} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                required
                                style={{ paddingLeft: '2.5rem', background: 'rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0, 0, 0, 0.1)', color: 'black', width: '100%' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(0, 0, 0, 0.4)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                style={{ paddingLeft: '2.5rem', background: 'rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0, 0, 0, 0.1)', color: 'black', width: '100%' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: '#ff4d4d', fontSize: '0.875rem', margin: 0, textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="primary" style={{ marginTop: '0.5rem', padding: '0.875rem', borderRadius: '12px' }}>
                        {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
