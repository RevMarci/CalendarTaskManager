interface ColorInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function ColorInput({ label, value, onChange }: ColorInputProps) {
    return (
        <div className="w-full">
            {label && (
                <span className="block text-sm font-medium text-gray-400 mb-1 select-none">
                    {label}
                </span>
            )}
            
            <div className="relative flex items-center bg-black border border-gray-600 rounded py-2 px-3 hover:border-gray-500 transition-colors focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 overflow-hidden">
                <div 
                    className="w-5 h-5 rounded-full border border-gray-700 shrink-0 mr-3 shadow-sm"
                    style={{ backgroundColor: value }}
                />
                
                <span className="text-sm text-gray-300 font-mono uppercase tracking-wider">
                    {value}
                </span>

                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
