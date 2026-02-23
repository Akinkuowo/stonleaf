'use client';

import { useState } from 'react';
import {
    Settings,
    User,
    Shield,
    Bell,
    Smartphone,
    Globe,
    Save,
    Lock,
    LogOut,
    ChevronRight,
    Loader2
} from 'lucide-react';

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
    };

    const sections = [
        {
            title: 'Account Settings',
            description: 'Manage your admin profile and security.',
            items: [
                { name: 'Profile Information', icon: User, value: 'Admin User' },
                { name: 'Change Password', icon: Lock, value: 'Last changed 3 months ago' },
                { name: 'Two-Factor Authentication', icon: Shield, value: 'Enabled' },
            ]
        },
        {
            title: 'System Preferences',
            description: 'Configure platform-wide behaviors and defaults.',
            items: [
                { name: 'Email Notifications', icon: Bell, value: 'Daily Summary' },
                { name: 'Curation Rules', icon: Globe, value: 'Global Standards' },
                { name: 'Mobile App Link', icon: Smartphone, value: 'Connected' },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Settings</h2>
                    <p className="text-gray-500 mt-1">Configure your administrative workspace.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    SAVE PREFERENCES
                </button>
            </div>

            <div className="space-y-8">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <div className="px-2">
                            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-400">{section.description}</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {section.items.map((item, idx) => (
                                <button
                                    key={item.name}
                                    className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${idx !== section.items.length - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <item.icon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-400">{item.value}</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-200" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-8 mt-8 border-t border-gray-100">
                    <button className="flex items-center gap-3 text-red-500 font-bold hover:text-red-700 transition-colors group">
                        <div className="bg-red-50 p-3 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </div>
                        Logout Session
                    </button>
                </div>
            </div>
        </div>
    );
}
