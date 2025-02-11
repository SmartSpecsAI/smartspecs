import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import ClientProvider from "../lib/presentation/store/ClientProvider";

export const metadata: Metadata = {
  title: "SmartSpecs - 57Blocks Collaboration Platform",
  description: "Specifications platform powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}