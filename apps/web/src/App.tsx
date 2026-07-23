import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PlayerPage } from './pages/PlayerPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { UserSession } from './types';

export const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('nik_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isTvMode, setIsTvMode] = useState(false);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('nik_session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('nik_session');
  };

  // TV Remote D-Pad Keyboard Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTvMode) return;

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>('button, a, input, [tabindex="0"]')
      );
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusable.length;
        focusable[nextIndex]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        focusable[prevIndex]?.focus();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (window.location.pathname === '/player') {
          window.history.back();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-[#0D0F12] text-[#F0F4F8] ${isTvMode ? 'text-lg font-bold' : ''}`}>
        <Navbar
          userEmail={session?.user.email}
          onLogout={handleLogout}
          isTvMode={isTvMode}
          onToggleTvMode={() => setIsTvMode(!isTvMode)}
        />

        <main className="container mx-auto px-6 pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/player"
              element={<PlayerPage isTvMode={isTvMode} />}
            />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
