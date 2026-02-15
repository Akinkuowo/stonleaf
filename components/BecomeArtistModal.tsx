"use client"

import { useState } from 'react'
import { X } from 'lucide-react'

interface BecomeArtistModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function BecomeArtistModal({ isOpen, onClose }: BecomeArtistModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        portfolioUrl: '',
        instagramHandle: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/become-artist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    bio: formData.bio,
                    portfolioUrl: formData.portfolioUrl,
                    instagramHandle: formData.instagramHandle,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to register as artist')
            }

            // Store token and redirect to artist dashboard
            localStorage.setItem('token', data.token)
            window.location.href = '/dashboard/artist'
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-bold mb-2">Become an Artist</h2>
                <p className="text-gray-600 mb-6 text-sm">Share your art with the world</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            placeholder="Tell us about your art..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Portfolio URL (Optional)</label>
                        <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="https://yourportfolio.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Instagram Handle (Optional)</label>
                        <input
                            type="text"
                            name="instagramHandle"
                            value={formData.instagramHandle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="@yourhandle"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Become an Artist'}
                    </button>
                </form>
            </div>
        </div>
    )
}
