import React from 'react';
import { motion } from 'motion/react';

export default function NeuralFrequency() {
  const [bars, setBars] = React.useState(new Array(20).fill(0).map(() => Math.random()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(bar => {
        const delta = (Math.random() - 0.5) * 0.2;
        return Math.max(0.1, Math.min(1, bar + delta));
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-0.5 h-12 px-4 py-2 bg-nexus-accent/5 rounded-xl border border-nexus-accent/10 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-t from-nexus-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-nexus-accent/40 rounded-t-sm"
          animate={{ height: `${height * 100}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
        />
      ))}
      <div className="absolute top-1 left-2 flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-nexus-accent animate-pulse" />
        <span className="text-[7px] font-mono text-nexus-accent uppercase tracking-widest opacity-60">Neural Freq</span>
      </div>
    </div>
  );
}
