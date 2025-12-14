import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../../services/eventService';

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

    if (!isOpen) return null;

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
        if (event && event.id) {
            if (confirm('Biztosan törölni szeretnéd ezt az eseményt?')) {
                onDelete(event.id);
                onClose();
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-black border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-2xl shadow-blue-900/10"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-6">
                    {event ? 'Esemény szerkesztése' : 'Új esemény'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors"
                        />
                    </div>

                    <div 
                        onClick={() => setAllDay(!allDay)}
                        className={`w-full bg-black flex items-center gap-3 cursor-pointer transition-all group ${
                            allDay
                        }`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            allDay 
                                ? 'bg-blue-600 border-blue-600 text-black' 
                                : 'border-gray-600 bg-transparent group-hover:border-gray-500'
                        }`}>
                            {allDay && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        
                        <span className={`text-sm font-medium select-none ${allDay ? 'text-blue-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                            All Day Event
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Start</label>
                            <input 
                                type="datetime-local" 
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                required
                                style={{ colorScheme: 'dark' }}
                                className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">End</label>
                            <input 
                                type="datetime-local" 
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                required
                                style={{ colorScheme: 'dark' }}
                                className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded p-2.5 text-white placeholder-gray-600 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900/50 transition-colors h-24 resize-none"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-900">
                        <div>
                            {event && (
                                <button 
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded text-sm font-medium border border-red-900 text-red-400 bg-red-900/10 hover:bg-red-900/30 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-4 py-2 rounded text-sm font-medium border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded text-sm font-medium border border-blue-900 text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 transition-colors cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}