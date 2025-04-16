import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/app/provider";
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script'

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
        <body className={`${inter.variable} ntialiased text-black`}>
          <Providers>{children}</Providers>
          <Analytics />
        </body>
        <Script 
         defer src="https://cloud.umami.is/script.js" data-website-id="b7ca31b3-b33a-4eca-8a50-464448bb6ba9"
        />
        
      </html>
    </ClerkProvider>
  );
}
