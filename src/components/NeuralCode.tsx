import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Zap, 
  Shield, 
  Copy, 
  Download, 
  Play,
  FileCode,
  Braces,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

const projects = [
  { id: '1', name: 'nexus-core-v3', language: 'TypeScript', status: 'Stable' },
  { id: '2', name: 'neural-canvas-engine', language: 'Rust', status: 'Active' },
  { id: '3', name: 'motion-gen-api', language: 'Python', status: 'Testing' }
];

export default function NeuralCode() {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Nexus Code</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Architect production-ready neural systems</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Project Explorer */}
        <div className="lg:col-span-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Explorer</span>
              <button className="p-1 rounded-md bg-nexus-accent/10 border border-nexus-accent/20 text-nexus-accent hover:bg-nexus-accent/20 transition-all group" title="New Project">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <FileCode className="w-4 h-4 text-nexus-text-dim" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {projects.map((project) => (
              <button key={project.id} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Braces className="w-4 h-4 text-nexus-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{project.name}</div>
                    <div className="text-[9px] text-nexus-text-dim">{project.language}</div>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Editor Placeholder */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <FileCode className="w-3 h-3 text-nexus-accent" />
                  <span className="text-[10px] font-bold text-white">server.ts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-nexus-accent/20 text-nexus-accent hover:bg-nexus-accent/30 transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-black/40">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">1</span>
                  <span className="text-nexus-purple">import</span>
                  <span className="text-white">express</span>
                  <span className="text-nexus-purple">from</span>
                  <span className="text-nexus-accent">'express'</span>
                  <span className="text-white">;</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">2</span>
                  <span className="text-nexus-purple">import</span>
                  <span className="text-white">{"{ initializeApp }"}</span>
                  <span className="text-nexus-purple">from</span>
                  <span className="text-nexus-accent">'firebase/app'</span>
                  <span className="text-white">;</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">3</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">4</span>
                  <span className="text-nexus-purple">const</span>
                  <span className="text-white">app = express();</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">5</span>
                  <span className="text-nexus-purple">const</span>
                  <span className="text-white">PORT = 3000;</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">6</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">7</span>
                  <span className="text-white/40">// Initialize Neural Link</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">8</span>
                  <span className="text-white">app.listen(PORT, () ={">"} {"{"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">9</span>
                  <span className="ml-4 text-white">console.log(</span>
                  <span className="text-nexus-accent">`Neural Core Online on port ${'{'}PORT{'}'}`</span>
                  <span className="text-white">);</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/20 select-none w-4">10</span>
                  <span className="text-white">{"}"});</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="h-40 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 bg-black/20">
              <Terminal className="w-3 h-3 text-nexus-text-dim" />
              <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Neural Terminal</span>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] text-nexus-text-dim overflow-y-auto bg-black/60">
              <div className="flex gap-2">
                <span className="text-nexus-accent">nexus@core:~$</span>
                <span className="text-white">npm run build:neural</span>
              </div>
              <div className="mt-2 text-white/40">[{">"}] Initializing TPU v5p acceleration...</div>
              <div className="text-white/40">[{">"}] Compiling custom CUDA kernels...</div>
              <div className="text-green-400">[{">"}] Build successful. Neural Link established.</div>
              <div className="flex gap-2 mt-2">
                <span className="text-nexus-accent">nexus@core:~$</span>
                <span className="w-2 h-4 bg-nexus-accent animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
