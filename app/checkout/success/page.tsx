"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowRight, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function SuccessContent() {
    const { clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const stripe = useStripe();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('Verifying your payment...');

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = searchParams.get('payment_intent_client_secret');
        if (!clientSecret) {
            setStatus('error');
            setMessage('No payment info found.');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setStatus('success');
                    await triggerProdigiOrder();
                    clearCart();
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setStatus('error');
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setStatus('error');
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe, searchParams]);

    const triggerProdigiOrder = async () => {
        const shippingData = localStorage.getItem('lastOrderShipping');
        const itemsData = localStorage.getItem('lastOrderItems');
        const token = localStorage.getItem('token');

        if (shippingData && itemsData && token) {
            try {
                const shipping = JSON.parse(shippingData);
                const items = JSON.parse(itemsData);

                const recipient = {
                    name: shipping.name,
                    address: {
                        line1: shipping.line1,
                        townOrCity: shipping.city,
                        stateOrCounty: shipping.state,
                        postalOrZipCode: shipping.postalCode,
                        countryCode: shipping.country,
                    }
                };

                await fetch('/api/prodigi/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        recipient,
                        items,
                    }),
                });

                // Clear after successful trigger
                localStorage.removeItem('lastOrderShipping');
                localStorage.removeItem('lastOrderItems');
            } catch (err) {
                console.error('Failed to trigger Prodigi order:', err);
            }
        }
    };

    if (status === 'loading') {
        return (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
                <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
                <p className="text-gray-600">{message}</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Issue</h1>
                <p className="text-gray-600 mb-8">{message}</p>
                <Link href="/checkout" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition block shadow-lg">
                    Return to Checkout
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
                Thank you for your purchase! Your order has been placed and is being processed.
                You will receive a confirmation email shortly.
            </p>

            <div className="space-y-4">
                <Link
                    href="/dashboard/customer"
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
                >
                    <ShoppingBag size={18} />
                    View Your Orders
                </Link>
                <Link
                    href="/shop"
                    className="w-full bg-white text-gray-900 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                    Continue Shopping
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                <Suspense fallback={
                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
                        <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-6" />
                        <p className="text-gray-600">Loading order details...</p>
                    </div>
                }>
                    <Elements stripe={stripePromise}>
                        <SuccessContent />
                    </Elements>
                </Suspense>
            </div>
            <Footer />
        </>
    );
}
