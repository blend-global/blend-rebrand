import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SiteAuthGate from "@/components/auth/SiteAuthGate";
import PageTransition from "@/components/PageTransition";
import ProjectModalProvider from "@/components/ProjectModalProvider";
import CookiePreferences from "@/components/CookiePreferences";
import { createPageMetadata, siteName, siteUrl } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  ...createPageMetadata({ title: siteName, path: "/" }),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-background`}>
        <AuthProvider>
          <CookiePreferences />
          <SiteAuthGate>
            <ProjectModalProvider>
              <PageTransition>{children}</PageTransition>
            </ProjectModalProvider>
          </SiteAuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
