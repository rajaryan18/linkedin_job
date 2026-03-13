import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, title, extra, className = '', animate = false }) => {
    const Component = animate ? motion.div : 'div';
    const motionProps = animate ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 }
    } : {};

    return (
        <Component className={`card ${className}`} {...motionProps}>
            {(title || extra) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {title && <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>}
                    {extra}
                </div>
            )}
            {children}
        </Component>
    );
};

export default Card;
