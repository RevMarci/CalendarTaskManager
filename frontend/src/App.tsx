import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TaskPage from './pages/task/TaskPage';
import BoardPage from './pages/task/BoardPage';
import Calendar from './pages/calendar/Calendar';
import ProfilePage from './pages/profile/ProfilePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './App.css';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/task" element={<TaskPage />} />
                <Route path="/board/:boardId" element={<BoardPage />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Layout>
    );
}

export default App;