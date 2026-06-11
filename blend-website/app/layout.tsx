import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SiteAuthGate from "@/components/auth/SiteAuthGate";
import PageTransition from "@/components/PageTransition";
import ProjectModalProvider from "@/components/ProjectModalProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blend Global",
  description:
    "Blend empowers connections globally through events, digital marketing, and immersive experiences.",
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
