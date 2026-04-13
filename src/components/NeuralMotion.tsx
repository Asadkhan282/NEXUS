import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Play, 
  Zap, 
  Download, 
  Share2, 
  Settings2,
  Clock,
  Sparkles,
  Film,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateVideo, getVideoStatus, fetchVideoBlob } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';

export default function NeuralMotion() {
  const { user } = useAuth();
  const [prompt, setPrompt] = React.useState('');
  const [isRendering, setIsRendering] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    
    setIsRendering(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    try {
      // Prioritize platform key if available, otherwise check local storage
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      let operation = await generateVideo(prompt, userKey);
      
      // Polling logic
      const poll = async () => {
        try {
          while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await getVideoStatus(operation, userKey);
            // Simulate progress since we don't have real progress from API
            setProgress(prev => Math.min(prev + 5, 95));
          }

          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
            const url = await fetchVideoBlob(videoUri, userKey);
            setVideoUrl(url);
            setProgress(100);
          } else {
            throw new Error("Video generation completed but no URI was found.");
          }
        } catch (err: any) {
          console.error("Video polling failed:", err);
          setError(err.message || "Neural Desync: Motion synthesis failed during rendering.");
        } finally {
          setIsRendering(false);
        }
      };

      poll();
    } catch (err: any) {
      console.error("Video generation failed:", err);
      setError(err.message || "Failed to initialize motion synthesis.");
      setIsRendering(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Motion Gen</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Synthesize cinematic neural video</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 no-scrollbar">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-4 block">Neural Video Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic scene you want to synthesize (e.g., 'A futuristic city at night with flying cars')..."
              className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-nexus-accent outline-none transition-all resize-none shadow-inner"
              disabled={isRendering}
            />
            <button 
              onClick={handleSynthesize}
              disabled={isRendering || !prompt.trim()}
              className="w-full mt-4 py-4 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Video... {progress}%
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-red-400 leading-relaxed">{error}</p>
                </div>
                {error.includes("403") && (
                  <button 
                    onClick={() => (window as any).aistudio?.openSelectKey()}
                    className="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold transition-all border border-red-500/30"
                  >
                    Select Personal API Key
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-nexus-accent" />
              Motion Parameters
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-nexus-text-dim">Duration</span>
                  <span className="text-xs font-bold text-white">5.0s</span>
                </div>
                <input type="range" className="w-full accent-nexus-accent" disabled={isRendering} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-nexus-text-dim">Motion Intensity</span>
                  <span className="text-xs font-bold text-white">High</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Mid', 'High'].map((level) => (
                    <button 
                      key={level} 
                      disabled={isRendering}
                      className={cn(
                        "py-2 rounded-lg border text-[10px] font-bold transition-all",
                        level === 'High' ? "bg-nexus-accent/20 border-nexus-accent text-nexus-accent" : "bg-white/5 border-white/5 text-nexus-text-dim"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-white/10 relative group overflow-hidden flex items-center justify-center bg-black/20">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                autoPlay
                loop
              />
            ) : (
              <>
                <img 
                  src="https://picsum.photos/seed/motion/1200/800?blur=2" 
                  alt="Motion Preview" 
                  className="w-full h-full object-cover opacity-20"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isRendering ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-4 border-nexus-accent/20 border-t-nexus-accent animate-spin mb-4" />
                      <p className="text-xs font-bold text-nexus-accent uppercase tracking-widest animate-pulse">Neural Rendering Active</p>
                      <p className="mt-2 text-[10px] text-nexus-text-dim">This typically takes 2-5 minutes</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-nexus-accent/20 border border-nexus-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="w-8 h-8 text-nexus-accent fill-nexus-accent" />
                      </div>
                      <p className="mt-4 text-xs font-bold text-white/60 uppercase tracking-widest">Preview Neural Render</p>
                    </>
                  )}
                </div>
              </>
            )}
            
            {isRendering && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Rendering {progress}%</span>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                  {videoUrl ? '00:05 / 00:05' : '00:00 / 05:00'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {videoUrl && (
                  <a 
                    href={videoUrl} 
                    download="nexus-motion.mp4"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-nexus-accent" />
              Neural Layers
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-20 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-nexus-text-dim" />
                  <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest">Layer {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
