import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {!isAuthPage && (
                <div className="w-64 flex-shrink-0 border-r border-gray-800 bg-black h-full">
                    <Sidebar />
                </div>
            )}
            
            <main className="flex-1 overflow-auto bg-black p-8 relative">
                <div className={`h-full ${isAuthPage ? 'flex items-center justify-center' : 'max-w-7xl mx-auto'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}