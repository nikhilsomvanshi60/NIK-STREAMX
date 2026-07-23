import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, ShieldCheck, Radio, Film, Sparkles } from 'lucide-react';
import { fetchMediaItems, resolveStreamSource } from '../api/client';
import { MediaItem } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolverError, setResolverError] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaItems().then(setItems).catch(console.error);
  }, []);

  const handleResolveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setResolving(true);
    setResolverError(null);

    try {
      const descriptor = await resolveStreamSource(customUrl);
      // Navigate to player with resolved media URL
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
      {/* Hero Banner / Add Custom Source */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 border border-white/10 bg-gradient-to-r from-black via-[#161920] to-[#0D0F12]">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Ultra-Premium Streaming Engine
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
            Add & Stream Authorized Media Streams
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Submit HLS, DASH, or legal progressive stream links. Passed through server-side SSRF validation before playback.
          </p>

          <form onSubmit={handleResolveSource} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="url"
              placeholder="https://example.com/stream.m3u8"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F2FE] tv-focus-ring text-sm"
              required
            />
            <button
              type="submit"
              disabled={resolving}
              className="px-6 py-3 bg-[#E50914] text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 tv-focus-ring disabled:opacity-50"
            >
              {resolving ? 'Validating...' : <><Plus className="w-4 h-4" /> Add Source</>}
            </button>
          </form>

          {resolverError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
              <span>{resolverError}</span>
            </div>
          )}
        </div>
      </section>

      {/* Catalog Sections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-[#E50914]" /> Media Catalogue
          </h2>
          <span className="text-xs text-[#94A3B8] font-mono">{items.length} items ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePlayMedia(item)}
              className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#E50914]/50 transition cursor-pointer tv-focus-ring flex flex-col justify-between"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePlayMedia(item)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 bg-[#E50914] text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 flex gap-1">
                  {item.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-black/60 backdrop-blur text-[10px] font-mono font-semibold text-[#00F2FE] rounded">
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
                <div className="pt-3 flex items-center justify-between text-xs text-[#94A3B8] border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-[#E50914]" /> {item.sourceType.toUpperCase()}
                  </span>
                  <span className="text-[#00F2FE] font-semibold">Play Stream &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
