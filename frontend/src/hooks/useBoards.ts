import { useState, useEffect } from 'react';
import { boardService } from '../services/boardService';
import type { TaskBoard } from '../models/TaskBoard';

export function useBoards() {
    const [boards, setBoards] = useState<TaskBoard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBoards();
    }, []);

    const loadBoards = () => {
        setLoading(true);
        boardService.getAll()
            .then(data => setBoards(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const saveBoard = async (boardData: Partial<TaskBoard>) => {
        try {
            let savedBoard: TaskBoard;
            
            if (boardData.id) {
                savedBoard = await boardService.update(boardData.id, boardData);
                setBoards(prev => prev.map(b => b.id === savedBoard.id ? savedBoard : b));
            } else {
                if (!boardData.title) throw new Error("Title is required");
                savedBoard = await boardService.create({ title: boardData.title });
                setBoards(prev => [savedBoard, ...prev]);
            }
            return savedBoard;
        } catch (err) {
            console.error(err);
            alert("Error while saving");
            throw err;
        }
    };

    const deleteBoard = async (id: number) => {
        if (!confirm("Are you sure you want to delete this board? All tasks in it will also be deleted!")) return;
        try {
            await boardService.delete(id);
            setBoards(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert("Error while deleting");
        }
    };

    return { 
        boards, 
        loading, 
        error, 
        saveBoard,
        deleteBoard,
        refresh: loadBoards 
    };
}