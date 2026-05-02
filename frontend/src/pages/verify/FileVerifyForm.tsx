import React, { useState } from 'react';
import FileInput from '../../components/inputs/FileInput';
import SaveButton from '../../components/buttons/SaveButton';

interface FileVerifyFormProps {
    onVerify: (file: File) => void;
    isLoading: boolean;
}

export default function FileVerifyForm({ onVerify, isLoading }: FileVerifyFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            onVerify(selectedFile);
        }
    };

    return (
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-900 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-white">Verify External File</h2>
            <p className="text-sm text-gray-400 mb-6 flex-grow">
                Upload a `.json` backup file. This option verifies the data directly against the blockchain contract.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-4">
                <FileInput 
                    accept=".json"
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                />
                
                <SaveButton 
                    type="submit" 
                    disabled={isLoading || !selectedFile} 
                    className="w-full flex justify-center"
                >
                    {isLoading ? 'Processing...' : 'Verify JSON'}
                </SaveButton>
            </form>
        </div>
    );
}
