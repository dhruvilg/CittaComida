import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pillars from "@/components/Pillars";
import MenuGrid from "@/components/MenuGrid";
import ProductShowcase from "@/components/ProductShowcase";
import Story from "@/components/Story";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import FloatingOrder from "@/components/FloatingOrder";

export default function Home() {
  return (
    <main className="relative">
      <Preloader />
      <Nav />
      <Hero />
      <Marquee />
      <Pillars />
      <MenuGrid />
      <ProductShowcase />
      <Marquee dark />
      <Story />
      <Testimonials />
      <Contact />
      <FloatingOrder />
    </main>
  );
}
