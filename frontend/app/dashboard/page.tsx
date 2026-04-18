type StatItem = {
    label: string;
    value: string;
    color: string;
}

const statList: StatItem[] = [
    { label: "Sale total", value: "45 200 ₽", color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: "Total Orders", value: "12", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "New Clients", value: "4", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Products out stock", value: "8", color: "bg-rose-50 text-rose-600 border-rose-100" }
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-3xl font-bold text-slate-800">Wellcome to StoreZ</h1>
                <p className="mt-2 text-slate-500">You managment store</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                { statList.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-xl border ${stat.color} shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
                        <p className="text-sm font-semibold opacity-80">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center italic text-slate-400">
                Statics Store-Z
            </div>
        </div>
    );
}