'use client';

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebarActions, useSidebarIsOpen, useSidebarVisible } from "@/store/use-sidebar-store";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { toggleVisible, setOpen } = useSidebarActions();
    const isSidebarVisible = useSidebarVisible();
    const isSidebarOpen = useSidebarIsOpen();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            { isSidebarVisible && (
                <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
                    <Sidebar />
                </div>
            )}

            <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}>
                <div className="absolute inset-0 bg-black/50"
                    onClick={() => setOpen(false)}/>
                <div className="absolute inset-y-0 left-0 z-50 w-64">
                    <Sidebar />
                </div>
            </div>

            <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? "lg:pl-64" : ""} overflow-hidden`}>
                <Header />
                <main className="p-4 lg:p-6 overflow-hidden">{ children }</main>
            </div>
        </div>
    );
}