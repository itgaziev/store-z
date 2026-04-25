'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type FullscreenContextType = {
    isFullscreen: boolean;
    toggle: () => void;
    setFullscreen: (fullscreen: boolean) => void;
};

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const useFullscreen = () => {
    const context = useContext(FullscreenContext);
    if (!context) {
        throw new Error('useFullscreen must be used within a FullscreenProvider');
    }
    return context;
};

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggle = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    const setFullscreen = useCallback((fullscreen: boolean) => {
        setIsFullscreen(fullscreen);
    }, []);

    useEffect(() => {
        if (isFullscreen) {
            document.documentElement.requestFullscreen?.();
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
            }
        }
    }, [isFullscreen]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <FullscreenContext.Provider value={{ isFullscreen, toggle, setFullscreen }}>
            {children}
        </FullscreenContext.Provider>
    );
};