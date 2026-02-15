import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CustomerDashboard() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">Active Orders</h3>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
                            <p className="text-3xl font-bold text-gray-900">$0.00</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold">Recent Orders</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-500 text-center py-8">No orders yet</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
