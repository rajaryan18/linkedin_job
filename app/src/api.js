import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (userData) => api.post('/auth/signup', userData);

export const searchJobs = (role, location) => api.get(`/jobs/search?role=${role}&location=${location}`);
export const trackJob = (jobData) => api.post('/jobs/track', jobData);
export const getTrackedJobs = () => api.get('/jobs/tracked');
export const updateJobStatus = (jobId, data) => api.patch(`/jobs/tracked/${jobId}`, data);
export const addReferral = (jobId, referralData) => api.post(`/jobs/tracked/${jobId}/referral`, referralData);
export const followUpReferral = (jobId, referralId) => api.post(`/jobs/tracked/${jobId}/referral/${referralId}/followup`);
export const addCustomJob = (jobData) => api.post('/jobs/custom', jobData);
export const analyzeResume = (formData) => api.post('/ai/analyze', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default api;
