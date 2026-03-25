import { useState } from 'react';
import { Lock, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInAdmin } = useAuth();

  const handleTeamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(teamId, accessCode);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signInAdmin(email, password);

    if (!result.success) {
      setError(result.error || 'Admin login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/assets/ship.png" alt="Pirate Ship" className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-amber-300 mb-2 tracking-wider font-serif pb-2 drop-shadow-md">
            Pirate's Treasure Hunt
          </h1>
          <p className="text-amber-200 text-lg italic">Enter your credentials to begin the treasure hunt</p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md rounded-lg shadow-2xl border-2 border-amber-700/50 overflow-hidden">
          <div className="flex border-b-2 border-amber-700/50">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                !isAdminLogin
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
              }`}
            >
              <Users className="w-5 h-5" />
              Team Login
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                isAdminLogin
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
              }`}
            >
              <Lock className="w-5 h-5" />
              Admin
            </button>
          </div>

          <div className="p-6">
            {!isAdminLogin ? (
              <form onSubmit={handleTeamLogin} className="space-y-4">
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">
                    Team ID
                  </label>
                  <input
                    type="text"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    placeholder="Enter your team ID"
                    className="w-full px-4 py-3 bg-stone-800 border-2 border-amber-700/50 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">
                    Access Code
                  </label>
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter your access code"
                    className="w-full px-4 py-3 bg-stone-800 border-2 border-amber-700/50 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mt-4"
                >
                  {loading ? 'Preparing Ship...' : 'Start Treasure Hunt!'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Bafnasahabh@admin.com"
                    className="w-full px-4 py-3 bg-stone-800 border-2 border-amber-700/50 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-stone-800 border-2 border-amber-700/50 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Logging in...' : 'Admin Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
