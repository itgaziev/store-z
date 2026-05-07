export const Heading = ({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-between shrink-0 pb-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-3">
                {actions}
            </div>
        </div>
    );
}