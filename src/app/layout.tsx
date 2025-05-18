import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "./header";
import Footer from "./footer";
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
  title: "TravelApp",
  description: "Plan your trips, manage itineraries, and explore the world.",
};

/**
 * Root layout for the application.
 * Wraps all pages with header, footer, and global styles.
 * @param props.children - The page content to render.
 * @returns The root layout JSX.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 flex flex-col min-h-screen`}
      >
        <Toaster />
        <Header />
        <main className="flex-grow flex flex-col items-center justify-between">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
