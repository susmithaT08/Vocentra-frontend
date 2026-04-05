import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-auto scrollbar-thin">
                {children}
            </main>
        </div>
    );
}
