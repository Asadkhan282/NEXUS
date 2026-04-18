import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Send, 
  Bot, 
  User, 
  Brain, 
  Zap, 
  Search, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Network,
  MessageSquare,
  Activity,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateResponse } from '../services/gemini';
import { MODELS } from '../constants';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'executing' | 'complete' | 'error';
  color: string;
  icon: any;
  output?: string;
}

export default function NeuralAgency() {
  const [goal, setGoal] = React.useState('');
  const [isSwarming, setIsSwarming] = React.useState(false);
  const [step, setStep] = React.useState<'input' | 'planning' | 'execution' | 'synthesis'>('input');
  const [agents, setAgents] = React.useState<Agent[]>([
    { id: 'director', name: 'Director v4', role: 'Strategic Overseer', status: 'idle', color: 'text-nexus-accent', icon: Brain },
    { id: 'analyst', name: 'Analyst.log', role: 'Data & Market Specialist', status: 'idle', color: 'text-blue-400', icon: Search },
    { id: 'creative', name: 'Visionary.art', role: 'UI/UX & Creative Director', status: 'idle', color: 'text-pink-400', icon: Sparkles },
    { id: 'coder', name: 'Synthesizer.sh', role: 'Full-Stack Architect', status: 'idle', color: 'text-orange-400', icon: Code2 }
  ]);
  const [sessionLog, setSessionLog] = React.useState<{ agent: string; message: string; time: string }[]>([]);
  const [finalOutput, setFinalOutput] = React.useState('');

  const addLog = (agent: string, message: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSessionLog(prev => [...prev.slice(-15), { agent, message, time }]);
  };

  const handleStartSwarm = async () => {
    if (!goal.trim()) return;
    
    setIsSwarming(true);
    setStep('planning');
    setAgents(prev => prev.map(a => ({ ...a, status: a.id === 'director' ? 'analyzing' : 'idle', output: undefined })));
    setFinalOutput('');
    addLog('System', 'Initializing multi-agent neural link...');
    addLog('Director v4', `Analyzing high-level goal: "${goal}"`);

    try {
      // Step 1: Planning
      await new Promise(r => setTimeout(r, 1500));
      setAgents(prev => prev.map(a => a.id === 'director' ? { ...a, status: 'complete' } : a));
      addLog('Director v4', 'Task breakdown complete. Assigning neural loads.');

      // Step 2: Execution
      setStep('execution');
      setAgents(prev => prev.map(a => a.id !== 'director' ? { ...a, status: 'executing' } : a));
      
      const subAgents = agents.filter(a => a.id !== 'director');
      const agentResults: Record<string, string> = {};

      const executionTasks = subAgents.map(async (agent) => {
        try {
          addLog(agent.name, `Synthesizing ${agent.role} perspective...`);
          
          const prompt = `As ${agent.name}, a ${agent.role}, provide a brief strategic overview (3 sentences) for this goal: ${goal}. Focus ONLY on your specific domain. Be concise and technical.`;
          const response = await generateResponse(prompt, [], MODELS.GENERAL);
          const outputText = response.text || 'Protocol timeout.';
          
          agentResults[agent.id] = outputText;
          setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'complete', output: outputText } : a));
          addLog(agent.name, 'Technical contribution localized.');
          return { id: agent.id, role: agent.role, output: outputText };
        } catch (e) {
          addLog(agent.name, 'ERROR: Neural desync.');
          setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'error' } : a));
          return { id: agent.id, role: agent.role, output: 'Error: Connection lost.' };
        }
      });

      const results = await Promise.all(executionTasks);

      // Step 3: Synthesis
      setStep('synthesis');
      setAgents(prev => prev.map(a => a.id === 'director' ? { ...a, status: 'analyzing' } : a));
      addLog('Director v4', 'Agent data received. Performing final multimodal synthesis...');

      const agentOutputs = results.map(r => `${r.role}: ${r.output}`).join('\n\n');
      const synthesisPrompt = `GOAL: ${goal}\n\nSUB-AGENT CONTRIBUTIONS:\n${agentOutputs}\n\nTASK: Synthesize these into a cohesive Master Plan. Use bullet points and professional architect terminology. Focus on immediate actionable steps.`;

      // Use a generator logic or simple string accumulation for "feeling" like a stream
      const synthesisResponse = await generateResponse(synthesisPrompt, [], MODELS.THINKING);
      const text = synthesisResponse.text || '';
      
      // Simulate typing for synthesis to make it feel more organic
      let displayed = '';
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        displayed += words[i] + ' ';
        setFinalOutput(displayed);
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 20)); // Small pause every few words
      }

      setAgents(prev => prev.map(a => ({ ...a, status: 'complete' })));
      addLog('Director v4', 'Mission complete. Neural Agency output ready.');
    } catch (error) {
      console.error("Swarm failed:", error);
      addLog('System', 'CRITICAL ERROR: Neural desync detected.');
    } finally {
      setIsSwarming(false);
    }
  };

  const resetSwarm = () => {
    setStep('input');
    setGoal('');
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle', output: undefined })));
    setSessionLog([]);
    setFinalOutput('');
    setIsSwarming(false);
  };

  const steps = [
    { id: 'input', label: 'Mission Input', icon: MessageSquare },
    { id: 'planning', label: 'Strategic Planning', icon: Brain },
    { id: 'execution', label: 'Distributed Execution', icon: Zap },
    { id: 'synthesis', label: 'Neural Synthesis', icon: Sparkles },
  ];

  return (
    <div className="min-h-full w-full flex flex-col p-4 md:p-8 bg-black/20 relative z-10 pointer-events-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-nexus-accent" />
            Neural Agency
          </h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Deploy autonomous multi-agent swarms for complex synthesis</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = steps.findIndex(st => st.id === step) > i;
            
            return (
              <React.Fragment key={s.id}>
                {i > 0 && <div className={cn("w-4 h-[1px]", isCompleted ? "bg-nexus-accent" : "bg-white/10")} />}
                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-nexus-accent/10 border-nexus-accent text-nexus-accent" 
                      : isCompleted
                        ? "bg-nexus-accent/5 border-nexus-accent/30 text-nexus-accent/60"
                        : "bg-white/5 border-white/10 text-nexus-text-dim"
                  )}
                >
                  <s.icon className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {step !== 'input' && !isSwarming && (
          <button 
            onClick={resetSwarm}
            className="px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all"
          >
            New Swarm
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Swarm Infrastructure */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Agent Command Center */}
          <div className="grid grid-cols-2 gap-4">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  className={cn(
                    "p-4 rounded-2xl border transition-all relative overflow-hidden group",
                    agent.status === 'idle' ? "bg-white/5 border-white/5" : "bg-white/10 border-white/20",
                    agent.status === 'executing' && "ring-1 ring-nexus-accent/50",
                    agent.status === 'error' && "border-red-500/50 bg-red-500/5"
                  )}
                >
                  {agent.status === 'executing' && (
                    <motion.div 
                      initial={{ top: '-100%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-nexus-accent/10 to-transparent z-0 pointer-events-none"
                    />
                  )}
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <div className={cn(
                      "p-2 rounded-xl bg-white/5 transition-all", 
                      agent.color, 
                      agent.status === 'executing' && "animate-pulse scale-110 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                    )}>
                      <agent.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white truncate">{agent.name}</h3>
                      <p className="text-[10px] text-nexus-text-dim uppercase tracking-tighter truncate">{agent.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      {agent.status === 'executing' && <Loader2 className="w-4 h-4 text-nexus-accent animate-spin" />}
                      {agent.status === 'error' && <X className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>

                  {agent.output && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <p className="text-[9px] text-white/50 italic line-clamp-2 leading-relaxed">
                        "{agent.output}"
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>

          {/* Master View / Output */}
          <div className="min-h-[500px] flex-1 glass rounded-2xl border border-white/10 flex flex-col relative z-20">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between shadow-sm relative z-30">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-nexus-text-dim">
                <Network className="w-3 h-3" />
                Synthesis Output
              </div>
              <div className="flex items-center gap-4">
                {finalOutput && !isSwarming && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(finalOutput)}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-nexus-accent hover:text-white transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    COPY PROTOCOL
                  </button>
                )}
                {isSwarming && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-nexus-accent animate-pulse">SWARM ACTIVE</span>
                    <Activity className="w-3 h-3 text-nexus-accent" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/10">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div 
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
                  >
                    <div className="p-4 rounded-full bg-nexus-accent/10 mb-6">
                      <Zap className="w-12 h-12 text-nexus-accent" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Initialize Mission</h2>
                    <p className="text-sm text-nexus-text-dim mb-8">
                      Define a complex objective. Director v4 will coordinate multiple autonomous 
                      neural nodes to architect a comprehensive solution.
                    </p>
                    <div className="w-full relative group">
                      <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., 'Architect a decentralized neural file system with 256-bit encryption and edge-computing protocol...'"
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-nexus-accent outline-none transition-all resize-none scroll-smooth"
                      />
                      <button
                        onClick={handleStartSwarm}
                        disabled={!goal.trim() || isSwarming}
                        className="absolute bottom-4 right-4 p-3 rounded-xl bg-nexus-accent text-nexus-bg hover:opacity-90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                      >
                        <ArrowRight className="w-5 h-5 font-bold" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="swarming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {!finalOutput ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="w-12 h-12 text-nexus-accent animate-spin mb-6" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                          {step === 'planning' ? 'Strategic Planning' : step === 'execution' ? 'Distributed Execution' : 'Modal Synthesis'}
                        </h3>
                        <p className="text-sm text-nexus-text-dim mt-2">Connecting to distributed neural clusters...</p>
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
                        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20">
                          <Bot className="w-6 h-6 text-nexus-accent" />
                          <h3 className="text-lg font-bold text-white tracking-tight">Strategy Protocol Finalized</h3>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-nexus-text-dim">
                            {finalOutput}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Swarm Telemetry Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6 relative z-10">
          {/* Swarm Logic Log */}
          <div className="min-h-[400px] lg:h-auto lg:flex-1 glass rounded-2xl border border-white/10 flex flex-col relative">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-20">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-nexus-text-dim">
                <MessageSquare className="w-3 h-3" />
                Swarm Protocol Log
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] scroll-smooth scrollbar-thin scrollbar-thumb-white/10">
              {sessionLog.length === 0 && <span className="text-white/20 italic">No active telemetry...</span>}
              {sessionLog.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-white/5 pl-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-accent font-bold uppercase tracking-tighter">{log.agent}</span>
                    <span className="text-white/20 text-[8px]">{log.time}</span>
                  </div>
                  <span className="text-white/70 group-hover:text-white transition-colors">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Monitor */}
          <div className="glass p-4 rounded-2xl border border-white/10">
            <h4 className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest mb-4">Neural Resources</h4>
            <div className="space-y-4">
              {[
                { label: 'Swarm Density', value: isSwarming ? '94%' : '0%', color: 'bg-nexus-accent' },
                { label: 'Compute Load', value: isSwarming ? '78%' : '12%', color: 'bg-nexus-purple' },
                { label: 'Synapse Latency', value: isSwarming ? '4ms' : '1ms', color: 'bg-emerald-500' }
              ].map((res, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-nexus-text-dim">{res.label}</span>
                    <span className="text-white font-bold">{res.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: res.value }}
                      className={cn("h-full", res.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
