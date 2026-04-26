interface DividerProps {
    label?: string;
    className?: string;
    align?: 'left' | 'center';
}

export default function Divider({ label, className = '', align = 'left' }: DividerProps) {
    return (
        <div className={`flex items-center w-full my-6 ${className}`}>
            {label && align === 'center' && (
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            )}
            
            {label && (
                <span className={`${align === 'center' ? 'mx-4' : 'mr-2'} text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap`}>
                    {label}
                </span>
            )}
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>
    );
}