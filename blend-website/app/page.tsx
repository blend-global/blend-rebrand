import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosRow from "@/components/LogosRow";
import AboutLocations from "@/components/AboutLocations";
import Services from "@/components/Services";
import LatestWork from "@/components/LatestWork";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LogosRow />
      <AboutLocations />
      <Services />
      <LatestWork />
      <Testimonials />
      <BlogPreview />
      <Footer />
    </main>
  );
}
