import React, { useState } from 'react';
import { CheckCircle, UserPlus, Timer, Plus, Briefcase, MapPin } from 'lucide-react';
import Card from './common/Card';
import Badge from './common/Badge';
import Modal from './common/Modal';

const JobTracker = ({ trackedJobs, onUpdateStatus, onCreateReferral, onFollowUp, onCreateCustomJob }) => {
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isCustomJobModalOpen, setIsCustomJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [referralName, setReferralName] = useState('');
    const [customJob, setCustomJob] = useState({ title: '', company: '', location: '', url: '' });

    const handleAddReferral = (e) => {
        e.preventDefault();
        if (selectedJob && referralName) {
            onCreateReferral(selectedJob.job_id, { person: referralName });
            setIsReferralModalOpen(false);
            setReferralName('');
        }
    };

    const handleAddCustomJob = (e) => {
        e.preventDefault();
        if (customJob.title && customJob.company) {
            onCreateCustomJob(customJob);
            setIsCustomJobModalOpen(false);
            setCustomJob({ title: '', company: '', location: '', url: '' });
        }
    };

    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button className="primary" onClick={() => setIsCustomJobModalOpen(true)}>
                    <Plus size={18} /> Add Custom Entry
                </button>
            </div>

            <div className="grid">
                {trackedJobs.map((job) => (
                    <Card key={job.job_id} title={job.title} animate>
                        <p style={{ margin: '0.5rem 0' }}>
                            <strong>{job.company}</strong> | {job.location}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Badge type="status-applied">{job.status}</Badge>
                            {job.link && (
                                <a
                                    href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}
                                >
                                    View Job →
                                </a>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <h4 style={{ margin: 0 }}>Referrals</h4>
                                <button
                                    className="primary"
                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                    onClick={() => {
                                        setSelectedJob(job);
                                        setIsReferralModalOpen(true);
                                    }}
                                >
                                    <UserPlus size={14} /> Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {job.referrals && job.referrals.map((ref) => (
                                    <div key={ref.id} style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{ref.person}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Last: {ref.last_followup}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onFollowUp(job.job_id, ref.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <Timer size={14} /> Follow Up
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal for adding a referral */}
            <Modal
                isOpen={isReferralModalOpen}
                onClose={() => setIsReferralModalOpen(false)}
                title={`Add Referral for ${selectedJob?.title}`}
            >
                <form onSubmit={handleAddReferral}>
                    <label>Referrer's Name</label>
                    <input
                        placeholder="e.g. John Doe"
                        autoFocus
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsReferralModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}>Cancel</button>
                        <button type="submit" className="primary" style={{ flex: 1 }}>Save Referral</button>
                    </div>
                </form>
            </Modal>

            {/* Modal for adding custom job */}
            <Modal
                isOpen={isCustomJobModalOpen}
                onClose={() => setIsCustomJobModalOpen(false)}
                title="Add Custom Job Entry"
            >
                <form onSubmit={handleAddCustomJob}>
                    <label>Designation / Role</label>
                    <div style={{ position: 'relative' }}>
                        <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="e.g. Frontend Engineer"
                            style={{ paddingLeft: '2.5rem' }}
                            value={customJob.title}
                            onChange={(e) => setCustomJob({ ...customJob, title: e.target.value })}
                            required
                        />
                    </div>

                    <label>Company</label>
                    <input
                        placeholder="e.g. Google"
                        value={customJob.company}
                        onChange={(e) => setCustomJob({ ...customJob, company: e.target.value })}
                        required
                    />

                    <label>Location</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="e.g. Bangalore, Remote"
                            style={{ paddingLeft: '2.5rem' }}
                            value={customJob.location}
                            onChange={(e) => setCustomJob({ ...customJob, location: e.target.value })}
                        />
                    </div>

                    <label>Job URL (Optional)</label>
                    <input
                        placeholder="e.g. https://company.com/jobs/123"
                        value={customJob.url}
                        onChange={(e) => setCustomJob({ ...customJob, url: e.target.value })}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setIsCustomJobModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}>Cancel</button>
                        <button type="submit" className="primary" style={{ flex: 1 }}>Add to Tracking</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default JobTracker;
