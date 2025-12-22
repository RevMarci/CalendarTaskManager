import type { Task } from '../../models/Task';
import StatusCheckbox from '../../components/inputs/StatusCheckbox';

interface TaskItemProps {
    task: Task;
    onToggleStatus: (id: number, currentStatus: string) => void;
    onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggleStatus, onEdit }: TaskItemProps) {
    const isCompleted = task.status === 'completed';

    return (
        <div 
            onClick={() => onEdit(task)}
            className="group flex items-center justify-between p-4 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-600 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <StatusCheckbox 
                    isCompleted={isCompleted} 
                    onClick={() => onToggleStatus(task.id, task.status)}
                />
                
                <div>
                    <h3 className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                        {task.name}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {task.deadline && (
                <span className={`text-xs px-2 py-1 rounded border ${
                    isCompleted 
                        ? 'border-gray-800 text-gray-600' 
                        : 'border-blue-900/30 text-blue-400 bg-blue-900/10'
                }`}>
                    {new Date(task.deadline).toLocaleDateString()}
                </span>
            )}
        </div>
    );
}