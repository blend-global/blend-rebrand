import Image from "next/image";
import { featuredService } from "@/lib/data";

export default function FeaturedService() {
  return (
    <section className="bg-black py-16 text-white">
      <div className="container-max">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-semibold">{featuredService.title}</h2>
          <p className="text-base text-white/70">{featuredService.description}</p>
        </div>
        <div className="mt-8 overflow-hidden rounded-[28px] bg-[#10131c] shadow-pill ring-1 ring-white/5">
          <Image
            src={featuredService.media}
            alt={featuredService.title}
            width={1200}
            height={700}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button className="pill-button pill-primary shadow-lg">{featuredService.cta}</button>
        </div>
      </div>
    </section>
  );
}
