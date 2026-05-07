import { lastActivity } from "@/data/activity"
import { cn } from "@/lib/utils"

export const Activity: React.FC = () => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Послденяя активность
            </h2>
            <div className="space-y-4">
                {lastActivity.map(item => (
                    <div key={item.title} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${item.colorName}-100`}>
                            <svg
                                className={`w-5 h-5 text-${item.colorName}-600`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.lastTime}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}