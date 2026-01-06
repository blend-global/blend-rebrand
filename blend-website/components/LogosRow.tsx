import { logos } from "@/lib/data";

export default function LogosRow() {
  return (
    <section className="bg-white py-8">
      <div className="container-max">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-white px-4 py-4 text-sm font-semibold text-[#545454] shadow-light ring-1 ring-black/5">
          {logos.map((logo) => (
            <span key={logo} className="whitespace-nowrap text-base md:text-lg">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
