import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartContextType {
    totalItems: number;
    setTotalItems: (total: number) => void;
    totalwishlistItems: number;
    setTotalwishlistItems: (total: number) => void;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [totalItems, _setTotalItems] = useState(0);
    const [totalwishlistItems, _setTotalwishlistItems] = useState(0);

    // ✅ Wrapped with condition to avoid unnecessary updates
    const setTotalItems = useCallback((total: number) => {
        _setTotalItems(prev => (prev !== total ? total : prev));
    }, []);

    const setTotalwishlistItems = useCallback((total: number) => {
        _setTotalwishlistItems(prev => (prev !== total ? total : prev));
    }, []);

    return (
        <CartContext.Provider value={{ totalItems, setTotalItems, totalwishlistItems, setTotalwishlistItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
