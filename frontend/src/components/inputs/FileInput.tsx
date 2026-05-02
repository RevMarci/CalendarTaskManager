import React, { useState, useRef } from 'react';

interface FileInputProps {
    accept?: string;
    selectedFile: File | null;
    onFileSelect: (file: File | null) => void;
}

export default function FileInput({ accept, selectedFile, onFileSelect }: FileInputProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[120px] ${
                isDragging 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-700 hover:border-gray-500 bg-black'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                type="file"
                accept={accept}
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
            />
            {selectedFile ? (
                <div className="text-blue-400 font-medium break-all">
                    📄 {selectedFile.name}
                </div>
            ) : (
                <div className="text-gray-400 text-sm">
                    <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
                    <br />
                    <span className="text-xs text-gray-500 mt-1 block">
                        {accept ? `(${accept} files only)` : '(File upload)'}
                    </span>
                </div>
            )}
        </div>
    );
}
