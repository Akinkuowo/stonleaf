'use client';

import { useState } from 'react';
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

export default function NewBlogPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));

        // Auto-generate slug from title
        if (name === 'title' && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/admin/dashboard/blog'), 1500);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to create post');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Create New Post</h2>
                    <p className="text-gray-500 mt-1">Compose a new article for your audience.</p>
                </div>
            </div>

            {success ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl text-center space-y-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 uppercase">Post Published!</h3>
                    <p className="text-gray-500">Redirecting you to the blog list...</p>
                </div>
            ) : (
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
                                        placeholder="The Future of Abstract Art"
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
                                            placeholder="future-of-abstract-art"
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
                                        placeholder="A brief summary for cards and search results..."
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
                                        placeholder="Write your beautiful story here..."
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
                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Publish Immediately</span>
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
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Required</span>
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
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        PUBLISH POST
                                    </button>
                                    <Link
                                        href="/admin/dashboard/blog"
                                        className="w-full py-3 text-center font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Save Draft
                                    </Link>
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
            )}
        </div>
    );
}
