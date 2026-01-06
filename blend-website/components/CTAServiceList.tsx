import { digitalServicesCTA } from "@/lib/data";

export default function CTAServiceList() {
  return (
    <section className="bg-white py-20">
      <div className="container-max grid items-center gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-12 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-indigo-200/60 to-slate-200/40 blur-3xl" />
          <div className="absolute -bottom-24 left-16 h-64 w-64 rounded-full bg-gradient-to-br from-pink-200/80 to-purple-300/70 blur-3xl" />
          <h2 className="relative z-10 text-4xl font-bold leading-tight text-[#0c0c0f]">
            {digitalServicesCTA.title}
          </h2>
        </div>
        <div className="relative z-10 flex flex-col gap-3 overflow-hidden rounded-[28px] bg-[#0f0f12] p-6 text-white shadow-pill">
          <div className="absolute -bottom-12 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-green-300/50 to-pink-400/50 blur-2xl" />
          {digitalServicesCTA.services.map((service) => (
            <div
              key={service}
              className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white/90"
            >
              <span>{service}</span>
              <span className="h-2 w-2 rounded-full bg-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
