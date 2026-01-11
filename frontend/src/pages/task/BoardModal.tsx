import { useState, useEffect } from 'react';
import type { TaskBoard } from '../../models/TaskBoard';
import Modal from '../../components/Modal';
import TextInput from '../../components/inputs/TextInput';
import DeleteButton from '../../components/buttons/DeleteButton';
import CancelButton from '../../components/buttons/CancelButton';
import SaveButton from '../../components/buttons/SaveButton';

interface BoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (board: Partial<TaskBoard>) => void;
    onDelete: (id: number) => void;
    board?: TaskBoard | null;
}

export default function BoardModal({ isOpen, onClose, onSave, onDelete, board }: BoardModalProps) {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (board) {
            setTitle(board.title);
        } else {
            setTitle('');
        }
    }, [board, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...board, title });
        onClose();
    };

    const handleDelete = () => {
        if (board?.id) {
            onDelete(board.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={board ? 'Edit Board' : 'New Board'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput 
                    label="Board Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                />

                <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                    <div>
                        {board && (
                            <DeleteButton type="button" onClick={handleDelete}>
                                Delete Board
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