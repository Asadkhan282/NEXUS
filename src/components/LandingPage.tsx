import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Code2,
  Globe,
  Database,
  Lock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import Login from './Login';

export default function LandingPage() {
  const [showLogin, setShowLogin] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (showLogin) {
    return <Login />;
  }

  const features = [
    {
      icon: MessageSquare,
      title: "Neural Chat",
      desc: "Multi-model dialogue with chain-of-thought orchestration.",
      color: "from-nexus-accent to-nexus-accent/50"
    },
    {
      icon: ImageIcon,
      title: "Vision Synthesis",
      desc: "High-fidelity image generation with spatial precision.",
      color: "from-nexus-purple to-nexus-purple/50"
    },
    {
      icon: Video,
      title: "Motion Gen",
      desc: "Cinematic video generation using the latest neural seeds.",
      color: "from-nexus-accent to-nexus-purple"
    },
    {
      icon: Code2,
      title: "Logic Architect",
      desc: "Production-ready code synthesis across all modern stacks.",
      color: "from-nexus-purple to-nexus-accent"
    }
  ];

  const stats = [
    { value: "4.2T", label: "Neural Parameters" },
    { value: "98.4%", label: "Sync Accuracy" },
    { value: "< 2ms", label: "Neural Latency" },
    { value: "24/7", label: "Link Availability" }
  ];

  return (
    <div className="min-h-screen bg-nexus-bg text-white overflow-x-hidden selection:bg-nexus-accent selection:text-nexus-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-nexus-bg/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-nexus-accent flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-nexus-bg" />
            </div>
            <span className="text-xl font-bold tracking-tighter">NEXUS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-nexus-text-dim hover:text-white transition-colors">Protocols</a>
            <a href="#network" className="text-sm font-medium text-nexus-text-dim hover:text-white transition-colors">Network</a>
            <a href="#security" className="text-sm font-medium text-nexus-text-dim hover:text-white transition-colors">Security</a>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-6 py-2.5 rounded-full bg-white text-nexus-bg font-bold text-sm hover:bg-nexus-accent transition-all"
            >
              Initialize Link
            </button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-52 md:pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-0 w-96 h-96 bg-nexus-accent/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-nexus-purple/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-nexus-accent">Neural Protocol 2.5 Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8"
            >
              THE WORLD'S <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-accent via-nexus-purple to-nexus-accent bg-[length:200%_auto] animate-gradient-x">MULTIMODAL</span> <br />
              ARCHITECT.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-nexus-text-dim max-w-2xl mb-12 leading-relaxed"
            >
              NEXUS is a sovereign AI infrastructure designed to architect, analyze, and synthesize across the neural landscape. Text, vision, and motion—unified.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-nexus-accent text-nexus-bg font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 neon-glow shadow-[0_0_30px_rgba(0,242,255,0.3)]"
              >
                Get Started
                <ArrowRight className="w-6 h-6" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                View Protocols
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-nexus-text-dim font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-nexus-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
                NEURAL <span className="text-nexus-accent italic serif">SPECTRUM</span> <br />
                CAPABILITIES.
              </h2>
              <p className="text-lg text-nexus-text-dim leading-relaxed">
                NEXUS integrates global neural knowledge with advanced creative synthesis to provide a unified architect interface for every modality.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-nexus-accent pb-2">
              <span className="animate-pulse">System Status: Nominal</span>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-full h-full bg-nexus-accent animate-progress" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[32px] glass border border-white/5 hover:border-nexus-accent/20 transition-all flex flex-col h-full bg-white/[0.01]"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br shadow-inner",
                  feature.color
                )}>
                  <feature.icon className="w-7 h-7 text-nexus-bg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-nexus-text-dim text-sm leading-relaxed mb-8 flex-1">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-nexus-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Protocol Details <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Typographic Section */}
      <section className="py-40 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] flex flex-col justify-around rotate-12 pointer-events-none">
          <div className="text-[20vw] font-bold whitespace-nowrap -ml-40 tracking-tighter leading-none">NEURAL NETWORK NEXUS</div>
          <div className="text-[20vw] font-bold whitespace-nowrap -ml-80 tracking-tighter leading-none opa">MACHINE INTELLIGENCE CORE</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-nexus-purple">Security Protocols</div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">SOVEREIGN BY <br />DESIGN.</h2>
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: Shield, title: "Vault Encryption", desc: "Data is encrypted via AES-512 neural lattice." },
                  { icon: Lock, title: "Identity Fingerprint", desc: "Biometric auth ensures only you hold the keys." },
                  { icon: Globe, title: "Global Mesh", desc: "Edge-computed nodes for zero-latency link." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-nexus-purple/20 transition-colors">
                      <item.icon className="w-5 h-5 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-nexus-text-dim leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-nexus-accent/20 to-nexus-purple/20 rounded-[40px] blur-3xl animate-pulse" />
              <div className="relative aspect-square glass rounded-[40px] border border-white/10 overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/cyber/1000/1000" 
                  alt="Neural Architecture" 
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 p-8 glass bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Core Stable</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-mono italic">
                    "Architecting the future requires more than just intelligence—it requires a synthesized neural presence."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-nexus-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-4">
              READY TO <br />
              <span className="text-nexus-accent italic serif">EVOLVE?</span>
            </h2>
            <p className="text-xl md:text-2xl text-nexus-text-dim max-w-2xl mx-auto leading-relaxed mb-8">
              Join the neural mesh and start architecting your vision today across the full spectrum of modality.
            </p>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-16 py-6 rounded-[2rem] bg-white text-nexus-bg font-bold text-xl hover:bg-nexus-accent transition-all neon-glow shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              Enter NEXUS Core
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="py-12 border-t border-white/5 bg-nexus-bg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-nexus-accent flex items-center justify-center">
              <Cpu className="w-5 h-5 text-nexus-bg" />
            </div>
            <span className="text-sm font-bold tracking-tighter">NEXUS MESH SYSTEM</span>
          </div>
          
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-nexus-text-dim">
            <span className="hover:text-white cursor-pointer transition-colors">Neural Sovereignty</span>
            <span className="hover:text-white cursor-pointer transition-colors">Safety Protocols</span>
            <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            © 2026 NEXUS NEURAL ARCHITECT
          </div>
        </div>
      </footer>
    </div>
  );
}
