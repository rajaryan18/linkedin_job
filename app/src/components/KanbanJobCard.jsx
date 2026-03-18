import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, ChevronRight, ChevronLeft, Trash2, ExternalLink } from 'lucide-react';

const KanbanJobCard = ({ job, columnId, isFirst, isLast, onMove, onRemove }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <motion.div
      layout
      key={job.job_id}
      className="card"
      style={{ padding: '1rem', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{job.title}</h4>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === job.job_id ? null : job.job_id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {activeMenu === job.job_id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  zIndex: 100,
                  width: '150px',
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  border: '1px solid var(--border)',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                  background: 'var(--panel-bg)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {job.link && (
                  <button
                    className="tab-btn"
                    style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem' }}
                    onClick={() => window.open(job.link, '_blank')}
                  >
                    <ExternalLink size={14} style={{ marginRight: '0.5rem' }} /> View Orig
                  </button>
                )}
                <button
                  className="tab-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem', color: '#fb7185' }}
                  onClick={() => {
                    onRemove(job.job_id);
                    setActiveMenu(null);
                  }}
                >
                  <Trash2 size={14} style={{ marginRight: '0.5rem' }} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{job.company}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {job.location}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {!isFirst && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove(columnId, job, -1); }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.2rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Move to previous stage"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {!isLast && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove(columnId, job, 1); }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.2rem',
                color: 'var(--primary)',
                cursor: 'pointer'
              }}
              title="Move to next stage"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KanbanJobCard;
