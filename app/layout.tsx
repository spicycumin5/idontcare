import type { Metadata } from "next";
import { Anton, IBM_Plex_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I Don't Care",
  description: "Pass the phone around, cross off what nobody wants, and let the ticket decide.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
