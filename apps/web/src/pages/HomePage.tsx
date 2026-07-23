import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, ShieldCheck, Radio, Film, Sparkles, Clipboard, X, CheckCircle2 } from 'lucide-react';
import { fetchMediaItems, resolveStreamSource } from '../api/client';
import { MediaItem } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [customUrl, setCustomUrl] = useState('https://drive.google.com/file/d/1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E/view?usp=drive_link');
  const [resolving, setResolving] = useState(false);
  const [resolverError, setResolverError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMediaItems().then((data) => {
      setItems(data);
      if (data.length > 0) setSelectedItem(data[0]);
    }).catch(console.error);
  }, []);

  // Provider Detection Helper
  const detectProvider = (url: string): string => {
    if (!url.trim()) return 'UNKNOWN';
    if (url.includes('drive.google.com') || url.includes('1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E')) return 'GOOGLE_DRIVE';
    if (url.includes('.m3u8')) return 'HLS';
    if (url.includes('.mpd')) return 'DASH';
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mkv')) return 'PROGRESSIVE_HTTP';
    return 'STANDARD_HTTP';
  };

  const provider = detectProvider(customUrl);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCustomUrl(text.trim());
    } catch (err) {
      console.warn('Clipboard access denied');
    }
  };

  const handleResolveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setResolving(true);
    setResolverError(null);

    try {
      const descriptor = await resolveStreamSource(customUrl);
      navigate('/player', {
        state: { streamUrl: descriptor.playbackUrl, title: descriptor.title },
      });
    } catch (err: any) {
      setResolverError(err.message || 'SSRF violation or invalid media source');
    } finally {
      setResolving(false);
    }
  };

  const handlePlayMedia = (item: MediaItem) => {
    navigate('/player', { state: { streamUrl: item.streamUrl, title: item.title } });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Card & Add Source Interface */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-glow p-8 border border-white/15 bg-gradient-to-r from-black via-[#161920] to-[#0D0F12] space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> CINEMA CONTROL DECK — MEDIA INGEST
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Authorized Media Source Ingest
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Submit Google Drive URLs, HLS playlists, DASH manifests, or direct streams for secure server-side verification.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-xs font-mono">
            <span className="text-[#94A3B8]">Detected Provider:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              provider === 'GOOGLE_DRIVE'
                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                : provider === 'HLS'
                ? 'bg-purple-950 text-purple-400 border border-purple-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {provider}
            </span>
          </div>
        </div>

        {/* Full-width Add Source Input Form */}
        <form onSubmit={handleResolveSource} className="space-y-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Paste Google Drive URL or HLS stream link (e.g. https://drive.google.com/file/d/1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E/view)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full pl-4 pr-24 py-4 bg-black/80 border border-white/20 rounded-2xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F2FE] tv-focus-ring text-sm font-mono tracking-tight"
              required
            />
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {customUrl && (
                <button
                  type="button"
                  onClick={() => setCustomUrl('')}
                  className="p-1.5 text-[#94A3B8] hover:text-white transition rounded-lg"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#00F2FE] text-xs font-semibold rounded-lg transition flex items-center gap-1"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={resolving}
              className="px-8 py-3.5 bg-[#E50914] text-white font-bold text-sm rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 tv-focus-ring shadow-lg shadow-red-900/40 disabled:opacity-50"
            >
              {resolving ? 'Validating Provider...' : <><Plus className="w-4 h-4" /> Validate & Stream Media</>}
            </button>
          </div>
        </form>

        {resolverError && (
          <div className="p-4 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
            <span>{resolverError}</span>
          </div>
        )}
      </section>

      {/* Main Media Catalogue Grid & Selected Details Panel */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Film className="w-6 h-6 text-[#E50914]" /> Media Catalogue
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">Select any movie or live stream to initiate playback</p>
          </div>
          <span className="text-xs text-[#00F2FE] font-mono bg-[#00F2FE]/10 px-3 py-1 rounded-full border border-[#00F2FE]/30 font-bold">
            {items.length} Ready Streams
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Items List (2 Columns) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group glass-panel rounded-2xl overflow-hidden border transition cursor-pointer tv-focus-ring flex flex-col justify-between ${
                  selectedItem?.id === item.id ? 'border-[#E50914] shadow-lg shadow-red-900/30' : 'border-white/10 hover:border-white/30'
                }`}
                tabIndex={0}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayMedia(item);
                      }}
                      className="w-14 h-14 bg-[#E50914] text-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition"
                    >
                      <Play className="w-7 h-7 fill-current ml-0.5" />
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 flex gap-1">
                    {item.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-black/80 backdrop-blur text-[10px] font-mono font-bold text-[#00F2FE] rounded border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#E50914] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">{item.description}</p>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-xs border-t border-white/10">
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Radio className="w-3.5 h-3.5 text-[#E50914]" /> {item.sourceType.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayMedia(item);
                      }}
                      className="text-[#00F2FE] font-bold hover:underline"
                    >
                      Play &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Media Details Panel */}
          {selectedItem && (
            <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-6 self-start sticky top-24">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-[#E50914]/20 border border-[#E50914] text-[#E50914] text-xs font-bold rounded-full uppercase tracking-wider inline-block">
                  SELECTED MEDIA DETAILS
                </span>
                <h3 className="text-2xl font-bold text-white">{selectedItem.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedItem.description}</p>
              </div>

              <div className="space-y-2 text-xs font-mono border-t border-b border-white/10 py-4">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Source Type:</span> <span className="text-white font-bold">{selectedItem.sourceType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Quality Rendition:</span> <span className="text-[#00F2FE] font-bold">1080p / ABR</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Authorization:</span> <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Granted</span>
                </div>
              </div>

              <button
                onClick={() => handlePlayMedia(selectedItem)}
                className="w-full py-4 bg-[#E50914] text-white font-bold rounded-2xl hover:bg-red-700 transition flex items-center justify-center gap-2 tv-focus-ring shadow-xl shadow-red-900/40"
              >
                <Play className="w-5 h-5 fill-current" /> Launch Player
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
