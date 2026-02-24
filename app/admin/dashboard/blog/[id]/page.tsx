'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    FileText,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    Type
} from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        category: 'Art Insight',
        published: true
    });

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({
                    title: data.post.title,
                    slug: data.post.slug,
                    excerpt: data.post.excerpt || '',
                    content: data.post.content,
                    coverImage: data.post.coverImage || '',
                    category: data.post.category || 'Art Insight',
                    published: data.post.published
                });
            } else {
                setError(data.error || 'Failed to fetch post');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update post');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-500">
            {/* Breadcrumb */}
            <Link
                href="/admin/dashboard/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
            </Link>

            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Edit Post</h2>
                    <p className="text-gray-500 mt-1">Refine your article or update visibility.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-lg font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">URL Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all appearance-none"
                                    >
                                        <option value="Art Insight">Art Insight</option>
                                        <option value="Update">Official Update</option>
                                        <option value="Collection">New Collection</option>
                                        <option value="Exhibition">Exhibition</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all resize-none text-sm"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Content (Markdown)</label>
                                <textarea
                                    name="content"
                                    required
                                    rows={20}
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-gray-900 transition-all resize-none font-serif leading-relaxed"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-6">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b pb-4">Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Published</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="published"
                                            checked={formData.published}
                                            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 text-center">Cover Image</label>
                                <div className="relative group cursor-pointer aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-gray-300 transition-all">
                                    {formData.coverImage ? (
                                        <>
                                            <img src={formData.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-white p-3 rounded-full shadow-sm">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Cover Image</span>
                                        </>
                                    )}
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        placeholder="Paste Image URL..."
                                        className="absolute bottom-4 left-4 right-4 px-3 py-2 bg-white/90 backdrop-blur rounded-lg text-[10px] border border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    SAVE CHANGES
                                </button>
                                {success && (
                                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-wider animate-in fade-in">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Update successful
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}
            </form>
        </div>
    );
}
