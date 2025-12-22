import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export default function TextArea({ label, className = '', ...props }: TextAreaProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
                {label}
            </label>
            <textarea 
                className={`w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors resize-none ${className}`}
                {...props}
            />
        </div>
    );
}