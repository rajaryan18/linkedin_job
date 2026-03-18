import { useState, useEffect } from 'react';
import * as api from '../api';

export const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [trackedJobs, setTrackedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({ role: 'Software Engineer', location: 'Remote' });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTrackedJobs = async () => {
        try {
            const res = await api.getTrackedJobs();
            setTrackedJobs(res.data);
        } catch (err) {
            console.error('Failed to fetch tracked jobs:', err);
        }
    };

    useEffect(() => {
        fetchTrackedJobs();
    }, []);

    const search = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setCurrentPage(1); // Reset page on new search
        try {
            const res = await api.searchJobs(searchParams.role, searchParams.location);
            setJobs(res.data);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const track = async (job) => {
        try {
            await api.trackJob(job);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Tracking failed:', err);
        }
    };

    const updateStatus = async (jobId, data) => {
        try {
            await api.updateJobStatus(jobId, data);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Update status failed:', err);
        }
    };

    const createReferral = async (jobId, referralData) => {
        try {
            await api.addReferral(jobId, referralData);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Failed to add referral:', err);
        }
    };

    const followUp = async (jobId, referralId) => {
        try {
            await api.followUpReferral(jobId, referralId);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Follow-up failed:', err);
        }
    };

    const createCustomJob = async (jobData) => {
        try {
            await api.addCustomJob(jobData);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Failed to add custom job:', err);
        }
    };

    const removeJob = async (jobId) => {
        try {
            await api.deleteJob(jobId);
            await fetchTrackedJobs();
        } catch (err) {
            console.error('Failed to delete job:', err);
        }
    };

    return {
        jobs,
        trackedJobs,
        loading,
        searchParams,
        setSearchParams,
        search,
        track,
        updateStatus,
        createReferral,
        followUp,
        createCustomJob,
        removeJob,
        fetchTrackedJobs,
        currentPage,
        setCurrentPage
    };
};
