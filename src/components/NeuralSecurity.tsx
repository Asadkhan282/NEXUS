import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Activity, 
  Zap, 
  AlertTriangle,
  Terminal,
  Globe,
  Fingerprint
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function NeuralSecurity() {
  const [isFirewallActive, setIsFirewallActive] = React.useState(true);
  const [threatLevel, setThreatLevel] = React.useState('Low');

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural Security</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Monitor and protect your neural infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2",
            threatLevel === 'Low' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            <Activity className="w-4 h-4" />
            Threat Level: {threatLevel}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Real-time Monitor */}
        <div className="lg:col-span-2 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden group">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-nexus-accent" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Neural Traffic & Threat Map</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse" />
                <span className="text-[10px] text-nexus-text-dim uppercase">Inbound: 1.2 GB/s</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-nexus-purple animate-pulse" />
                <span className="text-[10px] text-nexus-text-dim uppercase">Outbound: 0.8 GB/s</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-0 relative bg-black/40 overflow-hidden">
            {/* World Map SVG Background (Simplified) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none p-12">
              <svg viewBox="0 0 800 400" className="w-full h-full text-white fill-current">
                <path d="M150,150 Q180,100 250,120 T350,100 T450,150 T550,120 T650,150 M100,200 Q150,250 200,220 T300,250 T400,200 T500,230 T600,200" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="120" cy="140" r="2" />
                <circle cx="210" cy="180" r="2" />
                <circle cx="340" cy="120" r="2" />
                <circle cx="480" cy="220" r="2" />
                <circle cx="590" cy="160" r="2" />
                <circle cx="680" cy="240" r="2" />
              </svg>
            </div>

            {/* Simulated Attacks */}
            <div className="absolute inset-0 z-10">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0.5, 2],
                    x: [Math.random() * 600 + 100, Math.random() * 600 + 100],
                    y: [Math.random() * 300 + 50, Math.random() * 300 + 50]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 2,
                    ease: "easeOut" 
                  }}
                  className="absolute w-8 h-8 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center"
                >
                  <div className="w-1 h-1 rounded-full bg-red-500" />
                  <div className="absolute -top-6 text-[8px] font-bold text-red-400 whitespace-nowrap uppercase">
                    Detected Leak {i}
                  </div>
                </motion.div>
              ))}
              
              {/* Traffic Arcs */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`arc-${i}`}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 1.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <svg viewBox="0 0 800 400" className="w-full h-full">
                    <motion.path
                      d={`M${100 + i * 100},${200} Q${400},${50} ${700 - i * 50},${300}`}
                      fill="none"
                      stroke={i % 2 === 0 ? "#00f2ff" : "#a855f7"}
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -20 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </motion.div>
              ))}
            </div>
            
            <div className="relative h-full flex flex-col justify-center items-center z-20 hover:backdrop-blur-[2px] transition-all">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-56 h-56 rounded-full border-2 border-nexus-accent/30 flex items-center justify-center relative bg-nexus-bg/20 backdrop-blur-md"
              >
                <div className="w-48 h-48 rounded-full border border-nexus-accent/20 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-nexus-accent neon-glow" />
                </div>
                
                {/* Orbiting Nodes */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-nexus-accent/50 shadow-[0_0_10px_#00f5ff]"
                      style={{ transform: `translateY(-12px)` }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-2xl">
                {[
                  { label: 'Encryption', value: 'AES-512', icon: Lock },
                  { label: 'Auth Protocol', value: 'Neural-ID', icon: Fingerprint },
                  { label: 'Integrity', value: 'Verified', icon: Zap }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-5 h-5 text-nexus-text-dim mx-auto mb-2" />
                    <div className="text-[10px] text-nexus-text-dim uppercase mb-1">{stat.label}</div>
                    <div className="text-xs font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-6">Neural Firewall</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setIsFirewallActive(!isFirewallActive)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                  isFirewallActive ? "bg-nexus-accent/10 border-nexus-accent" : "bg-white/5 border-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Shield className={cn("w-5 h-5", isFirewallActive ? "text-nexus-accent" : "text-nexus-text-dim")} />
                  <span className={cn("text-sm font-bold", isFirewallActive ? "text-white" : "text-nexus-text-dim")}>
                    Active Shielding
                  </span>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full relative transition-all",
                  isFirewallActive ? "bg-nexus-accent" : "bg-white/10"
                )}>
                  <motion.div 
                    animate={{ x: isFirewallActive ? 22 : 2 }}
                    className="absolute top-1 w-3 h-3 rounded-full bg-white"
                  />
                </div>
              </button>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-nexus-text-dim uppercase">Deep Packet Inspection</span>
                  <span className="text-[10px] font-bold text-nexus-accent">ENABLED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-nexus-text-dim uppercase">Anomalous Detection</span>
                  <span className="text-[10px] font-bold text-nexus-accent">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">Security Logs</h3>
              <Terminal className="w-4 h-4 text-nexus-text-dim" />
            </div>
            <div className="space-y-3 font-mono">
              {[
                { time: '18:32:01', msg: 'Neural handshake verified', type: 'info' },
                { time: '18:30:45', msg: 'Unauthorized access blocked', type: 'alert' },
                { time: '18:28:12', msg: 'Encryption keys rotated', type: 'info' },
                { time: '18:25:59', msg: 'Firewall rules updated', type: 'info' }
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px]">
                  <span className="text-nexus-text-dim">{log.time}</span>
                  <span className={cn(log.type === 'alert' ? "text-red-400" : "text-emerald-400")}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Core Lockdown
          </button>
        </div>
      </div>
    </div>
  );
}
