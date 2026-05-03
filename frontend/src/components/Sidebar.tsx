import { Link } from "react-router-dom";

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    return (
        <aside className="w-full h-full bg-black text-white p-4 flex flex-col">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Menu</h2>
          
                    <button 
                        className="md:hidden text-gray-400 hover:text-white focus:outline-none" 
                        onClick={onClose}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
        
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                to="/calendar" 
                                className="block p-2 rounded hover:bg-gray-900 transition-colors"
                                onClick={onClose}
                            >
                                Calendar
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/task" 
                                className="block p-2 rounded hover:bg-gray-900 transition-colors"
                                onClick={onClose}
                            >
                                Task
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/verify" 
                                className="block p-2 rounded hover:bg-gray-900 transition-colors"
                                onClick={onClose}
                            >
                                Verification
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="mt-auto">
                <Link 
                    to="/profile" 
                    className="block p-2 rounded hover:bg-gray-900 transition-colors"
                    onClick={onClose}
                >
                    Profile
                </Link>
            </div>
        </aside>
    );
}
