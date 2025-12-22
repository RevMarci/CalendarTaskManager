import { useState, useEffect } from 'react';
import type { Task } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';
import Modal from '../../components/Modal';
import TextInput from '../../components/inputs/TextInput';
import TextArea from '../../components/inputs/TextArea';
import DeleteButton from '../../components/buttons/DeleteButton';
import CancelButton from '../../components/buttons/CancelButton';
import SaveButton from '../../components/buttons/SaveButton';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...task, name, description, deadline: deadline || undefined, status });
        onClose();
    };

    const handleDelete = () => {
        if (task?.id && confirm('You sure you want to delete this task?')) {
            onDelete(task.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Edit task' : 'New task'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <TextInput 
                    label="Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <TextArea 
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24"
                />

                <TextInput 
                    label="Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                />

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-900">
                    <div>
                        {task && (
                            <DeleteButton type="button" onClick={handleDelete}>
                                Delete
                            </DeleteButton>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <CancelButton onClick={onClose}>
                            Cancel
                        </CancelButton>
                        
                        <SaveButton type="submit">
                            Save
                        </SaveButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
}