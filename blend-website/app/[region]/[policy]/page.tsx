import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookiePreferencesButton } from "@/components/CookiePreferences";
import { isRegion, regions } from "@/lib/regions";
import { policyContent, policySlugs, policyUpdated, type PolicySlug } from "@/lib/policies";
import { createPageMetadata } from "@/lib/seo";
import zaPublishedPolicy from "@/content/policies/za-published-privacy.json";

type Params = { region: string; policy: string };
function validPolicy(value: string): value is PolicySlug { return policySlugs.includes(value as PolicySlug); }
export function generateStaticParams() { return policySlugs.map((policy) => ({ policy })); }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { region, policy } = await params;
  if (!isRegion(region) || !validPolicy(policy)) return {};
  const content = policyContent(region, policy);
  return createPageMetadata({ title: `${content.title} — ${regions[region].name}`, description: content.intro, path: `/${policy}`, region });
}

export default async function PolicyPage({ params }: { params: Promise<Params> }) {
  const { region, policy } = await params;
  if (!isRegion(region) || !validPolicy(policy)) notFound();
  const content = policyContent(region, policy);
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0f15] text-white">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-40 sm:px-8 sm:pt-44">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">Blend {regions[region].name}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-xs text-white/50">Website notice updated {policyUpdated}</p>
        <p className="mt-7 text-lg leading-8 text-white/80">{content.intro}</p>
        <nav aria-label="Policy pages" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {policySlugs.map((slug) => <Link key={slug} href={`/${region}/${slug}`} aria-current={policy === slug ? "page" : undefined} className="underline underline-offset-4">{policyContent(region, slug).title}</Link>)}
        </nav>
        <div className="mt-10 space-y-9">
          {content.sections.map((section) => <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-7 text-white/75 sm:text-base">{paragraph}</p>)}
            {section.link && <a href={section.link.href} className="mt-3 inline-block text-sm underline underline-offset-4">{section.link.label} ↗</a>}
          </section>)}
        </div>
        {policy === "cookie-policy" && <CookiePreferencesButton className="mt-8 min-h-12 rounded-full bg-white px-6 text-sm font-semibold text-black">Manage cookie preferences</CookiePreferencesButton>}
        {region === "za" && policy === "privacy-policy" && <section className="mt-12 border-t border-white/15 pt-10">
          <h2 className="text-2xl font-semibold">Published South African company policy</h2>
          <p className="mt-3 text-sm leading-7 text-white/65">The existing company policy is reproduced below with its original date ({zaPublishedPolicy.publishedPolicyUpdated}) and Information Officer details. The website-specific notice above describes the current website features.</p>
          <div className="mt-8 overflow-x-auto break-words text-sm leading-7 text-white/75 [&_a]:underline [&_h2]:my-6 [&_h2]:text-xl [&_h3]:my-5 [&_h3]:font-semibold [&_h4]:my-5 [&_h4]:font-semibold [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_td]:border [&_td]:border-white/15 [&_td]:p-3 [&_th]:border [&_th]:border-white/15 [&_th]:p-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: zaPublishedPolicy.html }} />
        </section>}
      </article>
      <Footer />
    </main>
  );
}
