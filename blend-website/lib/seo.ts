import type { Metadata } from "next";

export const siteName = "Blend Global";
export const siteDescription = "Blend empowers connections globally through events, digital marketing, and immersive experiences.";
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blend.global");
export const defaultShareImage = "/og/blend-share.png";

if (!["http:", "https:"].includes(siteUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP or HTTPS URL.");
}

export function seoDescription(value: string) {
  const text = value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text || siteDescription;
}

// SVGs and video files are unsuitable for social preview images. Published
// raster CMS images are used where available; otherwise use the branded card.
function shareImageUrl(image?: string) {
  if (!image) return new URL(defaultShareImage, siteUrl).href;
  try {
    const url = new URL(image, siteUrl);
    if (!["http:", "https:"].includes(url.protocol) || /\.(svg|mp4|webm)$/i.test(decodeURIComponent(url.pathname))) {
      return new URL(defaultShareImage, siteUrl).href;
    }
    return url.href;
  } catch {
    return new URL(defaultShareImage, siteUrl).href;
  }
}

export function createPageMetadata({ title, description = siteDescription, path, image, article = false }: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  article?: boolean;
}): Metadata {
  const pageTitle = title === siteName ? title : `${title} | ${siteName}`;
  const summary = seoDescription(description);
  const url = new URL(path, siteUrl).href;
  const imageUrl = shareImageUrl(image);
  const shareImage = { url: imageUrl, alt: pageTitle,
    ...(imageUrl === new URL(defaultShareImage, siteUrl).href ? { width: 1200, height: 630, type: "image/png" } : {}),
  };

  return {
    title: pageTitle,
    description: summary,
    alternates: { canonical: url },
    openGraph: { type: article ? "article" : "website", locale: "en_ZA", siteName, title: pageTitle, description: summary, url, images: [shareImage] },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: [{ url: imageUrl, alt: pageTitle }] },
  };
}
