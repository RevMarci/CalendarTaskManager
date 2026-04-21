import { useState } from 'react';
import type { TaskGroup } from "../../models/TaskGroup";
import type { Task as TaskModel } from "../../models/Task";
import type { TaskStatus } from "../../models/TaskStatus";
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from "./Task";

interface TaskGroupColumnProps {
    group: TaskGroup;
    index: number;
    onTaskStatusChange: (taskId: number, newStatus: TaskStatus) => Promise<void>;
    onTaskClick: (task: TaskModel) => void;
    onTitleChange: (groupId: number, newTitle: string) => Promise<void>;
    onAddTask: (groupId: number) => void;
}

export default function TaskGroupColumn({ group, index, onTaskStatusChange, onTaskClick, onTitleChange, onAddTask }: TaskGroupColumnProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [titleInput, setTitleInput] = useState(group.title);

    const handleTitleClick = () => {
        setTitleInput(group.title);
        setIsEditing(true);
    };

    const handleTitleSave = async () => {
        if (!titleInput.trim() || titleInput === group.title) {
            setIsEditing(false);
            return;
        }

        await onTitleChange(group.id, titleInput);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setTitleInput(group.title);
        }
    };

    return (
        <Draggable draggableId={`group-${group.id}`} index={index}>
            {(provided) => (
                <div 
                    className="flex-shrink-0 w-80 h-full border-r border-gray-700 flex flex-col bg-black/20"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div 
                        className="p-4 border-b border-gray-800 flex justify-between items-center h-16 cursor-grab active:cursor-grabbing hover:bg-gray-800/30 transition-colors"
                        {...provided.dragHandleProps}
                    >
                        {isEditing ? (
                            <input
                                autoFocus
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={handleKeyDown}
                                className="flex-grow mr-2 bg-gray-900 border border-blue-500 rounded px-2 py-1 -ml-2 text-white text-lg focus:outline-none font-bold"
                            />
                        ) : (
                            <h3 
                                onClick={handleTitleClick}
                                className="font-bold text-white text-lg truncate cursor-pointer hover:bg-gray-700 rounded px-2 py-1 -ml-2 transition-colors border border-transparent hover:border-gray-600 flex-grow mr-2" 
                                title="Click to edit group title"
                            >
                                {group.title}
                            </h3>
                        )}
                        
                        <span className="text-gray-500 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                            {group.Tasks?.length || 0}
                        </span>
                    </div>

                    <div className="flex-grow p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        <Droppable droppableId={group.id.toString()}>
                            {(droppableProvided) => (
                                <ul 
                                    className="space-y-3 min-h-[50px]"
                                    {...droppableProvided.droppableProps}
                                    ref={droppableProvided.innerRef}
                                >
                                    {(group.Tasks ? [...group.Tasks].sort((a, b) => (a.position || 0) - (b.position || 0)) : []).map((task, taskIndex) => (
                                        <Task 
                                            key={task.id} 
                                            task={task} 
                                            index={taskIndex}
                                            onStatusChange={onTaskStatusChange}
                                            onClick={() => onTaskClick(task)}
                                        />
                                    ))}
                                    {droppableProvided.placeholder}
                                </ul>
                            )}
                        </Droppable>

                        <button 
                            onClick={() => onAddTask(group.id)}
                            className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <span className="text-xl leading-none font-bold">+</span> Add Task
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}