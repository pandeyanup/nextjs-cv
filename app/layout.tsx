import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { MyNavigationMenu } from "@/components/MyNavigationMenu";
import ThemeToggle from "@/components/ThemeToggle";

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
      <head>
        <link
          rel="icon"
          className="rounded-full radius-2xl"
          href="https://media.licdn.com/dms/image/D5603AQG6rXeXwqpnFA/profile-displayphoto-shrink_800_800/0/1690801070395?e=1701302400&v=beta&t=QQKtQKtLkSYrHCSpvepuvqfuRsLX_p2WgggK11oe9_Q"
          sizes="any"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
