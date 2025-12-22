import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <div className="w-64 flex-shrink-0 border-r border-gray-800 bg-black h-full">
                <Sidebar />
            </div>
            
            <main className="flex-1 overflow-auto bg-black p-8 relative">
                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}