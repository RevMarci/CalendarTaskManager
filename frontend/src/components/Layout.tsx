import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {!isAuthPage && isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-70 transition-opacity md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {!isAuthPage && (
                <div 
                    className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-800 bg-black transition duration-300 ease-in-out md:static md:translate-x-0 ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>
            )}
            
            <main className="flex-1 flex flex-col overflow-hidden bg-black relative">
                {!isAuthPage && (
                    <header className="flex items-center justify-between border-b border-gray-800 p-4 md:hidden z-10">
                        <span className="text-xl font-bold">Menu</span>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </header>
                )}

                <div className={`flex-1 overflow-auto p-4 md:p-8 ${isAuthPage ? 'flex items-center justify-center' : 'mx-auto w-full'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
