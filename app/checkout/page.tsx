"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/context/CartContext';
import { AlertCircle, Lock, ShoppingBag, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, amount, cart }: { clientSecret: string; amount: number; cart: any[] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [shipping, setShipping] = useState({
        name: '',
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
    });
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShipping(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        if (!shipping.name || !shipping.line1 || !shipping.city || !shipping.postalCode) {
            setError('Please fill in all required shipping fields.');
            return;
        }

        setProcessing(true);

        // Store shipping and cart info for the success page to call Prodigi
        localStorage.setItem('lastOrderShipping', JSON.stringify(shipping));
        localStorage.setItem('lastOrderItems', JSON.stringify(cart));

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
                shipping: {
                    name: shipping.name,
                    address: {
                        line1: shipping.line1,
                        city: shipping.city,
                        state: shipping.state,
                        postal_code: shipping.postalCode,
                        country: shipping.country,
                    }
                }
            },
        });

        if (submitError) {
            setError(submitError.message || 'An unexpected error occurred.');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 mb-8">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Shipping Information</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                    value={shipping.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="line1"
                    placeholder="Address Line 1"
                    required
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                    value={shipping.line1}
                    onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        value={shipping.city}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State / Province"
                        className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        value={shipping.state}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal / Zip Code"
                        required
                        className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        value={shipping.postalCode}
                        onChange={handleInputChange}
                    />
                    <select
                        name="country"
                        className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:outline-none bg-white"
                        value={shipping.country}
                        onChange={(e: any) => handleInputChange(e)}
                    >
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                    </select>
                </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Payment Information</h3>
            <PaymentElement />
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
            <button
                disabled={!stripe || processing}
                className="w-full bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Lock size={18} />
                        Pay ${amount.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const { cart, syncCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);

        const createIntent = async () => {
            try {
                // Sync cart to DB before creating intent to avoid 400 error
                await syncCart();
                const res = await fetch('/api/checkout/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setAmount(data.amount);
                }
            } catch (err) {
                console.error('Failed to create payment intent:', err);
            }
        };

        createIntent();
    }, [router]);

    if (isLoggedIn === false) {
        return (
            <>
                <Header />
                <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                        <p className="text-gray-600 mb-6">You need to be logged in to complete your checkout.</p>
                        <Link
                            href="/checkout?auth=signin"
                            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition shadow-md block"
                        >
                            Sign In to Continue
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left Column: Order Summary */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <ShoppingBag size={20} /> Order Summary
                                </h2>
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium">{item.title}</h3>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 font-medium tracking-tight">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-4">
                                        <span>Total</span>
                                        <span>${amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-sky-50 p-4 rounded-lg flex items-start gap-3">
                                <Lock size={18} className="text-sky-600 mt-0.5" />
                                <p className="text-xs text-sky-700 leading-relaxed">
                                    Your payment is processed securely. We do not store your full credit card information.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Payment */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <CreditCard size={20} /> Payment Details
                            </h2>
                            {clientSecret ? (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'stripe',
                                            variables: {
                                                colorPrimary: '#000000',
                                            },
                                        },
                                    }}
                                >
                                    <CheckoutForm clientSecret={clientSecret} amount={amount} cart={cart} />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                    <p className="text-sm text-gray-500">Preparing secure payment...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
