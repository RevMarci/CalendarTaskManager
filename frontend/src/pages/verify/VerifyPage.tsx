import { useState } from 'react';
import { dailyLogService, type DailyLogData } from '../../services/dailyLogService';
import DailyLogResult from './DailyLogResult';
import DateSearchForm from './DateSearchForm';
import FileVerifyForm from './FileVerifyForm';

export default function VerifyPage() {
    const [resultData, setResultData] = useState<DailyLogData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDateSearch = async (date: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await dailyLogService.getLogByDate(date);
            setResultData(data);
        } catch (err: any) {
            setError(err.message || 'Network or server error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileVerify = (file: File) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);

                if (!parsedData.dailyLog) {
                    setError("Invalid file format. Missing 'dailyLog' object!");
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setError(null);
                
                const result = await dailyLogService.verifyUploadedLog(parsedData.dailyLog);
                
                setResultData({
                    transactionHash: parsedData.transactionHash,
                    dailyLog: parsedData.dailyLog,
                    isVerified: result.isVerified
                });
                
            } catch (err: any) {
                setError(err.message || "Error processing the file. Is it a valid JSON?");
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError("Failed to read the file.");
        };

        reader.readAsText(file);
    };

    if (resultData) {
        return (
            <div className="w-full h-full block"> 
                <DailyLogResult data={resultData} onBack={() => setResultData(null)} />
            </div>
        );
    }

    return (
        <div className="w-full h-full p-8 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-white">Daily Activity Verification</h1>
            <p className="text-gray-400 mb-10 max-w-2xl text-center">
                Retrieve a verified daily log from your calendar, or upload a JSON archive file to check its authenticity against the blockchain.
            </p>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-8 w-full max-w-2xl shadow">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-xl text-blue-400 mt-10 animate-pulse">Processing request...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <DateSearchForm onSearch={handleDateSearch} isLoading={isLoading} />
                    <FileVerifyForm onVerify={handleFileVerify} isLoading={isLoading} />
                </div>
            )}
        </div>
    );
}
