import { contactSection, footerContent } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-black py-10 text-white">
      <div className="container-max grid gap-8 md:grid-cols-[1.2fr,1fr,1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-300 to-pink-400 text-[#0c0c0f]">
              BL
            </div>
            BLEND
          </div>
          <p className="text-sm text-white/70">{contactSection.address}</p>
          <p className="text-sm text-white/70">{contactSection.email}</p>
        </div>

        <div className="flex flex-col gap-3 text-sm font-semibold text-white/80">
          <span>{footerContent.terms}</span>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {footerContent.siteLinks.map((link) => (
              <a key={link} href="#" className="hover:text-white">
                {link}
              </a>
            ))}
          </div>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {footerContent.bbee}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold">{footerContent.newsletterLabel}</span>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-black">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
            <button className="pill-button pill-primary px-4 py-2 text-xs font-semibold shadow-none">
              Submit
            </button>
          </div>
          <div className="text-xs text-white/60">{footerContent.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
