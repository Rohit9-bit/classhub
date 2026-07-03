import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavigationMenuDemo } from "@/components/components/NavigationBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar />
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="p-6">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger />
              <NavigationMenuDemo />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
