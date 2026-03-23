import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosRow from "@/components/LogosRow";
import AboutLocations from "@/components/AboutLocations";
import Services from "@/components/Services";
import LatestWork from "@/components/LatestWork";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import { readCmsSection } from "@/lib/cms-server";

export default async function Home() {
  const [blogSection, servicesSection, caseStudies] = await Promise.all([
    readCmsSection("blog"),
    readCmsSection("services"),
    readCmsSection("work"),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar isOverlay={true} />
      <Hero />
      <LogosRow />
      <AboutLocations />
      <Services servicesSection={servicesSection} />
      <LatestWork caseStudies={caseStudies} />
      <Testimonials />
      <BlogPreview blogSection={blogSection} />
      <Footer />
    </main>
  );
}
