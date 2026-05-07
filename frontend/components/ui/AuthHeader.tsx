
type AuthHeaderProps = {
    title: string;
    subtitle: string;
}
export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
    return (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">{title}</h2>
            <p className="text-xl font-bold text-gray-600 mb-8 text-center">{subtitle}</p>
        </>
    )
}