//import Navbar from "@/components/NavBar/Navbar";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppSidebar } from "@/components/SidebarComponent/SidebarComponent";

import "./globals.css";
import { useState } from "react";
import ProviderQuery from "@/QueryProvider";
import { Toaster } from "sonner";


/*
<body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
*/
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
      <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full flex max-w-full">
        <SidebarTrigger className="fixed"/>
        <main className="w-full h-full flex">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
      </SidebarProvider>
      </ProviderQuery>
      </body>
    </html>
  );
}
