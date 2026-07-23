import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Tv, Activity, LogOut, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchHealth } from '../api/client';

interface NavbarProps {
  userEmail?: string;
  onLogout: () => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userEmail, onLogout, isTvMode, onToggleTvMode }) => {
  const navigate = useNavigate();
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group tv-focus-ring rounded-lg p-1">
        <div className="w-10 h-10 bg-[#E50914] rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-red-900/50">
          N
        </div>
        <span className="font-bold text-xl tracking-wider text-white">
          NIK <span className="text-[#E50914]">STREAMX</span>
        </span>
      </Link>

      {/* Backend Status & Navigation */}
      <div className="flex items-center gap-6">
        {/* Backend Health Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs">
          <span className="text-[#94A3B8]">Backend:</span>
          {backendHealthy === null ? (
            <span className="text-yellow-400 font-mono">Checking...</span>
          ) : backendHealthy ? (
            <span className="text-green-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          ) : (
            <span className="text-red-400 font-mono font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Standalone Demo Mode
            </span>
          )}
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#E50914] transition px-3 py-1.5 rounded-lg tv-focus-ring"
          >
            <Film className="w-4 h-4 text-[#E50914]" /> Catalog
          </Link>

          <Link
            to="/diagnostics"
            className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-[#00F2FE] transition px-3 py-1.5 rounded-lg tv-focus-ring"
          >
            <Activity className="w-4 h-4 text-[#00F2FE]" /> Diagnostics
          </Link>

          {/* TV Mode Toggle Button */}
          <button
            onClick={onToggleTvMode}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition border tv-focus-ring ${
              isTvMode
                ? 'bg-[#00F2FE]/20 border-[#00F2FE] text-[#00F2FE]'
                : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            {isTvMode ? 'TV Mode ON' : 'TV Mode OFF'}
          </button>

          {userEmail ? (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">{userEmail}</span>
              <button
                onClick={() => {
                  onLogout();
                  navigate('/login');
                }}
                className="p-2 text-[#94A3B8] hover:text-[#E50914] transition tv-focus-ring rounded-lg"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#E50914] text-white font-semibold text-xs rounded-lg hover:bg-red-700 transition tv-focus-ring"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
