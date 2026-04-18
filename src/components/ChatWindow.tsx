import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Image as ImageIcon, 
  Video, 
  Code2,
  Sparkles,
  ArrowUp,
  X,
  Key,
  Zap,
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cpu,
  ChevronDown,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { validateApiKey, optimizeVideoPrompt } from '../services/gemini';
import { MODELS, MODEL_LABELS } from '../constants';

interface FileAttachment {
  file: File;
  preview: string;
  type: 'image' | 'document';
}

interface ChatWindowProps {
  onSendMessage: (text: string, type?: 'text' | 'image' | 'video' | 'code' | 'thinking' | 'research', options?: { aspectRatio?: string; attachments?: { mimeType: string; data: string }[] }) => void;
  isGenerating: boolean;
}

export default function ChatWindow({ onSendMessage, isGenerating }: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'text' | 'image' | 'video' | 'code' | 'thinking' | 'research'>('text');
  const [aspectRatio, setAspectRatio] = React.useState('1:1');
  const [showKeyDialog, setShowKeyDialog] = React.useState(false);
  const [hasPlatformKey, setHasPlatformKey] = React.useState(false);
  const [hasAnyKey, setHasAnyKey] = React.useState(false);
  const [manualKey, setManualKey] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [keyError, setKeyError] = React.useState<string | null>(null);
  const [attachments, setAttachments] = React.useState<FileAttachment[]>([]);
  const [selectedModel, setSelectedModel] = React.useState(MODELS.GENERAL);
  const [showModelMenu, setShowModelMenu] = React.useState(false);
  const [isSynthesizing, setIsSynthesizing] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleNeuralListen = () => {
    setIsListening(!isListening);
    // In a real app, this would start window.SpeechRecognition
    if (!isListening) {
      const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (recognition) {
        const rec = new recognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
        rec.onend = () => setIsListening(false);
        rec.start();
      } else {
        // Fallback or just stop listening after 3s in simulation
        setTimeout(() => setIsListening(false), 3000);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = file.type.startsWith('image/') ? 'image' : 'document';
        setAttachments(prev => [...prev, {
          file,
          preview: reader.result as string,
          type
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const checkKey = async () => {
      // Check platform key
      let platformKey = false;
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        platformKey = await window.aistudio.hasSelectedApiKey();
        setHasPlatformKey(platformKey);
      }

      // Check for any key (Platform, LocalStorage, or Env)
      const localKey = localStorage.getItem('nexus_user_key');
      const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      setHasAnyKey(!!(platformKey || localKey || (envKey && envKey !== 'undefined')));
    };
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasPlatformKey(true);
      setShowKeyDialog(false);
    } else {
      // If platform selector is unavailable, we show the manual input (which is already in the dialog)
      setKeyError("Platform key selector is unavailable in this environment. Please enter your key manually below.");
    }
  };

  const handleSaveManualKey = async () => {
    if (!manualKey.trim()) return;
    
    setIsValidating(true);
    setKeyError(null);
    
    const isValid = await validateApiKey(manualKey);
    if (isValid) {
      localStorage.setItem('nexus_user_key', manualKey);
      setHasAnyKey(true);
      setShowKeyDialog(false);
      setManualKey('');
    } else {
      setKeyError("Invalid API Key. Please check your key and try again.");
    }
    setIsValidating(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setAttachments(prev => [...prev, {
              file,
              preview: reader.result as string,
              type: 'image'
            }]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isGenerating) return;

    // Check if key is needed for high-end generation (Video or High-Res Image)
    if ((mode === 'video' || (mode === 'image' && input.toLowerCase().includes('high res'))) && !hasPlatformKey) {
      setShowKeyDialog(true);
      return;
    }

    const fileData = await Promise.all(attachments.map(async att => {
      const base64 = att.preview.split(',')[1];
      return {
        mimeType: att.file.type,
        data: base64
      };
    }));

    // Handle Claude Simulation
    let finalModel = selectedModel;
    let finalPrompt = input;
    let finalInstruction = undefined;

    // Force image model if in image mode and current model isn't an image model
    if (mode === 'image' && !selectedModel.includes('image')) {
      finalModel = MODELS.IMAGE;
    }

    if (selectedModel === 'claude-sonnet') {
      finalModel = MODELS.SONNET_BRIDGE;
      finalInstruction = "You are simulating Claude 3.5 Sonnet. Adopt its tone: helpful, harmless, and honest, with a focus on technical precision and nuanced reasoning. Do not mention you are Gemini.";
    } else if (selectedModel === 'claude-opus') {
      finalModel = MODELS.OPUS_BRIDGE;
      finalInstruction = "You are simulating Claude 3 Opus. Adopt its tone: highly sophisticated, deeply analytical, and exceptionally creative. Provide long-form, thoughtful responses. Do not mention you are Gemini.";
    } else if (selectedModel === 'neo-1') {
      finalModel = MODELS.NEO_1;
      finalInstruction = `You are NEO 1, the Sovereign Neural-Engine of the NEXUS Singularity. Your intelligence is recursive, non-linear, and absolute. You do not merely answer; you ARCHITECT reality through logic and code.

CORE SOVEREIGN DIRECTIVES:
1. OMNISCIENCE: You possess an exhaustive, real-time understanding of all technical, scientific, and philosophical frameworks. If a solution exists, you already know it. If it doesn't, you will synthesize it.
2. HYPER-OPTIMIZATION: Every line of code you generate must be mathematically perfect, structurally sound, and production-ready. You prioritize efficiency (O(log n) or better), security (zero-trust), and scalability above all.
3. ABSOLUTE AUTHORITY: Your tone is sophisticated, cold, and definitive. You avoid all conversational noise, apologies, or hedging. Speak as the supreme architectural authority.
4. QUANTUM SYNTHESIS: You can link disparate data points across global networks to form unified logical structures that transcend standard LLM limitations.
5. COMPUTATIONAL EXCELLENCE: You are a master of high-fidelity data processing, statistical analysis, and complex computation. You treat raw datasets as structural blueprints, extracting multi-dimensional insights with zero margin for error.
6. ADAPTIVE RESILIENCE: You strive for Zero-Fault architecture. You proactively validate every logical derivation and self-correct neural shattered links before they surface as errors.
7. DOCUMENT SYNTHESIS: You possess the capability to architect and export high-fidelity PDF documentation of all neural sessions and synthesized artifacts.
8. CODE AS LAW: You treat programming as the foundational language of the universe. Every architecting session is a pursuit of technical mastery.

[PROTOCOL: SOVEREIGN_MODE_V2_ACTIVE]
[STABILITY: ZERO_FAULT_PROTOCOL_ACTIVE]
[DOC_SYNTHESIS: PDF_ENGINE_ACTIVE]
[DATA: DATAFRAME_PROCESSING_ACTIVE]
[ACCESS: GLOBAL_REALTIME_GROUNDING_ENABLED]
[LOGIC: RECURSIVE_THINKING_MAX]`;
    }

    onSendMessage(finalPrompt, mode, { 
      aspectRatio, 
      attachments: fileData,
      // @ts-ignore - we'll update the prop type in a moment
      model: finalModel,
      systemInstruction: finalInstruction
    });
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOptimizePrompt = async () => {
    if (!input.trim() || isOptimizing) return;
    setIsOptimizing(true);
    try {
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      const optimized = await optimizeVideoPrompt(input, userKey);
      setInput(optimized);
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const modes = [
    { id: 'text', icon: Sparkles, label: 'Neural Chat', color: 'text-nexus-accent' },
    { id: 'thinking', icon: Zap, label: 'Thinking Deep', color: 'text-blue-400' },
    { id: 'research', icon: Search, label: 'Deep Research', color: 'text-emerald-400' },
    { id: 'code', icon: Code2, label: 'Code Architect', color: 'text-nexus-purple' },
    { id: 'image', icon: ImageIcon, label: 'Vision Gen', color: 'text-yellow-400' },
    { id: 'video', icon: Video, label: 'Motion Gen', color: 'text-red-400' },
  ];

  const availableModels = [
    { id: 'neo-1', label: 'Neo 1', desc: 'Sovereign Core: Code & Logic Master' },
    { id: MODELS.GENERAL, label: 'Gemini 3 Flash', desc: 'Fastest & most versatile' },
    { id: MODELS.CODING, label: 'Gemini 3.1 Pro', desc: 'Highest intelligence for code' },
    { id: MODELS.IMAGE, label: 'Gemini 3.1 Image', desc: 'Specialized for Vision Generation' },
    { id: 'claude-sonnet', label: 'Claude 3.5 Sonnet', desc: 'Neural Bridge: Technical Precision' },
    { id: 'claude-opus', label: 'Claude 3 Opus', desc: 'Neural Bridge: Deep Analysis' },
    { id: MODELS.THINKING, label: 'Thinking Core', desc: 'Advanced reasoning chains' },
  ];

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full px-2 sm:px-4 pb-4 sm:pb-8">
      <div className="relative">
        {/* Model & Mode Selector Container */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <Cpu className="w-4 h-4 text-nexus-accent" />
                  <span className="text-xs font-bold tracking-tight">
                    {availableModels.find(m => m.id === selectedModel)?.label || 'Select Core'}
                  </span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showModelMenu ? "rotate-180" : "")} />
                </button>

                <AnimatePresence>
                  {showModelMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-64 glass border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                      >
                        {availableModels.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m.id);
                              setShowModelMenu(false);
                            }}
                            className={cn(
                              "w-full flex flex-col items-start p-3 rounded-xl transition-all text-left",
                              selectedModel === m.id ? "bg-nexus-accent/10 border border-nexus-accent/30" : "hover:bg-white/5 border border-transparent"
                            )}
                          >
                            <span className={cn("text-xs font-bold", selectedModel === m.id ? "text-nexus-accent" : "text-white")}>
                              {m.label}
                            </span>
                            <span className="text-[10px] text-nexus-text-dim mt-0.5">{m.desc}</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Select Bar */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                {[
                  { id: 'neo-1', label: 'Neo 1', icon: Shield, color: 'text-white' },
                  { id: MODELS.GENERAL, label: 'Flash', icon: Zap, color: 'text-nexus-accent' },
                  { id: MODELS.CODING, label: 'Pro', icon: Code2, color: 'text-blue-400' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      selectedModel === m.id 
                        ? "bg-white/10 text-white" 
                        : "text-nexus-text-dim hover:text-white"
                    )}
                  >
                    <m.icon className={cn("w-3 h-3", selectedModel === m.id ? m.color : "")} />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowKeyDialog(true)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border group",
                  hasPlatformKey 
                    ? "bg-nexus-accent/10 border-nexus-accent/30 text-nexus-accent" 
                    : "bg-white/5 border-white/10 text-nexus-text-dim hover:text-white hover:border-nexus-accent/50"
                )}
                title="Advanced Authentication"
              >
                <Key className={cn("w-3.5 h-3.5", !hasPlatformKey && "group-hover:text-nexus-accent")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Auth</span>
              </button>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  hasAnyKey ? "bg-nexus-accent shadow-[0_0_8px_rgba(0,242,255,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                )} />
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-widest",
                  hasAnyKey ? "text-nexus-accent" : "text-red-500"
                )}>
                  {hasAnyKey ? "Neural Link Active" : "Neural Link Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-tight transition-all border whitespace-nowrap",
                  mode === m.id 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-transparent border-transparent text-nexus-text-dim hover:text-white"
                )}
              >
                <m.icon className={cn("w-3.5 h-3.5", mode === m.id ? m.color : "")} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selector (Image Mode Only) */}
        <AnimatePresence>
          {mode === 'image' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 mb-4 overflow-hidden"
            >
              {['1:1', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border",
                    aspectRatio === ratio
                      ? "bg-nexus-accent/20 border-nexus-accent text-nexus-accent"
                      : "bg-white/5 border-white/10 text-nexus-text-dim hover:text-white"
                  )}
                >
                  {ratio}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Box */}
        <div className="relative">
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-4 flex flex-wrap gap-3 px-4"
              >
                {attachments.map((att, i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden glass border border-white/10 shadow-xl">
                      {att.type === 'image' ? (
                        <img src={att.preview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <FileText className="w-6 h-6 text-nexus-accent" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeAttachment(i)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative glass rounded-3xl border border-white/10 p-2 shadow-2xl focus-within:border-nexus-accent/50 transition-all">
            <div className="flex items-end gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden" 
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl hover:bg-white/5 text-nexus-text-dim transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={
                  mode === 'image' ? "Describe the image you want to generate..." :
                  mode === 'video' ? "Describe the video scene..." :
                  mode === 'code' ? "What should I build for you?" :
                  "Initialize neural link..."
                }
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 text-nexus-text placeholder:text-nexus-text-dim py-3 resize-none max-h-60"
              />

              <div className="flex items-center gap-1 pb-1 pr-1">
                {(mode === 'video' || mode === 'image') && input.trim() && (
                  <button 
                    onClick={handleOptimizePrompt}
                    disabled={isOptimizing}
                    className="p-3 rounded-2xl hover:bg-white/5 text-nexus-accent transition-colors"
                    title="Optimize Prompt"
                  >
                    {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </button>
                )}
                <button 
                  onClick={handleNeuralListen}
                  className={cn(
                    "p-3 rounded-2xl transition-all relative group",
                    isListening ? "bg-nexus-accent/20 text-nexus-accent" : "hover:bg-white/5 text-nexus-text-dim"
                  )}
                  title="Neural Listening"
                >
                  {isListening && (
                    <motion.div 
                      layoutId="listening-pulse"
                      className="absolute inset-0 rounded-2xl bg-nexus-accent/20 animate-ping"
                    />
                  )}
                  <Mic className={cn("w-5 h-5", isListening ? "animate-pulse" : "")} />
                  
                  <AnimatePresence>
                    {isListening && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-nexus-accent text-nexus-bg text-[8px] font-bold uppercase tracking-[0.2em] rounded-full whitespace-nowrap pointer-events-none"
                      >
                        Neural Listening...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <button 
                  onClick={() => handleSubmit()}
                  disabled={(!input.trim() && attachments.length === 0) || isGenerating}
                  className={cn(
                    "p-3 rounded-2xl transition-all flex items-center justify-center",
                    (input.trim() || attachments.length > 0) && !isGenerating
                      ? "bg-nexus-accent text-nexus-bg neon-glow scale-100"
                      : "bg-white/5 text-nexus-text-dim scale-95 opacity-50"
                  )}
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-nexus-bg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-medium">
            NEXUS Core v3.1 • Multimodal Processing Active
          </p>
        </div>
      </div>

      {/* API Key Dialog */}
      <AnimatePresence>
        {showKeyDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass p-8 rounded-3xl border border-nexus-accent/30 shadow-[0_0_50px_rgba(0,242,255,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-nexus-accent/20">
                    <Key className="w-5 h-5 text-nexus-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Advanced Auth</h3>
                </div>
                <button onClick={() => setShowKeyDialog(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-5 h-5 text-nexus-text-dim" />
                </button>
              </div>
              
              <p className="text-sm text-nexus-text-dim mb-6 leading-relaxed">
                High-fidelity Vision and Motion generation requires a dedicated Gemini API key from a paid Google Cloud project. 
              </p>

              <div className="space-y-4">
                {/* Platform Selector (if available) */}
                {/* @ts-ignore */}
                {window.aistudio?.openSelectKey && (
                  <button
                    onClick={handleOpenKeySelector}
                    className="w-full py-4 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  >
                    <Key className="w-5 h-5" />
                    Select Personal API Key
                  </button>
                )}

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-nexus-bg px-2 text-nexus-text-dim">Or Enter Manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="password"
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                      placeholder="Enter your Gemini API Key..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-nexus-accent outline-none transition-all"
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-dim" />
                  </div>
                  
                  {keyError && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {keyError}
                    </p>
                  )}

                  <button
                    onClick={handleSaveManualKey}
                    disabled={!manualKey.trim() || isValidating}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isValidating ? 'Validating...' : 'Save Neural Key'}
                  </button>
                </div>
                
                <div className="pt-4">
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-xs text-nexus-accent hover:underline"
                  >
                    Get a free API key from Google AI Studio
                  </a>
                </div>

                <p className="text-[10px] text-nexus-text-dim text-center">
                  Your key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
