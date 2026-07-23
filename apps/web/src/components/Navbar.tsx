import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Tv, Activity, LogOut, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  userEmail?: string;
  onLogout: () => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userEmail, onLogout, isTvMode, onToggleTvMode }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group tv-focus-ring rounded-lg p-1">
        <div className="w-9 h-9 bg-[#E50914] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-red-900/40">
          N
        </div>
        <span className="font-bold text-xl tracking-wider text-white">
          NIK <span className="text-[#E50914]">STREAMX</span>
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-white transition tv-focus-ring px-3 py-1.5 rounded-lg"
        >
          <Film className="w-4 h-4 text-[#E50914]" /> Catalog
        </Link>
        <Link
          to="/diagnostics"
          className="flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-white transition tv-focus-ring px-3 py-1.5 rounded-lg"
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
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <span className="text-xs text-[#94A3B8] font-mono">{userEmail}</span>
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
            className="px-4 py-2 bg-[#E50914] text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition tv-focus-ring"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};
