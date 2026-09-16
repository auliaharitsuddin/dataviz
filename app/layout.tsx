import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DatasetProvider } from "@/lib/store/dataset-context";
import { LanguageProvider } from "@/lib/store/language-context";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/dashboard/app-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataViz Hub — Live Data Visualization",
  description: "Upload Excel, Word, or PDF files and turn them into live, interactive dashboards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <DatasetProvider>
            <AppHeader />
            <main className="flex flex-1 flex-col">{children}</main>
          </DatasetProvider>
        </LanguageProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
