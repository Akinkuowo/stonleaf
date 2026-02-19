'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

export default function CartComponent() {
    const { cart, removeItem, updateQuantity, totalAmount, itemCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added any artworks to your cart yet.
                    Explore our collection and find something beautiful for your space.
                </p>
                <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition">
                    START SHOPPING
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">SHOPPING CART ({itemCount})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-8">
                                {/* Image */}
                                <div className="w-full sm:w-40 aspect-square relative bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="text-gray-600 text-sm">by {item.artist || 'Unknown Artist'}</p>
                                        </div>
                                        <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-50 transition"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FiMinus size={14} />
                                            </button>
                                            <span className="px-4 py-1 text-sm border-x border-gray-300 min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-50 transition"
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition flex items-center gap-1 text-sm"
                                        >
                                            <FiTrash2 /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/shop" className="inline-flex items-center text-black hover:underline mt-4">
                            <FiArrowLeft className="mr-2" /> Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                            <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-medium">calculated at next step</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-4 rounded-md font-bold hover:bg-gray-800 transition mb-4">
                                PROCEED TO CHECKOUT
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-4 py-4 grayscale opacity-60">
                                {/* Simple payment icons placeholders */}
                                <div className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold">VISA</div>
                                <div className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold">MASTERCARD</div>
                                <div className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold">PAYPAL</div>
                                <div className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold">APPLE PAY</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
