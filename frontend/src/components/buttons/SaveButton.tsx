import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function SaveButton({ children, onClick, ...props }: ButtonProps) {
    return (
        <button 
            className="px-4 py-2 rounded text-sm font-medium border border-blue-900 text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 transition-colors cursor-pointer"
            {...props}
        >
            {children}
        </button>
    );
}