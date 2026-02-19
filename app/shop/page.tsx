'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header";
import Footer from "@/components/footer";
import ShopPage from "../components/shop";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/artworks?limit=50', {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`Fetch failed with status ${res.status}: ${errorText.substring(0, 200)}`);
                    throw new Error(`API returned ${res.status}`);
                }

                const data = await res.json();
                setProducts(data.artworks || []);
            } catch (err) {
                console.error('Error fetching artworks in Shop page:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Header />
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <p className="text-gray-500">Loading products...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <ShopPage initialProducts={products} />
            )}
            <Footer />
        </>
    )
}