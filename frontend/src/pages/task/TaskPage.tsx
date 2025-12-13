import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import List from './List';
import New from './New';
import TaskModal from './TaskModal';
import type { Task } from '../../models/Task';

export default function TaskPage() {
    const { tasks, error, loading, saveTask, changeTaskStatus, refresh, deleteTask } = useTasks();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openNewModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSave = async (taskData: Partial<Task>) => {
        await saveTask(taskData);
        await refresh();
    };

    const handleDelete = async (id: number) => {
        await deleteTask(id);
    };

    if (loading) return <div className="p-6 text-gray-400">Loading...</div>;
    if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tasks</h1>
                </div>
                <New onOpen={openNewModal} />
            </div>

            <List 
                tasks={tasks} 
                onStatusChange={async (id, status) => {
                    await changeTaskStatus(id, status);
                }}
                onEdit={openEditModal} 
            />

            <TaskModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
                task={editingTask}
            />
        </div>
    );
}