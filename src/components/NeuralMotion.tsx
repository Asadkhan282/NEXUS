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
  AlertCircle,
  History,
  Trash2,
  Search,
  Filter,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock4
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateVideo, getVideoStatus, fetchVideoBlob, optimizeVideoPrompt } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MotionHistoryItem } from '../types';

export default function NeuralMotion() {
  const { user } = useAuth();
  const [prompt, setPrompt] = React.useState('');
  const [isRendering, setIsRendering] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [history, setHistory] = React.useState<MotionHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'completed' | 'processing' | 'failed'>('all');
  const [hasPlatformKey, setHasPlatformKey] = React.useState(false);
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  React.useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasPlatformKey(hasKey);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  React.useEffect(() => {
    if (!user) return;

    const historyRef = collection(db, 'users', user.uid, 'motion_history');
    const q = query(historyRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MotionHistoryItem[];
      setHistory(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/motion_history`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSynthesize = async () => {
    if (!prompt.trim() || !user) return;

    // Fast-path for keyless users: trigger simulation immediately
    const activeUserKey = localStorage.getItem('nexus_user_key');
    if (!hasPlatformKey && !activeUserKey) {
      handleSimulate();
      return;
    }
    
    setIsRendering(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    let historyId = "";

    try {
      // Create initial history record
      const docRef = await addDoc(collection(db, 'users', user.uid, 'motion_history'), {
        prompt: prompt.trim(),
        status: 'processing',
        createdAt: Date.now()
      });
      historyId = docRef.id;

      // Prioritize platform key if available, otherwise check local storage
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      let operation = await generateVideo(prompt, userKey);
      
      // Update history with operation ID
      await updateDoc(doc(db, 'users', user.uid, 'motion_history', historyId), {
        operationId: operation.name
      });

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
            
            // Update history to completed
            await updateDoc(doc(db, 'users', user.uid, 'motion_history', historyId), {
              status: 'completed',
              videoUrl: url
            });
          } else {
            throw new Error("Video generation completed but no URI was found.");
          }
        } catch (err: any) {
          // If polling fails with auth issue, try simulation
          const isAuthError = err.message?.includes("403") || 
                             err.message?.includes("Access Denied") || 
                             err.message?.includes("PERMISSION_DENIED");
          
          if (isAuthError) {
            if (historyId) {
              try { await deleteDoc(doc(db, 'users', user.uid, 'motion_history', historyId)); } catch (e) {}
            }
            handleSimulate();
          } else {
            console.error("Video polling failed:", err);
            setError(err.message || "Neural Desync: Motion synthesis failed during rendering.");
            if (historyId) {
              await updateDoc(doc(db, 'users', user.uid, 'motion_history', historyId), {
                status: 'failed'
              });
            }
          }
        } finally {
          setIsRendering(false);
        }
      };

      poll();
    } catch (err: any) {
      // If initialization fails with auth issue, silent fallback to simulation
      const isAuthError = err.message?.includes("403") || 
                         err.message?.includes("Access Denied") || 
                         err.message?.includes("PERMISSION_DENIED") ||
                         err.message?.includes("API_KEY_INVALID");
      
      if (isAuthError) {
        if (historyId) {
          try { await deleteDoc(doc(db, 'users', user.uid, 'motion_history', historyId)); } catch (e) {}
        }
        handleSimulate();
      } else {
        console.error("Video synthesis failed:", err);
        setError(err.message || "Failed to initialize motion synthesis.");
        setIsRendering(false);
        if (historyId) {
          await updateDoc(doc(db, 'users', user.uid, 'motion_history', historyId), {
            status: 'failed'
          });
        }
      }
    }
  };

  const deleteHistoryItem = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'motion_history', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/motion_history/${id}`);
    }
  };

  const handleRemix = (item: MotionHistoryItem) => {
    setPrompt(item.prompt);
    // Scroll to the prompt input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulate = async () => {
    if (!prompt.trim() || !user) return;
    
    setIsRendering(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    // Neural templates (abstract cinematic loops)
    const templates = [
      'https://assets.mixkit.co/videos/preview/mixkit-abstract-holographic-neon-background-loop-41004-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-futuristic-scenery-of-a-planet-with-a-blue-ring-41010-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-neural-network-41002-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-digital-mesh-41008-large.mp4'
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    let interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(async () => {
      setVideoUrl(randomTemplate);
      setIsRendering(false);
      setProgress(100);

      // Save to history as simulated
      await addDoc(collection(db, 'users', user.uid, 'motion_history'), {
        prompt: `[SIMULATED] ${prompt.trim()}`,
        status: 'completed',
        createdAt: Date.now(),
        videoUrl: randomTemplate
      });

    }, 3000);
  };

  const handleOptimizePrompt = async () => {
    if (!prompt.trim() || isOptimizing) return;
    setIsOptimizing(true);
    try {
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      const optimized = await optimizeVideoPrompt(prompt, userKey);
      setPrompt(optimized);
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Motion Gen</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Synthesize cinematic neural video</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 no-scrollbar">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest block">Neural Video Prompt</label>
              <button 
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || isRendering || !prompt.trim()}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-nexus-accent/10 border border-nexus-accent/30 text-nexus-accent text-[9px] font-bold uppercase tracking-wider hover:bg-nexus-accent/20 transition-all disabled:opacity-50"
                title="Optimize with Neural Assistant"
              >
                {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Optimize Vision
              </button>
            </div>
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSimulate()}
                    className="flex-1 py-2 rounded-lg bg-nexus-accent/20 hover:bg-nexus-accent/30 text-nexus-accent text-[10px] font-bold transition-all border border-nexus-accent/30"
                  >
                    Simulate Synthesis
                  </button>
                  <button 
                    onClick={() => (window as any).aistudio?.openSelectKey()}
                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold transition-all border border-white/10"
                  >
                    Authorize Neural Core
                  </button>
                </div>
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
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 glass rounded-3xl border border-white/10 relative group overflow-hidden flex items-center justify-center bg-black/20">
            {videoUrl ? (
              <div className="relative w-full h-full">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                />
                
                {/* Simulation Badge */}
                {videoUrl.includes('mixkit.co') && (
                  <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-nexus-accent/20 backdrop-blur-md border border-nexus-accent/40 flex items-center gap-2 z-20">
                    <Sparkles className="w-3 h-3 text-nexus-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Neural Simulation</span>
                  </div>
                )}
              </div>
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

      {/* Motion History Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <History className="w-5 h-5 text-nexus-accent" />
            Motion History
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-dim" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter visions..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-nexus-text-dim focus:border-nexus-accent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All', icon: Filter },
                { id: 'completed', label: 'Done', icon: CheckCircle2 },
                { id: 'processing', label: 'Active', icon: Clock4 },
                { id: 'failed', label: 'Sync Errors', icon: XCircle }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                    statusFilter === f.id ? "bg-nexus-accent text-nexus-bg" : "text-nexus-text-dim hover:text-white"
                  )}
                >
                  <f.icon className="w-3 h-3" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center opacity-40">
            <Film className="w-12 h-12 text-nexus-text-dim mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-white">
              {searchQuery || statusFilter !== 'all' ? 'No matching visions found in records' : 'No historical motion data detected'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass group rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-nexus-accent/30 transition-all"
                >
                  <div className="aspect-video bg-black/40 relative overflow-hidden flex items-center justify-center">
                    {item.videoUrl ? (
                      <video 
                        src={item.videoUrl} 
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        muted
                        loop
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {item.status === 'processing' ? (
                          <Loader2 className="w-8 h-8 text-nexus-accent animate-spin" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-red-500/50" />
                        )}
                        <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">
                          {item.status === 'processing' ? 'Synthesizing...' : 'Desync Failed'}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleRemix(item)}
                        className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-nexus-accent transition-colors"
                        title="Remix Vision"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      {item.videoUrl && (
                        <a 
                          href={item.videoUrl} 
                          download={`motion-${item.id}.mp4`}
                          className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-nexus-accent transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button 
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.videoUrl && (
                      <button 
                        onClick={() => setVideoUrl(item.videoUrl!)}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all opacity-0 hover:opacity-100"
                      >
                        <Play className="w-8 h-8 text-white fill-white" />
                      </button>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-white font-medium line-clamp-2 mb-4 leading-relaxed">
                      {item.prompt}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-nexus-text-dim" />
                        <span className="text-[10px] text-nexus-text-dim">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={cn(
                        "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border",
                        item.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        item.status === 'processing' ? "bg-nexus-accent/10 border-nexus-accent/20 text-nexus-accent" :
                        "bg-red-500/10 border-red-500/20 text-red-400"
                      )}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
