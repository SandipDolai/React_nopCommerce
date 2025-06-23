import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

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
    const getCookie = () => {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        return {
            username: cookies['username'] || '',
            customerId: cookies['CustomerId'] || '',
            name: cookies['Name'] || ''
        };
    };

    const cookieData = useMemo(() => getCookie(), []);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!cookieData.customerId);
    const [customerId, setCustomerId] = useState<string | null>(() =>
        cookieData.customerId || localStorage.getItem('guestCustomerId') || null
    );

    const login = (customerId: string) => {
        setIsLoggedIn(true);
        setCustomerId(customerId);
        localStorage.removeItem('guestCustomerId');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCustomerId(null);
    };

    const contextValue = useMemo(() => ({
        isLoggedIn,
        login,
        logout,
        customerId
    }), [isLoggedIn, customerId]);

    return (
        <AuthContext.Provider value={contextValue}>
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
