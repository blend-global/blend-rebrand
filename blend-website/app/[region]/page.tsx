import { ukContent, ukServices } from "@/lib/regional-content";
import UkAbout from "@/components/regions/UkAbout";
import UkCallToAction from "@/components/regions/UkCallToAction";
import { createPageMetadata } from "@/lib/seo";
import { isRegion, regions } from "@/lib/regions";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosRow from "@/components/LogosRow";
import AboutLocations from "@/components/AboutLocations";
import Services from "@/components/Services";
import LatestWork from "@/components/LatestWork";
import Footer from "@/components/Footer";
import { readCmsSection } from "@/lib/cms-server";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const name = isRegion(region) ? regions[region].name : "";
  return createPageMetadata({ title: `Blend ${name}`, description: region === "uk" ? `${ukContent.hero.lead} ${ukContent.hero.impact}. ${ukContent.servicesIntro.description}` : `Meet Blend ${name}. Events, digital marketing, creative production and immersive brand experiences from your local team.`, path: "/", region });
}

export default async function Home({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const isUk = region === "uk";
  const servicesSection = isUk ? ukServices : await readCmsSection("services");

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <div className={isUk ? "bg-black" : "bg-white"}>
        <div className="w-full">
          <LogosRow clients={isUk ? ukContent.clients : undefined} />
        </div>
      </div>
      <div className="flex min-h-[100svh] items-center bg-[#0d0f15]">
        <div className="w-full">
          <Services key={region} servicesSection={servicesSection} regional={isUk} />
        </div>
      </div>
      {!isUk && <div className="flex min-h-[100svh] items-center bg-[#0d0f15]">
        <div className="w-full">
          <LatestWork />
        </div>
      </div>}
      {isUk ? <UkAbout /> : (
        <div className="flex min-h-[100svh] items-center bg-white">
          <div className="w-full">
            <AboutLocations />
          </div>
        </div>
      )}
      {isUk && <UkCallToAction />}
      <Footer />
    </main>
  );
}
