import React from 'react';

interface StatusCheckboxProps {
    isCompleted: boolean;
    onClick: () => void;
}

export default function StatusCheckbox({ isCompleted, onClick }: StatusCheckboxProps) {
    return (
        <div 
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-600 hover:border-gray-400'
            }`}
        >
            {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )}
        </div>
    );
}