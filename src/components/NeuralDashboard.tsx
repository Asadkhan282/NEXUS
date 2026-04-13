import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  BookOpen, 
  Beaker, 
  Newspaper, 
  Palette, 
  Settings, 
  Grid,
  Zap,
  Shield,
  Sparkles,
  MessageSquare,
  Code2,
  Image as ImageIcon,
  Video,
  Microchip,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NeuralDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function NeuralDashboard({ setActiveTab }: NeuralDashboardProps) {
  const modules = [
    { icon: MessageSquare, label: "Neural Chat", tab: 'chat', color: 'text-blue-400', desc: 'Advanced multimodal conversation' },
    { icon: BookOpen, label: "Academy", tab: 'academy', color: 'text-nexus-accent', desc: 'Master neural logic & architecture' },
    { icon: Beaker, label: "Neural Lab", tab: 'lab', color: 'text-emerald-400', desc: 'Experimental research & telemetry' },
    { icon: Newspaper, label: "Neural News", tab: 'news', color: 'text-nexus-purple', desc: 'Global AI transmissions & updates' },
    { icon: Microchip, label: "Neural Silicon", tab: 'silicon', color: 'text-emerald-500', desc: 'Architect custom AI-optimized hardware' },
    { icon: Shield, label: "Security", tab: 'security', color: 'text-red-500', desc: 'Monitor & protect neural infrastructure' },
    { icon: User, label: "Account", tab: 'account', color: 'text-blue-400', desc: 'Manage profile & configurations' },
    { icon: Palette, label: "Canvas", tab: 'canvas', color: 'text-pink-400', desc: 'Synthesize vision & motion' },
    { icon: Code2, label: "Nexus Code", tab: 'code', color: 'text-orange-400', desc: 'Architect production-ready systems' },
    { icon: ImageIcon, label: "Vision", tab: 'image', color: 'text-yellow-400', desc: 'Generate high-fidelity imagery' },
    { icon: Video, label: "Motion", tab: 'video', color: 'text-red-400', desc: 'Synthesize cinematic video' },
    { icon: Settings, label: "Architect", tab: 'architect', color: 'text-nexus-text-dim', desc: 'Configure neural core parameters' },
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto w-full py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-3xl bg-nexus-accent flex items-center justify-center neon-glow mb-8 flex-shrink-0"
        >
          <Cpu className="w-10 h-10 text-nexus-bg" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4"
        >
          Welcome to <span className="text-nexus-accent">NEXUS</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-nexus-text-dim max-w-2xl mb-16 leading-relaxed text-base md:text-lg px-4"
        >
          The next evolution in multimodal intelligence. Access the full suite of neural tools 
          to architect, visualize, and synthesize the future.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          {modules.map((module, i) => (
            <motion.button
              key={module.tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => setActiveTab(module.tab)}
              className="flex flex-col items-start p-6 rounded-3xl glass border border-white/5 hover:border-nexus-accent/30 transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-accent/5 blur-3xl -mr-16 -mt-16 group-hover:bg-nexus-accent/10 transition-colors" />
              
              <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-nexus-accent/10 transition-colors mb-6">
                <module.icon className={cn("w-6 h-6", module.color)} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nexus-accent transition-colors">{module.label}</h3>
              <p className="text-sm text-nexus-text-dim leading-relaxed">
                {module.desc}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Neural Status Monitor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Neural Latency', value: '12ms', sub: 'Optimal', color: 'text-nexus-accent' },
            { label: 'Inference Load', value: '24.8%', sub: 'Stable', color: 'text-emerald-400' },
            { label: 'Uptime', value: '99.99%', sub: 'Active', color: 'text-nexus-purple' }
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">{stat.label}</span>
              <span className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.sub}</span>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-nexus-accent" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Neural Shield Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-nexus-accent" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Quantum Core v3.1</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nexus-accent" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Multimodal Fusion</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
