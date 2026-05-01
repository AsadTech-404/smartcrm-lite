import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import MobileHeader from "@/components/MobileHeader";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartCRM",
  description: "Manage your users efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${manrope.variable} h-full antialiased`}
      >
        <body className="h-screen bg-background font-sans overflow-hidden">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen flex-col md:flex-row">
              <MobileHeader />

              <aside className="hidden w-64 border-r md:block shrink-0 bg-slate-950 h-full">
                <Sidebar />
              </aside>

              <main className="flex-1 overflow-y-auto bg-background">
                <Header />
                <div className="p-4">{children}</div>
                <Toaster position="top-center" richColors />
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
