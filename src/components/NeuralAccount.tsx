import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Bell, 
  Palette, 
  LogOut, 
  ChevronRight,
  Activity,
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function NeuralAccount() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = React.useState('profile');

  const stats = [
    { label: 'Neural Sessions', value: '124', icon: Activity, color: 'text-nexus-accent' },
    { label: 'Visions Generated', value: '842', icon: Zap, color: 'text-yellow-400' },
    { label: 'Data Synced', value: '1.2 GB', icon: Database, color: 'text-nexus-purple' },
  ];

  const menuItems = [
    { id: 'profile', label: 'Profile Overview', icon: User },
    { id: 'security', label: 'Security & Keys', icon: Shield },
    { id: 'auth', label: 'Authentication', icon: Key },
    { id: 'preferences', label: 'Neural Preferences', icon: Palette },
    { id: 'notifications', label: 'Transmissions', icon: Bell },
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural Account</h1>
        <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Manage your neural identity and core configurations</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                activeSection === item.id 
                  ? "bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20" 
                  : "text-nexus-text-dim hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                activeSection === item.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              )} />
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              Terminate Link
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 no-scrollbar pb-12">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-nexus-accent p-1 overflow-hidden">
                    <img 
                      src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-nexus-bg border-2 border-nexus-accent flex items-center justify-center">
                    <Globe className="w-4 h-4 text-nexus-accent" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{user?.displayName || 'Neural Entity'}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-nexus-text-dim mb-4">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-nexus-accent/10 border border-nexus-accent/20 text-[10px] font-bold text-nexus-accent uppercase tracking-widest">
                      Core Member
                    </span>
                    <span className="px-3 py-1 rounded-full bg-nexus-purple/10 border border-nexus-purple/20 text-[10px] font-bold text-nexus-purple uppercase tracking-widest">
                      Early Access
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass p-6 rounded-2xl border border-white/5">
                    <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Account Details */}
              <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Neural Identity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">Display Name</label>
                    <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-sm text-white/60">
                      {user?.displayName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-2">Neural ID</label>
                    <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/40 font-mono truncate">
                      {user?.uid}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-nexus-accent/20">
                    <Key className="w-5 h-5 text-nexus-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white">API Key Management</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">Personal Gemini Key</span>
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white/40 font-mono">
                        ••••••••••••••••••••••••••••••••
                      </div>
                      <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all">
                        Update
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-nexus-text-dim leading-relaxed">
                    Your API keys are stored locally in your browser's neural buffer. They are never transmitted to our servers, ensuring maximum privacy and security.
                  </p>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-nexus-purple/20">
                    <Shield className="w-5 h-5 text-nexus-purple" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold text-white">Google Auth Link</div>
                    <div className="text-[10px] text-nexus-text-dim">Your account is secured via Google OAuth 2.0</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                    Verified
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'auth' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-nexus-accent/20">
                    <Key className="w-5 h-5 text-nexus-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Session Management</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="text-xs font-bold text-white uppercase tracking-widest">Active Session</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nexus-accent/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-nexus-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{user?.displayName || 'Neural Entity'}</div>
                        <div className="text-[10px] text-nexus-text-dim">{user?.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => logout()}
                      className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all"
                    >
                      Terminate Session (Log Out)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="text-xs font-bold text-white uppercase tracking-widest">Switch Identity</div>
                    <p className="text-[10px] text-nexus-text-dim leading-relaxed">
                      To sign in with a different account or create a new neural identity, please terminate your current session first.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => logout()}
                        className="flex-1 py-2 rounded-lg bg-nexus-accent/10 border border-nexus-accent/20 text-nexus-accent font-bold text-[10px] uppercase tracking-widest hover:bg-nexus-accent/20 transition-all"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => logout()}
                        className="flex-1 py-2 rounded-lg bg-nexus-purple/10 border border-nexus-purple/20 text-nexus-purple font-bold text-[10px] uppercase tracking-widest hover:bg-nexus-purple/20 transition-all"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-nexus-purple/20">
                    <Shield className="w-5 h-5 text-nexus-purple" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Authentication Protocols</h3>
                </div>
                <p className="text-xs text-nexus-text-dim leading-relaxed">
                  NEXUS utilizes advanced OAuth 2.0 and Firebase Authentication to secure your neural link. 
                  Multi-factor authentication is enforced via your primary identity provider.
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-nexus-accent/20">
                    <Palette className="w-5 h-5 text-nexus-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Visual Interface</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-4">Accent Color</label>
                    <div className="flex gap-4">
                      {['#00f2ff', '#a855f7', '#ec4899', '#10b981', '#f59e0b'].map((color) => (
                        <button 
                          key={color}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            color === '#00f2ff' ? "border-white scale-110 shadow-[0_0_15px_rgba(0,242,255,0.5)]" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">Glassmorphism Intensity</div>
                      <div className="text-[10px] text-nexus-text-dim">Adjust the blur and transparency of the UI</div>
                    </div>
                    <input type="range" className="accent-nexus-accent" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
