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
      <div className="w-full h-auto flex max-w-full">
        <SidebarTrigger className=" fixed z-[10] scale-150 bottom-0 right-0 mb-6 mr-6 bg-slate-300 bg-opacity-15 p-4 rounded-full sm:bottom-auto sm:right-auto sm:m-0 sm:scale-100 sm:bg-[--tw-bg-opacity] sm:p-0 shadow-lg" />
        <main className="w-full h-full flex p-4">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
