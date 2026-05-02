import type { DailyLogData } from '../../services/dailyLogService';
import SaveButton from '../../components/buttons/SaveButton';
import Divider from '../../components/Divider';
import VerificationStatus from './components/VerificationStatus';
import LoggedTaskItem from './components/LoggedTaskItem';
import LoggedEventItem from './components/LoggedEventItem';

interface Props {
    data: DailyLogData;
    onBack: () => void;
}

export default function DailyLogResult({ data, onBack }: Props) {
    const { dailyLog, isVerified, transactionHash } = data;

    const handleDownload = () => {
        const fileData = {
            transactionHash: transactionHash,
            dailyLog: dailyLog
        };
        const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `daily-log-${dailyLog?.date || 'export'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!dailyLog) {
        return (
            <div className="p-6 text-gray-400">
                <button onClick={onBack} className="mb-4 text-blue-400 hover:text-white transition-colors">← Back</button>
                <p>No log data found to display.</p>
            </div>
        );
    }

    const tasks = dailyLog.tasks || [];
    const events = dailyLog.events || [];

    return (
        <div className="w-full h-[calc(100vh-8px)] flex flex-col -mt-8 -mb-8 bg-black">
            <div className="w-full flex justify-between items-center mb-0 px-6 pt-6 pb-4 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-4 w-full">
                    <button 
                        onClick={onBack}
                        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                    >
                        ← Back
                    </button>
                    
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-white">
                            Log Details
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Review your archived daily activity</p>
                    </div>

                    <div className="flex-shrink-0">
                        <SaveButton onClick={handleDownload} type="button">
                            Download JSON Archive
                        </SaveButton>
                    </div>
                </div>
            </div>

            <div className="w-full flex-grow overflow-y-auto px-6 pt-8 pb-16">
                <div className="w-full max-w-5xl mx-auto">
                    <VerificationStatus 
                        isVerified={isVerified} 
                        transactionHash={transactionHash}
                        message={isVerified ? "The contents of this log exactly match the fingerprint stored on the blockchain." : "Warning: This file's content has been altered or is not recorded on the blockchain."}
                    />

                    <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8">
                        <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Date</span>
                            <span className="text-gray-100 font-medium text-lg">{dailyLog.date}</span>
                        </div>
                        {dailyLog.userId && (
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">User ID</span>
                                <span className="text-gray-100 text-lg">{dailyLog.userId}</span>
                            </div>
                        )}
                        {(dailyLog.userEmail || dailyLog.email) && (
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Account</span>
                                <span className="text-gray-100 text-lg">{dailyLog.userEmail || dailyLog.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-10 w-full">
                        <Divider label={`Tasks (${tasks.length})`} align="left" className="!my-8" />
                        
                        {tasks.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {tasks.map((task: any, index: number) => (
                                    <LoggedTaskItem key={`task-${task.id || index}`} task={task} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic pl-2">No tasks recorded for this day.</p>
                        )}
                    </div>

                    <div className="mb-4 w-full">
                        <Divider label={`Calendar Events (${events.length})`} align="left" className="!my-8" />
                        
                        {events.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {events.map((event: any, index: number) => (
                                    <LoggedEventItem key={`event-${event.id || index}`} event={event} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic pl-2">No calendar events recorded for this day.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
