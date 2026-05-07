'use client';

import { routes } from "@/data/routes";
import { useSidebarActions, useSidebarExpandedItems, useSidebarVisible } from "@/store/use-sidebar-store";
import { ChevronsLeftIcon, ChevronsRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Sidebar: React.FC = () => {
    const { toggleVisible, setOpen, toggleExpanded } = useSidebarActions();
    const expandedItems = useSidebarExpandedItems();
    const isSidebarVisible = useSidebarVisible();

    return (
        <aside className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0 flex">
                <Link className="text-xl font-bold text-blue-600" href="/dashboard">Store-Z</Link>
                <button
                    onClick={ () => setOpen(false) }
                    className="flex md:hidden"
                >
                    <XIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                    { routes.map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleExpanded(item.label)}
                                        className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <span>{item.label}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    { expandedItems.includes(item.label) && (
                                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                                            { item.children.map(child => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setOpen(false) }
                                                >{ child.label }</Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={ item.href }
                                    onClick={() => setOpen(false) }
                                    className="block px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >{ item.label }</Link>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200 shrink-0">
                <button
                    onClick={ toggleVisible }
                    className="flex items-center justify-center w-full px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    { isSidebarVisible ? (
                        <ChevronsLeftIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronsRightIcon className="w-5 h-5 text-gray-600" />
                    ) }
                    <span className="ml-2">{ isSidebarVisible ? "Скрыть" : "Показать" }</span>
                </button>
            </div>
        </aside>
    );
};
