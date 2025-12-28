import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TaskPage from './pages/task/TaskPage';
import Calendar from './pages/calendar/Calendar';
import Login from './pages/auth/Login';
import './App.css';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/task" element={<TaskPage />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </Layout>
    );
}

export default App;