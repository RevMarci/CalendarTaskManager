import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../../hooks/useBoards';
import BoardItem from './BoardItem';
import AddButton from '../../components/buttons/AddButton';
import BoardModal from './BoardModal';
import type { TaskBoard } from '../../models/TaskBoard';

export default function TaskPage() {
    const { boards, error, loading, saveBoard, deleteBoard } = useBoards();
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<TaskBoard | null>(null);

    const openNewModal = () => {
        setEditingBoard(null);
        setIsModalOpen(true);
    };
    
    const handleBoardClick = (board: TaskBoard) => {
        navigate(`/board/${board.id}`);
    };

    if (loading) return <div className="p-6 text-gray-400">Loading boards...</div>;
    if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

    return (
        <div className="max-w-full mx-auto p-0">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Boards</h1>
                    <p className="text-gray-400 mt-1">Select a board to view tasks</p>
                </div>
                <AddButton onClick={openNewModal}>
                    + New Board
                </AddButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {boards.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        You don't have any task boards yet. Create one to get started!
                    </div>
                ) : (
                    boards.map((board) => (
                        <BoardItem 
                            key={board.id}
                            board={board}
                            onClick={handleBoardClick}
                        />
                    ))
                )}
            </div>

            <BoardModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={saveBoard}
                onDelete={deleteBoard}
                board={editingBoard}
            />
        </div>
    );
}