'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    ChevronDown
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalOrders: number;
    totalSales: number;
    totalProducts: number;
}

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    const metrics = [
        { name: 'Revenue', value: `$${stats?.totalSales.toFixed(2)}`, trend: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Customers', value: stats?.totalUsers.toString(), trend: '+5.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Orders', value: stats?.totalOrders.toString(), trend: '+8.1%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Growth', value: '24.8%', trend: '+2.4%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
                    <p className="text-gray-500 mt-1">Deep dive into your business performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Calendar className="w-4 h-4" />
                        Last 30 Days
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`${metric.bg} p-3 rounded-2xl`}>
                                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                {metric.trend}
                                <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{metric.name}</h3>
                            <p className="text-2xl font-black text-gray-900 mt-1">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                    <h3 className="font-bold text-gray-900 border-b pb-4 mb-8">Sales Overview</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-50 rounded-2xl">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-gray-100 mx-auto mb-2" />
                            <p className="text-gray-300 font-bold text-sm uppercase tracking-widest leading-tight">Revenue Data<br />Visualization</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                    <h3 className="font-bold text-gray-900 border-b pb-4 mb-8">Customer Acquisition</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-50 rounded-2xl">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-gray-100 mx-auto mb-2" />
                            <p className="text-gray-300 font-bold text-sm uppercase tracking-widest leading-tight">User Traffic<br />Analytics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
