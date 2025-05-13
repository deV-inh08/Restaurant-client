import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-providers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from "next-intl/server";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
});

// You can use many font

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "My Restuarant",
  description: "The best restuarant in the world",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale()

  return (
    <html lang={locale} className="mdl-js" suppressHydrationWarning>
      <body
        className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}
      >
        <NextIntlClientProvider>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
            </ThemeProvider>
            <Toaster></Toaster>
          </AppProvider>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
