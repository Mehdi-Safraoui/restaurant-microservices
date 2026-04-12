import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DeliverySidebar } from "@/components/DeliverySidebar";
import { Navbar } from "@/components/Navbar";

export function DeliveryLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DeliverySidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
