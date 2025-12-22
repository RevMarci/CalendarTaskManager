import type { Task } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';
import TaskItem from './TaskItem';

interface ListProps {
    tasks: Task[];
    onStatusChange: (id: number, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
}

export default function List({ tasks, onStatusChange, onEdit }: ListProps) {
    if (tasks.length === 0) {
        return <div className="text-gray-500 text-center py-10">No tasks yet.</div>;
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleStatus={(id, currentStatus) => {
                        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
                        onStatusChange(id, newStatus);
                    }}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}