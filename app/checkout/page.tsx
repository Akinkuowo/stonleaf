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

function CheckoutForm({ clientSecret, amount }: { clientSecret: string; amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
        });

        if (submitError) {
            setError(submitError.message || 'An unexpected error occurred.');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
    const { cart } = useCart();
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
                                    <CheckoutForm clientSecret={clientSecret} amount={amount} />
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
