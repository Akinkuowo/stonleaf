'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    artist: string | null;
}

interface CartContextType {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    totalAmount: number;
    syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Initialize cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prevCart, item];
        });
    };

    const removeItem = (id: string) => {
        setCart((prevCart) => prevCart.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const syncCart = async () => {
        const token = localStorage.getItem('token');
        if (!token || cart.length === 0) return;

        try {
            // First, clear existing cart items in DB or we can rely on a batch update API
            // For simplicity, we'll loop or use a dedicated sync endpoint if available.
            // Since we only have a POST /api/cart (add one by one), we'll implement a simple loop
            // or better yet, suggest a batch endpoint.
            // Let's assume we use the existing POST endpoint for now, but in a real app, 
            // a dedicated sync endpoint is preferred.

            for (const item of cart) {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: item.id,
                        quantity: item.quantity
                    })
                });
            }
        } catch (error) {
            console.error('Failed to sync cart:', error);
        }
    };

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                totalAmount,
                syncCart,
            }}
        >
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
