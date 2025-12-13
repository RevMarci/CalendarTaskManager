interface NewTaskProps {
    onOpen: () => void;
}

export default function New({ onOpen }: NewTaskProps) {
    return (
        <button 
            onClick={onOpen} 
            className="cursor-pointer border border-blue-900 text-blue-400 bg-blue-900/20 px-4 py-2 rounded hover:bg-blue-900/60 transition-colors font-medium text-sm"
        >
            + New Task
        </button>
    );
}