import Header from '@/components/header'
import Footer from '@/components/footer'
import Image from 'next/image'

export default function DiyHangPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Hanging With Artsake<span className="text-[#FF4D4D]">.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-800 mb-12 font-light">
                    Your Step-By-Step Guide To Hanging Art With Our “No Wire” Hanging System
                </p>

                <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
                    <p>
                        You received your art and now you're ready to get it up on your wall. Thanks to our clever
                        hanging kit, you get to skip that “leave it leaning against the wall for a few months” situation
                        that many people go through. The sooner you get to hang your art, the sooner the compliments
                        will start to roll in.
                    </p>
                    <p className="font-medium">
                        Not in the mood to read? Watch the "How To Hang" video instead.
                    </p>
                </div>
            </section>

            {/* Hero Image */}
            <section className="w-full h-[60vh] relative bg-gray-100 mb-16 md:mb-24">
                {/* Placeholder for hero image - using a gray background for now as requested */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-lg">Hero Image Placeholder</span>
                </div>
            </section>

            {/* What You Need Section */}
            <section className="container mx-auto px-4 mb-20 max-w-4xl text-center">
                <div className="mb-4">
                    <span className="text-[#FF4D4D] font-bold tracking-widest text-sm uppercase">BEFORE YOU GET STARTED</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Let’s unpack what you get & what you’ll need
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Attached to the back of your art, you’ll find our easy-to-use hanging kit with: 1 level, 1 strip of tape, 2
                    markers, 2 nails and 1 bumper. The only things you need? A hammer and a phillips head screwdriver.
                </p>

                {/* Kit Items Grid - Placeholder for icons/images of items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                    {[
                        { name: '1 Level', icon: '📏' },
                        { name: '1 Strip of Tape', icon: 'gl' },
                        { name: '2 Markers', icon: '📍' },
                        { name: '2 Nails', icon: '🔨' },
                        { name: '1 Bumper', icon: '⭕' },
                        { name: 'Hammer', icon: '🔨' },
                        { name: 'Screwdriver', icon: '🪛' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                            <span className="text-4xl mb-3">{item.icon}</span>
                            <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps Section - Placeholder structure based on typical guides */}
            <section className="container mx-auto px-4 mb-24 max-w-4xl">
                <div className="space-y-24">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                Step {step} Image
                            </div>
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <span className="text-6xl font-bold text-gray-200 mb-4 block">{step}</span>
                                <h3 className="text-2xl font-bold mb-4">Step {step} Title</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Instructions for step {step} go here. Place the marker on the wall, create your guide holes, and get ready to hang your masterpiece.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    )
}
