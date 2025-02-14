import type { Metadata } from "next";
import "./globals.css";

import { ReactNode } from "react";
import { AppLayout, MultiProvider } from "@/smartspecs/lib/presentation";
import ThemeProvider from "@/smartspecs/lib/presentation/components/layout/ThemeProvider";

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
        <ThemeProvider>
          <AppLayout>
            <MultiProvider>{children}</MultiProvider>{" "}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
