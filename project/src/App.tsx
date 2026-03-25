import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { TeamGame } from './components/TeamGame';
import { AdminDashboard } from './components/AdminDashboard';
import { MusicPlayer } from './components/MusicPlayer';
import { Loader } from 'lucide-react';

const AppContent = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login />
        <MusicPlayer />
      </>
    );
  }

  if (isAdmin) {
    return (
      <>
        <AdminDashboard />
        <MusicPlayer />
      </>
    );
  }

  return (
    <>
      <TeamGame />
      <MusicPlayer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
