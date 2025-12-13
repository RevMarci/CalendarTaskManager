import Task from './Task';
import type { Task as TaskModel } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';

interface ListProps {
    tasks: TaskModel[];
    onStatusChange: (id: number, newStatus: TaskStatus) => Promise<void>; 
    onEdit: (task: TaskModel) => void;
}

export default function List({ tasks, onStatusChange, onEdit }: ListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-gray-800 rounded-lg">
                <p className="text-gray-400">Nothing to do here...</p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {tasks.map((task) => (
                <Task 
                    key={task.id} 
                    task={task} 
                    onStatusChange={onStatusChange}
                    onClick={() => onEdit(task)} 
                />
            ))}
        </ul>
    );
}