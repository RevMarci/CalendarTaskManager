import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../../services/eventService';
import Modal from '../../components/Modal';
import TextInput from '../../components/inputs/TextInput';
import TextArea from '../../components/inputs/TextArea';
import Checkbox from '../../components/inputs/Checkbox';
import DeleteButton from '../../components/buttons/DeleteButton';
import CancelButton from '../../components/buttons/CancelButton';
import SaveButton from '../../components/buttons/SaveButton';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Partial<CalendarEvent>) => void;
    onDelete: (id: string) => void;
    event?: CalendarEvent | null;
    initialDateRange?: { start: string; end: string; allDay: boolean } | null;
}

export default function CalendarModal({ isOpen, onClose, onSave, onDelete, event, initialDateRange }: CalendarModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [allDay, setAllDay] = useState(false);

    const formatDateForInput = (dateStr: string | Date) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (isOpen) {
            if (event) {
                setTitle(event.title);
                setDescription(event.description || '');
                setStart(formatDateForInput(event.start));
                setEnd(formatDateForInput(event.end));
                setAllDay(event.allDay || false);
            } else if (initialDateRange) {
                setTitle('');
                setDescription('');
                setStart(formatDateForInput(initialDateRange.start));
                setEnd(formatDateForInput(initialDateRange.end));
                setAllDay(initialDateRange.allDay);
            } else {
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                
                setTitle('');
                setDescription('');
                setStart(formatDateForInput(now));
                setEnd(formatDateForInput(oneHourLater));
                setAllDay(false);
            }
        }
    }, [event, isOpen, initialDateRange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const eventData: Partial<CalendarEvent> = {
            ...event,
            title,
            description,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
            allDay
        };

        onSave(eventData);
        onClose();
    };

    const handleDelete = () => {
        if (event?.id && confirm('You sure you want to delete this event?')) {
            onDelete(event.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? 'Edit event' : 'New event'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <TextInput 
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <Checkbox 
                    label="All Day Event"
                    checked={allDay}
                    onChange={setAllDay}
                />

                <div className="grid grid-cols-2 gap-4">
                    <TextInput 
                        label="Start"
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                    
                    <TextInput 
                        label="End"
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                </div>

                <TextArea 
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24"
                />

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-900">
                    <div>
                        {event && (
                            <DeleteButton type="button" onClick={handleDelete}>
                                Delete
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