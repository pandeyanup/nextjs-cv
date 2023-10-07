import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MyNavigationMenu } from "@/components/MyNavigationMenu";
import Providers from "@/components/Providers";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anup Pandey",
  description: "Anup Pandey. Full-Stack Developer | Backend Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <head>
          <link
            rel="icon"
            className="rounded-full radius-2xl"
            href="/favicon.ico"
            sizes="any"
          />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <div className="flex justify-between">
                <MyNavigationMenu />
                <ThemeToggle />
              </div>
            </header>
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
