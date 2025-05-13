import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import AppProvider from "@/components/app-providers";
import { Toaster } from "sonner";
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages, setRequestLocale } from "next-intl/server";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
});



export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale)

  const message = await getMessages()

  return (
    <html lang={locale} className="mdl-js" suppressHydrationWarning>
      <body
        className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}
      >
        <NextIntlClientProvider messages={message}>
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
