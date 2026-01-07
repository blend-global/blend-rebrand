import Image from "next/image";
import { heroContent } from "@/lib/data";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#0a0a0f] pb-24 pt-12 lg:pt-16">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
      </div>

      <div className="relative container-max">
        <div className="relative z-10 flex flex-col items-center gap-12 text-center text-white">
          <div className="flex flex-col gap-4">
            <h1 className="text-[2.8rem] font-bold leading-tight sm:text-[3.2rem] bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 bg-clip-text text-transparent">
              Empowering Connections Globally
            </h1>
            <p className="max-w-3xl text-lg leading-7 text-white/80">
              {heroContent.subtitle}
            </p>
          </div>

          <div className="relative w-full max-w-5xl rounded-[32px] bg-[#0c0c0f]/80 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
            <div className="relative overflow-hidden rounded-[30px] bg-black">
              <iframe
                src="https://www.youtube.com/embed/1ZYbU82GVz4"
                title="Relaxing music"
                className="h-[420px] w-full rounded-[30px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="absolute left-[-42px] top-1/2 hidden -translate-y-1/2 md:flex">
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-base shadow-[0_10px_20px_rgba(0,0,0,0.3)] ring-2 ring-white"
                aria-label="Say Hi"
              >
                👋
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
