import React from 'react';
import { Search, ExternalLink, Building2, MapPin } from 'lucide-react';
import Card from './common/Card';
import Loader from './common/Loader';

const JobSearch = ({ jobs, trackedJobs, loading, searchParams, setSearchParams, onSearch, onTrack }) => {
    return (
        <div className="tab-content">
            <Card>
                <form onSubmit={onSearch} className="grid" style={{ gridTemplateColumns: '1fr 1fr auto', alignItems: 'center' }}>
                    <input
                        placeholder="Job Role"
                        value={searchParams.role}
                        onChange={(e) => setSearchParams({ ...searchParams, role: e.target.value })}
                    />
                    <input
                        placeholder="Location"
                        value={searchParams.location}
                        onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    />
                    <button type="submit" className="primary" style={{ marginBottom: '1rem' }} disabled={loading}>
                        <Search size={18} />
                        Search
                    </button>
                </form>
            </Card>

            {loading && <Loader text="Searching for jobs..." />}

            {!loading && (
                <div className="grid">
                    {jobs.map((job) => (
                        <Card
                            key={job.job_id}
                            animate
                            title={job.title}
                            extra={<a href={job.link} target="_blank" rel="noreferrer"><ExternalLink size={18} /></a>}
                        >
                            <div style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building2 size={16} /> {job.company}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <MapPin size={16} /> {job.location}
                                </div>
                            </div>
                            <button
                                className="primary"
                                style={{ width: '100%', marginTop: '1rem', background: '#ecf3ff', color: 'var(--primary)' }}
                                onClick={() => onTrack(job)}
                                disabled={trackedJobs.some(tj => tj.job_id === job.job_id)}
                            >
                                {trackedJobs.some(tj => tj.job_id === job.job_id) ? 'Tracked' : 'Track Application'}
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobSearch;
