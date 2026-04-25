import { useHeaderActions, useHeaderSearch, useHeaderUser } from "@/store/use-header-store";
import { useSidebarActions, useSidebarVisible } from "@/store/use-sidebar-store";
import { NotificationHeader } from "../header/NotificationHeader";
import { UserHeader } from "../header/UserHeader";

export const Header: React.FC = () => {
    const { toggleVisible, setOpen } = useSidebarActions()
    const { toggleUser, toggleNotification, setSearchOpen } = useHeaderActions()
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={toggleVisible}
                        className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
                        title={useSidebarVisible() ? "Скрыть сайдбар" : "Показать сайдбар"}
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {useSidebarVisible() ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>

                    <button
                        onClick={() => {
                            if (document.fullscreenElement) {
                                document.exitFullscreen();
                            } else {
                                document.documentElement.requestFullscreen();
                            }
                        }}

                        className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
                        title="На весь экран"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>

                    <div className="relative">
                        {useHeaderSearch()
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
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
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
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.353 2.353 0 0118 9.75V6a1 1 0 00-1-1H4a1 1 0 00-1 1v3a1 1 0 00.263.737l1.405 1.405A2.354 2.354 0 016 12.25v4.75A2.5 2.5 0 008.5 19.5h7.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <NotificationHeader />
                    </div>

                    <div className="relative">
                        <button
                            onClick={toggleUser}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-sm text-white font-medium">ИИ</span>
                            </div>
                            <svg
                                className={`w-4 h-4 text-gray-600 transition-transform ${useHeaderUser() ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <UserHeader />
                    </div>
                </div>
            </div>
        </header>
    );
};