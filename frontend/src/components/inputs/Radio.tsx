interface RadioProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

export default function Radio({ label, checked, onChange }: RadioProps) {
    return (
        <div 
            onClick={onChange}
            className="flex items-center gap-3 cursor-pointer transition-all group"
        >
            <div className={`relative w-5 h-5 rounded-full border transition-all ${
                checked 
                    ? 'border-blue-600 bg-transparent' 
                    : 'border-gray-600 bg-transparent group-hover:border-gray-500'
            }`}>
                {checked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </div>
                )}
            </div>
            <span className="text-gray-300 text-sm select-none">{label}</span>
        </div>
    );
}
