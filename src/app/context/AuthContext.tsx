import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (customerId: string) => void;
    logout: () => void;
    customerId: string | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const username = getCookie();
        return !!username.customerId;
        //const savedState = localStorage.getItem('isLoggedIn');
        // return savedState ? JSON.parse(savedState) : false;
    });
    const [customerId, setCustomerId] = useState<string | null>(() => {
        const username = getCookie();
        return username.customerId || localStorage.getItem('guestCustomerId') || null;
    });
    function getCookie() {
        //debugger;
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        return {
            username: cookies['username'],
            customerId: cookies['CustomerId'],
            name: cookies['Name']
        };
    }
    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    const login = (customerId: string) => {
        setIsLoggedIn(true);
        setCustomerId(customerId);
        localStorage.removeItem('guestCustomerId');
    };
    const logout = () => {
        setIsLoggedIn(false);
        setCustomerId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, customerId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
