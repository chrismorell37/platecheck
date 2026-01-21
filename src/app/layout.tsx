import type { Metadata } from "next";
import { Public_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlateCheck | Check Your Plate Against the New Food Pyramid",
  description: "Snap a photo of your meal and get instant AI-powered feedback based on the 2025-2030 Dietary Guidelines. See how your plate measures up to the new inverted food pyramid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
