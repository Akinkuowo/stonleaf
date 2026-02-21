'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    User
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalOrders: number;
    totalSales: number;
    totalProducts: number;
}

interface RecentOrder {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    }
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setStats(data.stats);
                    setRecentOrders(data.recentOrders);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const statCards = [
        { name: 'Total Revenue', value: `$${stats?.totalSales.toFixed(2)}`, icon: DollarSign, trend: '+12.5%', color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Total Users', value: stats?.totalUsers.toString(), icon: Users, trend: '+5.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Total Orders', value: stats?.totalOrders.toString(), icon: ShoppingBag, trend: '+8.1%', color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Collections', value: stats?.totalProducts.toString(), icon: TrendingUp, trend: '+2.4%', color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Greeting */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin</h2>
                <p className="text-gray-500 mt-1">Here's what's happening with Stoneleaf today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div key={card.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                {card.trend}
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-500">{card.name}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table & Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                        <button className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wider">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{order.user.name}</div>
                                                    <div className="text-xs text-gray-400">{order.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notifications/Feed */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        System Activity
                    </h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 relative">
                                {i !== 4 && <div className="absolute left-2.5 top-6 bottom-0 w-px bg-gray-100"></div>}
                                <div className="z-10 w-5 h-5 rounded-full bg-gray-900 border-4 border-white shadow-sm flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-700 leading-tight">
                                        <span className="font-bold">New user</span> registered from Germany
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 block">2 hours ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all">
                        Load More Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
