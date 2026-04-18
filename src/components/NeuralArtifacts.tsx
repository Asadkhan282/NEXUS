import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  ExternalLink, 
  Download, 
  Maximize2, 
  X,
  Copy,
  Check,
  Eye,
  Settings,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { exportArtifactToPDF } from '../lib/pdf';

interface Artifact {
  id: string;
  type: 'code' | 'html' | 'svg' | 'markdown';
  title: string;
  content: string;
  language?: string;
  isThinking?: boolean;
}

interface NeuralArtifactsProps {
  artifacts: Artifact[];
  onClose: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function NeuralArtifacts({ artifacts, onClose, activeId, onSelect }: NeuralArtifactsProps) {
  const activeArtifact = artifacts.find(a => a.id === activeId) || artifacts[0];
  const [isCopied, setIsCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'preview' | 'code'>('preview');

  const copyToClipboard = () => {
    if (!activeArtifact) return;
    navigator.clipboard.writeText(activeArtifact.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadContent = () => {
    if (!activeArtifact) return;
    const blob = new Blob([activeArtifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeArtifact.title.replace(/\s+/g, '_')}.${activeArtifact.type === 'svg' ? 'svg' : activeArtifact.type === 'html' ? 'html' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (artifacts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-y-0 right-0 w-full lg:w-[45%] bg-nexus-bg border-l border-white/5 shadow-2xl z-[60] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 glass">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-nexus-accent/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-nexus-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Neural Artifact</h3>
            <p className="text-[10px] text-nexus-text-dim uppercase tracking-tighter">Real-time code & vision synthesis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-all group relative"
            title="Copy Code"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => activeArtifact && exportArtifactToPDF(activeArtifact.type, activeArtifact.title, activeArtifact.content)}
            className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-all group relative"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4 group-hover:text-nexus-accent transition-colors" />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-2" />
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 py-2 border-b border-white/5 bg-black/20 overflow-x-auto no-scrollbar">
        {artifacts.map(art => (
          <button
            key={art.id}
            onClick={() => onSelect(art.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
              activeId === art.id 
                ? "bg-nexus-accent/10 text-nexus-accent border-nexus-accent/20" 
                : "text-nexus-text-dim border-transparent hover:text-white hover:bg-white/5"
            )}
          >
            {art.type === 'code' ? <Code2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {art.title}
          </button>
        ))}
      </div>

      {/* Preview Controls */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
              viewMode === 'preview' ? "bg-nexus-accent text-nexus-bg" : "text-nexus-text-dim hover:text-white"
            )}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
              viewMode === 'code' ? "bg-nexus-accent text-nexus-bg" : "text-nexus-text-dim hover:text-white"
            )}
          >
            Code
          </button>
        </div>
        <div className="text-[10px] text-nexus-text-dim font-mono uppercase tracking-widest">
          {activeArtifact.type} • {activeArtifact.language || 'dynamic'}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a] relative">
        <AnimatePresence mode="wait">
          {viewMode === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {activeArtifact.type === 'html' ? (
                <iframe
                  title="Nexus Artifact Preview"
                  className="w-full h-full bg-white"
                  srcDoc={activeArtifact.content}
                />
              ) : activeArtifact.type === 'svg' ? (
                <div 
                  className="w-full h-full flex items-center justify-center p-8 bg-nexus-bg"
                  dangerouslySetInnerHTML={{ __html: activeArtifact.content }}
                />
              ) : activeArtifact.type === 'markdown' ? (
                <div className="p-8 prose prose-invert max-w-none prose-sm">
                  {/* Markdown content would go here */}
                  <div className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {activeArtifact.content}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-nexus-text-dim text-sm italic">
                  Code artifact: Switch to code view to inspect.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 font-mono text-sm leading-relaxed"
            >
              <pre className="text-blue-400">
                <code>{activeArtifact.content}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Overlay */}
        <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
          <div className="w-24 h-24 border border-nexus-accent rounded-full animate-ping" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/5 items-center justify-between flex px-6 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-pulse" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-nexus-accent font-bold">Neural Core Rendering Active</span>
        </div>
        <div className="text-[8px] text-nexus-text-dim flex items-center gap-2">
          <span>{activeArtifact.content.length} Bytes</span>
          <span>|</span>
          <span>Hash: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>
      </div>
    </motion.div>
  );
}
