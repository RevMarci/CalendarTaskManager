import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../../services/eventService';
import Modal from '../../components/Modal';
import TextInput from '../../components/inputs/TextInput';
import TextArea from '../../components/inputs/TextArea';
import Checkbox from '../../components/inputs/Checkbox';
import SelectInput from '../../components/inputs/SelectInput';
import DeleteButton from '../../components/buttons/DeleteButton';
import CancelButton from '../../components/buttons/CancelButton';
import SaveButton from '../../components/buttons/SaveButton';
import { toLocalISOString } from '../../utils/dateUtils';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Partial<CalendarEvent>) => void;
    onDelete: (id: string) => void;
    event?: CalendarEvent | null;
    initialDateRange?: { start: string; end: string; allDay: boolean } | null;
}

type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export default function CalendarModal({ isOpen, onClose, onSave, onDelete, event, initialDateRange }: CalendarModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [recurrence, setRecurrence] = useState<RecurrenceType>('NONE');

    const formatDateForInput = (dateStr: string | Date) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const parseRruleToRecurrence = (rruleString?: string | null): RecurrenceType => {
        if (!rruleString) return 'NONE';
        if (rruleString.includes('FREQ=DAILY')) return 'DAILY';
        if (rruleString.includes('FREQ=WEEKLY')) return 'WEEKLY';
        if (rruleString.includes('FREQ=MONTHLY')) return 'MONTHLY';
        if (rruleString.includes('FREQ=YEARLY')) return 'YEARLY';
        return 'NONE';
    };

    const createRruleString = (type: RecurrenceType): string | null => {
        switch (type) {
            case 'DAILY': return 'FREQ=DAILY';
            case 'WEEKLY': return 'FREQ=WEEKLY';
            case 'MONTHLY': return 'FREQ=MONTHLY';
            case 'YEARLY': return 'FREQ=YEARLY';
            default: return null;
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (event) {
                setTitle(event.title);
                setDescription(event.description || '');
                setStart(toLocalISOString(event.start));
                setEnd(toLocalISOString(event.end));
                setAllDay(event.allDay || false);
                setRecurrence(parseRruleToRecurrence(event.rrule));
            } else if (initialDateRange) {
                setTitle('');
                setDescription('');
                setStart(toLocalISOString(initialDateRange.start));
                setEnd(toLocalISOString(initialDateRange.end));
                setAllDay(initialDateRange.allDay);
                setRecurrence('NONE');
            } else {
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                
                setTitle('');
                setDescription('');
                setStart(formatDateForInput(now));
                setEnd(formatDateForInput(oneHourLater));
                setAllDay(false);
                setRecurrence('NONE');
            }
        }
    }, [event, isOpen, initialDateRange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const targetId = event?.originalEventId ? String(event.originalEventId) : event?.id;

        const eventData: Partial<CalendarEvent> = {
            id: targetId, 
            title,
            description,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
            allDay,
            rrule: createRruleString(recurrence)
        };

        onSave(eventData);
        onClose();
    };

    const handleDelete = () => {
        const targetId = event?.originalEventId ? String(event.originalEventId) : event?.id;

        if (targetId && confirm('You sure you want to delete this event? (If it repeats, all instances will be deleted)')) {
            onDelete(targetId);
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

                <SelectInput
                    label="Repeat"
                    value={recurrence}
                    onChange={(val) => setRecurrence(val as RecurrenceType)}
                    options={[
                        { value: 'NONE', label: 'Does not repeat' },
                        { value: 'DAILY', label: 'Daily' },
                        { value: 'WEEKLY', label: 'Weekly' },
                        { value: 'MONTHLY', label: 'Monthly' },
                        { value: 'YEARLY', label: 'Yearly' },
                    ]}
                />

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
