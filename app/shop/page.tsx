
import Header from "@/components/header";
import Footer from "@/components/footer";
import ShopPage from "../components/shop";

export default async function Shop() {
    const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'} /api/artworks ? limit = 50`;
    let products = [];

    try {
        const res = await fetch(apiUrl, {
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Fetch failed with status ${res.status}: ${errorText.substring(0, 200)} `);
            throw new Error(`API returned ${res.status} `);
        }

        const data = await res.json();
        products = data.artworks || [];
    } catch (error) {
        console.error('Error fetching artworks in Shop page:', error);
        // Fallback to empty array or show error message
    }

    return (
        <>
            <Header />
            <ShopPage initialProducts={products} />
            <Footer />
        </>
    )
}
