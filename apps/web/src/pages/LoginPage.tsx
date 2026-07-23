import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { loginUser } from '../api/client';
import { UserSession } from '../types';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@nikstreamx.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await loginUser(email, password);
      onLoginSuccess(session);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#E50914] rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-red-900/40">
            N
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to NIK STREAMX</h2>
          <p className="text-xs text-[#94A3B8]">Cinema Control Deck Secure Authentication</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94A3B8]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F2FE] text-sm tv-focus-ring"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94A3B8]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#94A3B8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F2FE] text-sm tv-focus-ring"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E50914] text-white font-semibold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 tv-focus-ring disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : <><ArrowRight className="w-4 h-4" /> Continue</>}
          </button>
        </form>
      </div>
    </div>
  );
};
