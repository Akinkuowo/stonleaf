import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ArtistDashboard() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your portfolio and track your art</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Artworks</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                            <p className="text-3xl font-bold text-gray-900">$0.00</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Views</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold">My Artworks</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-500 text-center py-8">No artworks uploaded yet</p>
                                <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                                    Upload Artwork
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold">Recent Sales</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-500 text-center py-8">No sales yet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
