//import Navbar from "@/components/NavBar/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SidebarComponent/SidebarComponent";
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
        <div className="w-full h-full flex max-w-full">
          <SidebarTrigger className="fixed" />
          <main className="w-full h-full flex">
            <Toaster position="top-right" />
            {children}
          </main>
        </div>
      </SidebarProvider>
  );
}
