'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    icon: React.ElementType;
    items: FAQItem[];
}

const faqData: FAQCategory[] = [
    {
        title: "General FAQ",
        icon: HelpCircle,
        items: [
            {
                question: "Where do you ship from?",
                answer: "All orders are printed and shipped from our facilities in the USA to ensure speed and quality."
            },
            {
                question: "What is your return policy?",
                answer: "Since every piece is custom printed for you, we cannot accept returns for change of mind. However, if your print arrives damaged, we will replace it immediately free of charge."
            },
            {
                question: "Can I buy the digital file?",
                answer: "To protect our artists' copyright, we do not sell high-resolution digital files."
            }
        ]
    },
    {
        title: "Shipping & Delivery",
        icon: Truck,
        items: [
            {
                question: "How long will it take to receive my order?",
                answer: "Since every piece is custom-made, production takes 2–4 business days. Once shipped, standard US delivery takes an additional 3–5 business days. You will receive a tracking link as soon as your art leaves our facility."
            },
            {
                question: "Do you ship internationally?",
                answer: "Yes, we ship globally! While we manufacture in the US, we can deliver to most countries. Please note that international customers are responsible for any customs duties or import taxes that may apply upon arrival."
            },
            {
                question: "My tracking says \"Delivered\" but I don't have it.",
                answer: "Please check with neighbors or your building manager first. If it still hasn't turned up after 24 hours, contact us at support@stonleaf.com so we can file a claim and get a replacement started for you."
            }
        ]
    },
    {
        title: "Product & Quality",
        icon: ShieldCheck,
        items: [
            {
                question: "What kind of paper do you use?",
                answer: "We use museum-grade, acid-free archival paper (230 gsm). This implies the paper is thick, premium to the touch, and designed not to yellow or fade for over 100 years."
            },
            {
                question: "Do the prints come with a white border?",
                answer: "Most of our prints are \"full bleed\" (printed to the edge). However, some artists design their work with a built-in white border for a specific look. Please check the product preview image—what you see on screen is exactly how it will print."
            },
            {
                question: "Is the glass real glass or acrylic?",
                answer: "For safety during shipping, we use shatter-resistant gallery-grade acrylic. It offers the same clarity as glass but protects your artwork from UV damage and won't break if knocked off the wall."
            }
        ]
    },
    {
        title: "Orders & Returns",
        icon: CreditCard,
        items: [
            {
                question: "Can I cancel or change my order?",
                answer: "We process orders quickly! You have a 2-hour window after placing your order to request a cancellation or address change. After that, your order has likely entered the production line."
            },
            {
                question: "My print arrived damaged. What now?",
                answer: "We’ve got you covered. Please snap a photo of the damage (and the box, if possible) and email it to us within 48 hours of delivery. We will reprint and express ship a replacement to you immediately, free of charge."
            },
            {
                question: "Do you offer gift cards?",
                answer: "Yes! Digital gift cards are available in amounts from $250 and above. They are delivered instantly via email—perfect for last-minute gifts."
            }
        ]
    }
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 uppercase">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about our premium prints, shipping policies, and ordering process.
                    </p>
                </div>

                <div className="space-y-16">
                    {faqData.map((category, catIdx) => (
                        <section key={catIdx} className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <category.icon className="w-6 h-6 text-gray-900" />
                                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">
                                    {category.title}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {category.items.map((item, itemIdx) => {
                                    const isOpen = openItems[`${catIdx}-${itemIdx}`];
                                    return (
                                        <div
                                            key={itemIdx}
                                            className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <button
                                                onClick={() => toggleItem(catIdx, itemIdx)}
                                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                            >
                                                <span className="font-semibold text-gray-900 pr-8">{item.question}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-24 p-8 bg-black rounded-2xl text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="mb-8 opacity-80">
                        Our support team is always here to help you tell your story.
                    </p>
                    <a
                        href="mailto:support@stonleaf.com"
                        className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
