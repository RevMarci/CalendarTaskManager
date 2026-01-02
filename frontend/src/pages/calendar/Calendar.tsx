import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService, type CalendarEvent } from '../../services/eventService';
import { taskService } from '../../services/taskService';
import type { Task } from '../../models/Task';
import CalendarModal from './CalendarModal';
import TaskModal from '../task/TaskModal';
import AddButton from '../../components/buttons/AddButton';

import '../../styles/Calendar.css';

export default function Calendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [initialDateRange, setInitialDateRange] = useState<{ start: string; end: string; allDay: boolean } | null>(null);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const [calendarEvents, fetchedTasks] = await Promise.all([
                eventService.getAll(),
                taskService.getAll()
            ]);

            setTasks(fetchedTasks);

            const taskEvents = fetchedTasks
                .filter(task => task.startTime && task.duration && task.status === 'pending')
                .map(task => {
                    const startDate = new Date(task.startTime!);
                    const endDate = new Date(startDate.getTime() + (task.duration! * 60 * 1000));
                    
                    return {
                        id: `task-${task.id}`,
                        title: `📝 ${task.title}`,
                        start: task.startTime!,
                        end: endDate.toISOString(),
                        allDay: false,
                        backgroundColor: '#10B981',
                        borderColor: '#059669',
                        extendedProps: {
                            type: 'task',
                            description: task.description,
                            originalId: task.id
                        }
                    } as any as CalendarEvent;
                });

            setEvents([...calendarEvents, ...taskEvents]);
        } catch (error) {
            console.error("Error loading items: ", error);
        }
    };

    const handleNewEventClick = () => {
        setSelectedEvent(null);
        setInitialDateRange(null);
        setIsCalendarModalOpen(true);
    };

    const handleDateSelect = (selectInfo: any) => {
        setSelectedEvent(null);
        setInitialDateRange({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        });
        setIsCalendarModalOpen(true);
    };

    const handleEventClick = (clickInfo: any) => {
        if (clickInfo.event.extendedProps.type === 'task') {
            const originalId = clickInfo.event.extendedProps.originalId;
            const task = tasks.find(t => t.id === originalId);
            
            if (task) {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
            }
            return;
        }

        const event = events.find(e => e.id === clickInfo.event.id);
        if (event) {
            setSelectedEvent(event);
            setInitialDateRange(null);
            setIsCalendarModalOpen(true);
        }
    };

    const handleEventSave = async (eventData: Partial<CalendarEvent>) => {
        try {
            if (eventData.id) {
                await eventService.update(eventData.id, eventData);
            } else {
                await eventService.create(eventData);
            }
            await loadEvents();
        } catch (error) {
            alert("Error while saving event.");
        }
    };

    const handleEventDelete = async (id: string) => {
        try {
            await eventService.delete(id);
            await loadEvents();
        } catch (error) {
            alert("Error while deleting event.");
        }
    };

    const handleTaskSave = async (taskData: Partial<Task>) => {
        try {
            if (taskData.id) {
                await taskService.update(taskData.id, taskData);
            } else {
                await taskService.create(taskData);
            }
            await loadEvents();
        } catch (error) {
            alert("Error while saving task.");
        }
    };

    const handleTaskDelete = async (id: number) => {
        try {
            await taskService.delete(id);
            await loadEvents();
        } catch (error) {
            alert("Error while deleting task.");
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-white">Calendar</h1>
                <AddButton onClick={handleNewEventClick}>
                    + New Event
                </AddButton>
            </div>

            <div className="flex-1 min-h-0 bg-black text-gray-200">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    firstDay={1}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClassNames={(arg) => {
                        if (arg.event.extendedProps.type === 'task') return ['custom-task-event'];
                        if (arg.event.allDay) return ['custom-allday-event'];
                        return ['custom-timed-event'];
                    }}
                    height="100%"
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                />
            </div>

            <CalendarModal 
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                onSave={handleEventSave}
                onDelete={handleEventDelete}
                event={selectedEvent}
                initialDateRange={initialDateRange}
            />

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
                task={selectedTask}
            />
        </div>
    );
}