import Image from "next/image";
import { latestWork } from "@/lib/data";

export default function LatestWork() {
  return (
    <section id="work" className="relative overflow-hidden bg-[#0d0f15] py-16 text-white">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-white/10 to-white/0 blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-pink-500/20 to-transparent blur-3xl" />
      <div className="container-max relative z-10 flex flex-col gap-8 py-14">
        <div className="relative flex flex-col gap-2 text-left">
          <div className="absolute -left-10 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-white/15 to-white/0 blur-2xl" />
          <h2 className="text-4xl font-semibold leading-tight">{latestWork.title}</h2>
          <button className="pill-button pill-primary self-start text-sm font-semibold">
            {latestWork.cta}
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestWork.items.map((item) => (
            <div
              key={item.client}
              className="group relative overflow-hidden rounded-[32px] bg-white/5 shadow-xl ring-1 ring-white/10"
            >
              <Image
                src={item.image}
                alt={item.client}
                width={900}
                height={1400}
                className="h-[440px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-2xl font-semibold">{item.client}</div>
                <div className="mt-3 flex gap-2 text-xs font-semibold uppercase tracking-wide">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/90 px-3 py-1 text-[#0c0c0f] shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
