'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    FileText,
    Loader2,
    Calendar,
    User,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface Post {
    id: string;
    title: string;
    slug: string;
    category: string;
    published: boolean;
    createdAt: string;
    authorId: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/blog', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setDeleteLoading(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete post', error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
                    <p className="text-gray-500 mt-1">Share stories, updates and art insights.</p>
                </div>
                <Link
                    href="/admin/dashboard/blog/new"
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    CREATE NEW POST
                </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Article</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 line-clamp-1">{post.title}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                <User className="w-3 h-3" />
                                                Admin / {post.slug}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {post.published ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter bg-green-100 text-green-700">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter bg-orange-100 text-orange-700">
                                                    <XCircle className="w-3 h-3" />
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/dashboard/blog/${post.id}`}
                                                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deleteLoading === post.id}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {deleteLoading === post.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPosts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">No posts found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto mt-2">Start sharing your journey by creating your first blog post.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
