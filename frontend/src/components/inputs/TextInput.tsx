import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function TextInput({ label, className = '', ...props }: TextInputProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
                {label}
            </label>
            <input 
                className={`w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors ${className}`}
                {...props}
            />
        </div>
    );
}