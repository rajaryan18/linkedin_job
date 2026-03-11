import React from 'react';
import { TrendingUp } from 'lucide-react';
import Card from './common/Card';
import Badge from './common/Badge';
import Loader from './common/Loader';
import { motion } from 'framer-motion';

const AIOptimizer = ({ analysis, loading, analysisInput, setAnalysisInput, onAnalyze }) => {
    return (
        <div className="tab-content">
            <Card title="Resume Optimizer (Powered by AI)">
                <form onSubmit={onAnalyze} style={{ marginTop: '1rem' }}>
                    <label>Job Description</label>
                    <textarea
                        rows="5"
                        placeholder="Paste the Job Description here..."
                        value={analysisInput.jd_text}
                        onChange={(e) => setAnalysisInput({ ...analysisInput, jd_text: e.target.value })}
                        required
                    ></textarea>

                    <label>Upload Resume (PDF/TXT)</label>
                    <input
                        type="file"
                        onChange={(e) => setAnalysisInput({ ...analysisInput, resume_file: e.target.files[0] })}
                    />

                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? <Loader text="" /> : <TrendingUp size={18} />} Optimize My Resume
                    </button>
                </form>
            </Card>

            {analysis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card
                        title="Analysis Results"
                        extra={
                            <Badge type={analysis.match_rating >= 4 ? 'status-applied' : ''} style={{ fontSize: '1.2rem' }}>
                                Match Score: {analysis.match_rating}/5
                            </Badge>
                        }
                    >
                        <div className="analysis-result" style={{ marginTop: '1.5rem' }}>
                            <h4>What to Add</h4>
                            <p>{analysis.additions}</p>
                        </div>

                        <div className="analysis-result" style={{ marginTop: '1rem', borderLeftColor: '#f59e0b' }}>
                            <h4>General Suggestions</h4>
                            <p>{analysis.general_suggestions}</p>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <h4>ATS Keywords to Include</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {analysis.keywords.map(kw => <Badge key={kw}>{kw}</Badge>)}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default AIOptimizer;
