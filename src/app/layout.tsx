import type { Metadata } from "next";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { IntlProviderWrapper } from "@/context/IntlProviderWrapper";
import { UserDataProvider } from "@/lib/useUserData";
import { SITE_CONFIG } from "@/lib/constants";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Anoniem bereikbaar voor je voertuig`,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${quicksand.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans overflow-x-clip">
        <IntlProviderWrapper>
          <ThemeProvider>
            <UserDataProvider>
              {children}
            </UserDataProvider>
          </ThemeProvider>
        </IntlProviderWrapper>
      </body>
    </html>
  );
}
