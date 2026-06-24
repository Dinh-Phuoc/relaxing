'use client';

import { useState, useEffect } from 'react';

interface Breakpoints {
    isMobile: boolean;   // < 768px
    isTablet: boolean;   // 768 – 1023px
    isDesktop: boolean;  // >= 1024px
    width: number;
}

export function useResponsive(): Breakpoints {
    const [state, setState] = useState<Breakpoints>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1200,
    });

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setState({
                isMobile: w < 768,
                isTablet: w >= 768 && w < 1024,
                isDesktop: w >= 1024,
                width: w,
            });
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return state;
}
