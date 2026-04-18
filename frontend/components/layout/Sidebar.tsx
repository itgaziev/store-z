'use client';

import { clearAuthTokens } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type MenuItem = {
    label: string;
    href: string;
    icon: any;
    children?: { name: string; href: string }[];
};

const menuItems: MenuItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

    useEffect(() => {
        const newOpenMenus: Record<string, boolean> = {};
        menuItems.forEach(item => {
            if (item.children?.some(child => pathname === child.href)) {
                newOpenMenus[item.href] = true;
            }
        });
        setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
    }, [pathname]);

    const toggleMenu = (href: string) => {
        setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }));
    }

    const logOut = () => {
        clearAuthTokens();
        router.push('/login');
    }

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-slate-100 shadow-xl">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider uppercase text-blue-400">StoreZ</h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {menuItems.map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openMenus[item.href];
                    const isActive = pathname === item.href || item.children?.some(c => pathname === c.href);

                    return (
                        <div key={item.href} className="space-y-1">
                            { hasChildren ? (
                                <button 
                                    onClick={() => toggleMenu(item.href)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                                        isActive 
                                        ? 'bg-slate-800/50 text-blue-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={cn(
                                            "w-5 h-5",
                                            isActive 
                                            ? 'text-blue-400' 
                                            : 'text-blue-400 group-hover:text-blue-400'
                                        )} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    { isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" /> }
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                        pathname === item.href
                                            ? 'bg-slate-800/50 text-blue-400'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                    )}
                                >
                                    <item.icon className={cn(
                                        'w-5 h-5',
                                        pathname === item.href
                                            ? 'text-white'
                                            : 'text-slate-400 group-hover:text-blue-400'
                                    )} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )}

                            { hasChildren && isOpen && (
                                <div className="pl-11 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    { item.children?.map(child => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={cn(
                                                "block px-4 py-2 rounded-md transition-colors",
                                                pathname === child.href
                                                    ? 'text-blue-400 font-semibold'
                                                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                                            )}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => logOut()}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
};