'use client';
import ProviderQuery from "@/QueryProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/Custom/DarkMode/theme-provider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      {false && <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async></script>
      </head>}
      <body >

        <ProviderQuery>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ProviderQuery>


      </body>
    </html>
  );
}
