import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  User, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Zap, 
  Volume2, 
  RefreshCw, 
  ChevronDown,
  Brain
} from 'lucide-react';
import { ChatMessage, MessagePart } from '../types';
import { MODEL_LABELS } from '../constants';
import { cn } from '../lib/utils';
import { generateSpeech } from '../services/gemini';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface MessageItemProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  searchQuery?: string;
}

export default function MessageItem({ message, onRegenerate, searchQuery = '' }: MessageItemProps) {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isSynthesizing, setIsSynthesizing] = React.useState(false);
  const [showThoughts, setShowThoughts] = React.useState(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const isAssistant = message.role === 'assistant';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNeuralSpeak = async (text: string) => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsSpeaking(false);
      return;
    }

    try {
      let audioUrl = "";
      
      if (message.audioData) {
        // Use cached audio
        const binary = atob(message.audioData);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        setIsSynthesizing(true);
        // Get API key from somewhere or assume it's in env for now
        // For simplicity, we'll try to get it from localStorage (nexus_user_key)
        const userKey = localStorage.getItem('nexus_user_key') || undefined;
        
        const base64 = await generateSpeech(text, userKey);
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
        
        // Save to message for persistence if we have session/message info
        // (This would require passing session ID, but let's just use it once for now)
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audioRef.current.play();
      setIsSpeaking(true);
    } catch (error) {
      console.error("Neural Voice failed:", error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const renderContent = () => {
    let displayContent = message.content;
    let thoughtFromText: string | null = null;

    // Extract thoughts from XML tags if content is a string
    if (typeof displayContent === 'string' && displayContent.includes('<thought>')) {
      const thoughtMatch = displayContent.match(/<thought>([\s\S]*?)<\/thought>/);
      if (thoughtMatch) {
        thoughtFromText = thoughtMatch[1];
        displayContent = displayContent.replace(/<thought>[\s\S]*?<\/thought>/, '').trim();
      }
    }

    if (Array.isArray(message.content) || thoughtFromText) {
      const textParts = Array.isArray(message.content) ? message.content.filter(p => p.text) : [{ text: displayContent as string }];
      const thoughtParts = Array.isArray(message.content) ? message.content.filter(p => p.thought) : (thoughtFromText ? [{ thought: thoughtFromText }] : []);
      const imageDataParts = Array.isArray(message.content) ? message.content.filter(p => p.inlineData) : [];

      return (
        <div className="space-y-4">
          {thoughtParts.length > 0 && (
            <div className="glass border border-white/5 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setShowThoughts(!showThoughts)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-nexus-purple/20">
                    <Brain className="w-4 h-4 text-nexus-purple" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight uppercase">Neural Reasoning Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  {message.isStreaming && <span className="text-[8px] text-nexus-accent animate-pulse font-mono tracking-widest uppercase">Streaming Thinking</span>}
                  <ChevronDown className={cn("w-4 h-4 text-nexus-text-dim transition-transform", showThoughts ? "rotate-180" : "")} />
                </div>
              </button>
              <AnimatePresence>
                {showThoughts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-xs text-nexus-text-dim font-mono leading-relaxed border-t border-white/5 bg-black/20">
                      {thoughtParts.map((p, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <MarkdownContent content={p.thought!} searchQuery={searchQuery} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {textParts.map((part, i) => (
            <div key={i} className="relative">
              {part.text && <MarkdownContent content={part.text} searchQuery={searchQuery} />}
              {message.isStreaming && i === textParts.length - 1 && (
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1.5 h-4 ml-1 bg-nexus-accent align-middle"
                />
              )}
            </div>
          ))}

          {imageDataParts.map((part, i) => (
            <div key={i} className="mt-2 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={`data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`} 
                alt="Generated content"
                className="max-w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}

          {/* Search Grounding Results */}
          {message.groundingMetadata?.searchEntryPoint && (
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/40">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-3 h-3 text-nexus-accent" />
                <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Neural Knowledge Sources</span>
              </div>
              <div 
                className="text-xs text-nexus-accent hover:underline cursor-pointer"
                dangerouslySetInnerHTML={{ __html: message.groundingMetadata.searchEntryPoint.htmlContent }}
              />
            </div>
          )}
        </div>
      );
    }

    // Handle special types (image/video URLs) - ONLY for assistant or if it's a valid data URL
    if (message.type === 'image' && typeof message.content === 'string' && (isAssistant || message.content.startsWith('data:') || message.content.startsWith('http'))) {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-nexus-accent/30 shadow-[0_0_30px_rgba(0,242,255,0.1)] group relative">
            <img 
              src={message.content} 
              alt="Nexus Vision" 
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = message.content as string;
                  link.download = `nexus-vision-${Date.now()}.png`;
                  link.click();
                }}
                className="p-3 rounded-full bg-nexus-accent text-nexus-bg hover:scale-110 transition-transform"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open(message.content as string, '_blank')}
                className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md hover:scale-110 transition-transform"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-nexus-accent font-bold">Vision Output Generated</div>
        </div>
      );
    }

    if (message.type === 'video' && typeof message.content === 'string') {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-red-400/30 shadow-[0_0_30px_rgba(248,113,113,0.1)] group relative">
            <video 
              src={message.content} 
              controls
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = message.content as string;
                  link.download = `nexus-motion-${Date.now()}.mp4`;
                  link.click();
                }}
                className="p-3 rounded-full bg-red-400 text-nexus-bg hover:scale-110 transition-transform shadow-lg"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Motion Sequence Synthesized</div>
        </div>
      );
    }

    if (isAssistant && typeof message.content === 'string' && (message.content.includes("Access Denied [403]") || message.content.includes("bandwidth exceeded") || message.content.includes("quota"))) {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            <MarkdownContent content={message.content} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => (window as any).aistudio?.openSelectKey()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-nexus-accent/10 border border-nexus-accent/30 text-nexus-accent font-bold text-xs hover:bg-nexus-accent/20 transition-all shadow-[0_0_20px_rgba(0,242,255,0.1)] group"
            >
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Authorize Reactive Key
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Logic
            </button>
          </div>
          <p className="text-[10px] text-nexus-text-dim leading-relaxed">
            NEXUS core bandwidth is shared. To bypass these limits, please authorize your own API key from a paid Google Cloud project.
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        <MarkdownContent content={message.content as string} searchQuery={searchQuery} />
        {message.isStreaming && (
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-4 ml-1 bg-nexus-accent align-middle"
          />
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 p-6 transition-colors relative overflow-hidden group",
        isAssistant ? "bg-white/[0.02]" : "bg-transparent"
      )}
    >
      {isAssistant && <div className="neural-scan-line" />}
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
        isAssistant ? "bg-nexus-accent neon-glow" : "bg-nexus-purple"
      )}>
        {isAssistant ? <Cpu className="w-6 h-6 text-nexus-bg" /> : <User className="w-6 h-6 text-white" />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white/90">
              {isAssistant ? 'NEXUS' : 'User'}
            </span>
            {isAssistant && message.modelUsed && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-mono text-nexus-text-dim uppercase tracking-widest">
                <Zap className="w-2 h-2 text-nexus-accent" />
                {MODEL_LABELS[message.modelUsed] || message.modelUsed}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-nexus-text-dim font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isAssistant && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleNeuralSpeak(typeof message.content === 'string' ? message.content : (message.content as MessagePart[]).map(p => p.text || '').join(' '))}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isSpeaking 
                      ? "bg-nexus-accent/20 text-nexus-accent animate-pulse" 
                      : "hover:bg-white/5 text-nexus-text-dim hover:text-white"
                  )}
                  title={isSpeaking ? "Stop Synthesis" : "Neural Synthesis"}
                >
                  {isSynthesizing ? (
                    <div className="w-3.5 h-3.5 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button 
                  onClick={() => handleCopy(typeof message.content === 'string' ? message.content : (message.content as MessagePart[]).map(p => p.text || '').join(' '))}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-nexus-text-dim transition-colors"
                  title="Copy Message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {onRegenerate && (
                  <button 
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-nexus-text-dim transition-colors"
                    title="Regenerate Response"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-nexus-text leading-relaxed">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {message.attachments.map((att, i) => (
                <div key={i} className="relative group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden glass border border-white/10 shadow-xl">
                    {att.mimeType.startsWith('image/') ? (
                      <img 
                        src={`data:${att.mimeType};base64,${att.data}`} 
                        alt="Attachment" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 p-2 text-center">
                        <FileText className="w-8 h-8 text-nexus-accent mb-1" />
                        <span className="text-[8px] text-nexus-text-dim truncate w-full">
                          {att.mimeType.split('/')[1].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
}

function MarkdownContent({ content, searchQuery = '' }: { content: string, searchQuery?: string }) {
  const highlightText = (text: any): React.ReactNode => {
    if (typeof text !== 'string' || !searchQuery.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={i} className="bg-nexus-accent/30 text-nexus-accent font-bold px-0.5 rounded shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          return !inline && match ? (
            <div className="relative group my-4">
              <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/5">
                <div className="bg-white/5 px-4 py-2 text-[10px] font-mono text-nexus-text-dim border-b border-white/5 flex justify-between items-center">
                  <span>{match[1].toUpperCase()}</span>
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-[#0a0a0c] !p-4"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-nexus-accent font-mono text-sm", className)} {...props}>
              {highlightText(children)}
            </code>
          );
        },
        p: ({ children }) => <p className="mb-4 last:mb-0">{highlightText(children)}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{highlightText(children)}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{highlightText(children)}</ol>,
        li: ({ children }) => <li>{highlightText(children)}</li>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white">{highlightText(children)}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-white">{highlightText(children)}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-white">{highlightText(children)}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-nexus-accent bg-nexus-accent/5 px-4 py-2 my-4 italic">
            {highlightText(children)}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
