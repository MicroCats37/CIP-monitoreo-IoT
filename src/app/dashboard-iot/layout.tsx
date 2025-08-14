//import Navbar from "@/components/NavBar/Navbar";
'use client";'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Custom/SidebarComponent/SidebarComponent";
import { Toaster } from "sonner";

/*
<body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
*/
export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-auto flex max-w-full">
        <SidebarTrigger className="fixed z-[10] scale-150 bottom-0 right-0 mb-6 mr-6 bg-slate-300 bg-opacity-15 p-4 rounded-full lg:bottom-auto lg:right-auto lg:m-0 lg:scale-100 lg:bg-[--tw-bg-opacity] lg:p-0 shadow-lg" />
        <main className="w-full h-full">
          <div className="w-full h-full grid">
            <div className="w-full h-full flex flex-1">
              <Toaster expand visibleToasts={3} position="top-right" />
              <div className="flex-col w-full h-full justify-center items-center">
                {/*<div className="flex-col w-full h-full justify-center items-center p-4">*/}
                
                {children}
              </div>

            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
