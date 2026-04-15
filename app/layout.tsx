import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Library App FE",
  description: "Library management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-800">{children}</body>
    </html>
  );
}
