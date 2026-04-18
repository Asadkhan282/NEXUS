import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  BookOpen, 
  ListChecks,
  Brain,
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
  User,
  Users,
  Activity,
  Terminal,
  Trello,
  Layers as LayersIcon,
  HardDrive
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NeuralDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function NeuralDashboard({ setActiveTab }: NeuralDashboardProps) {
  const [hoveredModule, setHoveredModule] = React.useState<string | null>(null);

  const modules = [
    { icon: MessageSquare, label: "Neural Chat", tab: 'chat', color: 'text-blue-400', desc: 'Advanced multimodal conversation' },
    { icon: ListChecks, label: "Neural Tasks", tab: 'tasks', color: 'text-nexus-accent', desc: 'Prioritize and synchronize objectives' },
    { icon: Brain, label: "Neural Training", tab: 'training', color: 'text-nexus-accent', desc: 'Knowledge ingestion & model fine-tuning' },
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
    { icon: Users, label: "Neural Agency", tab: 'agency', color: 'text-nexus-accent', desc: 'Autonomous multi-agent swarms' },
    { icon: Settings, label: "Architect", tab: 'architect', color: 'text-nexus-text-dim', desc: 'Configure neural core parameters' },
  ];

  return (
    <div className="h-full flex flex-col p-0 overflow-y-auto no-scrollbar bg-[#020203]">
      {/* Top Header Section */}
      <div className="border-b border-white/5 bg-white/[0.02] p-8 md:p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 mb-6 justify-center md:justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-nexus-accent flex items-center justify-center neon-glow">
                <Cpu className="w-6 h-6 text-nexus-bg" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-nexus-accent uppercase tracking-widest">Core Status: Online</span>
                <span className="text-xs text-nexus-text-dim">Nexus Quantum Subsystem v4.2</span>
              </div>
            </motion.div>
            
            <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
        >
          OPERATING <span className="text-nexus-accent">NEXUS</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-nexus-text-dim max-w-xl leading-relaxed text-sm md:text-base font-medium"
        >
          Advanced multimodal command interface. Orchestrate neural swarms, 
          synthesize cinematic motion, and architect the future of silicon.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
        {[
          { label: 'Active Nodes', value: '1,024', icon: Activity, color: 'text-nexus-accent' },
          { label: 'Neural Flux', value: '0.82 TH/s', icon: Zap, color: 'text-yellow-400' },
          { label: 'Data Scoped', value: '42.0 PB', icon: HardDrive, color: 'text-nexus-purple' },
          { label: 'Sovereign Link', value: 'ONLINE', icon: Shield, color: 'text-white' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass p-4 rounded-2xl border border-white/5 flex flex-col gap-2 min-w-[140px]"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={cn("w-3 h-3", stat.color)} />
              <div className="w-1 h-1 rounded-full bg-nexus-accent animate-pulse" />
            </div>
            <span className="text-lg font-mono font-bold text-white tracking-tighter">{stat.value}</span>
            <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col gap-8">

    {/* Module Grid - Mission Control Style */}
    <div className="grid grid-cols-1 md:grid-cols-12 border-t border-l border-white/5">
      {modules.map((module, i) => (
        <motion.button
          key={module.tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          onMouseEnter={() => setHoveredModule(module.tab)}
          onMouseLeave={() => setHoveredModule(null)}
          onClick={() => setActiveTab(module.tab)}
          className={cn(
            "md:col-span-3 h-48 border-r border-b border-white/5 relative group transition-all p-6 flex flex-col text-left",
            hoveredModule === module.tab ? "bg-white/[0.03]" : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-2 rounded-lg transition-all",
              hoveredModule === module.tab ? "bg-nexus-accent/20" : "bg-white/5"
            )}>
              <module.icon className={cn("w-5 h-5", module.color)} />
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
              MOD-{(i + 1).toString().padStart(2, '0')}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-nexus-accent transition-colors leading-none">
            {module.label}
          </h3>
          <p className="text-[11px] text-nexus-text-dim leading-relaxed line-clamp-2">
            {module.desc}
          </p>

          <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Initialize Module</span>
            <Zap className="w-3 h-3 text-nexus-accent" />
          </div>

          {/* Detail lines for technical feel */}
          <div className="absolute top-0 left-0 w-2 h-[1px] bg-nexus-accent/40" />
          <div className="absolute top-0 left-0 w-[1px] h-2 bg-nexus-accent/40" />
          <motion.div 
            className="absolute bottom-0 right-0 h-1 bg-nexus-accent"
            initial={{ width: 0 }}
            animate={{ width: hoveredModule === module.tab ? '100%' : 0 }}
          />
        </motion.button>
      ))}
    </div>

    {/* Neural Telemetry Bar */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="glass rounded-2xl border border-white/5 p-6 flex flex-wrap items-center justify-between gap-8"
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-widest mb-1">Global Transmissions</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white">42 Feed Streams Active</span>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-widest mb-1">System Health</span>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                className="h-full bg-nexus-accent"
              />
            </div>
            <span className="text-[10px] font-mono text-nexus-accent">92%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border border-black bg-nexus-bg flex items-center justify-center">
              <User className="w-3 h-3 text-nexus-text-dim" />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">1,240 Agents Synced</span>
      </div>
    </motion.div>

    {/* Footer Rail */}
    <div className="flex items-center justify-between border-t border-white/5 pt-8 opacity-40 hover:opacity-100 transition-opacity">
      <div className="flex gap-12">
        {[
          { icon: Shield, label: 'Secure protocol active' },
          { icon: Terminal, label: 'Quantum Kernel v3.1' },
          { icon: Trello, label: 'Swarm Orchestrator' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className="w-3.5 h-3.5 text-nexus-accent" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-white">{item.label}</span>
          </div>
        ))}
      </div>
      <span className="text-[10px] font-mono text-nexus-text-dim">45.0210° N, 122.6830° W</span>
    </div>
      </div>
    </div>
  );
}
