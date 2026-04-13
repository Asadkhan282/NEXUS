import React from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  TrendingUp, 
  Globe, 
  Zap, 
  Cpu, 
  Shield, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

const newsItems = [
  {
    id: '1',
    title: 'Gemini 2.0 Pro: The New Benchmark in Multimodal Reasoning',
    category: 'Neural Update',
    time: '2 hours ago',
    description: 'The latest core update from Google DeepMind sets new records in complex logic and long-context understanding.',
    image: 'https://picsum.photos/seed/ai1/800/400'
  },
  {
    id: '2',
    title: 'Quantum Neural Networks: Bridging the Gap',
    category: 'Research',
    time: '5 hours ago',
    description: 'Researchers at the NEXUS Lab have successfully demonstrated quantum entanglement in synthetic neural pathways.',
    image: 'https://picsum.photos/seed/ai2/800/400'
  },
  {
    id: '3',
    title: 'The Rise of Autonomous Code Architects',
    category: 'Industry',
    time: '1 day ago',
    description: 'How AI agents are transforming the landscape of software engineering and system design.',
    image: 'https://picsum.photos/seed/ai3/800/400'
  }
];

export default function NeuralNews() {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural News</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Stay synchronized with the latest in AI evolution</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexus-accent/10 border border-nexus-accent/20 text-[10px] font-bold text-nexus-accent uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" />
            Live Feed
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">
            <Globe className="w-3 h-3" />
            Global Sync
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {newsItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl border border-white/10 overflow-hidden group cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-nexus-accent text-nexus-bg text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-4">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-nexus-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-nexus-text-dim leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-nexus-accent">
                    Read Full Transmission
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-nexus-accent" />
                Neural Pulse
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Global Inference Load', value: 'High' },
                  { label: 'Neural Coherence', value: '99.8%' },
                  { label: 'Active Architectures', value: '1.2M' }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-nexus-text-dim">{stat.label}</span>
                    <span className="text-xs font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Trending Architectures</h3>
              <div className="space-y-4">
                {[
                  '#QuantumComputing',
                  '#NeuralSynthesis',
                  '#Gemini2Pro',
                  '#MultimodalAI'
                ].map((tag) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-nexus-text-dim group-hover:text-nexus-accent transition-colors">{tag}</span>
                    <TrendingUp className="w-4 h-4 text-white/10 group-hover:text-nexus-accent transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 bg-nexus-accent/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-nexus-accent flex items-center justify-center neon-glow mb-6">
                <Shield className="w-8 h-8 text-nexus-bg" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Neural Newsletter</h3>
              <p className="text-xs text-nexus-text-dim leading-relaxed mb-6">
                Get the latest neural transmissions delivered directly to your core.
              </p>
              <div className="w-full space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your neural ID..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-nexus-accent outline-none transition-all"
                />
                <button className="w-full py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-xs hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
