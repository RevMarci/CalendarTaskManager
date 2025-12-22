import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function DeleteButton({ children, onClick, ...props }: ButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="px-4 py-2 rounded text-sm font-medium border border-red-900 text-red-400 bg-red-900/10 hover:bg-red-900/30 transition-colors cursor-pointer"
            {...props}
        >
            {children}
        </button>
    );
}