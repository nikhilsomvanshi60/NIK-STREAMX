import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Activity, RotateCcw, AlertTriangle } from 'lucide-react';
import { DiagnosticStats } from '../types';

interface ShakaPlayerProps {
  streamUrl: string;
  title: string;
  isTvMode?: boolean;
}

export const ShakaPlayer: React.FC<ShakaPlayerProps> = ({ streamUrl, title, isTvMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<DiagnosticStats>({
    protocol: 'HLS',
    resolution: '1920x1080',
    bitrate: '3.2 Mbps',
    fps: '60',
    bufferLength: 4.5,
    state: 'PLAYING',
  });

  useEffect(() => {
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      setErrorMsg('UNSUPPORTED_FORMAT: Browser does not support Media Source Extensions');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const player = new shaka.Player(video);
    playerRef.current = player;

    player.addEventListener('error', (event: any) => {
      const err = event.detail;
      console.error('Shaka Player Error:', err);
      setErrorMsg(`PLAYBACK_ERROR: Code ${err.code} (${err.category})`);
    });

    player.load(streamUrl).then(() => {
      setIsPlaying(true);
      setErrorMsg(null);
    }).catch((err: any) => {
      console.error('Error loading stream:', err);
      setErrorMsg(`SOURCE_UNAVAILABLE: ${err.message || 'Failed to load media manifest'}`);
    });

    // Update Diagnostics HUD interval
    const timer = setInterval(() => {
      if (player && video) {
        const statsData = player.getStats();
        setStats({
          protocol: streamUrl.includes('.mpd') ? 'DASH' : 'HLS',
          resolution: `${statsData.width || 1920}x${statsData.height || 1080}`,
          bitrate: `${((statsData.streamBandwidth || 2800000) / 1000000).toFixed(1)} Mbps`,
          fps: `${statsData.frameRate || 60}`,
          bufferLength: Number(player.getBufferFullness().toFixed(1)) * 10 || 4.2,
          state: video.paused ? 'PAUSED' : 'PLAYING',
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      player.destroy();
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0D0F12] flex items-center justify-center overflow-hidden">
      {errorMsg ? (
        <div className="glass-panel-glow p-8 rounded-2xl max-w-md text-center border border-[#E50914]">
          <AlertTriangle className="w-12 h-12 text-[#E50914] mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Playback Error</h3>
          <p className="text-sm text-[#94A3B8] mb-6">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#E50914] text-white font-semibold rounded-lg hover:bg-red-700 tv-focus-ring flex items-center justify-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Retry Playback
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />

          {/* Top Title Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E50914] font-bold">CINEMA CONTROL DECK</span>
              <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="px-3 py-1.5 glass-panel rounded-lg text-xs font-mono text-[#00F2FE] flex items-center gap-2 tv-focus-ring hover:bg-white/10"
            >
              <Activity className="w-4 h-4 text-[#00F2FE]" />
              {showDiagnostics ? 'Hide HUD' : 'Stats HUD'}
            </button>
          </div>

          {/* Diagnostics Overlay HUD */}
          {showDiagnostics && (
            <div className="absolute bottom-24 left-6 z-20 glass-panel p-4 rounded-xl text-xs font-mono w-72 border border-white/10 space-y-1">
              <div className="text-[#E50914] font-bold border-b border-white/10 pb-1 mb-2">
                PLAYER DIAGNOSTICS
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Protocol:</span> <span className="text-white font-semibold">{stats.protocol}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Resolution:</span> <span className="text-white font-semibold">{stats.resolution}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Bitrate:</span> <span className="text-white font-semibold">{stats.bitrate}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>FPS:</span> <span className="text-white font-semibold">{stats.fps}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Buffer:</span> <span className="text-white font-semibold">{stats.bufferLength}s</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>State:</span> <span className="text-[#00F2FE] font-semibold">{stats.state}</span>
              </div>
            </div>
          )}

          {/* Bottom Player Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-3 bg-[#E50914] text-white rounded-full hover:scale-105 transition tv-focus-ring"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:text-[#00F2FE] transition tv-focus-ring"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs px-2.5 py-1 bg-[#E50914]/20 border border-[#E50914] text-[#E50914] font-bold rounded-full uppercase tracking-wider">
                LIVE / ABR
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:text-[#00F2FE] transition tv-focus-ring"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
