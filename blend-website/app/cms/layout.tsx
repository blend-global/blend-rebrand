import { createPageMetadata } from "@/lib/seo";

export const metadata = {
  ...createPageMetadata({ title: "CMS", description: "Blend's content management workspace.", path: "/cms" }),
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
