import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function CancelButton({ children, onClick, ...props }: ButtonProps) {
    return (
        <button 
            type="button"
            onClick={onClick}
            className="px-4 py-2 rounded text-sm font-medium border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer"
            {...props}
        >
            {children}
        </button>
    );
}