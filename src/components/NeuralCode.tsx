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
  Plus,
  Loader2,
  Trash2,
  Library,
  Layers,
  FileJson
} from 'lucide-react';
import { cn } from '../lib/utils';
import Editor from '@monaco-editor/react';

const SNIPPETS = [
  {
    label: 'React Fragment',
    icon: Code2,
    code: `
export const NeuralModule = () => {
  return (
    <div className="glass p-6 rounded-3xl border border-white/10">
      <h2 className="text-nexus-accent font-bold uppercase tracking-widest text-xs">Neural Node v1.0</h2>
      <p className="text-white/60 text-sm mt-2">Active synaptic processing initiated.</p>
    </div>
  );
};`
  },
  {
    label: 'Cloud Logic',
    icon: Terminal,
    code: `
router.post('/sync', async (req, res) => {
  const { payload } = req.body;
  console.log('Synchronizing neural weights:', payload);
  res.json({ status: 'stabilized', latency: '12ms' });
});`
  },
  {
    label: 'Python Core',
    icon: Cpu,
    code: `
class NeuralCore:
    def __init__(self, layers=[64, 32, 16]):
        self.weights = [np.random.randn(y, x) for x, y in zip(layers[:-1], layers[1:])]
        self.biases = [np.random.randn(y, 1) for y in layers[1:]]

    def synthesize(self, x):
        return x * self.weights`
  }
];

const initialProjects = [
  { id: '1', name: 'nexus-core-v3', language: 'TypeScript', status: 'Stable' },
  { id: '2', name: 'neural-canvas-engine', language: 'Rust', status: 'Active' },
  { id: '3', name: 'motion-gen-api', language: 'Python', status: 'Testing' }
];

const initialFiles: Record<string, { content: string, project: string }> = {
  'server.ts': {
    project: 'nexus-core-v3',
    content: `import express from 'express';
import { initializeApp } from 'firebase/app';

const app = express();
const PORT = 3000;

// Initialize Neural Link
app.listen(PORT, () => {
  console.log(\`Neural Core Online on port \${PORT}\`);
});`
  },
  'types.ts': {
    project: 'nexus-core-v3',
    content: `export interface NeuralNode {
  id: string;
  type: 'logic' | 'memory' | 'fabric';
  weights: Float32Array;
  bias: number;
}`
  },
  'main.rs': {
    project: 'neural-canvas-engine',
    content: `fn main() {
    println!("Initializing Neural Canvas Engine...");
    let mut core = NeuralCore::new();
    core.sync();
}`
  },
  'api.py': {
    project: 'motion-gen-api',
    content: `def generate_motion(prompt: str):
    print(f"Generating motion for: {prompt}")
    return {"status": "success", "id": "task_923"}`
  }
};

export default function NeuralCode() {
  const [projects, setProjects] = React.useState(initialProjects);
  const [selectedFile, setSelectedFile] = React.useState('server.ts');
  const [activeProject, setActiveProject] = React.useState('nexus-core-v3');
  const [isRunning, setIsRunning] = React.useState(false);
  
  const [fileData, setFileData] = React.useState(initialFiles);

  const [terminalLogs, setTerminalLogs] = React.useState<{ 
    type: 'cmd' | 'info' | 'success' | 'err', 
    text: string,
    suggestion?: string
  }[]>([
    { type: 'cmd', text: 'npm run build:neural' },
    { type: 'info', text: 'Initializing TPU v5p acceleration...' },
    { type: 'success', text: 'Build successful. Neural Link established.' }
  ]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const code = fileData[selectedFile]?.content || '';
    const newLogs: any[] = [
      { type: 'cmd', text: `node ${selectedFile}` },
      { type: 'info', text: 'Spawning neural process cluster...' },
    ];
    
    setTerminalLogs(prev => [...prev, ...newLogs]);

    setTimeout(() => {
      // Heuristic diagnostic check
      if (code.toLowerCase().includes('error') || code.length < 20) {
        setTerminalLogs(prev => [...prev, { 
          type: 'err', 
          text: `CRITICAL_FAILURE in [${selectedFile}]: Synaptic Alignment Error.`,
          suggestion: 'High weight variance detected in neural layers. Recommendation: Re-verify imports or run "nexus doc fix" to stabilize cognitive entropy.'
        }]);
      } else {
        setTerminalLogs(prev => [...prev, { type: 'success', text: `Neural node [${selectedFile}] is now ACTIVE.` }]);
      }
      setIsRunning(false);
    }, 2000);
  };

  const [lastSaved, setLastSaved] = React.useState<Date>(new Date());

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFileData(prev => ({
      ...prev,
      [selectedFile]: {
        ...prev[selectedFile],
        content: value
      }
    }));
    setLastSaved(new Date());
  };

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'rs': return 'rust';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  };

  const handleAddProject = () => {
    const name = prompt('Enter project name:');
    if (!name) return;
    const id = Date.now().toString();
    setProjects(prev => [...prev, { id, name, language: 'TypeScript', status: 'Active' }]);
    setActiveProject(name);
  };

  const handleAddFile = () => {
    const name = prompt('Enter file name (with extension):');
    if (!name) return;
    setFileData(prev => ({
      ...prev,
      [name]: {
        project: activeProject,
        content: '// New Neural Module\n'
      }
    }));
    setSelectedFile(name);
  };

  const filteredFiles = Object.entries(fileData).filter(([_, data]) => data.project === activeProject);
  const currentCode = fileData[selectedFile]?.content || '';

  return (
    <div className="min-h-full flex flex-col p-4 md:p-8 bg-black/20 relative z-10 pointer-events-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Nexus Code 
            <span className="text-nexus-text-dim/40 font-light">/</span> 
            <span className="text-nexus-accent uppercase tracking-tighter">{activeProject}</span>
          </h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Architect production-ready neural systems</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Explorer */}
        <div className="lg:col-span-2 glass rounded-3xl border border-white/10 flex flex-col h-[400px] lg:h-auto overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-nexus-accent animate-pulse" />
                 Active: {activeProject}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAddProject}
                className="p-1 rounded-md bg-white/5 border border-white/10 text-nexus-text-dim hover:text-nexus-accent hover:border-nexus-accent/20 transition-all" 
                title="New Project"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button 
                onClick={handleAddFile}
                className="p-1 rounded-md bg-white/5 border border-white/10 text-nexus-text-dim hover:text-white hover:border-white/20 transition-all"
                title="New File"
              >
                <FileCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {projects.map((project) => (
              <button 
                key={project.id} 
                onClick={() => {
                  setActiveProject(project.name);
                  const firstFile = Object.keys(fileData).find(name => fileData[name].project === project.name);
                  if (firstFile) setSelectedFile(firstFile);
                }}
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
              <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest">Project Files</span>
            </div>
            {filteredFiles.map(([fileName, _]) => (
              <div key={fileName} className="group/file relative">
                <button 
                  onClick={() => setSelectedFile(fileName)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-[10px] transition-all",
                    selectedFile === fileName ? "bg-white/10 text-white" : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                  )}
                >
                  <FileCode className={cn("w-3.5 h-3.5", selectedFile === fileName ? "text-nexus-accent" : "text-nexus-text-dim")} />
                  {fileName}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Sever link to ${fileName}?`)) {
                      setFileData(prev => {
                        const next = { ...prev };
                        delete next[fileName];
                        return next;
                      });
                      if (selectedFile === fileName) {
                        const remaining = Object.keys(fileData).filter(f => f !== fileName && fileData[f].project === activeProject);
                        if (remaining.length > 0) setSelectedFile(remaining[0]);
                      }
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500/20 text-red-500/0 group-hover/file:text-red-500/60 transition-all"
                  title="Delete File"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex-1 min-h-[500px] glass rounded-3xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 group">
                    <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest group-hover:text-nexus-accent transition-colors">{activeProject}</span>
                    <span className="text-white/20">/</span>
                    <FileCode className="w-3 h-3 text-nexus-accent" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{selectedFile}</span>
                  </div>
                  <span className="text-[9px] text-nexus-text-dim italic">
                    Last sync: {lastSaved.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className={cn(
                      "p-2 rounded-lg transition-colors flex items-center gap-2",
                      isRunning ? "bg-nexus-accent/10 text-nexus-accent animate-pulse" : "bg-nexus-accent/20 text-nexus-accent hover:bg-nexus-accent/30"
                    )}
                  >
                    {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span className="text-[10px] font-bold tracking-widest">DEPLOY CORE</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black/60 pt-2 relative">
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile)}
                  theme="vs-dark"
                  value={currentCode}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: '"JetBrains Mono", monospace',
                    lineHeight: 1.6,
                    padding: { top: 20 },
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    renderLineHighlight: 'all',
                    automaticLayout: true,
                    suggestOnTriggerCharacters: true,
                    tabSize: 2,
                  }}
                  onMount={(editor, monaco) => {
                    // Custom Keyboard Shortcuts
                    editor.addAction({
                      id: 'save-file',
                      label: 'Save Neural Module',
                      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
                      contextMenuGroupId: 'navigation',
                      run: () => {
                        setLastSaved(new Date());
                        setTerminalLogs(prev => [...prev, { type: 'info', text: `Neural Sync successful. Module [${selectedFile}] persisted.` }]);
                      }
                    });

                    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                      target: monaco.languages.typescript.ScriptTarget.ESNext,
                      allowNonTsExtensions: true,
                      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                      module: monaco.languages.typescript.ModuleKind.CommonJS,
                      noEmit: true,
                      esModuleInterop: true,
                      jsx: monaco.languages.typescript.JsxEmit.React,
                      reactNamespace: 'React',
                      allowJs: true,
                    });
                  }}
                />
              </div>
            </div>

          {/* Terminal */}
          <div className="h-48 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-nexus-text-dim" />
                <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Neural Terminal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] text-nexus-text-dim overflow-y-auto bg-black/60 scrollbar-thin">
              <div className="space-y-1">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {log.type === 'cmd' ? (
                      <div className="flex gap-2">
                        <span className="text-nexus-accent">nexus@core:~$</span>
                        <span className="text-white">{log.text}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className={cn(
                          "transition-colors",
                          log.type === 'success' ? "text-green-400" : 
                          log.type === 'err' ? "text-red-400 font-bold" : "text-white/40"
                        )}>
                          [{">"}] {log.text}
                        </div>
                        
                        {log.suggestion && (
                          <div className="mt-1.5 mb-2 ml-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20 animate-in fade-in slide-in-from-left-2 transition-all">
                            <div className="flex items-center gap-2 mb-1 text-red-400/80">
                              <Shield className="w-3 h-3" />
                              <span className="text-[8px] font-bold uppercase tracking-widest">Diagnostic Recommendation</span>
                            </div>
                            <p className="text-[9px] text-white/60 leading-relaxed italic">
                              "{log.suggestion}"
                            </p>
                            <div className="mt-2 flex gap-2">
                              <button className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[8px] font-bold text-red-500 hover:bg-red-500/20 transition-all uppercase tracking-tighter">
                                STABILIZE CORE
                              </button>
                              <button className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 hover:text-white transition-all uppercase tracking-tighter">
                                VIEW LOGS
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2 items-center">
                  <span className="text-nexus-accent">nexus@core:~$</span>
                  <span className="w-1.5 h-3.5 bg-nexus-accent animate-[pulse_1s_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Architect Assistant Sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-2 text-white">
              <Cpu className="w-4 h-4 text-nexus-accent animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Assistant</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
              {/* Quick Actions */}
              <div className="space-y-3">
                <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest pl-1">Neural Scaffolding</span>
                {[
                  { label: 'Cloud Server', icon: Terminal, prompt: 'Generate an Express server with Firebase integration.' },
                  { label: 'Logic Node', icon: Cpu, prompt: 'Architect a neural weight processing function in TypeScript.' },
                  { label: 'Modern UI', icon: Code2, prompt: 'Build a glassmorphic React component with Framer Motion.' },
                ].map((action, i) => (
                  <button 
                    key={i}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left group hover:bg-nexus-accent/10 hover:border-nexus-accent/30 transition-all"
                  >
                    <div className="flex items-center gap-2 text-white/50 group-hover:text-nexus-accent transition-colors">
                      <action.icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Optimization Panel */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-nexus-accent uppercase tracking-widest">Core Health</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(b => <div key={b} className="w-1 h-3 rounded-full bg-nexus-accent" />)}
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] font-bold text-nexus-accent uppercase tracking-widest hover:bg-nexus-accent/20 transition-all">
                  Fix Neural Desync
                </button>
              </div>

              {/* Snippet Library */}
              <div className="space-y-3">
                <span className="text-[8px] font-bold text-nexus-accent uppercase tracking-widest pl-1">Neural Synthesis (Snippets)</span>
                <div className="grid grid-cols-1 gap-2">
                  {SNIPPETS.map((snippet, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        handleEditorChange(currentCode + "\n" + snippet.code);
                        setTerminalLogs(prev => [...prev, { type: 'info', text: `Synthesizing ${snippet.label} pattern...` }]);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-nexus-accent/30 transition-all"
                    >
                      <div className="flex items-center gap-3 text-white/50 group-hover:text-white transition-colors">
                        <snippet.icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{snippet.label}</span>
                      </div>
                      <Plus className="w-3 h-3 text-nexus-text-dim group-hover:text-nexus-accent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Memory */}
              <div className="space-y-3">
                <span className="text-[8px] font-bold text-nexus-text-dim uppercase tracking-widest pl-1">Memory Buffer</span>
                <div className="space-y-2">
                  {[
                    "Optimized Firebase initializeApp",
                    "Synthesized CSS variables in index.css",
                    "Architected NeuralGraph using D3",
                  ].map((log, i) => (
                    <div key={i} className="text-[9px] text-white/40 flex items-start gap-2 group cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1 transition-colors group-hover:bg-nexus-accent" />
                      <span className="group-hover:text-white transition-colors">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 group focus-within:border-nexus-accent/30 transition-all">
                <input 
                  type="text" 
                  placeholder="Ask architect..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[10px] text-white placeholder:text-white/20"
                />
                <Zap className="w-3 h-3 text-nexus-accent group-focus-within:animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
