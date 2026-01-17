import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../../services/boardService';
import { taskService } from '../../services/taskService';
import { taskGroupService } from '../../services/taskGroupService';
import type { TaskGroup } from '../../models/TaskGroup';
import type { TaskBoard } from '../../models/TaskBoard';
import type { Task as TaskModel } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';
import TaskGroupColumn from './TaskGroupColumn';
import AddGroupColumn from './AddGroupColumn';
import TaskModal from './TaskModal';

export default function BoardPage() {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState<TaskBoard | null>(null);
    const [groups, setGroups] = useState<TaskGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskModel | null>(null);

    const [activeGroupId, setActiveGroupId] = useState<number | null>(null);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');

    useEffect(() => {
        if (!boardId) return;
        loadBoardData(Number(boardId));
    }, [boardId]);

    const loadBoardData = async (id: number) => {
        try {
            setLoading(true);
            const boardData = await boardService.getById(id);
            setBoard(boardData);
            if (boardData.TaskGroups) {
                setGroups(boardData.TaskGroups);
            } else {
                setGroups([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load board data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = (groupId: number) => {
        setActiveGroupId(groupId);
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleGroupTitleChange = async (groupId: number, newTitle: string) => {
        try {
            await taskGroupService.update(groupId, { title: newTitle });
            setGroups(prevGroups => prevGroups.map(group => 
                group.id === groupId ? { ...group, title: newTitle } : group
            ));
        } catch (error) {
            console.error("Failed to update group title", error);
            alert("Failed to update group title.");
        }
    };

    const handleTitleClick = () => {
        if (board) {
            setTitleInput(board.title);
            setIsEditingTitle(true);
        }
    };

    const handleTitleSave = async () => {
        if (!board || !titleInput.trim()) {
            setIsEditingTitle(false);
            return;
        }

        if (titleInput === board.title) {
            setIsEditingTitle(false);
            return;
        }

        try {
            await boardService.update(board.id, { title: titleInput });
            setBoard({ ...board, title: titleInput });
            setIsEditingTitle(false);
        } catch (error) {
            console.error("Failed to update board title", error);
            alert("Failed to update board title.");
        }
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false);
        }
    };

    const handleAddGroup = async (title: string) => {
        if (!board) return;
        
        const newGroup = await taskGroupService.create({ 
            title, 
            taskBoardId: board.id 
        });

        setGroups([...groups, { ...newGroup, Tasks: [] }]);
    };

    const handleTaskStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        try {
            await taskService.update(taskId, { status: newStatus });
            
            setGroups(currentGroups => currentGroups.map(group => ({
                ...group,
                Tasks: group.Tasks?.map(task => 
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            })));
        } catch (error) {
            console.error("Status update failed", error);
            alert("Failed to update task status");
        }
    };

    const handleTaskClick = (task: TaskModel) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleTaskSave = async (taskData: Partial<TaskModel>) => {
        try {
            if (taskData.id) {
                await taskService.update(taskData.id, taskData);
            } else {
                if (activeGroupId === null) {
                    alert("Error: There is no selected group!");
                    return;
                }
                await taskService.create({ ...taskData, taskGroupId: activeGroupId });
            }

            setIsModalOpen(false);
            setEditingTask(null);
            setActiveGroupId(null);
            await loadBoardData(Number(boardId));
        } catch (error) {
            console.error("Failed to save task", error);
            alert("Failed to save task.");
        }
    };

    const handleTaskDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await taskService.delete(id);
            setIsModalOpen(false);
            setEditingTask(null);
            await loadBoardData(Number(boardId));
        } catch (error) {
            console.error("Failed to delete task", error);
            alert("Failed to delete task.");
        }
    };

    if (loading) return <div className="p-6 text-gray-400">Loading board...</div>;
    if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
    if (!board) return <div className="p-6 text-gray-400">Board not found.</div>;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col -mt-8">
            <div className="flex justify-between items-center mb-0 px-6 pt-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-4 w-full">
                    <button 
                        onClick={() => navigate('/task')}
                        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                    >
                        ← Back
                    </button>
                    
                    <div className="flex-grow">
                        {isEditingTitle ? (
                            <input
                                autoFocus
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={handleTitleKeyDown}
                                className="text-3xl font-bold text-white bg-gray-900 border border-blue-500 rounded px-2 py-1 -ml-2 outline-none w-full max-w-md"
                            />
                        ) : (
                            <h1 
                                onClick={handleTitleClick}
                                className="text-3xl font-bold text-white cursor-pointer hover:bg-gray-800/50 rounded px-2 py-1 -ml-2 transition-colors inline-block border border-transparent hover:border-gray-700"
                                title="Click to edit board title"
                            >
                                {board.title}
                            </h1>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-x-auto overflow-y-hidden">
                <div className="h-full flex flex-row">
                    {groups.length === 0 && (
                        <div className="p-6 text-gray-500 italic absolute">
                            This board has no columns yet.
                        </div>
                    )}
                    
                    {groups.map(group => (
                        <TaskGroupColumn 
                            key={group.id} 
                            group={group} 
                            onTaskStatusChange={handleTaskStatusChange}
                            onTaskClick={handleTaskClick}
                            onTitleChange={handleGroupTitleChange}
                            onAddTask={handleAddTask}
                        />
                    ))}
                    
                    <AddGroupColumn onAdd={handleAddGroup} />
                </div>
            </div>

            <TaskModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
                task={editingTask}
            />
        </div>
    );
}