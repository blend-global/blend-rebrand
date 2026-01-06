import Image from "next/image";
import { aboutContent } from "@/lib/data";

export default function AboutLocations() {
  return (
    <section className="bg-white py-16">
      <div className="container-max grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-green-200/60 to-blue-200/50 blur-2xl" />
          <div className="absolute -bottom-16 left-6 h-36 w-36 rounded-full bg-gradient-to-br from-pink-200/80 to-purple-200/60 blur-2xl" />
          <div className="relative w-full max-w-xl rounded-[32px] bg-white p-5 shadow-light ring-1 ring-black/5">
            <div className="overflow-hidden rounded-[28px] shadow-lg">
              <Image
                src={aboutContent.media}
                alt="About"
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9aa0ac]">
              About Us
            </p>
          </div>
          <h2 className="section-title">{aboutContent.title}</h2>
          <p className="max-w-xl text-base text-[#3c3f46]">{aboutContent.description}</p>
          <div className="mt-6 flex items-center gap-6">
            <div className="text-4xl font-semibold text-[#0e0e10]">
              {aboutContent.statValue}
              <div className="text-sm font-semibold text-[#4f5158]">{aboutContent.statLabel}</div>
            </div>
            <div className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-black"></span>
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-green-300 to-pink-400"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
