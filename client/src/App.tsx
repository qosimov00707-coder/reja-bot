import { Routes, Route, Navigate } from 'react-router-dom';
import { trpc } from './main';
import DashboardLayout from './components/DashboardLayout';
import Today from './pages/Today';
import Progress from './pages/Progress';
import Weekly from './pages/Weekly';
import Monthly from './pages/Monthly';
import Calendar from './pages/Calendar';
import Schedule from './pages/Schedule';
import Mosques from './pages/Mosques';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[oklch(0.08_0.014_285)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.72_0.18_160)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout user={user}>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/monthly" element={<Monthly />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/mosques" element={<Mosques />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
