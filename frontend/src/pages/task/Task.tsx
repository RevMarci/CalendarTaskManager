import { useState } from 'react';
import type { Task as TaskModel } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';

interface TaskItemProps {
    task: TaskModel;
    onStatusChange: (id: number, newStatus: TaskStatus) => Promise<void>;
    onClick: () => void;
}

export default function Task({ task, onStatusChange, onClick }: TaskItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (isUpdating) return;

        setIsUpdating(true);
        
        try {
            const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
            await onStatusChange(task.id, newStatus);
        } catch (error) {
            console.error("Error occurred", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <li 
            onClick={onClick}
            className="group cursor-pointer border border-gray-800 rounded-lg p-4 flex justify-between items-center bg-black hover:bg-gray-900/40 transition-colors h-16"
        >
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                
                <span className={`text-gray-200 truncate ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                    <strong>{task.name}</strong>
                </span>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                    onClick={handleStatusClick}
                    disabled={isUpdating}
                    className={`w-28 h-8 flex items-center justify-center text-xs rounded border font-medium transition-all cursor-pointer ${
                        isUpdating 
                            ? 'border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed'
                            : task.status === 'completed' 
                                ? 'border-green-900 text-green-400 bg-green-900/20 hover:bg-green-900/40' 
                                : 'border-yellow-900 text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/40'
                    }`}
                >
                    {isUpdating ? (
                        <span className="animate-pulse">...</span> 
                    ) : (
                        task.status === 'completed' ? 'Completed' : 'Pending'
                    )}
                </button>
            </div>
        </li>
    );
}