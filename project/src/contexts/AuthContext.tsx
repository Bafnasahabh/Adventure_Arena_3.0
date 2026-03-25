import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Team } from '../lib/supabase';

export type User = {
  id: string;
  email?: string;
  role?: string;
};

interface AuthContextType {
  user: User | null;
  team: Team | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (teamId: string, accessCode: string) => Promise<{ success: boolean; error?: string }>;
  signInAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing session
    const session = localStorage.getItem('adventure_arena_session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setUser(parsedSession.user);

        if (parsedSession.user.id === 'admin') {
          setIsAdmin(true);
          setLoading(false);
        } else {
          loadTeamData(parsedSession.user.id);
        }
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadTeamData = async (userId: string) => {
    try {
      const data = await api.get(`/api/teams/${userId}`);
      if (data && data.team_id) {
        setTeam(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (teamId: string, accessCode: string) => {
    try {
      const data = await api.post('/api/auth/login', { teamId, accessCode });

      const newUser = { id: teamId, role: 'team' };
      setUser(newUser);
      setTeam(data);

      localStorage.setItem('adventure_arena_session', JSON.stringify({ user: newUser }));

      return { success: true };
    } catch (error) {
      // api.post() throws Error(await res.text()), so message often is JSON.
      const msg = error instanceof Error ? error.message : String(error);
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.error) return { success: false, error: parsed.error };
      } catch {
        // ignore JSON parse errors
      }

      if (msg.toLowerCase().includes('failed to fetch')) {
        return { success: false, error: 'Cannot reach backend API. Check VITE_API_URL.' };
      }

      return { success: false, error: msg || 'Invalid team ID or access code' };
    }
  };

  const signInAdmin = async (email: string, password: string) => {
    try {
      if (email === 'Bafnasahabh@admin.com' && password === 'Bafna1305') {
        const newUser = { id: 'admin', email: 'Bafnasahabh@admin.com', role: 'admin' };
        setUser(newUser);
        setIsAdmin(true);
        localStorage.setItem('adventure_arena_session', JSON.stringify({ user: newUser }));
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials.' };
    } catch (error) {
      return { success: false, error: 'Admin login failed' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('adventure_arena_session');
    setUser(null);
    setTeam(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, team, isAdmin, loading, signIn, signInAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

