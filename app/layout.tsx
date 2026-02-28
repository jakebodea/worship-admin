import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "worshipadmin.com",
  description: "Church-agnostic Planning Center scheduling tools for worship admins.",
  openGraph: {
    title: "worshipadmin.com",
    description: "Church-agnostic Planning Center scheduling tools for worship admins.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "worshipadmin.com",
    description: "Church-agnostic Planning Center scheduling tools for worship admins.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
