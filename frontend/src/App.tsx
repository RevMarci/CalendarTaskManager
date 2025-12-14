import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Calendar from './pages/calendar/Calendar';
import Task from './pages/task/TaskPage';

function App() {
    return (
        <div className="flex h-screen bg-gray-100">
            
            <Sidebar />

            <main className="flex-1 p-6 bg-black text-white h-screen overflow-hidden">
                <div className="h-full w-full">
                    <Routes>
                        <Route path="/" element={<h1 className="text-3xl font-bold text-gray-800">Üdv az Appban!</h1>} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/task" element={<Task />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;