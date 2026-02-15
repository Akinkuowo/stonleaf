import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Shop() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Shop Page Test</h1>
                    <p className="text-gray-600">If you can see this, the basic rendering works.</p>
                </div>
            </div>
            <Footer />
        </>
    )
}
