"use client"

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Copy, Check } from 'lucide-react'

export default function MarketerDashboard() {
    const [affiliateCode, setAffiliateCode] = useState('MRKT-XXXXXX')
    const [copied, setCopied] = useState(false)

    const copyAffiliateCode = () => {
        navigator.clipboard.writeText(affiliateCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Marketer Dashboard</h1>
                        <p className="text-gray-600 mt-2">Track your affiliate performance</p>
                    </div>

                    {/* Affiliate Code Card */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
                        <h2 className="text-xl font-semibold mb-2">Your Affiliate Code</h2>
                        <div className="flex items-center justify-between bg-white/20 rounded-lg p-4">
                            <span className="text-2xl font-bold tracking-wider">{affiliateCode}</span>
                            <button
                                onClick={copyAffiliateCode}
                                className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check size={18} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm mt-2 text-white/80">
                            Share this code with your audience to earn 10% commission on every sale
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Referrals</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
                            <p className="text-3xl font-bold text-gray-900">$0.00</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Earned</h3>
                            <p className="text-3xl font-bold text-green-600">$0.00</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Rate</h3>
                            <p className="text-3xl font-bold text-gray-900">10%</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold">Recent Transactions</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-500 text-center py-8">No transactions yet</p>
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600 mb-2">Start promoting to earn commissions!</p>
                                <p className="text-xs text-gray-500">Copy your affiliate code and share it with your audience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
