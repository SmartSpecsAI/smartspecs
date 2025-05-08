import type { Metadata } from "next";
import "./globals.css";

import { ReactNode } from "react";
import { MultiProvider } from "@/smartspecs/lib/presentation";
import ConditionalLayoutWrapper from "./ConditionalLayoutWrapper";

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
        <MultiProvider>
          <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
        </MultiProvider>
      </body>
    </html>
  );
}
