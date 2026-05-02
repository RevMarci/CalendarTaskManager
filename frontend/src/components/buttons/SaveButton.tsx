import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function SaveButton({ children, className = '', disabled, ...props }: ButtonProps) {
    return (
        <button 
            disabled={disabled}
            className={`px-4 py-2 rounded text-sm font-medium border border-blue-900 text-blue-400 bg-blue-900/20 transition-colors 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900/40 cursor-pointer'} 
                ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
