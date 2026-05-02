interface Props {
    isVerified: boolean;
    transactionHash?: string;
    message?: string;
}

export default function VerificationStatus({ isVerified, transactionHash, message }: Props) {
    const polygonscanUrl = transactionHash 
        ? `https://amoy.polygonscan.com/tx/${transactionHash}` 
        : null;

    const statusConfig = isVerified
        ? {
            containerClass: "bg-green-900/20 border-green-800",
            titleClass: "text-green-400",
            title: "✅ Verified (Blockchain Match)",
            descClass: "text-green-300/70"
        }
        : {
            containerClass: "bg-red-900/20 border-red-800",
            titleClass: "text-red-400",
            title: "❌ Verification Failed",
            descClass: "text-red-300/70"
        };

    return (
        <div className={`p-4 rounded-lg border ${statusConfig.containerClass} mb-6`}>
            <div className="flex flex-col">
                <span className={`font-bold text-lg mb-1 ${statusConfig.titleClass}`}>
                    {statusConfig.title}
                </span>
                
                {message && (
                    <span className={`text-sm mb-3 ${statusConfig.descClass}`}>
                        {message}
                    </span>
                )}
                
                {polygonscanUrl && (
                    <div className="mt-2 pt-3 border-t border-black/20">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                            Transaction Hash
                        </span>
                        <a 
                            href={polygonscanUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline break-all text-sm font-mono"
                        >
                            {transactionHash}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
