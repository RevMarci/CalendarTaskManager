import { useState } from 'react';

interface AddGroupColumnProps {
    onAdd: (title: string) => Promise<void>;
}

export default function AddGroupColumn({ onAdd }: AddGroupColumnProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await onAdd(title);
            setTitle('');
            setIsAdding(false);
        } catch (error) {
            console.error("Failed to add group", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAdding) {
        return (
            <div className="w-80 flex-shrink-0 p-4">
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full h-12 border border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-500 hover:bg-gray-800/50 cursor-pointer transition-all"
                >
                    + Add Group
                </button>
            </div>
        );
    }

    return (
        <div className="w-80 flex-shrink-0 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Enter group title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
                    />
                    <div className="flex items-center gap-2">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Adding...' : 'Add Group'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                setIsAdding(false);
                                setTitle('');
                            }}
                            className="px-3 py-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}