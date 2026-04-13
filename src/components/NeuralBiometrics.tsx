import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Heart, Brain, Activity, Zap, Shield, AlertCircle, CheckCircle2, Loader2, Camera, CameraOff, Sparkles, Waves, Target, Fingerprint } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NeuralBiometrics() {
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [bpm, setBpm] = React.useState(72);
  const [syncProgress, setSyncProgress] = React.useState(0);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [eyePos, setEyePos] = React.useState({ x: 50, y: 50 });
  const [brainWaves, setBrainWaves] = React.useState({
    alpha: 45,
    beta: 62,
    theta: 28,
    delta: 12
  });
  const [neuralMetrics, setNeuralMetrics] = React.useState({
    analyticalLoad: 45,
    creativeResonance: 62,
    focusStability: 88,
    intentClarity: 0
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const startSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setNeuralMetrics({
            analyticalLoad: Math.floor(Math.random() * 40) + 40,
            creativeResonance: Math.floor(Math.random() * 50) + 30,
            focusStability: Math.floor(Math.random() * 20) + 75,
            intentClarity: Math.floor(Math.random() * 30) + 60
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setEyePos({
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20
      });
      setBrainWaves({
        alpha: 30 + Math.random() * 40,
        beta: 40 + Math.random() * 40,
        theta: 10 + Math.random() * 30,
        delta: 5 + Math.random() * 15
      });
    }, 2000);
    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter flex items-center gap-3">
              Neural <span className="text-nexus-accent">Biometrics</span>
              <div className="px-2 py-0.5 rounded-md bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] uppercase tracking-widest text-nexus-accent">
                Bio-Sync Active
              </div>
            </h1>
            <p className="text-nexus-text-dim mt-2 max-w-xl">
              Advanced physiological sensing and cognitive intent analysis. 
              NEXUS synchronizes with your neural patterns for optimized interaction.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={isCameraActive ? stopCamera : startCamera}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
                isCameraActive 
                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
                  : "bg-nexus-accent/10 border-nexus-accent/30 text-nexus-accent hover:bg-nexus-accent/20"
              )}
            >
              {isCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              {isCameraActive ? "Deactivate Sensors" : "Initialize Eye Sensing"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eye Sensing & Visual Tracking */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-nexus-bg/80 z-10" />
              
              {/* Camera Feed */}
              <div className="aspect-video bg-black/40 relative overflow-hidden">
                {!isCameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-nexus-text-dim">
                    <Eye className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm font-mono uppercase tracking-widest">Awaiting Visual Input</p>
                  </div>
                ) : (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover grayscale opacity-60"
                  />
                )}

                {/* Neural Overlays */}
                <AnimatePresence>
                  {isCameraActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 pointer-events-none"
                    >
                      {/* Scanning Lines */}
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.div 
                          animate={{ y: ['0%', '100%', '0%'] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="h-[2px] w-full bg-nexus-accent/40 shadow-[0_0_15px_rgba(0,242,255,0.8)]"
                        />
                      </div>

                      {/* Facial Landmark Grid */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="grid grid-cols-12 h-full w-full">
                          {[...Array(144)].map((_, i) => (
                            <div key={i} className="border-[0.5px] border-nexus-accent/30" />
                          ))}
                        </div>
                      </div>

                      {/* Eye Tracking Reticles */}
                      <motion.div 
                        animate={{ 
                          left: `${eyePos.x - 15}%`,
                          top: `${eyePos.y}%`
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="w-32 h-32 border border-nexus-accent/30 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border border-nexus-accent/50 rounded-full animate-pulse" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-12 w-[1px] bg-nexus-accent/30" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full h-12 w-[1px] bg-nexus-accent/30" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-12 h-[1px] bg-nexus-accent/30" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-12 h-[1px] bg-nexus-accent/30" />
                        </div>
                      </motion.div>

                      <motion.div 
                        animate={{ 
                          left: `${eyePos.x + 15}%`,
                          top: `${eyePos.y}%`
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="w-32 h-32 border border-nexus-accent/30 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border border-nexus-accent/50 rounded-full animate-pulse" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-12 w-[1px] bg-nexus-accent/30" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full h-12 w-[1px] bg-nexus-accent/30" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-12 h-[1px] bg-nexus-accent/30" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-12 h-[1px] bg-nexus-accent/30" />
                        </div>
                      </motion.div>

                      {/* Telemetry Data */}
                      <div className="absolute bottom-8 left-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-nexus-accent animate-ping" />
                          <span className="text-[10px] font-mono text-nexus-accent uppercase tracking-widest">Neural Gaze Active</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">
                          Gaze Vector: [{eyePos.x.toFixed(2)}, {eyePos.y.toFixed(2)}, 0.92]
                        </div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">
                          Pupil Dilation: 4.2mm | Blink Rate: 12/min
                        </div>
                      </div>

                      {/* Heatmap Simulation */}
                      <div className="absolute top-8 right-8 w-32 h-32 glass rounded-xl border border-white/10 p-3">
                        <div className="text-[8px] font-bold text-nexus-accent uppercase tracking-widest mb-2">Focus Heatmap</div>
                        <div className="grid grid-cols-4 grid-rows-4 gap-1 h-20">
                          {[...Array(16)].map((_, i) => (
                            <div 
                              key={i} 
                              className="rounded-sm" 
                              style={{ 
                                backgroundColor: `rgba(0, 242, 255, ${Math.random() * 0.5})` 
                              }} 
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 relative z-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-nexus-accent" />
                    <h3 className="text-lg font-bold text-white">Neural Eye Tracker</h3>
                  </div>
                  <div className="text-xs font-mono text-nexus-accent">99.8% Precision</div>
                </div>
                <p className="text-sm text-nexus-text-dim leading-relaxed">
                  Real-time visual focus analysis. NEXUS tracks ocular micro-movements to predict 
                  information processing priority and cognitive engagement levels.
                </p>
              </div>
            </div>

            {/* Heart Rate & Brain Waves */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Heart className={cn("w-6 h-6 text-red-500 animate-pulse", bpm > 100 ? "animate-[pulse_0.5s_infinite]" : "")} />
                </div>
                <h3 className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-4">Heart Rate (BPM)</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-white tracking-tighter">{bpm}</span>
                  <span className="text-nexus-accent font-mono text-sm">BPM</span>
                </div>
                
                {/* Pulse Waveform */}
                <div className="h-16 w-full flex items-end gap-1">
                  {[...Array(30)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, Math.random() * 40 + 20, 10] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.03 }}
                      className="flex-1 bg-gradient-to-t from-red-500/40 to-red-500 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Waves className="w-6 h-6 text-nexus-accent animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-4">Brain Waves (EEG)</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Alpha (Relaxed)', value: brainWaves.alpha, color: 'bg-blue-400' },
                    { label: 'Beta (Alert)', value: brainWaves.beta, color: 'bg-nexus-accent' },
                    { label: 'Theta (Deep)', value: brainWaves.theta, color: 'bg-nexus-purple' },
                    { label: 'Delta (Sleep)', value: brainWaves.delta, color: 'bg-emerald-400' }
                  ].map((wave, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/60">{wave.label}</span>
                        <span className="text-nexus-accent">{wave.value.toFixed(0)}Hz</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${wave.value}%` }}
                          className={cn("h-full", wave.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mind Reader / Neural Intent */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-nexus-accent/30 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-6">
                <Brain className="w-8 h-8 text-nexus-accent animate-pulse" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Mind Reader</h3>
              <p className="text-sm text-nexus-text-dim mb-8">
                Cognitive intent prediction and neural resonance analysis.
              </p>

              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Analytical Load</span>
                    </div>
                    <span className="text-sm font-mono text-nexus-accent">{neuralMetrics.analyticalLoad}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${neuralMetrics.analyticalLoad}%` }}
                      className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-nexus-purple" />
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Creative Resonance</span>
                    </div>
                    <span className="text-sm font-mono text-nexus-accent">{neuralMetrics.creativeResonance}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${neuralMetrics.creativeResonance}%` }}
                      className="h-full bg-nexus-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Focus Stability</span>
                    </div>
                    <span className="text-sm font-mono text-nexus-accent">{neuralMetrics.focusStability}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${neuralMetrics.focusStability}%` }}
                      className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-nexus-accent" />
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Intent Clarity</span>
                    </div>
                    <span className="text-sm font-mono text-nexus-accent">{neuralMetrics.intentClarity}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${neuralMetrics.intentClarity}%` }}
                      className="h-full bg-nexus-accent shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={startSync}
                  disabled={isSyncing}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3",
                    isSyncing 
                      ? "bg-white/5 text-nexus-text-dim cursor-not-allowed" 
                      : "bg-nexus-accent text-nexus-bg neon-glow hover:scale-[1.02]"
                  )}
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Syncing Neural Link ({syncProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-5 h-5" />
                      <span>Initialize Neural Sync</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="glass p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-nexus-accent" />
            <h3 className="text-xl font-bold text-white">Neural Health Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-accent/20 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Cognitive Readiness</span>
              </div>
              <p className="text-xs text-nexus-text-dim leading-relaxed">
                Neural pathways are clear. Optimal state for high-complexity architectural tasks and deep research.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-accent/20 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Fatigue Detection</span>
              </div>
              <p className="text-xs text-nexus-text-dim leading-relaxed">
                Minor ocular strain detected. Recommend 5-minute neural reset after current session completion.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-accent/20 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-4 h-4 text-nexus-accent" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Creative Resonance</span>
              </div>
              <p className="text-xs text-nexus-text-dim leading-relaxed">
                High resonance with current multimodal generation tasks. Vision synthesis efficiency increased by 14%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
