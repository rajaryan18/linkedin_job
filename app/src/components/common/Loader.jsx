import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = 'Loading...' }) => {
    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{text}</p>
        </div>
    );
};

export default Loader;
