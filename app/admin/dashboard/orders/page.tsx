'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    Loader2,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    Package,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        imageUrl: string | null;
    }
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updateLoading, setUpdateLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdateLoading(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error('Failed to update order status', error);
        } finally {
            setUpdateLoading(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                <p className="text-gray-500 mt-1">Manage customer transactions and shipping.</p>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold appearance-none pr-10 relative"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-200 transition-all">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.user.name}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                                    <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                                    <div className="flex gap-2">
                                        <select
                                            value={order.status}
                                            disabled={updateLoading === order.id}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                                        >
                                            <option value="pending">Mark Pending</option>
                                            <option value="processing">Mark Processing</option>
                                            <option value="completed">Mark Completed</option>
                                            <option value="cancelled">Mark Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl">
                                        <div className="h-10 w-10 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-gray-100">
                                            {item.product.imageUrl ? (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-gray-900 truncate">{item.product.name}</div>
                                            <div className="text-[10px] text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">No orders found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto mt-2">Try adjusting your filters or wait for new customers to arrive.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
