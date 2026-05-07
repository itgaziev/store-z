'use client'

import { useHeaderActions, useHeaderFullScreen, useHeaderSearch, useHeaderUser } from "@/store/use-header-store";
import { useSidebarActions, useSidebarVisible } from "@/store/use-sidebar-store";
import { NotificationHeader } from "../header/NotificationHeader";
import { UserHeader } from "../header/UserHeader";
import { Loader } from "../ui/Loader";
import React from "react";
import { useUserStore } from "@/store/user.store";
import { ChevronLeft, ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsLeftIcon, ChevronsRightIcon, ExpandIcon, MegaphoneIcon, MenuIcon, Minimize, SearchIcon } from "lucide-react";

export const Header: React.FC = () => {
    const { toggleVisible, setOpen } = useSidebarActions()
    const { toggleUser, toggleNotification, setSearchOpen, setFullScreen } = useHeaderActions()

    const isSidebarVisible = useSidebarVisible();
    const isHeaderSearchOpen = useHeaderSearch();
    const isUserMenuOpen = useHeaderUser();
    const isFullScreen = useHeaderFullScreen();

    const { user, fetchUser, isLoading } = useUserStore();

    React.useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const getUserChar = () => {
        if (user?.firstName && user?.lastName)
            return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();

        return '--';
    }

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        <MenuIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={toggleVisible}
                        className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
                        title={isSidebarVisible ? "Скрыть сайдбар" : "Показать сайдбар"}
                    >
                        {isSidebarVisible ? (
                            <ChevronsLeftIcon className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronsRightIcon className="w-5 h-5 text-gray-600" />
                        )}

                    </button>

                    <button
                        onClick={() => setFullScreen() }

                        className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
                        title="На весь экран"
                    >
                        { isFullScreen ? (
                            <Minimize className="w-5 h-5 text-gray-600 rotate-180" />
                        ) : (
                            <ExpandIcon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    <div className="relative">
                        {isHeaderSearchOpen
                            ? (
                                <input
                                    type="text"
                                    placeholder="Поиск ..."
                                    autoFocus
                                    onBlur={() => setSearchOpen(false)}
                                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            )
                            : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <SearchIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    <div className="relative">
                        <button
                            onClick={toggleNotification}
                            className="relative p-2 rounded-lg hover:bg-gray-100"
                        >
                            <MegaphoneIcon className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <NotificationHeader />
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div className="relative">
                            <button
                                onClick={toggleUser}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm text-white font-medium">{getUserChar()}</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-600 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <UserHeader />
                        </div>
                    )
                    }
                </div>
            </div>
        </header>
    );
};