import React from 'react';

interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function AddButton({ children, onClick, ...props }: AddButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="cursor-pointer border border-blue-900 text-blue-400 bg-blue-900/20 px-4 py-2 rounded hover:bg-blue-900/60 transition-colors font-medium text-sm"
            {...props}
        >
            {children}
        </button>
    );
}