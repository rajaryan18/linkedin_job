import { useState } from 'react';
import * as api from '../api';

export const useAI = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisInput, setAnalysisInput] = useState({ jd_text: '', resume_file: null });

    const analyze = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('jd_text', analysisInput.jd_text);
        if (analysisInput.resume_file) {
            formData.append('resume_file', analysisInput.resume_file);
        }

        try {
            const res = await api.analyzeResume(formData);
            setAnalysis(res.data);
        } catch (err) {
            console.error('Analysis failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        analysis,
        loading,
        analysisInput,
        setAnalysisInput,
        analyze
    };
};
