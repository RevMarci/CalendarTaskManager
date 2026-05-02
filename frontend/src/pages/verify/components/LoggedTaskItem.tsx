import { useState } from 'react';

interface Props {
    task: any;
}

export default function LoggedTaskItem({ task }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(task, null, 2));
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
                    {task.status === 'completed' ? '✓ ' : '○ '}{task.title}
                </h4>
                <div className="flex items-center gap-3">
                    {copied && (
                        <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded animate-pulse">
                            Copied!
                        </span>
                    )}
                    {task.status && (
                        <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                            task.status === 'completed' 
                                ? 'bg-green-900/40 text-green-300 border border-green-800' 
                                : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}>
                            {task.status}
                        </span>
                    )}
                </div>
            </div>
            
            {task.description && (
                <p className="text-base text-gray-300 mt-2 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex gap-6 mt-4 text-sm text-gray-400">
                {task.startTime && (
                    <span>Start: <span className="text-gray-200 font-medium">{new Date(task.startTime).toLocaleString()}</span></span>
                )}
                {task.duration && (
                    <span>Duration: <span className="text-gray-200 font-medium">{task.duration} min</span></span>
                )}
            </div>
        </div>
    );
}
