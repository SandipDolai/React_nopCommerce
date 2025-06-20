import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    const [totalItems, setTotalItems] = useState(0);
    const [totalwishlistItems, setTotalwishlistItems] = useState(0);

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
