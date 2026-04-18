import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Zap, 
  Cpu, 
  Activity, 
  Search, 
  Code2, 
  Sparkles,
  FlaskConical,
  TestTube2,
  Dna,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

const experiments = [
  {
    id: 'vision-probe',
    title: 'Vision Probe',
    status: 'Active',
    description: 'Test the limits of neural image recognition and descriptive synthesis.',
    icon: Search,
    color: 'text-nexus-accent',
    complexity: 'Medium'
  },
  {
    id: 'logic-stress',
    title: 'Logic Stress Test',
    status: 'Stable',
    description: 'Benchmark the reasoning capabilities of the Gemini 2.0 Pro core.',
    icon: Activity,
    color: 'text-nexus-purple',
    complexity: 'High'
  },
  {
    id: 'motion-synthesis',
    title: 'Motion Synthesis',
    status: 'Experimental',
    description: 'Experiment with temporal coherence in AI-generated video sequences.',
    icon: Zap,
    color: 'text-yellow-400',
    complexity: 'Ultra'
  },
  {
    id: 'code-architect',
    title: 'Code Architect',
    status: 'Active',
    description: 'Analyze the structural integrity of AI-generated software systems.',
    icon: Code2,
    color: 'text-blue-400',
    complexity: 'High'
  }
];

export default function NeuralLab() {
  const [isRunningBenchmark, setIsRunningBenchmark] = React.useState(false);
  const [benchmarkProgress, setBenchmarkProgress] = React.useState(0);
  const [telemetryData, setTelemetryData] = React.useState([40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95, 70, 40, 60, 80]);
  const [syntheticResult, setSyntheticResult] = React.useState<string | null>(null);

  const runBenchmark = () => {
    setIsRunningBenchmark(true);
    setBenchmarkProgress(0);
    setSyntheticResult(null);
    
    const interval = setInterval(() => {
      setBenchmarkProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningBenchmark(false);
          // Randomize telemetry after benchmark
          setTelemetryData(prevData => prevData.map(() => Math.floor(Math.random() * 60) + 40));
          
          setSyntheticResult(Math.random() > 0.5 
            ? `// Synthetic Neural Logic v2.4\nfunction synthesize(dna) {\n  return dna.map(x => Math.atan2(x.y, x.x));\n}`
            : `VISION_SYNTHESIS_COMPLETE: { "objects": ["quantum_core", "neural_lattice"], "confidence": 0.998 }`
          );
          
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural Lab</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Experimental research and neural benchmarking</p>
        </div>
        <button 
          onClick={runBenchmark}
          disabled={isRunningBenchmark}
          className="px-6 py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isRunningBenchmark ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          {isRunningBenchmark ? 'Benchmarking...' : 'Run Global Benchmark'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        <AnimatePresence>
          {isRunningBenchmark && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-2xl bg-nexus-accent/10 border border-nexus-accent/20"
            >
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Neural Stress Test in Progress</span>
                <span className="text-[10px] font-mono text-nexus-accent">{benchmarkProgress}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-nexus-accent shadow-[0_0_10px_#00f5ff]"
                  style={{ width: `${benchmarkProgress}%` }}
                />
              </div>
              {benchmarkProgress > 30 && (
                <div className="mt-4 font-mono text-[10px] text-white/40 animate-pulse">
                  [{'>'}] Analyzing core temperatures... 54°C :: STABLE
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {syntheticResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-3xl glass border border-nexus-accent/30 bg-nexus-accent/5 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-5 h-5 text-nexus-accent animate-pulse" />
            </div>
            <h3 className="text-xs font-bold text-nexus-accent uppercase tracking-widest mb-4">Latest Synthetic Yield</h3>
            <pre className="text-xs font-mono text-white/90 whitespace-pre-wrap leading-relaxed">
              <code>{syntheticResult}</code>
            </pre>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/5 hover:border-nexus-accent/30 transition-all group cursor-pointer"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-colors", exp.color)}>
                <exp.icon className="w-6 h-6" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">{exp.status}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">{exp.complexity}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{exp.title}</h3>
              <p className="text-xs text-nexus-text-dim leading-relaxed">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-nexus-accent/20">
                  <Activity className="w-5 h-5 text-nexus-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Neural Telemetry</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nexus-accent" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Inference</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nexus-purple" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Synthesis</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end gap-2 px-4">
              {telemetryData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-nexus-accent/20 rounded-t-sm relative group"
                  >
                    <div className="absolute inset-0 bg-nexus-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 0.6}%` }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-nexus-purple/20 rounded-t-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">
              <span>00:00</span>
              <span>Neural Cycle T-Minus</span>
              <span>24:00</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-nexus-accent" />
                Active Probes
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Quantum Entanglement', value: 88 },
                  { label: 'Neural Plasticity', value: 42 },
                  { label: 'Semantic Mapping', value: 76 }
                ].map((probe) => (
                  <div key={probe.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-nexus-text-dim">{probe.label}</span>
                      <span className="text-xs font-bold text-nexus-accent">{probe.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${probe.value}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-nexus-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 bg-nexus-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <Dna className="w-5 h-5 text-nexus-accent" />
                <h3 className="text-lg font-bold text-white">Neural DNA</h3>
              </div>
              <p className="text-xs text-nexus-text-dim leading-relaxed mb-4">
                Your unique neural signature is used to optimize model weights for your specific interaction patterns.
              </p>
              <button className="w-full py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-xs hover:opacity-90 transition-opacity">
                Recalibrate Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
