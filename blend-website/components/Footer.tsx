import Image from "next/image";

export default function Footer() {
  const siteLinks = ["Home", "Services", "Work", "Blog"];
  const termsLinks = ["Terms Of Services", "Privacy Policy", "Cookie Policy", "Cookie Preferences"];

  return (
    <footer className="mt-16 text-white">
      <div className="bg-[#0c0c0c] py-12">
        <div className="container-max flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xs flex-col gap-3">
            <Image src="/logo.png" alt="Blend logo" width={22} height={22} className="h-6 w-6" />
            <p className="text-sm leading-6 text-white/85">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta atque impedit architecto esse
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="text-lg font-semibold">Site</h5>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {siteLinks.map((link) => (
                <a key={link} href="#" className="hover:text-white">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="text-lg font-semibold">Terms</h5>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              {termsLinks.map((link) => (
                <a key={link} href="#" className="hover:text-white">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="flex max-w-sm flex-col gap-4">
            <h5 className="text-lg font-semibold">Subscribe To Newsletter</h5>
            <p className="text-sm text-white/85">
              Keep up with the latest trends and news from the world of events and digital experiences.
            </p>
            <form className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-transparent px-2 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#0c0c0c] px-5 py-2 text-sm font-semibold text-white"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 text-[#0c0c0c]">
        <div className="container-max flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <h6 className="text-xl font-semibold leading-snug">
              Copyright © 2024 Blend Global All Rights Reserved
            </h6>
            <span className="text-sm text-[#4d4d50]">B-BBEE Level 1</span>
          </div>

          <div className="flex flex-col gap-3">
            <h6 className="text-lg font-semibold">Contact</h6>
            <div className="flex items-center gap-2 text-sm text-[#222]">
              <span role="img" aria-label="mail">
                ✉
              </span>
              <a href="mailto:info@blend.global">info@blend.global</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#222]">
              <span role="img" aria-label="phone">
                ☎
              </span>
              <a href="tel:0214488282">0214488282</a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h6 className="text-lg font-semibold">Address</h6>
            <p className="text-sm leading-6 text-[#222]">
              33 Salt River Road,
              <br />
              Salt River, Cape Town, South Africa, 7925
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { label: "Instagram", icon: "ig" },
              { label: "Facebook", icon: "f" },
              { label: "LinkedIn", icon: "in" },
            ].map((item) => (
              <button
                key={item.label}
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
