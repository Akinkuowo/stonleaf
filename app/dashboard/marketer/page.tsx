"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
    Copy, Check, TrendingUp, DollarSign, MousePointerClick,
    Users, Link2, ArrowUpRight, Clock, ChevronRight,
    LayoutDashboard, LinkIcon, Receipt, Wallet, ExternalLink,
    AlertCircle
} from 'lucide-react'

type Tab = 'overview' | 'links' | 'transactions' | 'payouts'

interface MarketerData {
    id: string
    affiliateCode: string
    commissionRate: number
    totalEarnings: number
    clickCount: number
}

interface Stats {
    totalReferrals: number
    totalSalesAmount: number
    totalCommission: number
    pendingPayout: number
}

interface Transaction {
    id: string
    orderId: string
    commission: number
    orderAmount: number
    status: string
    createdAt: string
    customerName: string
}

interface PayoutRequest {
    id: string
    amount: number
    status: string
    createdAt: string
}

interface MonthlyEarning {
    month: string
    earnings: number
}

interface Product {
    id: string
    name: string
    category: string
    price: number
    imageUrl: string | null
}

export default function MarketerDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [isLoading, setIsLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [marketer, setMarketer] = useState<MarketerData | null>(null)
    const [stats, setStats] = useState<Stats | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
    const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([])

    // Links tab state
    const [products, setProducts] = useState<Product[]>([])
    const [affiliateLink, setAffiliateLink] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [generatedProductLink, setGeneratedProductLink] = useState('')

    // Copy state
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Payout state
    const [payoutAmount, setPayoutAmount] = useState('')
    const [payoutError, setPayoutError] = useState('')
    const [payoutSuccess, setPayoutSuccess] = useState('')
    const [payoutLoading, setPayoutLoading] = useState(false)

    // Transaction filter
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const getToken = () => localStorage.getItem('token')

    // Auth check + fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            const token = getToken()
            if (!token) {
                router.push('/')
                return
            }

            try {
                // Check auth
                const meRes = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!meRes.ok) {
                    router.push('/')
                    return
                }
                const meData = await meRes.json()
                if (meData.user?.role !== 'MARKETER') {
                    router.push('/')
                    return
                }
                setUserName(meData.user.name || meData.user.email)

                // Fetch dashboard data
                const dashRes = await fetch('/api/marketer/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (dashRes.ok) {
                    const data = await dashRes.json()
                    setMarketer(data.marketer)
                    setStats(data.stats)
                    setTransactions(data.transactions)
                    setPayoutRequests(data.payoutRequests)
                    setMonthlyEarnings(data.monthlyEarnings)
                }

                // Fetch links data
                const linksRes = await fetch('/api/marketer/links', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (linksRes.ok) {
                    const linksData = await linksRes.json()
                    setAffiliateLink(linksData.affiliateLink)
                    setProducts(linksData.products)
                }
            } catch (err) {
                console.error('Error loading dashboard:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [router])

    // Add role to me endpoint response
    useEffect(() => {
        // Fetch role info for auth guard — handled in initial load
    }, [])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const generateProductLink = async () => {
        if (!selectedProduct) return
        const token = getToken()
        const res = await fetch(`/api/marketer/links?productId=${selectedProduct}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            const data = await res.json()
            setGeneratedProductLink(data.productLink)
        }
    }

    const handlePayoutRequest = async () => {
        setPayoutError('')
        setPayoutSuccess('')
        const amount = parseFloat(payoutAmount)
        if (isNaN(amount) || amount <= 0) {
            setPayoutError('Please enter a valid amount')
            return
        }
        setPayoutLoading(true)
        try {
            const token = getToken()
            const res = await fetch('/api/marketer/payout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPayoutError(data.error || 'Failed to request payout')
            } else {
                setPayoutSuccess(`Payout of $${amount.toFixed(2)} requested successfully!`)
                setPayoutAmount('')
                setPayoutRequests(prev => [data.payoutRequest, ...prev])
                // Update stats
                if (stats) {
                    setStats({ ...stats, pendingPayout: stats.pendingPayout - amount })
                }
            }
        } catch {
            setPayoutError('Network error. Please try again.')
        } finally {
            setPayoutLoading(false)
        }
    }

    const filteredTransactions = statusFilter === 'all'
        ? transactions
        : transactions.filter(t => t.status === statusFilter)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700'
            case 'pending': return 'bg-amber-100 text-amber-700'
            case 'paid': return 'bg-blue-100 text-blue-700'
            case 'approved': return 'bg-indigo-100 text-indigo-700'
            case 'rejected': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    }

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

    const maxEarning = Math.max(...monthlyEarnings.map(m => m.earnings), 1)

    const sidebarItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'links', label: 'Affiliate Links', icon: <LinkIcon size={20} /> },
        { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
        { id: 'payouts', label: 'Payouts', icon: <Wallet size={20} /> },
    ]

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-8">
                                {/* Profile */}
                                <div className="mb-8">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold mb-3">
                                        {userName?.charAt(0)?.toUpperCase() || 'M'}
                                    </div>
                                    <h3 className="font-semibold text-lg">{userName}</h3>
                                    <p className="text-gray-400 text-sm">Affiliate Marketer</p>
                                </div>

                                {/* Nav */}
                                <nav className="space-y-1">
                                    {sidebarItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                                    ? 'bg-white/15 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>

                                {/* Commission badge */}
                                <div className="mt-8 pt-6 border-t border-gray-700">
                                    <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl p-4">
                                        <p className="text-xs text-gray-400 mb-1">Commission Rate</p>
                                        <p className="text-2xl font-bold">{((marketer?.commissionRate || 0.1) * 100).toFixed(0)}%</p>
                                        <p className="text-xs text-gray-400 mt-1">Per successful sale</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0">

                            {/* ===== OVERVIEW TAB ===== */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                                    {/* Welcome */}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName?.split(' ')[0]}!</h1>
                                        <p className="text-gray-500 mt-1">Here&apos;s how your affiliate links are performing.</p>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <MousePointerClick size={20} className="text-blue-600" />
                                                </div>
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">All time</span>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{marketer?.clickCount || 0}</p>
                                            <p className="text-sm text-gray-500 mt-1">Total Clicks</p>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                                    <Users size={20} className="text-purple-600" />
                                                </div>
                                                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">{stats?.totalReferrals || 0} orders</span>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalSalesAmount || 0)}</p>
                                            <p className="text-sm text-gray-500 mt-1">Referral Sales</p>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                    <DollarSign size={20} className="text-emerald-600" />
                                                </div>
                                                <TrendingUp size={16} className="text-emerald-500" />
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalCommission || 0)}</p>
                                            <p className="text-sm text-gray-500 mt-1">Commission Earned</p>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                                    <Wallet size={20} className="text-amber-600" />
                                                </div>
                                                <button
                                                    onClick={() => setActiveTab('payouts')}
                                                    className="text-xs text-amber-600 hover:underline font-medium"
                                                >
                                                    Withdraw
                                                </button>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.pendingPayout || 0)}</p>
                                            <p className="text-sm text-gray-500 mt-1">Available Payout</p>
                                        </div>
                                    </div>

                                    {/* Affiliate Code Card */}
                                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
                                        <div className="relative z-10">
                                            <h2 className="text-lg font-semibold mb-1">Your Affiliate Code</h2>
                                            <p className="text-white/70 text-sm mb-4">Share this code or link with your audience to earn commissions</p>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center justify-between">
                                                    <span className="text-xl font-mono font-bold tracking-widest">{marketer?.affiliateCode}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(marketer?.affiliateCode || '', 'code')}
                                                        className="bg-white text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1.5"
                                                    >
                                                        {copiedId === 'code' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                                                    </button>
                                                </div>
                                                <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center justify-between">
                                                    <span className="text-sm truncate mr-3 font-mono">{affiliateLink}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(affiliateLink, 'link')}
                                                        className="bg-white text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1.5 flex-shrink-0"
                                                    >
                                                        {copiedId === 'link' ? <><Check size={14} /> Copied!</> : <><Link2 size={14} /> Copy Link</>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Chart + Recent Transactions */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {/* Monthly Earnings Chart */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings</h3>
                                            <div className="flex items-end justify-between gap-3 h-48">
                                                {monthlyEarnings.map((m, i) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            {m.earnings > 0 ? formatCurrency(m.earnings) : '—'}
                                                        </span>
                                                        <div className="w-full relative">
                                                            <div
                                                                className="w-full bg-gradient-to-t from-purple-500 to-blue-400 rounded-t-lg transition-all duration-700 ease-out"
                                                                style={{
                                                                    height: `${Math.max((m.earnings / maxEarning) * 140, 8)}px`,
                                                                    opacity: m.earnings > 0 ? 1 : 0.2,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">{m.month}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Transactions */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                                                <button
                                                    onClick={() => setActiveTab('transactions')}
                                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                                >
                                                    View all <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            {transactions.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                                    <Receipt size={40} className="mb-3 opacity-50" />
                                                    <p className="font-medium">No transactions yet</p>
                                                    <p className="text-sm mt-1">Share your affiliate link to start earning!</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {transactions.slice(0, 5).map(t => (
                                                        <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{t.customerName}</p>
                                                                <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-semibold text-emerald-600">+{formatCurrency(t.commission)}</p>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(t.status)}`}>
                                                                    {t.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== LINKS TAB ===== */}
                            {activeTab === 'links' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
                                        <p className="text-gray-500 mt-1">Generate and manage your promotional links.</p>
                                    </div>

                                    {/* Base Affiliate Link */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Store Affiliate Link</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            This link directs users to the shop page. You earn a commission on any purchase they make.
                                        </p>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                            <ExternalLink size={18} className="text-gray-400 flex-shrink-0" />
                                            <code className="text-sm text-gray-700 flex-1 truncate">{affiliateLink}</code>
                                            <button
                                                onClick={() => copyToClipboard(affiliateLink, 'store-link')}
                                                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 flex-shrink-0"
                                            >
                                                {copiedId === 'store-link' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product-Specific Link Generator */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Link Generator</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Create a direct link to a specific product. Great for promoting individual artworks.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <select
                                                value={selectedProduct}
                                                onChange={(e) => {
                                                    setSelectedProduct(e.target.value)
                                                    setGeneratedProductLink('')
                                                }}
                                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                                            >
                                                <option value="">Select a product...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} — {formatCurrency(p.price)}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={generateProductLink}
                                                disabled={!selectedProduct}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Link2 size={16} /> Generate Link
                                            </button>
                                        </div>

                                        {generatedProductLink && (
                                            <div className="mt-4 flex items-center gap-3 bg-purple-50 rounded-xl p-4 border border-purple-100">
                                                <ArrowUpRight size={18} className="text-purple-500 flex-shrink-0" />
                                                <code className="text-sm text-purple-700 flex-1 truncate">{generatedProductLink}</code>
                                                <button
                                                    onClick={() => copyToClipboard(generatedProductLink, 'product-link')}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2 flex-shrink-0"
                                                >
                                                    {copiedId === 'product-link' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tips */}
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                                        <h3 className="text-lg font-semibold mb-4">💡 Tips to Maximize Earnings</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-white/10 rounded-xl p-4">
                                                <p className="font-medium text-sm mb-1">Share on Social Media</p>
                                                <p className="text-xs text-gray-300">Post your affiliate link on Instagram, TikTok, and Pinterest with art-related content.</p>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4">
                                                <p className="font-medium text-sm mb-1">Product-Specific Links</p>
                                                <p className="text-xs text-gray-300">Direct links to specific artworks convert better than generic shop links.</p>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4">
                                                <p className="font-medium text-sm mb-1">Create Content</p>
                                                <p className="text-xs text-gray-300">Write reviews, room mockups, or &quot;best art picks&quot; content to drive authentic traffic.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== TRANSACTIONS TAB ===== */}
                            {activeTab === 'transactions' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                                        <p className="text-gray-500 mt-1">Track all your referral sales and commissions.</p>
                                    </div>

                                    {/* Filter */}
                                    <div className="flex gap-2">
                                        {['all', 'completed', 'pending', 'paid'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setStatusFilter(s)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === s
                                                        ? 'bg-gray-900 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Table */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        {filteredTransactions.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                                <Receipt size={48} className="mb-3 opacity-50" />
                                                <p className="font-medium">No transactions found</p>
                                                <p className="text-sm mt-1">
                                                    {statusFilter === 'all'
                                                        ? 'Share your affiliate link to start earning!'
                                                        : `No ${statusFilter} transactions yet.`
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Amount</th>
                                                            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                                                            <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredTransactions.map(t => (
                                                            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                                                <td className="py-4 px-6">
                                                                    <p className="text-sm font-medium text-gray-900">{t.customerName}</p>
                                                                    <p className="text-xs text-gray-400">Order #{t.orderId.slice(-8)}</p>
                                                                </td>
                                                                <td className="py-4 px-6 text-sm text-gray-600">{formatDate(t.createdAt)}</td>
                                                                <td className="py-4 px-6 text-sm text-gray-900 text-right font-medium">{formatCurrency(t.orderAmount)}</td>
                                                                <td className="py-4 px-6 text-sm text-emerald-600 text-right font-semibold">+{formatCurrency(t.commission)}</td>
                                                                <td className="py-4 px-6 text-center">
                                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(t.status)}`}>
                                                                        {t.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ===== PAYOUTS TAB ===== */}
                            {activeTab === 'payouts' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
                                        <p className="text-gray-500 mt-1">Request payouts and view your payout history.</p>
                                    </div>

                                    {/* Balance + Request */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Balance</h3>
                                            <p className="text-4xl font-bold text-gray-900 mb-1">{formatCurrency(stats?.pendingPayout || 0)}</p>
                                            <p className="text-sm text-gray-500 mb-6">Available for withdrawal</p>

                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                                        <input
                                                            type="number"
                                                            value={payoutAmount}
                                                            onChange={(e) => { setPayoutAmount(e.target.value); setPayoutError(''); setPayoutSuccess('') }}
                                                            placeholder="0.00"
                                                            min="10"
                                                            step="0.01"
                                                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handlePayoutRequest}
                                                        disabled={payoutLoading}
                                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {payoutLoading ? 'Processing...' : 'Request Payout'}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} /> Minimum payout: $10.00 · Processing time: 3-5 business days
                                                </p>
                                                {payoutError && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                                                        <AlertCircle size={16} /> {payoutError}
                                                    </div>
                                                )}
                                                {payoutSuccess && (
                                                    <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl">
                                                        <Check size={16} /> {payoutSuccess}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Earnings Breakdown */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings Summary</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                                    <span className="text-sm text-gray-600">Total Commission Earned</span>
                                                    <span className="font-semibold text-gray-900">{formatCurrency(stats?.totalCommission || 0)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                                    <span className="text-sm text-gray-600">Total Paid Out</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            payoutRequests
                                                                .filter(p => p.status === 'paid')
                                                                .reduce((sum, p) => sum + p.amount, 0)
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                                    <span className="text-sm text-gray-600">Pending Payouts</span>
                                                    <span className="font-semibold text-amber-600">
                                                        {formatCurrency(
                                                            payoutRequests
                                                                .filter(p => p.status === 'pending')
                                                                .reduce((sum, p) => sum + p.amount, 0)
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-3">
                                                    <span className="text-sm font-medium text-gray-900">Available Balance</span>
                                                    <span className="font-bold text-lg text-gray-900">{formatCurrency(stats?.pendingPayout || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payout History */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
                                        </div>
                                        {payoutRequests.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                                <Wallet size={48} className="mb-3 opacity-50" />
                                                <p className="font-medium">No payouts yet</p>
                                                <p className="text-sm mt-1">Request your first payout when your balance reaches $10.</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                                            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                                            <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payoutRequests.map(p => (
                                                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                                                <td className="py-4 px-6 text-sm text-gray-600">{formatDate(p.createdAt)}</td>
                                                                <td className="py-4 px-6 text-sm text-gray-900 text-right font-semibold">{formatCurrency(p.amount)}</td>
                                                                <td className="py-4 px-6 text-center">
                                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(p.status)}`}>
                                                                        {p.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
