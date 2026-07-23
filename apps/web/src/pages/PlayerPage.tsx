import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ShakaPlayer } from '../components/ShakaPlayer';

interface PlayerPageProps {
  isTvMode: boolean;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({ isTvMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { streamUrl?: string; title?: string } | null;
  const streamUrl = state?.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  const title = state?.title || 'Big Buck Bunny (Legal HLS Demo)';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-30 p-3 bg-black/60 hover:bg-white/20 text-white rounded-full transition tv-focus-ring flex items-center justify-center backdrop-blur border border-white/20"
        title="Back to Catalog"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 w-full h-full">
        <ShakaPlayer streamUrl={streamUrl} title={title} isTvMode={isTvMode} />
      </div>
    </div>
  );
};
