import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KanbanJobCard from './KanbanJobCard';

const COLUMNS = [
  { id: 'Saved', title: 'Saved', color: '#94a3b8' },
  { id: 'Applied', title: 'Applied', color: '#34d399' },
  { id: 'Interviewing', title: 'Interviewing', color: '#818cf8' },
  { id: 'Offer', title: 'Offer', color: '#c084fc' },
  { id: 'Rejected', title: 'Rejected', color: '#fb7185' }
];

const KanbanBoard = ({ trackedJobs, onUpdateStatus, onRemoveJob }) => {
  const [refresh, setRefresh] = useState(0);

  const getJobsByStatus = (status) => {
    return trackedJobs.filter(job => {
      if (status === 'Applied' && job.status === 'Referral Requested') return true;
      if (status === 'Saved' && job.status === 'Found') return true;
      return job.status === status;
    });
  };

  const handleMoveStatus = async (currentStatus, job, direction) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === currentStatus);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      await onUpdateStatus(job.job_id, { status: COLUMNS[nextIndex].id });
      setRefresh(prev => prev + 1);
    }
  };

  return (
    <div className="kanban-container" key={refresh}>
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
        {COLUMNS.map((column, index) => (
          <div key={column.id} className="kanban-column">
            <div className="column-header">
              <span className="column-title" style={{ color: column.color }}>{column.title}</span>
              <span className="column-count">{getJobsByStatus(column.id).length}</span>
            </div>

            <div className="column-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '200px' }}>
              {getJobsByStatus(column.id).map(job => (
                <KanbanJobCard
                  key={job.job_id}
                  job={job}
                  columnId={column.id}
                  isFirst={index === 0}
                  isLast={index === COLUMNS.length - 1}
                  onMove={handleMoveStatus}
                  onRemove={onRemoveJob}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
