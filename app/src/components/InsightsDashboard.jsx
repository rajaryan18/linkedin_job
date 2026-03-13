import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

const InsightsDashboard = ({ trackedJobs }) => {
  const total = trackedJobs.length;
  const applied = trackedJobs.filter(j => j.status !== 'Saved').length;
  const interviews = trackedJobs.filter(j => j.status === 'Interviewing').length;
  const offers = trackedJobs.filter(j => j.status === 'Offer').length;
  const rejected = trackedJobs.filter(j => j.status === 'Rejected').length;

  const stats = [
    { label: 'Total Tracked', value: total, icon: <Target size={24} />, color: '#6366f1' },
    { label: 'Applications Sent', value: applied, icon: <Clock size={24} />, color: '#34d399' },
    { label: 'Interview Invites', value: interviews, icon: <TrendingUp size={24} />, color: '#818cf8' },
    { label: 'Offers Received', value: offers, icon: <CheckCircle2 size={24} />, color: '#c084fc' },
    { label: 'Rejections', value: rejected, icon: <XCircle size={24} />, color: '#fb7185' },
  ];

  const conversionRate = applied > 0 ? ((interviews / applied) * 100).toFixed(1) : 0;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Application Insights</h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time metrics of your job search progress.</p>
      </div>

      <div className="grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ 
              background: `${stat.color}15`, 
              color: stat.color, 
              padding: '1rem', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }} className="grid">
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Conversion Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ position: 'relative', height: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: applied > 0 ? '100%' : '0%' }}
                  style={{ position: 'absolute', height: '100%', background: 'var(--primary)', opacity: 0.8 }}
                />
                <span style={{ position: 'relative', zIndex: 1, left: '1rem', fontSize: '0.75rem', fontWeight: 700, lineHeight: '1.5rem' }}>Applications ({applied})</span>
             </div>
             <div style={{ position: 'relative', height: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: applied > 0 ? `${(interviews/applied)*100}%` : '0%' }}
                  style={{ position: 'absolute', height: '100%', background: '#818cf8', opacity: 0.8 }}
                />
                <span style={{ position: 'relative', zIndex: 1, left: '1rem', fontSize: '0.75rem', fontWeight: 700, lineHeight: '1.5rem' }}>Interviews ({interviews})</span>
             </div>
             <div style={{ position: 'relative', height: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: applied > 0 ? `${(offers/applied)*100}%` : '0%' }}
                  style={{ position: 'absolute', height: '100%', background: '#c084fc', opacity: 0.8 }}
                />
                <span style={{ position: 'relative', zIndex: 1, left: '1rem', fontSize: '0.75rem', fontWeight: 700, lineHeight: '1.5rem' }}>Offers ({offers})</span>
             </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${conversionRate}, 100` }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{conversionRate}%</div>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontWeight: 700 }}>Conversion Rate</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applications to Interviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
