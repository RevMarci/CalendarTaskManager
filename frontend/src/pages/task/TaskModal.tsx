import { useState, useEffect } from 'react';
import type { Task } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    onDelete: (id: number) => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState<TaskStatus>('pending');

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description || '');
            setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
            setStatus(task.status);
        } else {
            setName('');
            setDescription('');
            setDeadline('');
            setStatus('pending');
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...task,
            name,
            description,
            deadline: deadline || undefined,
            status
        });
        onClose();
    };

    const handleDelete = () => {
        if (task && task.id) {
            if (confirm('Biztosan törölni szeretnéd ezt a feladatot?')) {
                onDelete(task.id);
                onClose();
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            
            <div 
                className="bg-black border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-2xl shadow-blue-900/10"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-6">
                    {task ? 'Feladat szerkesztése' : 'Új feladat'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Title</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors h-24 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Deadline</label>
                        <input 
                            type="date" 
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-900">
                        <div>
                            {task && (
                                <button 
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded text-sm font-medium border border-red-900 text-red-400 bg-red-900/10 hover:bg-red-900/30 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-4 py-2 rounded text-sm font-medium border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded text-sm font-medium border border-blue-900 text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}