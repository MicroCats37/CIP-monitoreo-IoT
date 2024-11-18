//import Navbar from "@/components/NavBar/Navbar";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppSidebar } from "@/components/SidebarComponent/SidebarComponent";

import "./globals.css";
import { useState } from "react";
import ProviderQuery from "@/QueryProvider";


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
      <body>
      <ProviderQuery>
      <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full flex-1 flex">
        <SidebarTrigger/>
        <main className="w-full h-full flex">
          {children}
        </main>
      </div>
      </SidebarProvider>
      </ProviderQuery>
      </body>
    </html>
  );
}
