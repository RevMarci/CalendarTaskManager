interface DividerProps {
    label?: string;
    className?: string;
}

export default function Divider({ label, className = '' }: DividerProps) {
    return (
        <div className={`flex items-center w-full my-6 ${className}`}>
            {label && (
                <span className="mr-2 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {label}
                </span>
            )}
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>
    );
}