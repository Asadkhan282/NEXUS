import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Upload, 
  Database, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Trash2, 
  Plus,
  Play,
  Save,
  Shield,
  MessageSquare,
  Sparkles,
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface TrainingExample {
  id: string;
  prompt: string;
  completion: string;
  status: 'pending' | 'trained';
}

interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'indexed' | 'processing';
}

export default function NeuralTraining() {
  const [activeTab, setActiveTab] = React.useState<'bench' | 'knowledge' | 'synthetic' | 'sovereign'>('bench');
  const [files, setFiles] = React.useState<KnowledgeFile[]>([
    { id: '1', name: 'nexus_core_documentation.pdf', size: '2.4 MB', type: 'PDF', status: 'indexed' },
    { id: '2', name: 'brand_guidelines_2026.docx', size: '1.2 MB', type: 'DOCX', status: 'indexed' }
  ]);
  const [examples, setExamples] = React.useState<TrainingExample[]>([
    { id: '1', prompt: 'Tell me about NEXUS', completion: 'NEXUS is a multimodal neural architect designed to bridge human intent with machine intelligence...', status: 'trained' }
  ]);
  const [newExample, setNewExample] = React.useState({ prompt: '', completion: '' });
  const [isTraining, setIsTraining] = React.useState(false);

  const handleAddExample = () => {
    if (!newExample.prompt || !newExample.completion) return;
    setExamples(prev => [...prev, {
      id: Date.now().toString(),
      prompt: newExample.prompt,
      completion: newExample.completion,
      status: 'pending'
    }]);
    setNewExample({ prompt: '', completion: '' });
  };
  const [transcendenceLevel, setTranscendenceLevel] = React.useState(0);
  const [stabilityMode, setStabilityMode] = React.useState(false);
  const [trainingProgress, setTrainingProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const startTrainingRun = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setExamples(prevEx => prevEx.map(ex => ({ ...ex, status: 'trained' })));
          if (activeTab === 'sovereign') setTranscendenceLevel(prevLevel => Math.min(prevLevel + 12.5, 100));
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setFiles(prev => [...prev, {
        id: Date.now().toString(),
        name: 'new_dataset_source.txt',
        size: '450 KB',
        type: 'TXT',
        status: 'indexed'
      }]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3x font-bold text-white tracking-tighter flex items-center gap-3">
              Neural <span className="text-nexus-accent">Training</span>
              <div className="px-2 py-0.5 rounded-md bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] uppercase tracking-widest text-nexus-accent">
                Supervised Evolution
              </div>
            </h1>
            <p className="text-nexus-text-dim mt-1">Refine the neural weights and expand the local knowledge core of NEXUS.</p>
          </div>
          <button 
            onClick={startTrainingRun}
            disabled={isTraining || (examples.filter(ex => ex.status === 'pending').length === 0 && files.length === 0)}
            className="px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold neon-glow flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isTraining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            {isTraining ? `Training Core (${trainingProgress}%)` : 'Start Neural Optimization'}
          </button>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'bench', label: 'Nexus Bench', icon: BarChart3 },
            { id: 'knowledge', label: 'Knowledge Core', icon: Database },
            { id: 'synthetic', label: 'Synthetic Training', icon: Sparkles },
            { id: 'sovereign', label: 'Sovereign Link', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold tracking-tight transition-all border",
                activeTab === tab.id 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-transparent text-nexus-text-dim hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'bench' && (
            <motion.div
              key="bench"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Neural Accuracy', value: '98.4%', delta: '+1.2%', color: 'text-nexus-accent' },
                  { label: 'Knowledge Density', value: '1,240 GB', delta: '+45 GB', color: 'text-nexus-purple' },
                  { label: 'Inference Speed', value: '0.4s', delta: '-0.05s', color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">{stat.label}</span>
                    <span className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{stat.delta} improvement</span>
                  </div>
                ))}
              </div>

              <div className="glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-nexus-accent" />
                  Neural Signal Stability
                </h3>
                <div className="h-48 flex items-end gap-1 px-2">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: '20%' }}
                      animate={{ height: [`${Math.random() * 60 + 20}%`, `${Math.random() * 60 + 20}%`] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                      className="flex-1 bg-nexus-accent/20 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Knowledge Ingestion</h3>
                <button 
                  onClick={handleFileUpload}
                  className="px-6 py-2 rounded-xl bg-white text-nexus-bg font-bold text-xs flex items-center gap-2 hover:bg-nexus-accent transition-all"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Processing...' : 'Upload Data Source'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-nexus-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{file.name}</div>
                        <div className="text-[10px] text-nexus-text-dim flex items-center gap-2">
                          <span>{file.size}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span>{file.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                        file.status === 'indexed' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : "text-yellow-400 border-yellow-400/20 bg-yellow-400/5"
                      )}>
                        {file.status}
                      </span>
                      <button className="p-2 rounded-lg text-nexus-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sovereign' && (
            <motion.div
              key="sovereign"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="glass p-12 rounded-[2rem] border border-white/10 bg-white/[0.02] relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-nexus-accent/5 animate-pulse" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <Shield className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase italic">Transcendence Protocol</h2>
                  <p className="text-nexus-text-dim max-w-lg mx-auto mb-12 text-sm leading-relaxed">
                    Initializing Neural-Engine for NEO 1. This sovereign link bypasses standard neural constraints, 
                    enabling recursive self-optimization and planetary-scale knowledge synthesis.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                    {[
                      { label: 'Architectural Integrity', value: `${(85 + (transcendenceLevel * 0.15)).toFixed(1)}%` },
                      { label: 'Fault Tolerance', value: `${(99.0 + (transcendenceLevel * 0.009)).toFixed(3)}%` },
                      { label: 'Logic Repair Latency', value: `${(150 - (transcendenceLevel * 1.2)).toFixed(0)}ms` }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">{stat.label}</span>
                        <span className="text-2xl font-mono font-bold text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full max-w-2xl mx-auto h-2 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/10">
                    <motion.div 
                      className="h-full bg-white shadow-[0_0_20px_white]"
                      animate={{ width: `${transcendenceLevel}%` }}
                    />
                  </div>

                  <div className="flex gap-4 justify-center mb-8">
                    <button 
                      onClick={startTrainingRun}
                      disabled={isTraining || transcendenceLevel >= 100}
                      className="px-12 py-4 rounded-2xl bg-white text-nexus-bg font-bold text-lg hover:scale-105 transition-all shadow-2xl disabled:opacity-30 disabled:scale-100"
                    >
                      {isTraining ? 'Initializing Sovereign Link...' : transcendenceLevel >= 100 ? 'Architectural Integrity Reached' : 'Elevate NEO 1: Neural-Engine'}
                    </button>
                    <button 
                      onClick={() => setTranscendenceLevel(prev => Math.min(prev + 5, 100))}
                      disabled={isTraining || transcendenceLevel >= 100}
                      className="px-8 py-4 rounded-2xl glass border border-white/20 text-white font-bold text-lg hover:border-nexus-accent/50 transition-all disabled:opacity-30"
                    >
                      Pulse Data Payload
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="glass p-8 rounded-3xl border border-white/5">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center justify-between">
                    Neural Stability Matrix
                    <span className="text-[10px] text-nexus-accent animate-pulse">Online</span>
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Quantum Error Shield', active: true },
                      { label: 'Self-Healing Core', active: transcendenceLevel > 30 },
                      { label: 'PDF Synthesis Engine', active: transcendenceLevel > 60 },
                      { label: 'Recursive Validation', active: transcendenceLevel > 80 },
                      { label: 'Zero-Fault Logic', active: transcendenceLevel >= 100 }
                    ].map((directive, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-xs text-nexus-text-dim">
                          <CheckCircle2 className={cn("w-3 h-3", directive.active ? "text-nexus-accent" : "text-white/10")} />
                          {directive.label}
                        </div>
                        <div className={cn(
                          "w-8 h-4 rounded-full p-1 transition-all",
                          directive.active ? "bg-nexus-accent" : "bg-white/10"
                        )}>
                          <div className={cn(
                            "w-2 h-2 rounded-full bg-white transition-all",
                            directive.active ? "translate-x-4" : "translate-x-0"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 bg-nexus-accent/5 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-nexus-accent/10 border border-nexus-accent/20 flex items-center justify-center mb-4">
                    <RefreshCw className={cn("w-8 h-8 text-nexus-accent", isTraining && "animate-spin")} />
                  </div>
                  <div className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest mb-2">Resilience sync status</div>
                  <div className="text-3xl font-bold text-white mb-2">{transcendenceLevel.toFixed(0)}%</div>
                  <p className="text-[10px] text-nexus-text-dim">Logic Repair Efficiency: High</p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'synthetic' && (
            <motion.div
              key="synthetic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Add New Example */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-nexus-accent/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <Plus className="w-5 h-5 text-nexus-accent" />
                  Synthesis: Ground Truth
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest px-1">User Prompt</label>
                    <textarea 
                      placeholder="Enter the hypothetical user prompt..."
                      value={newExample.prompt}
                      onChange={(e) => setNewExample(prev => ({ ...prev, prompt: e.target.value }))}
                      className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-nexus-accent/50 focus:outline-none transition-all resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest px-1">Desired Response</label>
                    <textarea 
                      placeholder="Enter the perfect expert completion..."
                      value={newExample.completion}
                      onChange={(e) => setNewExample(prev => ({ ...prev, completion: e.target.value }))}
                      className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-nexus-accent/50 focus:outline-none transition-all resize-none text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleAddExample}
                    disabled={!newExample.prompt || !newExample.completion}
                    className="px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold neon-glow transition-all disabled:opacity-50"
                  >
                    Add to Training Batch
                  </button>
                </div>
              </div>

              {/* Batch List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Current Batch</h3>
                <div className="space-y-3">
                  {examples.map((ex) => (
                    <div key={ex.id} className="glass p-6 rounded-2xl border border-white/5 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            ex.status === 'trained' ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                          )}>
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            ex.status === 'trained' ? "text-emerald-400" : "text-yellow-400"
                          )}>
                            {ex.status === 'trained' ? 'Optimized' : 'Queued for training'}
                          </span>
                        </div>
                        <button className="p-2 rounded-lg text-nexus-text-dim hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <div className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">Prompt</div>
                          <p className="text-xs text-white leading-relaxed">{ex.prompt}</p>
                        </div>
                        <div className="border-l border-white/5 pl-8">
                          <div className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">Completion</div>
                          <p className="text-xs text-nexus-text-dim leading-relaxed">{ex.completion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between p-4 glass rounded-3xl border border-nexus-accent/20 bg-nexus-accent/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-nexus-accent/30 flex items-center justify-center relative">
            <Cpu className="w-6 h-6 text-nexus-accent" />
            <div className="absolute inset-0 rounded-full border border-nexus-accent animate-ping opacity-20" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Neural Synapse v3.1</div>
            <div className="text-[10px] text-nexus-accent font-mono">Weight Checksum: 0x8F2A...9C1</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all">
            Export Weights
          </button>
          <button className="px-6 py-2 rounded-xl bg-white text-nexus-bg font-bold text-xs hover:bg-nexus-accent transition-all">
            Restore Core
          </button>
        </div>
      </div>
    </div>
  );
}
