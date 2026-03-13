import React from 'react';
import { Search, ExternalLink, Building2, MapPin } from 'lucide-react';
import Card from './common/Card';
import Loader from './common/Loader';

const JobSearch = ({ jobs, trackedJobs, loading, searchParams, setSearchParams, onSearch, onTrack }) => {
    return (
        <div className="animate-fade-in">
            <Card style={{ marginBottom: '2rem' }}>
                <form onSubmit={onSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'start' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                          placeholder="Job Role (e.g. Software Engineer)"
                          value={searchParams.role}
                          onChange={(e) => setSearchParams({ ...searchParams, role: e.target.value })}
                          style={{ marginBottom: 0 }}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                          placeholder="Location (e.g. Remote)"
                          value={searchParams.location}
                          onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                          style={{ marginBottom: 0 }}
                      />
                    </div>
                    <button type="submit" className="primary" style={{ height: '48px' }} disabled={loading}>
                        <Search size={18} />
                        Search
                    </button>
                </form>
            </Card>

            {loading && <Loader text="Scouring LinkedIn for opportunities..." />}

            {!loading && (
                <div className="grid">
                    {jobs.map((job) => (
                        <Card
                            key={job.job_id}
                            animate
                            title={job.title}
                            extra={<a href={job.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}><ExternalLink size={18} /></a>}
                        >
                            <div style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Building2 size={16} /> <span style={{ fontWeight: 600, color: 'var(--text)' }}>{job.company}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} /> {job.location}
                                </div>
                            </div>
                            <button
                                className={trackedJobs.some(tj => tj.job_id === job.job_id) ? "secondary" : "primary"}
                                style={{ width: '100%', marginTop: '0.5rem' }}
                                onClick={() => onTrack(job)}
                                disabled={trackedJobs.some(tj => tj.job_id === job.job_id)}
                            >
                                {trackedJobs.some(tj => tj.job_id === job.job_id) ? 'Already Tracked' : 'Track Application'}
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>

    );
};

export default JobSearch;
