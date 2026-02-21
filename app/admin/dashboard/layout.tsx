'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Bell
} from 'lucide-react';
import { verifyToken, isAdmin } from '@/lib/auth';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        const user = verifyToken(token);
        if (!user || !isAdmin(user)) {
            router.push('/admin/login');
            return;
        }

        setIsAuthorized(true);
    }, [router]);

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/dashboard/users', icon: Users },
        { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingBag },
        { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 border-r border-gray-800 text-white transition-all duration-300 ease-in-out z-30 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } hidden md:flex flex-col`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl tracking-tight">STONELEAF</span>}
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-20 bg-gray-800 px-2 py-1 rounded text-xs invisible group-hover:visible whitespace-nowrap">
                                        {item.name}
                                    </div>
                                )}
                            </a>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-3 text-gray-400 hover:text-white transition-colors group"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg md:block hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">
                            {navItems.find(item => item.href === pathname)?.name || 'Admin'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
