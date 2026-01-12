import Header from "@/components/header";
import Hero from "./components/hero";
import Usecases from "./components/usecases";
import Gallery from "./components/gallery";
import Footer from "@/components/footer";
import LetsTalk from "./components/contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-stonleaf-light">
      <Header />
      <Hero />
      <Usecases />
      <Gallery />
      <LetsTalk />
      <Footer />
    </main>
  )
}