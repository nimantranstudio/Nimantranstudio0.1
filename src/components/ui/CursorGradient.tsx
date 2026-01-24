'use client';

import { useEffect, useState } from 'react';

export const CursorGradient = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setPosition({ x: ev.clientX, y: ev.clientY });
            if (!visible) setVisible(true);
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 50,
                pointerEvents: 'none',
                width: '800px',
                height: '800px',
                transform: `translate3d(${position.x - 400}px, ${position.y - 400}px, 0)`,
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
                transition: 'opacity 0.3s ease',
            }}
        />
    );
};
