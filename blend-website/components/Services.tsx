import { servicesContent } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="bg-white pb-16 pt-4">
      <div className="container-max relative">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-gradient-to-br from-green-200/70 to-blue-200/40 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-44 w-44 rounded-full bg-gradient-to-br from-pink-200/70 to-purple-200/50 blur-3xl" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9aa0ac]">
            Services
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-[#0e0e10]">{servicesContent.title}</h2>
          <p className="text-base text-[#3c3f46]">{servicesContent.description}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-3xl bg-[#0f0f12] p-6 text-white shadow-pill">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{servicesContent.digitalLabel}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {servicesContent.digital.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white/90"
                >
                  <span>{item}</span>
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl bg-[#0f0f12] p-6 text-white shadow-pill">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{servicesContent.experientialLabel}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {servicesContent.experiential.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-full bg-[#15151b] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white/90"
                >
                  <span>{item}</span>
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
