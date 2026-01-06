import Image from "next/image";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-[#0d0f15] py-16 text-white">
      <div className="container-max flex flex-col gap-8">
        <h2 className="text-3xl font-semibold">{testimonials.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.items.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-[24px] bg-[#11141f] p-6 shadow-xl ring-1 ring-white/10"
            >
              <p className="text-sm leading-relaxed text-white/80">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="overflow-hidden rounded-full">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs uppercase tracking-wide text-white/60">{item.role}</div>
                </div>
              </div>
              <div className="absolute -bottom-16 right-6 h-28 w-28 rounded-full bg-gradient-to-br from-green-300/30 to-pink-400/40 blur-2xl" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="h-3 w-3 rounded-full bg-white"></span>
          <span className="h-3 w-3 rounded-full bg-white/30"></span>
          <span className="h-3 w-3 rounded-full bg-white/30"></span>
        </div>
      </div>
    </section>
  );
}
