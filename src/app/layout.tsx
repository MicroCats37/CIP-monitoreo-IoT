import ProviderQuery from "@/QueryProvider";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      {false && <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async></script>
      </head>}
      <body>
          <ProviderQuery>
          {children}
          </ProviderQuery>
      </body>
    </html>
  );
}
