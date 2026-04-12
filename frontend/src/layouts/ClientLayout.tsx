import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/ClientSidebar";
import { Navbar } from "@/components/Navbar";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
