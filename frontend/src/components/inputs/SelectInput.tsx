export interface SelectOption {
    value: string;
    label: string;
}

interface SelectInputProps {
    label?: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}

export default function SelectInput({ label, value, options, onChange }: SelectInputProps) {
    return (
        <div className="w-full">
            {label && (
                <span className="block text-sm font-medium text-gray-400 mb-1 select-none">
                    {label}
                </span>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-900/50 transition-all cursor-pointer hover:border-gray-700"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-gray-900 text-gray-200">
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
