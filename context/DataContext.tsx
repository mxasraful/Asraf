import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSingleDoc, getOrderedCollection } from '../firebase/api';
import { Profile, HeaderLink } from '../types';
import { useLoading } from './LoadingContext';

interface DataContextType {
    profile: Profile | null;
    navLinks: HeaderLink[];
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [navLinks, setNavLinks] = useState<HeaderLink[]>([]);
    const { setIsInitialLoading } = useLoading();

    const fetchData = async () => {
        try {
            const [profileData, navigationData] = await Promise.all([
                getSingleDoc<Profile>('profile', 'info'),
                getOrderedCollection<HeaderLink>('navigation', 'order', 'asc')
            ]);

            if (profileData) setProfile(profileData);

            if (navigationData && navigationData.length > 0) {
                setNavLinks(navigationData);
            } else {
                // Fallback defaults
                setNavLinks([
                    { name: 'Home', path: '/', order: 0 },
                    { name: 'About', path: '/about', order: 1 },
                    { name: 'Projects', path: '/projects', order: 2 },
                    { name: 'Services', path: '/services', order: 3 },
                    { name: 'Contact', path: '/contact', order: 4 },
                ]);
            }
        } catch (error) {
            console.error("Error fetching global data:", error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ profile, navLinks, refreshData: fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
