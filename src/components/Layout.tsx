import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutGrid,
  MessageSquare, 
  Code2, 
  Image as ImageIcon, 
  Video, 
  Settings, 
  History,
  Plus,
  Cpu,
  Zap,
  Shield,
  Menu,
  X,
  LogOut,
  Grid,
  Palette,
  BookOpen,
  Beaker,
  Sparkles,
  Newspaper,
  Microchip,
  ArrowLeft,
  User,
  Activity,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import NeuralBackground from './NeuralBackground';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChatSession, VisualConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  currentSessionId?: string | null;
  visualConfig?: VisualConfig;
}

export default function Layout({ children, activeTab, setActiveTab, onNewSession, onSelectSession, currentSessionId, visualConfig }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth > 1024);
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (!user) return;

    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatSession[];
      setSessions(sessionData);
    });

    return () => unsubscribe();
  }, [user]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'Neural Chat' },
    { id: 'canvas', icon: Palette, label: 'Neural Canvas' },
    { id: 'academy', icon: BookOpen, label: 'Neural Academy' },
    { id: 'lab', icon: Beaker, label: 'Neural Lab' },
    { id: 'news', icon: Newspaper, label: 'Neural News' },
    { id: 'silicon', icon: Microchip, label: 'Neural Silicon' },
    { id: 'biometrics', icon: Activity, label: 'Neural Biometrics' },
    { id: 'security', icon: Shield, label: 'Neural Security' },
    { id: 'code', icon: Code2, label: 'Nexus Code' },
    { id: 'image', icon: ImageIcon, label: 'Vision' },
    { id: 'video', icon: Video, label: 'Motion' },
    { id: 'gallery', icon: Grid, label: 'Gallery' },
    { id: 'architect', icon: Settings, label: 'Neural Architect' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  return (
    <div className="flex h-screen w-full bg-nexus-bg overflow-hidden relative">
      {/* Neural Background Layer */}
      <div className="neural-bg">
        <div className="neural-noise" />
        <div className="neural-grid" />
        <NeuralBackground config={visualConfig} />
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0, 
          x: isSidebarOpen ? 0 : -280,
          opacity: isSidebarOpen ? 1 : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative h-full glass border-r border-white/5 flex flex-col z-40",
          !isSidebarOpen && "pointer-events-none"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-nexus-accent flex items-center justify-center neon-glow">
            <Cpu className="w-5 h-5 text-nexus-bg" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">NEXUS</span>
        </div>

        <div className="px-4 mb-6">
          <button 
            onClick={onNewSession}
            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 text-sm font-medium group"
          >
            <Plus className="w-4 h-4 text-nexus-accent group-hover:rotate-90 transition-transform" />
            New Session
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          <div className="px-4 mb-2 text-[10px] uppercase tracking-widest text-nexus-text-dim font-bold">
            Capabilities
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group",
                activeTab === item.id 
                  ? "bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20" 
                  : "text-nexus-text-dim hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4",
                activeTab === item.id ? "text-nexus-accent" : "group-hover:text-white"
              )} />
              {item.label}
            </button>
          ))}

          <div className="px-4 mt-8 mb-2 text-[10px] uppercase tracking-widest text-nexus-text-dim font-bold">
            History
          </div>
          <div className="space-y-1 px-2">
            {sessions.length === 0 ? (
              <div className="px-4 py-3 text-[10px] text-nexus-text-dim italic">
                No neural logs found.
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer",
                    currentSessionId === session.id 
                      ? "bg-nexus-accent/10 border border-nexus-accent/20" 
                      : "hover:bg-white/5 border border-transparent"
                  )}
                  onClick={() => {
                    onSelectSession?.(session.id);
                    setActiveTab('chat');
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <History className={cn(
                    "w-3.5 h-3.5 flex-shrink-0",
                    currentSessionId === session.id ? "text-nexus-accent" : "text-nexus-text-dim"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-[11px] font-bold truncate",
                      currentSessionId === session.id ? "text-nexus-accent" : "text-white/80"
                    )}>
                      {session.title || 'Untitled Session'}
                    </div>
                    <div className="text-[9px] text-nexus-text-dim truncate">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user) {
                        deleteDoc(doc(db, 'users', user.uid, 'sessions', session.id));
                        if (currentSessionId === session.id) onNewSession?.();
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminate Link
          </button>
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-nexus-text-dim">Core Online</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {activeTab !== 'dashboard' && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-nexus-text-dim hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-nexus-accent" />
              <span className="text-sm font-medium text-white/80">Neural Link Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {localStorage.getItem('nexus_user_key') && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20">
                <Shield className="w-3.5 h-3.5 text-nexus-accent" />
                <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Neural Shield Active</span>
              </div>
            )}
            <div 
              onClick={() => setActiveTab('account')}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-white leading-none group-hover:text-nexus-accent transition-colors">{user?.displayName || 'User'}</span>
                <span className="text-[9px] text-nexus-text-dim uppercase tracking-widest mt-1">{user?.email?.split('@')[0]}</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-nexus-accent overflow-hidden group-hover:shadow-[0_0_10px_rgba(0,242,255,0.5)] transition-all">
                <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-2" />
            <button 
              onClick={() => setActiveTab('account')}
              className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>

        {/* Neural News Ticker */}
        <div className="h-8 bg-black/40 border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap relative z-10">
          <div className="absolute left-0 top-0 bottom-0 px-3 bg-nexus-accent flex items-center z-20">
            <span className="text-[9px] font-bold text-nexus-bg uppercase tracking-widest">Neural Feed</span>
          </div>
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 pl-32"
          >
            {[
              "GEMINI 2.0 PRO CORE SYNCHRONIZED",
              "NEURAL BANDWIDTH AT 98.4% CAPACITY",
              "NEW MOTION GEN KERNELS DEPLOYED",
              "QUANTUM REASONING MODULE ACTIVE",
              "GLOBAL INFERENCE LOAD: STABLE",
              "NEURAL ARCHITECT v4.2 INITIALIZED",
              "VISION SYNTHESIS ACCURACY IMPROVED BY 12%",
              "DEEP RESEARCH GROUNDING ACTIVE"
            ].map((news, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-nexus-accent" />
                <span className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest">{news}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
