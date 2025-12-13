import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../models/Task';
import type { TaskStatus } from '../models/TaskStatus';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        setLoading(true);
        taskService.getAll()
            .then(data => setTasks(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const saveTask = async (taskData: Partial<Task>) => {
        try {
            let savedTask: Task;
            
            if (taskData.id) {
                savedTask = await taskService.update(taskData.id, taskData);

                setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
            } else {
                savedTask = await taskService.create(taskData);
                setTasks(prev => [...prev, savedTask]);
            }
            return savedTask;
        } catch (err) {
            console.error(err);
            alert("Hiba a mentés során");
            throw err;
        }
    };

    const changeTaskStatus = async (id: number, newStatus: TaskStatus) => {
        try {
            const updatedTask = await taskService.update(id, { status: newStatus }); 

            setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            
        } catch (err) {
            alert("Nem sikerült a státusz frissítése");
        }
    };

    const deleteTask = async (id: number) => {
        if (!confirm("Biztosan törölni szeretnéd?")) return;
        try {
            await taskService.delete(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert("Hiba törléskor");
        }
    };

    return { 
        tasks, 
        loading, 
        error, 
        saveTask,
        changeTaskStatus,
        deleteTask,
        refresh: loadTasks 
    };
}