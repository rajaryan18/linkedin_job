import React, { useState } from 'react';
import { CheckCircle, UserPlus, Timer, Plus, Briefcase, MapPin, Trash2 } from 'lucide-react';
import Card from './common/Card';
import Badge from './common/Badge';
import Modal from './common/Modal';

const JobTracker = ({ trackedJobs, onUpdateStatus, onCreateReferral, onFollowUp, onCreateCustomJob, onRemoveJob }) => {
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
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>Tracked Applications</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage your active job applications and referrals.</p>
                </div>
                <button className="primary" onClick={() => setIsCustomJobModalOpen(true)}>
                    <Plus size={18} /> Add Entry
                </button>
            </div>

            <div className="grid">
                {trackedJobs.map((job) => (
                    <Card 
                      key={job.job_id} 
                      title={job.title} 
                      animate
                      extra={
                        <button 
                          onClick={() => onRemoveJob(job.job_id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                          title="Remove from tracking"
                        >
                          <Trash2 size={16} />
                        </button>
                      }
                    >
                        <div style={{ color: 'var(--text-muted)', margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <Badge type={`status-${job.status.toLowerCase().replace(/\s+/g, '-')}`}>{job.status}</Badge>
                            {job.link && (
                                <a
                                    href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}
                                >
                                    Original Listing →
                                </a>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>NETWORK REFERRALS</h4>
                                <button
                                    className="tab-btn"
                                    style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
                                    onClick={() => {
                                        setSelectedJob(job);
                                        setIsReferralModalOpen(true);
                                    }}
                                >
                                    <Plus size={14} /> Add Referral
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {job.referrals && job.referrals.length > 0 ? job.referrals.map((ref) => (
                                    <div key={ref.id} style={{
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: '0.2s'
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{ref.person}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                                              <Timer size={12} style={{ color: 'var(--text-muted)' }} />
                                              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                  Last: {ref.last_followup}
                                              </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onFollowUp(job.job_id, ref.id)}
                                            className="tab-btn"
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.3rem 0.6rem',
                                                color: 'var(--primary)'
                                            }}
                                        >
                                            Follow Up
                                        </button>
                                    </div>
                                )) : (
                                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                    No referrals yet.
                                  </div>
                                )}
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
                    <label style={{ color: 'var(--text)' }}>Referrer's Name</label>
                    <input
                        placeholder="e.g. John Doe"
                        autoFocus
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="secondary" onClick={() => setIsReferralModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
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
                    <label style={{ color: 'var(--text)' }}>Designation / Role</label>
                    <div style={{ position: 'relative' }}>
                        <Briefcase size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="e.g. Frontend Engineer"
                            style={{ paddingLeft: '3rem' }}
                            value={customJob.title}
                            onChange={(e) => setCustomJob({ ...customJob, title: e.target.value })}
                            required
                        />
                    </div>

                    <label style={{ color: 'var(--text)' }}>Company</label>
                    <input
                        placeholder="e.g. Google"
                        value={customJob.company}
                        onChange={(e) => setCustomJob({ ...customJob, company: e.target.value })}
                        required
                    />

                    <label style={{ color: 'var(--text)' }}>Location</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="e.g. Bangalore, Remote"
                            style={{ paddingLeft: '3rem' }}
                            value={customJob.location}
                            onChange={(e) => setCustomJob({ ...customJob, location: e.target.value })}
                        />
                    </div>

                    <label style={{ color: 'var(--text)' }}>Job URL (Optional)</label>
                    <input
                        placeholder="e.g. https://company.com/jobs/123"
                        value={customJob.url}
                        onChange={(e) => setCustomJob({ ...customJob, url: e.target.value })}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="secondary" onClick={() => setIsCustomJobModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="primary" style={{ flex: 1 }}>Add to Tracking</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default JobTracker;
