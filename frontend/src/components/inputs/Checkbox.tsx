import React from 'react';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
    return (
        <div 
            onClick={() => onChange(!checked)}
            className="w-full flex items-center gap-3 cursor-pointer transition-all group"
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                checked 
                    ? 'bg-blue-600 border-blue-600 text-black' 
                    : 'border-gray-600 bg-transparent group-hover:border-gray-500'
            }`}>
                {checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            
            <span className={`text-sm font-medium select-none ${checked ? 'text-blue-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                {label}
            </span>
        </div>
    );
}