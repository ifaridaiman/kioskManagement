import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/app/provider";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lemangtul",
  description: "100% buatan Saujana Utama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="288aadd8-37ec-49b4-9872-c0576a8398d4"
        ></script>
        <body className={`${inter.variable} ntialiased text-black`}>
          <Providers>{children}</Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
