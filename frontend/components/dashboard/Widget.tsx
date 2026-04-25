import { widgets } from "@/data/widget"
import { cn } from "@/lib/utils"

export const Widget: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            { widgets.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="flex items-start justify-between">{ item.title }</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{ item.value }</p>
                        </div>
                        <div
                            className={cn(
                                "text-sm",
                                item.positive ? "text-green-600" : "text-red-600",
                            )}
                        >
                            { item.change }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}