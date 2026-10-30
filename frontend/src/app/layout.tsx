import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme/theme-provider";

const appSans = Inter({
  subsets: ["latin"],
  variable: "--font-app-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsureGuard — AI-Powered Insurance Intelligence",
  description:
    "AI-powered insurance fraud detection, claim management and investigation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={appSans.variable}>
      <head>
        {/* Applies the persisted theme class before first paint so there is
            no flash of the wrong theme (dark is the default identity). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
