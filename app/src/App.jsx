import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from './hooks/useJobs';
import { useAI } from './hooks/useAI';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import JobSearch from './components/JobSearch';
import AIOptimizer from './components/AIOptimizer';
import JobTracker from './components/JobTracker';
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
    createCustomJob
  } = useJobs();

  const {
    analysis,
    loading: aiLoading,
    analysisInput,
    setAnalysisInput,
    analyze
  } = useAI();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
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

          {activeTab === 'ai' && (
            <AIOptimizer
              analysis={analysis}
              loading={aiLoading}
              analysisInput={analysisInput}
              setAnalysisInput={setAnalysisInput}
              onAnalyze={analyze}
            />
          )}

          {activeTab === 'tracked' && (
            <JobTracker
              trackedJobs={trackedJobs}
              onUpdateStatus={updateStatus}
              onCreateReferral={createReferral}
              onFollowUp={followUp}
              onCreateCustomJob={createCustomJob}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
