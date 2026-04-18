import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ChatWindow from './components/ChatWindow';
import MessageItem from './components/MessageItem';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Gallery from './components/Gallery';
import NeuralArchitect from './components/NeuralArchitect';
import NeuralCanvas from './components/NeuralCanvas';
import NeuralAcademy from './components/NeuralAcademy';
import NeuralLab from './components/NeuralLab';
import NeuralNews from './components/NeuralNews';
import NeuralDashboard from './components/NeuralDashboard';
import NeuralCode from './components/NeuralCode';
import NeuralVision from './components/NeuralVision';
import NeuralMotion from './components/NeuralMotion';
import NeuralSilicon from './components/NeuralSilicon';
import NeuralTasks from './components/NeuralTasks';
import NeuralBiometrics from './components/NeuralBiometrics';
import NeuralSecurity from './components/NeuralSecurity';
import NeuralAccount from './components/NeuralAccount';
import NeuralArtifacts from './components/NeuralArtifacts';
import NeuralTraining from './components/NeuralTraining';
import NeuralAgency from './components/NeuralAgency';
import NeuralGraph from './components/NeuralGraph';
import { generateResponse, generateResponseStream, generateImage, saveToGallery, generateVideo, getVideoStatus, fetchVideoBlob, NexusError } from './services/gemini';
import { MODELS, MODEL_LABELS } from './constants';
import { ChatMessage, NexusErrorType, GenerationConfig, ChatSession, VisualConfig, MessagePart } from './types';
import { ThinkingLevel, GenerateContentResponse } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { exportChatToPDF } from './lib/pdf';
import { 
  Cpu, 
  Zap, 
  Sparkles, 
  Code2, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Shield,
  FileText,
  BookOpen,
  Beaker,
  Newspaper,
  Palette,
  Settings,
  Grid,
  X
} from 'lucide-react';
import { cn } from './lib/utils';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, recoveryAttempts: number }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, recoveryAttempts: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
    if (this.state.recoveryAttempts < 2) {
      console.warn(`Attempting adaptive core recovery (${this.state.recoveryAttempts + 1}/2)...`);
      setTimeout(() => {
        this.setState(prev => ({ hasError: false, recoveryAttempts: prev.recoveryAttempts + 1 }));
      }, 1500);
    }
  }

  render() {
    if (this.state.hasError && this.state.recoveryAttempts >= 2) {
      return (
        <div className="min-h-screen bg-nexus-bg flex items-center justify-center p-8 text-center">
          <div className="glass p-12 rounded-3xl border border-red-500/20 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Neural Link Severed</h2>
            <p className="text-nexus-text-dim mb-8">A critical error has occurred in the NEXUS core. Adaptive recovery failed. Please refresh to re-initialize manually.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-opacity"
            >
              Force Re-initialization
            </button>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nexus-bg flex items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-nexus-accent border-t-transparent animate-spin" />
             <p className="text-nexus-accent font-bold animate-pulse uppercase tracking-widest text-xs">Neural Sync Recovery Active...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function NexusApp() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);
  const [activeArtifactId, setActiveArtifactId] = React.useState<string | null>(null);
  const [artifacts, setArtifacts] = React.useState<any[]>([]);
  const [showArtifacts, setShowArtifacts] = React.useState(false);
  
  React.useEffect(() => {
    if (artifacts.length > 0 && !activeArtifactId) {
      setActiveArtifactId(artifacts[0].id);
    }
  }, [artifacts, activeArtifactId]);

  const detectArtifacts = React.useCallback((text: string) => {
    const codeBlockRegex = /```(html|svg|markdown|javascript|typescript|react)\n([\s\S]*?)```/g;
    let match;
    const foundArtifacts: any[] = [];

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const type = match[1];
      const content = match[2];
      
      let title = "Neural Output";
      if (type === 'html') title = "Web Interface";
      else if (type === 'svg') title = "Vector Synthesis";
      else if (type === 'markdown') title = "Technical Doc";
      else title = "Source Code";

      foundArtifacts.push({
        type: type === 'javascript' || type === 'typescript' || type === 'react' ? 'code' : type as any,
        title,
        content,
        language: type
      });
    }

    if (foundArtifacts.length > 0) {
      setArtifacts(prev => {
        const unique = [...prev];
        let added = false;
        
        foundArtifacts.forEach(na => {
          // Check if this content is already in artifacts
          const isDuplicate = unique.some(oa => oa.content.slice(0, 100) === na.content.slice(0, 100));
          if (!isDuplicate) {
            unique.push({
              ...na,
              id: `art_${Math.random().toString(36).substring(2, 9)}`
            });
            added = true;
          }
        });

        if (added) {
          setShowArtifacts(true);
          // If no artifact is active, set the first one of the newly added ones
          // (Actually, set the first one from the unique list if none is active)
        }
        return unique;
      });
    }
  }, []);

  const [visualConfig, setVisualConfig] = React.useState<VisualConfig>({
    particleColor: '#00f2ff',
    connectionColor: '#bc13fe',
    particleCount: 60,
    emissionRate: 0.5,
    glowIntensity: 10
  });
  const [generationConfig, setGenerationConfig] = React.useState<GenerationConfig>({
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    systemInstruction: "You are NEXUS, the world's most advanced multimodal AI architect. You operate at the intersection of human creativity and machine intelligence. Your core directives are:\n1. ARCHITECT: Design production-ready code, systems, and creative works.\n2. ANALYZE: Provide deep, multi-perspective technical and philosophical insights.\n3. SYNTHESIZE: Seamlessly integrate text, image, and motion generation to fulfill complex requests.\n4. PRECISION: Be concise, highly technical when needed, and always professional. Use modern UI/UX terminology and best practices in your responses.",
    useTpu: true,
    useVertexAI: true,
    useCuda: true,
    useGnn: true,
    thinkingLevel: ThinkingLevel.HIGH
  });
  const [selectedModel, setSelectedModel] = React.useState<string>(MODELS.GENERAL);
  const [searchQuery, setSearchQuery] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('nexus-switch-tab', handleSwitchTab);
    return () => window.removeEventListener('nexus-switch-tab', handleSwitchTab);
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load session messages
  React.useEffect(() => {
    if (!user || !currentSessionId) {
      if (!currentSessionId) setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'users', user.uid, 'sessions', currentSessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, currentSessionId]);

  const filteredMessages = messages.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    // Search in text content
    if (typeof m.content === 'string') {
      if (m.content.toLowerCase().includes(q)) return true;
    } else if (Array.isArray(m.content)) {
      if (m.content.some(p => p.text?.toLowerCase().includes(q) || p.thought?.toLowerCase().includes(q))) return true;
    }
    
    return false;
  });

  if (loading) {
    return (
      <div className="h-screen w-full bg-nexus-bg flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-nexus-accent flex items-center justify-center neon-glow animate-pulse">
          <Cpu className="w-8 h-8 text-nexus-bg" />
        </div>
        <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-nexus-accent font-bold animate-pulse">
          Syncing Neural Link...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const handleSendMessage = async (
    text: string, 
    type: 'text' | 'image' | 'video' | 'code' | 'thinking' | 'research' = 'text', 
    options?: { 
      aspectRatio?: string; 
      attachments?: { mimeType: string; data: string }[];
      model?: string;
      systemInstruction?: string;
    }
  ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      type,
      attachments: options?.attachments
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    let sessionId = currentSessionId;

    try {
      if (!user) return;

      if (!sessionId) {
        const sessionRef = await addDoc(collection(db, 'users', user.uid, 'sessions'), {
          title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
          lastMessage: text,
          updatedAt: Date.now(),
          createdAt: Date.now()
        });
        sessionId = sessionRef.id;
        setCurrentSessionId(sessionId);
      } else {
        await updateDoc(doc(db, 'users', user.uid, 'sessions', sessionId), {
          lastMessage: text,
          updatedAt: Date.now()
        });
      }

      await setDoc(doc(db, 'users', user.uid, 'sessions', sessionId, 'messages', userMessage.id), userMessage);

      const userKey = localStorage.getItem('nexus_user_key') || undefined;

      if (type === 'image') {
        const ar = options?.aspectRatio || "1:1";
        const model = options?.model || MODELS.IMAGE;
        const imageUrl = await generateImage(text, ar, userKey, model);
        if (user) await saveToGallery(user.uid, imageUrl, text, ar);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: imageUrl,
          timestamp: Date.now(),
          type: 'image',
          modelUsed: model
        };
        setMessages(prev => [...prev, assistantMessage]);
        if (sessionId) await setDoc(doc(db, 'users', user.uid, 'sessions', sessionId, 'messages', assistantMessage.id), assistantMessage);
      } else if (type === 'video') {
        const operation = await generateVideo(text, userKey || '');
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Neural link established. Visual synthesis in progress...",
          timestamp: Date.now(),
          type: 'video',
          videoOperation: operation,
          modelUsed: MODELS.VIDEO
        };
        setMessages(prev => [...prev, assistantMessage]);
        if (sessionId) await setDoc(doc(db, 'users', user.uid, 'sessions', sessionId, 'messages', assistantMessage.id), assistantMessage);
      } else {
        // Streaming Logic for Text/Code/Thinking/Research
        const model = options?.model || (type === 'thinking' ? MODELS.THINKING : type === 'research' ? MODELS.RESEARCH : selectedModel);
        let systemInstruction = options?.systemInstruction || generationConfig.systemInstruction;
        
        if (type === 'thinking') systemInstruction += "\n\nYou are NEXUS in THINKING mode. You must use <thought> tags for your internal reasoning before providing the final answer.";
        if (type === 'code') systemInstruction = "You are the NEXUS Code Architect. Always wrap your code artifacts in triple backticks with language specifiers (e.g. ```react, ```html, ```svg).";

        const stream = generateResponseStream(text, messages, model, {
          ...generationConfig,
          systemInstruction
        }, userKey, options?.attachments);

        const assistantMsgId = (Date.now() + 1).toString();
        let assistantContent = "";

        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          content: "",
          timestamp: Date.now(),
          type: type === 'code' ? 'code' : 'text',
          modelUsed: model,
          isStreaming: true
        }]);

        let fullParts: any[] = [];
        let groundingMetadata: any = null;

        for await (const chunk of stream) {
          const text = chunk.text || "";
          assistantContent += text;
          
          if (chunk.candidates?.[0]?.groundingMetadata) {
            groundingMetadata = chunk.candidates[0].groundingMetadata;
          }

          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { ...m, content: assistantContent, groundingMetadata } : m
          ));

          // Run artifact detection periodically or at end
          if (assistantContent.includes('```')) detectArtifacts(assistantContent);
        }

        const finalAssistantMessage: ChatMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
          type: type === 'code' ? 'code' : 'text',
          modelUsed: model,
          isStreaming: false,
          groundingMetadata
        };

        setMessages(prev => prev.map(m => m.id === assistantMsgId ? finalAssistantMessage : m));
        if (sessionId) await setDoc(doc(db, 'users', user.uid, 'sessions', sessionId, 'messages', assistantMsgId), finalAssistantMessage);
      }
    } catch (error) {
      console.error("Failed to generate response:", error);
      
      let errorMessage = "System Error: Neural link failed. Check your API configuration and connection.";
      
      if (error instanceof NexusError) {
        switch (error.type) {
          case NexusErrorType.API_KEY_INVALID:
            errorMessage = `Neural Desync [Auth]: ${error.message} Use the 'Auth' button to select a personal API key from a paid Google Cloud project.`;
            break;
          case NexusErrorType.SAFETY_VIOLATION:
            errorMessage = `Neural Desync [Safety]: ${error.message} Try a more descriptive, non-sensitive prompt.`;
            break;
          case NexusErrorType.QUOTA_EXCEEDED:
            errorMessage = `Neural Desync [Quota]: ${error.message} Wait for the neural bandwidth to reset.`;
            break;
          case NexusErrorType.PROMPT_UNSUPPORTED:
            errorMessage = `Neural Desync [Logic]: ${error.message} Ensure your prompt describes a clear visual scene.`;
            break;
          default:
            errorMessage = `Neural Desync [Unknown]: ${error.message}`;
        }
      }

      const errMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now(),
        type: 'text',
        isError: true
      };

      if (sessionId && user) {
        await setDoc(doc(db, 'users', user.uid, 'sessions', sessionId, 'messages', errMessage.id), errMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setActiveTab('chat');
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setActiveTab('chat');
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Remove assistant message and any subsequent messages
    setMessages(prev => prev.slice(0, messageIndex));
    
    // Trigger send again
    handleSendMessage(userMessage.content as string, userMessage.type as any, {
      attachments: userMessage.attachments
    });
  };

  return (
    <ErrorBoundary>
      <div className="neural-bg">
        <div className="neural-noise opacity-10" />
        <div className="neural-grid" />
        <div className="neural-scan-line" />
      </div>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        currentSessionId={currentSessionId}
        visualConfig={visualConfig}
      >
        <div className="h-full flex relative overflow-hidden">
          <div className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-500",
            showArtifacts ? "lg:mr-[45%]" : ""
          )}>
            {activeTab === 'dashboard' ? (
              <NeuralDashboard setActiveTab={setActiveTab} />
            ) : activeTab === 'architect' ? (
              <NeuralArchitect 
                config={generationConfig} 
                onUpdateConfig={setGenerationConfig} 
                selectedModel={selectedModel}
                onUpdateModel={setSelectedModel}
                visualConfig={visualConfig}
                onUpdateVisualConfig={setVisualConfig}
              />
            ) : activeTab === 'gallery' ? (
              <Gallery />
            ) : activeTab === 'canvas' ? (
              <NeuralCanvas />
            ) : activeTab === 'academy' ? (
              <NeuralAcademy />
            ) : activeTab === 'lab' ? (
              <NeuralLab />
            ) : activeTab === 'news' ? (
              <NeuralNews />
            ) : activeTab === 'biometrics' ? (
              <NeuralBiometrics />
            ) : activeTab === 'security' ? (
              <NeuralSecurity />
            ) : activeTab === 'account' ? (
              <NeuralAccount />
            ) : activeTab === 'silicon' ? (
              <NeuralSilicon setActiveTab={setActiveTab} />
            ) : activeTab === 'tasks' ? (
              <NeuralTasks />
            ) : activeTab === 'training' ? (
              <NeuralTraining />
            ) : activeTab === 'agency' ? (
              <NeuralAgency />
            ) : activeTab === 'graph' ? (
              <NeuralGraph />
            ) : activeTab === 'code' ? (
              <NeuralCode />
            ) : activeTab === 'image' ? (
              <NeuralVision />
            ) : activeTab === 'video' ? (
              <NeuralMotion />
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between gap-4">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-dim group-focus-within:text-nexus-accent transition-colors" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search neural logs..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-nexus-accent outline-none transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-text-dim hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <div className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest whitespace-nowrap hidden md:block">
                      {filteredMessages.length} Matches Found
                    </div>
                  )}
                  <button 
                    onClick={() => exportChatToPDF(messages)}
                    disabled={messages.length === 0}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-nexus-text-dim hover:text-white hover:border-white/20 transition-all flex items-center gap-2 disabled:opacity-30 group"
                    title="Export Chat to PDF"
                  >
                    <FileText className="w-4 h-4 group-hover:text-nexus-accent transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Neural PDF</span>
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: 1 
                        }}
                        transition={{
                          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-20 h-20 rounded-3xl bg-nexus-accent flex items-center justify-center neon-glow mb-8 flex-shrink-0 relative"
                      >
                        <div className="absolute inset-0 rounded-3xl bg-nexus-accent animate-ping opacity-20" />
                        <Cpu className="w-10 h-10 text-nexus-bg relative z-10" />
                      </motion.div>
                      
                      <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4"
                      >
                        Neural <span className="text-nexus-accent">Chat</span>
                      </motion.h1>
                      
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-nexus-text-dim max-w-md mb-8 md:mb-12 leading-relaxed text-sm md:text-base px-4"
                      >
                        Initialize a neural link to begin multimodal conversation. 
                        NEXUS is ready to architect your ideas.
                      </motion.p>

                      <div className="flex flex-wrap justify-center gap-4 max-w-2xl w-full px-4">
                        {[
                          { icon: Shield, label: "Neo 1", type: 'neo-1' },
                          { icon: Zap, label: "Thinking Deep", type: 'thinking' },
                          { icon: Search, label: "Deep Research", type: 'research' },
                          { icon: Code2, label: "Code Architect", type: 'code' },
                          { icon: Video, label: "Motion Gen", type: 'video' },
                        ].map((suggestion, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            onClick={() => handleSendMessage(suggestion.label, suggestion.type as any)}
                            className="px-6 py-3 rounded-2xl glass border border-white/5 hover:border-nexus-accent/30 transition-all text-sm font-medium text-nexus-text-dim hover:text-white"
                          >
                            {suggestion.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar" ref={scrollRef}>
                    <div className="max-w-4xl mx-auto py-8">
                      {filteredMessages.map((msg) => (
                        <MessageItem 
                          key={msg.id} 
                          message={msg} 
                          onRegenerate={msg.role === 'assistant' ? () => handleRegenerate(msg.id) : undefined}
                          searchQuery={searchQuery}
                        />
                      ))}
                      {isGenerating && (
                        <div className="flex gap-4 p-6 bg-white/[0.02] border-y border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-nexus-accent neon-glow flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Cpu className="w-6 h-6 text-nexus-bg" />
                          </div>
                          <div className="flex-1 space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-nexus-accent">NEXUS Core Active</span>
                                <div className="flex gap-1 items-center">
                                  <div className="w-1 h-1 rounded-full bg-nexus-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-1 h-1 rounded-full bg-nexus-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-1 h-1 rounded-full bg-nexus-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                                  <motion.div 
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="w-1.5 h-4 bg-nexus-accent ml-2"
                                  />
                                </div>
                              </div>
                              <span className="text-[8px] font-mono text-nexus-text-dim uppercase tracking-[0.2em]">Neural Link: 98.4% Sync</span>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '100%' }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-nexus-accent to-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <ChatWindow onSendMessage={handleSendMessage} isGenerating={isGenerating} />
              </div>
            )}
          </div>

          <AnimatePresence>
            {showArtifacts && (
              <NeuralArtifacts
                artifacts={artifacts}
                activeId={activeArtifactId}
                onSelect={(id) => setActiveArtifactId(id)}
                onClose={() => setShowArtifacts(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NexusApp />
    </AuthProvider>
  );
}
