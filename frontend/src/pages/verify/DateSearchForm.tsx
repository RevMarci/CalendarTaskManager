import React, { useState } from 'react';
import TextInput from '../../components/inputs/TextInput';
import SaveButton from '../../components/buttons/SaveButton';

interface DateSearchFormProps {
    onSearch: (date: string) => void;
    isLoading: boolean;
}

export default function DateSearchForm({ onSearch, isLoading }: DateSearchFormProps) {
    const [selectedDate, setSelectedDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate) {
            onSearch(selectedDate);
        }
    };

    return (
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-900 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-white">Search by Date</h2>
            <p className="text-sm text-gray-400 mb-6 flex-grow">
                Select a date to fetch your verified daily log directly from the database and cross-check it with the blockchain.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-auto">
                <TextInput 
                    label="Select Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    style={{ colorScheme: 'dark' }}
                />
                
                <SaveButton 
                    type="submit" 
                    disabled={isLoading || !selectedDate} 
                    className="w-full flex justify-center"
                >
                    {isLoading ? 'Searching...' : 'Search My Logs'}
                </SaveButton>
            </form>
        </div>
    );
}
