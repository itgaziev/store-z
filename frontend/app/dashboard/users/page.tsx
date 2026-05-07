import { Heading } from "@/components/layout/Heading";
import { SearchTable } from "@/components/tables/SearchTable";

export default function UsersPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <Heading title="Пользователи" description="Управление пользователями вашего магазина" />
            { /* Main content goes here */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shrink-0">
                        <SearchTable />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
                        <div className="overflow-auto flex-1 custom-scrollbar">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}