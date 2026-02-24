'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    Package,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    Plus,
    X,
    Upload,
    Palette,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '0',
        gainFee: '0',
        price: '0',
        category: 'canvas',
        imageUrl: '',
        gallery: [] as string[],
        colors: [] as string[],
        artist: '',
        stock: '0',
        isActive: true
    });

    const [newColor, setNewColor] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({
                    name: data.product.name,
                    description: data.product.description || '',
                    basePrice: (data.product.basePrice || 0).toString(),
                    gainFee: (data.product.gainFee || 0).toString(),
                    price: data.product.price.toString(),
                    category: data.product.category,
                    imageUrl: data.product.imageUrl || '',
                    gallery: data.product.gallery || [],
                    colors: data.product.colors || [],
                    artist: data.product.artist || '',
                    stock: data.product.stock.toString(),
                    isActive: data.product.isActive
                });
            } else {
                setError(data.error || 'Failed to fetch product');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-calculate total price
    useEffect(() => {
        if (loading) return;
        const base = parseFloat(formData.basePrice) || 0;
        const gain = parseFloat(formData.gainFee) || 0;
        const total = base + gain;
        setFormData(prev => ({ ...prev, price: total.toString() }));
    }, [formData.basePrice, formData.gainFee, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(target === 'main' ? 'main' : 'gallery');

        try {
            const token = localStorage.getItem('token');
            const dataTransfer = new FormData();
            dataTransfer.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataTransfer
            });

            const data = await response.json();
            if (response.ok) {
                if (target === 'main') {
                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                } else {
                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }));
                }
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploading(null);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const addColor = () => {
        if (!newColor.trim()) return;
        if (formData.colors.includes(newColor.trim())) return;
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, newColor.trim()]
        }));
        setNewColor('');
    };

    const removeColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/products/${id}`, {
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
                setError(data.error || 'Failed to update product');
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
                href="/admin/dashboard/products"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Products
            </Link>

            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Edit Product</h2>
                    <p className="text-gray-500 mt-1">Refine your product assets and pricing.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all font-bold text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all resize-none leading-relaxed"
                                ></textarea>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                    Image Gallery
                                </h3>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{formData.gallery.length} Images Added</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 bg-gray-50">
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group">
                                    {uploading === 'gallery' ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                <Plus className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'gallery')}
                                        disabled={uploading !== null}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b pb-4 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-gray-400" />
                                Variations
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Colors</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.colors.map((color) => (
                                        <span key={color} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold animate-in zoom-in">
                                            {color}
                                            <button type="button" onClick={() => removeColor(color)} className="hover:text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add color (e.g. Midnight Blue)..."
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                        className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-bold text-sm transition-all"
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b pb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                Pricing & Revenue
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Base Price ($)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        step="0.01"
                                        required
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gain Fee ($)</label>
                                    <input
                                        type="number"
                                        name="gainFee"
                                        step="0.01"
                                        required
                                        value={formData.gainFee}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all font-mono"
                                    />
                                </div>
                                <div className="pt-4 border-t border-dashed">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total Listing Price</span>
                                        <span className="text-2xl font-black text-gray-900">${parseFloat(formData.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b pb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                Inventory
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Artist</label>
                                    <input
                                        type="text"
                                        name="artist"
                                        value={formData.artist}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all appearance-none text-xs font-bold uppercase"
                                    >
                                        <option value="canvas">Canvas</option>
                                        <option value="photo">Photo</option>
                                        <option value="digital">Digital</option>
                                        <option value="ar">AR Art</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b pb-4">Display Asset</h3>
                            <div className="space-y-4">
                                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group overflow-hidden">
                                    {formData.imageUrl ? (
                                        <>
                                            <img src={formData.imageUrl} alt="Main" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-white mt-1" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {uploading === 'main' ? (
                                                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                                            ) : (
                                                <>
                                                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Product Image</span>
                                                </>
                                            )}
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'main')}
                                        disabled={uploading !== null}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <span className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Active for Sale</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-end gap-6 pt-6">
                    <Link
                        href="/admin/dashboard/products"
                        className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving || uploading !== null}
                        className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-black transition-all shadow-2xl shadow-gray-300 active:scale-95 disabled:opacity-50 tracking-widest uppercase"
                    >
                        {saving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Save className="w-5 h-5" />
                                {success ? 'PRODUCT UPDATED' : 'SAVE CHANGES'}
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
