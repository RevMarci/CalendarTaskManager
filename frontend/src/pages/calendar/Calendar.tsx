import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService, type CalendarEvent } from '../../services/eventService';
import CalendarModal from './CalendarModal';
import AddButton from '../../components/buttons/AddButton';

import '../../styles/Calendar.css';

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