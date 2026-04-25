import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Авторизация",
    description: "Вход и регистрация в систему учета"
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-7xl flex flex-col justify-center px-8 py-12 bg-white">
                <div className="max-w-md mx-auto w-full">{children}</div>
            </div>

            <div className="hidden lg:flex flex-col w-full items-center justify-center p-12" style={{ background: "url('/background.jpg')", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
                <div className="max-w-lg text-center">
                    <div className="w-24 h-24 mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-black/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-4">Добро пожаловать</h1>
                    <p className="text-black text-lg leading-relaxed">
                        Управляйте своими проектами и задачами в одном месте.
                        Начните работу с нашей платформой уже сегодня.
                    </p>
                </div>
            </div>
        </div>
    );
}
