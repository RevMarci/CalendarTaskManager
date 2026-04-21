import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../../services/boardService';
import { taskService } from '../../services/taskService';
import { taskGroupService } from '../../services/taskGroupService';
import type { TaskGroup } from '../../models/TaskGroup';
import type { TaskBoard } from '../../models/TaskBoard';
import type { Task as TaskModel } from '../../models/Task';
import type { TaskStatus } from '../../models/TaskStatus';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
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

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (type === 'group') {
            if (destination.index === source.index) return;
            
            const sortedGroups = [...groups].sort((a, b) => (a.position || 0) - (b.position || 0));
            const [movedGroup] = sortedGroups.splice(source.index, 1);
            sortedGroups.splice(destination.index, 0, movedGroup);

            sortedGroups.forEach((g, idx) => g.position = idx);
            
            setGroups(sortedGroups);

            const groupId = Number(draggableId.replace('group-', ''));
            try {
                await taskGroupService.update(groupId, { position: destination.index });
            } catch (error) {
                console.error("Group drag failed", error);
                alert("Failed to save column position.");
                loadBoardData(Number(boardId));
            }
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceGroupId = Number(source.droppableId);
        const destGroupId = Number(destination.droppableId);
        const taskId = Number(draggableId);

        const newGroups = [...groups];
        const sourceGroupIndex = newGroups.findIndex(g => g.id === sourceGroupId);
        const destGroupIndex = newGroups.findIndex(g => g.id === destGroupId);

        const sourceGroup = { ...newGroups[sourceGroupIndex] };
        const destGroup = sourceGroupId === destGroupId ? sourceGroup : { ...newGroups[destGroupIndex] };

        const sourceTasks = [...(sourceGroup.Tasks || [])].sort((a, b) => (a.position || 0) - (b.position || 0));
        const destTasks = sourceGroupId === destGroupId ? sourceTasks : [...(destGroup.Tasks || [])].sort((a, b) => (a.position || 0) - (b.position || 0));

        const [movedTask] = sourceTasks.splice(source.index, 1);
        movedTask.taskGroupId = destGroupId;

        destTasks.splice(destination.index, 0, movedTask);

        sourceTasks.forEach((t, idx) => t.position = idx);
        if (sourceGroupId !== destGroupId) {
            destTasks.forEach((t, idx) => t.position = idx);
        }

        sourceGroup.Tasks = sourceTasks;
        if (sourceGroupId !== destGroupId) destGroup.Tasks = destTasks;
        newGroups[sourceGroupIndex] = sourceGroup;
        if (sourceGroupId !== destGroupId) newGroups[destGroupIndex] = destGroup;

        setGroups(newGroups);

        try {
            await taskService.update(taskId, {
                taskGroupId: destGroupId,
                position: destination.index
            });
        } catch (error) {
            console.error("Drag update failed", error);
            alert("Nem sikerült elmenteni a pozíciót.");
            loadBoardData(Number(boardId));
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
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="board" type="group" direction="horizontal">
                        {(provided) => (
                            <div 
                                className="h-full flex flex-row"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {[...groups].sort((a, b) => (a.position || 0) - (b.position || 0)).map((group, index) => (
                                    <TaskGroupColumn 
                                        key={group.id} 
                                        index={index}
                                        group={group} 
                                        onTaskStatusChange={handleTaskStatusChange}
                                        onTaskClick={handleTaskClick}
                                        onTitleChange={handleGroupTitleChange}
                                        onAddTask={handleAddTask}
                                    />
                                ))}
                                
                                {provided.placeholder}
                                
                                <AddGroupColumn onAdd={handleAddGroup} />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
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
