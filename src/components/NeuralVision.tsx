import React from 'react';
import { motion } from 'motion/react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Download, 
  Share2, 
  Maximize2,
  Settings2,
  History,
  Plus,
  Video
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function NeuralVision() {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Vision Gen</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Generate high-fidelity neural imagery</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Generation Panel */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 no-scrollbar">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-4 block">Neural Prompt</label>
            <textarea 
              placeholder="Describe your vision..."
              className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-nexus-accent outline-none transition-all resize-none"
            />
            <button className="w-full mt-4 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Manifest Vision
            </button>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-nexus-text-dim uppercase tracking-widest mb-3 text-center">Or Synthesize Motion</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('nexus-switch-tab', { detail: 'video' }))}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4 text-red-400" />
                Generate Video
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-nexus-accent" />
              Parameters
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-nexus-text-dim">Aspect Ratio</span>
                  <span className="text-xs font-bold text-white">16:9</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '16:9', '9:16'].map((ar) => (
                    <button key={ar} className={cn(
                      "py-2 rounded-lg border text-[10px] font-bold transition-all",
                      ar === '16:9' ? "bg-nexus-accent/20 border-nexus-accent text-nexus-accent" : "bg-white/5 border-white/5 text-nexus-text-dim"
                    )}>
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-nexus-text-dim">Neural Steps</span>
                  <span className="text-xs font-bold text-white">50</span>
                </div>
                <input type="range" className="w-full accent-nexus-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-white/10 relative group overflow-hidden">
            <img 
              src="https://picsum.photos/seed/vision/1200/800" 
              alt="Generated Vision" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-3">
                <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button className="p-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-opacity">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="h-32 flex gap-4 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} className="h-full aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-nexus-accent transition-all flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/vision${i}/200/200`} 
                  alt={`History ${i}`} 
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
            <button className="h-full aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-nexus-text-dim hover:text-white hover:border-white/20 transition-all flex-shrink-0">
              <History className="w-5 h-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
