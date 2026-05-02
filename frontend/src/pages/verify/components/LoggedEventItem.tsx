import { useState } from 'react';

interface Props {
    event: any;
}

export default function LoggedEventItem({ event }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(event, null, 2));
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            onClick={handleCopy}
            title="Click to copy raw JSON"
            className="group relative bg-black/50 border border-gray-700 p-4 rounded hover:border-blue-900 transition-colors cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <h4 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">
                    {event.title}
                </h4>
                {copied && (
                    <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded animate-pulse">
                        Copied!
                    </span>
                )}
            </div>
            
            {event.description && (
                <p className="text-base text-gray-300 mt-2">{event.description}</p>
            )}
            
            <div className="flex flex-col gap-1.5 mt-4 text-sm text-gray-400">
                {event.start && (
                    <span>Start: <span className="text-gray-200 font-medium">{new Date(event.start).toLocaleString()}</span></span>
                )}
                {event.end && (
                    <span>End: <span className="text-gray-200 font-medium">{new Date(event.end).toLocaleString()}</span></span>
                )}
                {event.allDay && (
                    <span className="text-blue-400 font-medium mt-1">All Day Event</span>
                )}
            </div>
        </div>
    );
}
