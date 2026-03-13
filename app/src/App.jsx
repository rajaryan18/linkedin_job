import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from './hooks/useJobs';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import JobSearch from './components/JobSearch';
import JobTracker from './components/JobTracker';
import KanbanBoard from './components/KanbanBoard';
import InsightsDashboard from './components/InsightsDashboard';
import Login from './components/Login';

const App = () => {
  const [activeTab, setActiveTab] = useState('search');
  const { user } = useAuth();

  const {
    jobs,
    trackedJobs,
    loading: jobsLoading,
    searchParams,
    setSearchParams,
    search,
    track,
    updateStatus,
    createReferral,
    followUp,
    createCustomJob,
    removeJob
  } = useJobs();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeTab === 'search' && (
            <JobSearch
              jobs={jobs}
              trackedJobs={trackedJobs}
              loading={jobsLoading}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={search}
              onTrack={track}
            />
          )}

          {activeTab === 'tracked' && (
            <JobTracker
              trackedJobs={trackedJobs}
              onUpdateStatus={updateStatus}
              onCreateReferral={createReferral}
              onFollowUp={followUp}
              onCreateCustomJob={createCustomJob}
              onRemoveJob={removeJob}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoard
              trackedJobs={trackedJobs}
              onUpdateStatus={updateStatus}
              onRemoveJob={removeJob}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsDashboard
              trackedJobs={trackedJobs}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;

