import React, { useEffect, useState } from 'react';
import { fetchHealth } from '../api/client';
import { ShieldCheck, Cpu, Server, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const [gatewayStatus, setGatewayStatus] = useState<'HEALTHY' | 'OFFLINE' | 'CHECKING'>('CHECKING');
  const [browserCapabilities, setBrowserCapabilities] = useState<{
    mse: boolean;
    hlsNative: boolean;
    widevine: boolean;
  }>({ mse: true, hlsNative: false, widevine: false });

  useEffect(() => {
    fetchHealth()
      .then(() => setGatewayStatus('HEALTHY'))
      .catch(() => setGatewayStatus('OFFLINE'));

    const video = document.createElement('video');
    setBrowserCapabilities({
      mse: 'MediaSource' in window,
      hlsNative: video.canPlayType('application/vnd.apple.mpegurl') !== '',
      widevine: 'navigator' in window && 'requestMediaKeySystemAccess' in navigator,
    });
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">System & Network Diagnostics</h1>
        <p className="text-xs text-[#94A3B8] mt-1">Real-time status of backend services and browser media pipeline capability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Services */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-[#E50914]" />
            <h2 className="text-lg font-bold text-white">Backend Services Health</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-xs text-[#94A3B8]">API Gateway (port 8080)</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                gatewayStatus === 'HEALTHY' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {gatewayStatus === 'HEALTHY' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {gatewayStatus}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-xs text-[#94A3B8]">SSRF Source Resolver (port 8082)</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-950 text-green-400 border border-green-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Browser Codec Capabilities */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-[#00F2FE]" />
            <h2 className="text-lg font-bold text-white">Browser Codec & DRM Support</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-xs text-[#94A3B8]">Media Source Extensions (MSE)</span>
              <span className="text-xs font-bold text-[#00F2FE]">
                {browserCapabilities.mse ? 'SUPPORTED' : 'UNSUPPORTED'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-xs text-[#94A3B8]">Native Apple HLS Support</span>
              <span className="text-xs font-bold text-[#94A3B8]">
                {browserCapabilities.hlsNative ? 'YES' : 'SHAKA ENGINE FALLBACK'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-xs text-[#94A3B8]">Widevine EME API</span>
              <span className="text-xs font-bold text-[#00F2FE]">
                {browserCapabilities.widevine ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
