import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService, type CalendarEvent } from '../../services/eventService';
import CalendarModal from './CalendarModal';
import AddButton from '../../components/buttons/AddButton';

export default function Calendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [initialDateRange, setInitialDateRange] = useState<{ start: string; end: string; allDay: boolean } | null>(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleNewEventClick = () => {
        setSelectedEvent(null);
        setInitialDateRange(null);
        setIsModalOpen(true);
    };

    const handleDateSelect = (selectInfo: any) => {
        setSelectedEvent(null);
        setInitialDateRange({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        });
        setIsModalOpen(true);
    };

    const handleEventClick = (clickInfo: any) => {
        const event = events.find(e => e.id === clickInfo.event.id);
        if (event) {
            setSelectedEvent(event);
            setInitialDateRange(null);
            setIsModalOpen(true);
        }
    };

    const handleSave = async (eventData: Partial<CalendarEvent>) => {
        try {
            if (eventData.id) {
                await eventService.update(eventData.id, eventData);
            } else {
                await eventService.create(eventData);
            }
            await loadEvents();
        } catch (error) {
            alert("Error while saving.");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await eventService.delete(id);
            await loadEvents();
        } catch (error) {
            alert("Error while deleting.");
            console.error(error);
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
                <style>{`
                    :root {
                        --fc-border-color: #1f2937;
                        --fc-page-bg-color: black;
                        --fc-neutral-bg-color: black;
                        --fc-list-event-hover-bg-color: #1f2937;
                    }
                    
                    .fc-header-toolbar {
                        margin-bottom: 1rem !important;
                    }

                    .fc .fc-button-primary {
                        background-color: transparent;
                        border-color: #1f2937;
                        color: #9ca3af;
                        text-transform: capitalize;
                        font-weight: 500;
                    }
                    .fc .fc-button-primary:hover {
                        background-color: #111827;
                        color: white;
                    }
                    .fc .fc-button-primary:not(:disabled).fc-button-active,
                    .fc .fc-button-primary:not(:disabled):active {
                        background-color: #1e3a8a20;
                        border-color: #1e3a8a;
                        color: #60a5fa;
                    }
                    .fc-col-header-cell-cushion { color: #9ca3af; font-size: 0.75rem; text-transform: uppercase; padding: 10px 0; }
                    .fc-daygrid-day-number { color: #d1d5db; padding: 8px; }
                    .fc .fc-daygrid-day.fc-day-today { background-color: #1e3a8a10; }
                    
                    .fc-event {
                        cursor: pointer;
                        border: none;
                        border-radius: 4px;
                        transition: filter 0.2s;
                    }
                    .fc-event:hover {
                        filter: brightness(1.2);
                    }
                    .fc-event-main { color: #e5e7eb; padding: 2px 4px; font-weight: 500; font-size: 0.75rem; }

                    .custom-timed-event {
                        background-color: #1e3a8a40 !important;
                        border-left: 3px solid #1e3a8a !important;
                    }
                    .custom-timed-event .fc-event-main { color: #93c5fd; }

                    .custom-allday-event {
                        background-color: #581c87 !important;
                        border: 1px solid #7e22ce !important;
                    }
                    .custom-allday-event .fc-event-main { color: #e9d5ff; text-align: center; font-weight: bold; }
                `}</style>

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
                        if (arg.event.allDay) {
                            return [ 'custom-allday-event' ];
                        }
                        return [ 'custom-timed-event' ];
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
                event={selectedEvent}
                initialDateRange={initialDateRange}
            />
        </div>
    );
}