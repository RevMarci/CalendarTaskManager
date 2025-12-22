import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TaskPage from './pages/task/TaskPage';
import Calendar from './pages/calendar/Calendar';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/tasks" replace />} />
                    <Route path="/tasks" element={<TaskPage />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;