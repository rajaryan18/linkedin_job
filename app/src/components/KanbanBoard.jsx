import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, ChevronRight, Trash2, ExternalLink } from 'lucide-react';

const COLUMNS = [
  { id: 'Saved', title: 'Saved', color: '#94a3b8' },
  { id: 'Applied', title: 'Applied', color: '#34d399' },
  { id: 'Interviewing', title: 'Interviewing', color: '#818cf8' },
  { id: 'Offer', title: 'Offer', color: '#c084fc' },
  { id: 'Rejected', title: 'Rejected', color: '#fb7185' }
];

const KanbanBoard = ({ trackedJobs, onUpdateStatus, onRemoveJob }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  
  const getJobsByStatus = (status) => {
    return trackedJobs.filter(job => {
      if (status === 'Applied' && job.status === 'Referral Requested') return true;
      if (status === 'Saved' && job.status === 'Found') return true;
      return job.status === status;
    });
  };

  const handleNextStatus = (job) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === job.status);
    if (currentIndex < COLUMNS.length - 1 && job.status !== 'Rejected') {
      onUpdateStatus(job._id || job.id, { status: COLUMNS[currentIndex + 1].id });
    }
  };

  const handleDragEnd = (event, info, job) => {
    // Basic drop detection based on horizontal position
    const x = info.point.x;
    const columnWidth = window.innerWidth / COLUMNS.length;
    const columnIndex = Math.floor(x / columnWidth);
    
    if (columnIndex >= 0 && columnIndex < COLUMNS.length) {
      const newStatus = COLUMNS[columnIndex].id;
      if (newStatus !== job.status) {
        onUpdateStatus(job._id || job.id, { status: newStatus });
      }
    }
  };

  return (
    <div className="kanban-container">
      {/* Background Columns for Drop Areas */}
      <div className="kanban-grid" style={{ display: 'flex', gap: '1.5rem', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.1 }}>
        {COLUMNS.map(col => (
          <div key={`bg-${col.id}`} style={{ flex: 1, borderRight: '1px dashed var(--border)' }}></div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
      {COLUMNS.map(column => (
        <div key={column.id} className="kanban-column">
          <div className="column-header">
            <span className="column-title" style={{ color: column.color }}>{column.title}</span>
            <span className="column-count">{getJobsByStatus(column.id).length}</span>
          </div>
          
          <div className="column-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '200px' }}>
            {getJobsByStatus(column.id).map(job => (
              <motion.div
                layout
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => handleDragEnd(e, info, job)}
                whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                key={job._id || job.id}
                className="card"
                style={{ padding: '1rem', cursor: 'grab', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{job.title}</h4>
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === job.id && (
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
                              onRemoveJob(job._id || job.id);
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
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {job.location}
                  </span>
                  {column.id !== 'Offer' && column.id !== 'Rejected' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextStatus(job); }}
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
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
