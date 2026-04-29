import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosRow from "@/components/LogosRow";
import AboutLocations from "@/components/AboutLocations";
import Services from "@/components/Services";
import LatestWork from "@/components/LatestWork";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { readCmsSection } from "@/lib/cms-server";

export default async function Home() {
  const servicesSection = await readCmsSection("services");

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar isOverlay={true} />
      <Hero />
      <div className="bg-white">
        <div className="w-full">
          <LogosRow />
        </div>
      </div>
      <div className="flex min-h-[100svh] items-center bg-white">
        <div className="w-full">
          <Services servicesSection={servicesSection} />
        </div>
      </div>
      <div className="flex min-h-[100svh] items-center bg-[#0d0f15]">
        <div className="w-full">
          <LatestWork />
        </div>
      </div>
      <div className="flex min-h-[100svh] items-center bg-[#0d0f15]">
        <div className="w-full">
          <Testimonials />
        </div>
      </div>
      <div className="flex min-h-[100svh] items-center bg-white">
        <div className="w-full">
          <AboutLocations />
        </div>
      </div>
      <Footer />
    </main>
  );
}
