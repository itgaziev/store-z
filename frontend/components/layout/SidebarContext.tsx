'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type SidebarContextType = {
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const setOpen = useCallback((open: boolean) => {
        setIsOpen(open);
    }, []);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};