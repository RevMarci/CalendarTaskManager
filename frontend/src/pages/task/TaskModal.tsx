import { useState, useEffect } from 'react';
import type { Task } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';
import Modal from '../../components/Modal';
import TextInput from '../../components/inputs/TextInput';
import TextArea from '../../components/inputs/TextArea';
import DeleteButton from '../../components/buttons/DeleteButton';
import CancelButton from '../../components/buttons/CancelButton';
import SaveButton from '../../components/buttons/SaveButton';
import Divider from '../../components/Divider';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    onDelete: (id: number) => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadLine, setDeadLine] = useState('');
    const [duration, setDuration] = useState<string>('');
    const [startTime, setStartTime] = useState('');
    const [status, setStatus] = useState<TaskStatus>('pending');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDeadLine(task.deadLine ? new Date(task.deadLine).toISOString().slice(0, 16) : '');
            setStartTime(task.startTime ? new Date(task.startTime).toISOString().slice(0, 16) : '');
            setDuration(task.duration ? task.duration.toString() : '');
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setDeadLine('');
            setStartTime('');
            setDuration('');
            setStatus('pending');
        }
    }, [task, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            ...task, 
            title, 
            description, 
            deadLine: deadLine || undefined, 
            startTime: startTime || undefined,
            duration: duration ? parseInt(duration) : undefined,
            status 
        });
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <TextArea 
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24"
                />

                <Divider label="Timing & Schedule" />

                <div className="grid grid-cols-3 gap-4">
                    <TextInput 
                        label="Deadline"
                        type="datetime-local"
                        value={deadLine}
                        onChange={(e) => setDeadLine(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                    />

                    <TextInput 
                        label="Start Time (auto set if left blank)"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                    />

                    <TextInput 
                        label="Duration in minutes (default is 60)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                    />
                </div>

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