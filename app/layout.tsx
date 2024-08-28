import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Membership Dashboard",
  description: "By Tons Of Minds Limited",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
