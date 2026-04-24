import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
    isInitialLoading: boolean;
    isPageLoading: boolean;
    setIsInitialLoading: (loading: boolean) => void;
    setIsPageLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialLoading, setInternalInitialLoading] = useState(true);
    const [isPageLoading, setInternalPageLoading] = useState(false);

    const setIsInitialLoading = useCallback((loading: boolean) => {
        setInternalInitialLoading(loading);
    }, []);

    const setIsPageLoading = useCallback((loading: boolean) => {
        setInternalPageLoading(loading);
    }, []);

    return (
        <LoadingContext.Provider value={{
            isInitialLoading,
            isPageLoading,
            setIsInitialLoading,
            setIsPageLoading
        }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
