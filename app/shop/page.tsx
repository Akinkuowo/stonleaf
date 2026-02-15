import { prisma } from '@/lib/prisma'
import Header from "@/components/header";
import ShopPage from "../components/shop";
import Footer from "@/components/footer";

async function getProducts() {
    const products = await prisma.product.findMany();
    return products;
}

export default async function Shop() {
    const products = await getProducts();

    return (
        <>
            <Header />
            <ShopPage initialProducts={products} />
            <Footer />
        </>
    )
}
