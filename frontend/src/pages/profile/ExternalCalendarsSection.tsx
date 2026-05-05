import { useState, useEffect } from 'react';
import { externalCalendarService, type ExternalCalendar } from '../../services/externalCalendarService';
import TextInput from '../../components/inputs/TextInput';
import SaveButton from '../../components/buttons/SaveButton';
import ColorInput from '../../components/inputs/ColorInput';

export default function ExternalCalendarsSection() {
    const [calendars, setCalendars] = useState<ExternalCalendar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [color, setColor] = useState('#3B82F6');
    
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadCalendars();
    }, []);

    const loadCalendars = async () => {
        try {
            const data = await externalCalendarService.getAll();
            setCalendars(data);
        } catch (error) {
            console.error("Failed to load external calendars", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSaving(true);

        try {
            await externalCalendarService.create({ name, url, color });
            setMessage({ type: 'success', text: 'Calendar added successfully!' });
            
            setName('');
            setUrl('');
            setColor('#3B82F6');
            
            await loadCalendars();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to add calendar.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this calendar? All imported events will be removed.')) return;
        
        try {
            await externalCalendarService.delete(id);
            await loadCalendars();
        } catch (err: any) {
            alert('Failed to delete calendar.');
        }
    };

    if (isLoading) return <div className="text-gray-400">Loading external calendars...</div>;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
                External Calendars (ICS)
            </h2>
            <p className="text-sm text-gray-400 mb-6">
                Import and sync events from external calendars like Google Calendar or Apple Calendar.
            </p>

            <div className="space-y-3 mb-8">
                {calendars.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">No external calendars configured yet.</div>
                ) : (
                    calendars.map(cal => (
                        <div key={cal.id} className="bg-transparent border border-gray-800 hover:border-gray-700 transition-colors rounded-lg p-4 flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.color || '#3B82F6' }}></div>
                                    <span className="font-medium text-gray-200">{cal.name}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs sm:max-w-md">
                                    {cal.url}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Last synced: {cal.lastSyncedAt ? new Date(cal.lastSyncedAt).toLocaleString() : 'Never'}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(cal.id)}
                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                title="Remove calendar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAdd} className="space-y-4 bg-black/50 p-5 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-300">Add New Calendar</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput 
                        label="Calendar Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Work Calendar"
                        required
                    />
                    
                    <ColorInput label="Color" value={color} onChange={setColor} />
                </div>

                <TextInput 
                    label="ICS URL"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                    required
                />

                {message && (
                    <div className={`p-3 rounded text-sm ${
                        message.type === 'success' 
                            ? 'bg-green-900/20 text-green-400 border border-green-800' 
                            : 'bg-red-900/20 text-red-400 border border-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-2">
                    <SaveButton type="submit" disabled={isSaving}>
                        {isSaving ? 'Adding...' : 'Add Calendar'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}
