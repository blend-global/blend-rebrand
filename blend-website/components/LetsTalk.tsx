import { contactSection } from "@/lib/data";

export default function LetsTalk() {
  return (
    <section id="contact" className="bg-white py-16">
      <div className="container-max grid gap-10 md:grid-cols-[1fr,1.1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-300 to-pink-400" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9aa0ac]">
              Contact
            </p>
          </div>
          <h2 className="text-3xl font-semibold text-[#0e0e10]">
            Let<span className="text-[#2bbf7f]">s </span>
            <span className="text-[#f36fb4]">Talk</span>
          </h2>
          <p className="max-w-xl text-base text-[#3c3f46]">{contactSection.subtitle}</p>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Email</span>
            <span className="text-lg font-semibold">{contactSection.email}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Contact Number</span>
            <span className="text-lg font-semibold">{contactSection.phone}</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-[#6c6f77]">Address</span>
            <span className="text-lg font-semibold">{contactSection.address}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#6c6f77]">Socials</span>
            <div className="flex gap-3">
              {contactSection.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f0f12] text-sm font-semibold text-white shadow-pill"
                  aria-label={social.label}
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-light ring-1 ring-black/5">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="firstName">
                First name
              </label>
              <input id="firstName" name="firstName" className="input-control" placeholder="John" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="lastName">
                Last name
              </label>
              <input id="lastName" name="lastName" className="input-control" placeholder="Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="email">
                Email address
              </label>
              <input id="email" name="email" type="email" className="input-control" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="contactNumber">
                Contact number
              </label>
              <input id="contactNumber" name="contactNumber" className="input-control" placeholder="+00 000 0000" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#6c6f77]" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="input-control"
                placeholder="Let us know what you have in mind"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="pill-button pill-dark px-8">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
