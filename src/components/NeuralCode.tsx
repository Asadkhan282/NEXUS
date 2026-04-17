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
  const [selectedFile, setSelectedFile] = React.useState('server.ts');
  const [activeProject, setActiveProject] = React.useState('nexus-core-v3');

  const files = {
    'server.ts': `import express from 'express';
import { initializeApp } from 'firebase/app';

const app = express();
const PORT = 3000;

// Initialize Neural Link
app.listen(PORT, () => {
  console.log(\`Neural Core Online on port \${PORT}\`);
});`,
    'types.ts': `export interface NeuralNode {
  id: string;
  type: 'logic' | 'memory' | 'fabric';
  weights: Float32Array;
  bias: number;
}`,
    'main.rs': `fn main() {
    println!("Initializing Neural Canvas Engine...");
    let mut core = NeuralCore::new();
    core.sync();
}`
  };

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
              <button 
                key={project.id} 
                onClick={() => setActiveProject(project.name)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-colors group",
                  activeProject === project.name ? "bg-nexus-accent/10 border border-nexus-accent/20" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Braces className="w-4 h-4 text-nexus-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{project.name}</div>
                    <div className="text-[9px] text-nexus-text-dim">{project.language}</div>
                  </div>
                </div>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-green-500 transition-opacity",
                  activeProject === project.name ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )} />
              </button>
            ))}
            
            <div className="pt-4 px-2 pb-2">
              <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest">Recent Files</span>
            </div>
            {Object.keys(files).map(file => (
              <button 
                key={file}
                onClick={() => setSelectedFile(file)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg text-[10px] transition-all",
                  selectedFile === file ? "bg-white/10 text-white" : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                )}
              >
                <FileCode className="w-3.5 h-3.5" />
                {file}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <FileCode className="w-3 h-3 text-nexus-accent" />
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">{selectedFile}</span>
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
              <pre className="text-white">
                <code>
                  {(files as any)[selectedFile].split('\n').map((line: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-white/10 select-none w-4 text-right pr-2">{i + 1}</span>
                      <span className={cn(
                        line.includes('import') || line.includes('const') || line.includes('fn') || line.includes('let') || line.includes('mut')
                          ? "text-nexus-purple" 
                          : line.includes("'") || line.includes('"')
                            ? "text-nexus-accent"
                            : "text-white"
                      )}>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
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
