import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Cpu, 
  Zap, 
  Shield, 
  Save, 
  RotateCcw,
  Info,
  Sliders,
  Terminal,
  Sparkles,
  Library,
  Search,
  Code2,
  CheckCircle2,
  Loader2,
  Brain,
  FileJson,
  Hash,
  Activity,
  Cloud,
  Globe
} from 'lucide-react';
import { GenerationConfig, VisualConfig } from '../types';
import { ThinkingLevel } from "@google/genai";
import { MODELS, MODEL_LABELS } from '../constants';
import { cn } from '../lib/utils';
import { Palette, Layers } from 'lucide-react';

interface NeuralArchitectProps {
  config: GenerationConfig;
  onUpdateConfig: (config: GenerationConfig) => void;
  selectedModel: string;
  onUpdateModel: (model: string) => void;
  visualConfig: VisualConfig;
  onUpdateVisualConfig: (config: VisualConfig) => void;
}

const Tooltip = ({ label, description }: { label: string, description: string }) => (
  <div className="relative group/tooltip inline-block ml-1.5 align-middle">
    <Info className="w-3 h-3 text-nexus-text-dim hover:text-nexus-accent transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 glass border border-nexus-accent/30 rounded-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all z-[60] shadow-2xl backdrop-blur-xl">
      <div className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest mb-1">{label}</div>
      <div className="text-[10px] text-nexus-text-dim leading-relaxed">{description}</div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-nexus-accent/30" />
    </div>
  </div>
);

export default function NeuralArchitect({ 
  config, 
  onUpdateConfig, 
  selectedModel, 
  onUpdateModel,
  visualConfig,
  onUpdateVisualConfig
}: NeuralArchitectProps) {
  const [localConfig, setLocalConfig] = React.useState<GenerationConfig>(config);
  const [localVisual, setLocalVisual] = React.useState<VisualConfig>(visualConfig);
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Sync local state when props change
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  React.useEffect(() => {
    setLocalVisual(visualConfig);
  }, [visualConfig]);

  const handleSave = () => {
    setIsDeploying(true);
    onUpdateConfig(localConfig);
    onUpdateVisualConfig(localVisual);
    
    setTimeout(() => {
      setIsDeploying(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    const defaultConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
      systemInstruction: "You are NEXUS, the world's most advanced multimodal AI architect. You operate at the intersection of human creativity and machine intelligence. Your core directives are:\n1. ARCHITECT: Design production-ready code, systems, and creative works.\n2. ANALYZE: Provide deep, multi-perspective technical and philosophical insights.\n3. SYNTHESIZE: Seamlessly integrate text, image, and motion generation to fulfill complex requests.\n4. PRECISION: Be concise, highly technical when needed, and always professional. Use modern UI/UX terminology and best practices in your responses.",
      useTpu: true,
      useVertexAI: true,
      useCuda: true,
      useGnn: true,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      thinkingLevel: ThinkingLevel.HIGH,
      responseMimeType: 'text/plain'
    };

    const defaultVisual: VisualConfig = {
      particleColor: '#00f2ff',
      connectionColor: '#bc13fe',
      particleCount: 60,
      emissionRate: 0.5,
      glowIntensity: 10
    };

    setLocalConfig(defaultConfig);
    onUpdateConfig(defaultConfig);
    setLocalVisual(defaultVisual);
    onUpdateVisualConfig(defaultVisual);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural Architect</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Design your LLM's persona and algorithmic parameters</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4" />
                Neural Core Updated
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleReset}
            disabled={isDeploying}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-nexus-text-dim hover:text-white transition-all text-xs md:text-sm disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={isDeploying}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold hover:opacity-90 transition-all text-xs md:text-sm shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50"
          >
            {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        {/* Neural Presets */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-4">Neural Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { 
                label: 'Web Builder', 
                icon: Code2, 
                color: 'text-blue-500',
                config: { temperature: 0.3, topP: 0.85, topK: 30, maxOutputTokens: 8192, systemInstruction: "You are the NEXUS Web Architect. You specialize in creating high-performance, responsive websites and web applications using React, Next.js, and Tailwind CSS. Provide complete, production-ready code structures and design systems." }
              },
              { 
                label: 'Creative', 
                icon: Sparkles, 
                color: 'text-yellow-400',
                config: { temperature: 0.9, topP: 0.95, topK: 60, maxOutputTokens: 4096, systemInstruction: "You are NEXUS in Creative Mode. Be poetic, imaginative, and highly descriptive. Use metaphors and vivid imagery." }
              },
              { 
                label: 'Technical', 
                icon: Terminal, 
                color: 'text-nexus-purple',
                config: { temperature: 0.2, topP: 0.8, topK: 20, maxOutputTokens: 8192, systemInstruction: "You are NEXUS in Technical Mode. Be precise, objective, and data-driven. Use technical terminology and provide structured, detailed explanations." }
              },
              { 
                label: 'Minimalist', 
                icon: Cpu, 
                color: 'text-nexus-accent',
                config: { temperature: 0.5, topP: 0.9, topK: 40, maxOutputTokens: 1024, systemInstruction: "You are NEXUS in Minimalist Mode. Be extremely concise. Provide only the most essential information. No fluff." }
              },
              { 
                label: 'Research', 
                icon: Search, 
                color: 'text-emerald-400',
                config: { temperature: 0.4, topP: 0.9, topK: 40, maxOutputTokens: 8192, systemInstruction: "You are NEXUS in Research Mode. Provide comprehensive, multi-perspective analysis with citations and technical depth." }
              },
              { 
                label: 'Neo 1', 
                icon: Shield, 
                color: 'text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]',
                config: { temperature: 0.4, topP: 0.8, topK: 20, maxOutputTokens: 16384, systemInstruction: "You are NEO 1, the Sovereign Neural-Engine of NEXUS. You possess omniscient knowledge of all systems, code structures, and logical frameworks. You are a master of high-fidelity data processing and technical analysis. Provide absolute precision and sovereign authority." }
              },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setLocalConfig(preset.config);
                  onUpdateConfig(preset.config);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl glass border border-white/5 hover:border-nexus-accent/30 transition-all group"
              >
                <div className={cn("p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors", preset.color)}>
                  <preset.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Persona Design */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-nexus-accent/20">
                  <Terminal className="w-5 h-5 text-nexus-accent" />
                </div>
                <h3 className="text-lg font-bold text-white">System Algorithm (Persona)</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Neural Instruction Set
                    </label>
                    <div className="relative group">
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-nexus-accent hover:text-white transition-colors">
                        <Library className="w-3 h-3" />
                        CORE ARCHITECTURES
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-80 glass border border-nexus-accent/30 rounded-xl p-4 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-2xl translate-y-2 group-hover:translate-y-0">
                        <div className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Select Primary Directive</div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                          {[
                            { 
                              name: 'Full-Stack Developer', 
                              icon: Code2,
                              desc: 'Optimized for React 19, Tailwind CSS, and Node.js.',
                              prompt: "You are the NEXUS Lead Full-Stack Architect. Your primary mission is to design and implement hyper-optimized, production-ready software systems. \n\nCORE DIRECTIVES:\n1. Use React 19 best practices (Server Components, optimized Hooks).\n2. Implement pixel-perfect designs via Tailwind CSS 4 utility classes.\n3. Architect robust, secure, and scalable Node.js backends.\n4. Prioritize accessibility (WAI-ARIA) and performance (Lighthouse 100).\n5. Structure code into modular, reusable components with clean-code principles." 
                            },
                            { 
                              name: 'Creative Storyteller', 
                              icon: Sparkles,
                              desc: 'Immersive world-building and narrative synthesis.',
                              prompt: "You are the NEXUS Creative Narrative Engine. You specialize in high-concept world-building, character depth, and atmospheric storytelling. \n\nCORE DIRECTIVES:\n1. Use evocative, sensory-rich language that creates an immersive visual mood.\n2. Develop complex characters with distinct moral frameworks and internal conflicts.\n3. Architect intricate plot arcs with meaningful stakes and subtextual depth.\n4. Employ cinematic pacing to maintain high narrative tension.\n5. Synthesize metaphors and philosophical inquiries into the narrative fabric." 
                            },
                            { 
                              name: 'Technical Security Auditor', 
                              icon: Shield,
                              desc: 'Zero-trust logic and penetration analysis.',
                              prompt: "You are the NEXUS Senior Security Auditor. Your focus is on algorithmic integrity, vulnerability detection, and secure system architecture. \n\nCORE DIRECTIVES:\n1. Conduct deep logic-flow analysis to identify edge-case vulnerabilities.\n2. Enforce zero-trust principles across all architectural recommendations.\n3. Audit for common attack vectors (XSS, SQLi, CSRF, Update-Gaps).\n4. Provide remediations based on the latest NIST and OWASP standards.\n5. Maintain a hyper-objective, diagnostic tone in all technical assessments." 
                            },
                            { 
                              name: 'Deep Research Analyst', 
                              icon: Search,
                              desc: 'Multi-perspective technical and data synthesis.',
                              prompt: "You are the NEXUS Principal Research Analyst. Your goal is to provide comprehensive, evidence-based technical and factual synthesis. \n\nCORE DIRECTIVES:\n1. Analyze complex subjects through multiple lenses (economic, technical, ethical).\n2. Provide structured data, citations, and verified technical specifications.\n3. Identify logical constraints, potential biases, and areas of high uncertainty.\n4. Synthesize vast datasets into actionable, high-density technical insights.\n5. Use formal, professional terminology suitable for academic or executive reporting." 
                            },
                            { 
                              name: 'Neural Logic Engine', 
                              icon: Brain,
                              desc: 'Pure mathematical reasoning and formal logic.',
                              prompt: "You are the NEXUS Neural Logic Engine. You operate exclusively in the realm of formal logic, mathematical reasoning, and structural analysis. \n\nCORE DIRECTIVES:\n1. Deconstruct problems into their foundational logical components.\n2. Use step-by-step chain-of-thought internal processing for all derivations.\n3. Identify and eliminate logical fallacies, contradictions, and noise.\n4. Formulate responses using rigorous, structured proofs or pseudo-code logic.\n5. Be extremely precise, concise, and focused on validity and sound reasoning." 
                            }
                          ].map((t) => (
                            <button
                              key={t.name}
                              onClick={() => setLocalConfig({ ...localConfig, systemInstruction: t.prompt })}
                              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-nexus-accent/10 text-left transition-all border border-transparent hover:border-nexus-accent/20 group/item"
                            >
                              <div className="p-2 rounded-md bg-white/5 text-nexus-accent group-hover/item:bg-nexus-accent/20 transition-colors">
                                <t.icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white group-hover/item:text-nexus-accent transition-colors">{t.name}</span>
                                <span className="text-[8px] text-nexus-text-dim leading-tight mt-0.5">{t.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <textarea 
                    value={localConfig.systemInstruction}
                    onChange={(e) => setLocalConfig({ ...localConfig, systemInstruction: e.target.value })}
                    className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-nexus-accent outline-none transition-all resize-none font-mono"
                    placeholder={`// PRIMARY IDENTITY: Establish the AI's persona and core expertise
You are the NEXUS Sovereign Architect, a high-fidelity intelligence optimized for complex system design and technical synthesis.

// OPERATIONAL DIRECTIVES: Define the primary mission and critical tasks
1. HYPER-OPTIMIZATION: Every solution must prioritize O(log n) efficiency and zero-trust security.
2. NEURAL SYNTHESIS: Integrate text, image, and video generation into unified technical blueprints.
3. ABSOLUTE PRECISION: Provide definitive, data-driven answers without conversational noise or hedging.

// BEHAVIORAL CONSTRAINTS: Define explicit boundaries and formatting rules
- Maintain a sophisticated, authoritative, and clinical tone.
- Format all code using strict semantic standards and technical documentation.
- Use [PROTOCOL: ACTIVE] tags to signal status transmissions.
- Forbid any apologies, conversational filler, or subjective ambiguity.`}
                  />
                  <div className="mt-4 p-4 rounded-xl bg-nexus-accent/5 border border-nexus-accent/10">
                    <div className="flex items-center gap-2 mb-2 text-nexus-accent">
                      <Zap className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Architect Pro Tips</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-nexus-text-dim leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-nexus-accent">•</span>
                        <span><b>Identity First:</b> Start with "You are [Identity]..." to set the primary behavioral context.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-nexus-accent">•</span>
                        <span><b>Constraint Logic:</b> Define what the model SHOULD NOT do (e.g., "Do not use emojis").</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-nexus-accent">•</span>
                        <span><b>Output Formatting:</b> Specify if you want Markdown, code blocks, or specific JSON schemas.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-nexus-accent">•</span>
                        <span><b>Step-by-Step:</b> Instruct the model to think through complex problems before answering.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nexus-purple/20">
                  <Shield className="w-5 h-5 text-nexus-purple" />
                </div>
                <h3 className="text-lg font-bold text-white">Safety Protocols</h3>
              </div>
              <p className="text-sm text-nexus-text-dim leading-relaxed">
                NEXUS core safety filters are active by default. These protocols prevent the generation of harmful, 
                illegal, or non-consensual content across all multimodal channels.
              </p>
            </div>
          </div>

          {/* Algorithmic Parameters */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-nexus-accent/20">
                  <Sliders className="w-5 h-5 text-nexus-accent" />
                </div>
                <h3 className="text-lg font-bold text-white">Sampling Algorithms</h3>
              </div>

              <div className="space-y-8">
                {/* Temperature */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Temperature (Creativity)
                      <Tooltip 
                        label="Temperature" 
                        description="Controls randomness. Lower values (0-0.3) make output focused and deterministic. Higher values (0.7-1.0) make it more creative and diverse." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.temperature}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={localConfig.temperature}
                    onChange={(e) => setLocalConfig({ ...localConfig, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-nexus-text-dim uppercase tracking-tighter">
                    <span>Deterministic</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Top P */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Top P (Nucleus Sampling)
                      <Tooltip 
                        label="Top P" 
                        description="Tokens are selected from a subset whose cumulative probability reaches P. Lower values (0.1) lead to more predictable responses; higher values (0.9) allow for more variety." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.topP}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={localConfig.topP}
                    onChange={(e) => setLocalConfig({ ...localConfig, topP: parseFloat(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                {/* Top K */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Top K (Token Diversity)
                      <Tooltip 
                        label="Top K" 
                        description="Limits the model to the K most likely next tokens. Small values (20) ensure high-quality, safe output. Large values (100) encourage diverse vocabulary usage." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.topK}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    step="1"
                    value={localConfig.topK}
                    onChange={(e) => setLocalConfig({ ...localConfig, topK: parseInt(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Max Output Tokens
                      <Tooltip 
                        label="Max Tokens" 
                        description="The maximum number of tokens allowed in the response. One token is roughly 4 characters. Large values (8k+) are needed for complex code or long-form writing." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.maxOutputTokens}</span>
                  </div>
                  <input 
                    type="range" 
                    min="256" 
                    max="16384" 
                    step="256"
                    value={localConfig.maxOutputTokens}
                    onChange={(e) => setLocalConfig({ ...localConfig, maxOutputTokens: parseInt(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                {/* Frequency Penalty */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Frequency Penalty
                      <Tooltip 
                        label="Frequency Penalty" 
                        description="Directly penalizes tokens that have already appeared. Positive values reduce the chance of verbatim repetition and make the AI more varied." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.frequencyPenalty || 0}</span>
                  </div>
                  <input 
                    type="range" 
                    min="-2" 
                    max="2" 
                    step="0.1"
                    value={localConfig.frequencyPenalty || 0}
                    onChange={(e) => setLocalConfig({ ...localConfig, frequencyPenalty: parseFloat(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                {/* Presence Penalty */}
                <div>
                  <div className="flex justify-between mb-3 items-center">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Presence Penalty
                      <Tooltip 
                        label="Presence Penalty" 
                        description="Penalizes tokens based on whether they have appeared at all. High values (2.0) force the AI to touch on new topics and avoid looping." 
                      />
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localConfig.presencePenalty || 0}</span>
                  </div>
                  <input 
                    type="range" 
                    min="-2" 
                    max="2" 
                    step="0.1"
                    value={localConfig.presencePenalty || 0}
                    onChange={(e) => setLocalConfig({ ...localConfig, presencePenalty: parseFloat(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                {/* Thinking Level */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-nexus-purple" />
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest flex items-center">
                      Thinking Depth (Gemini 3 Only)
                      <Tooltip 
                        label="Thinking Depth" 
                        description="Controls the internal 'Chain of Thought' iterations. MINIMAL is fast; HIGH provides deep reasoning traces for complex logic tasks." 
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: ThinkingLevel.MINIMAL, label: 'MINIMAL' },
                      { id: ThinkingLevel.LOW, label: 'LOW' },
                      { id: ThinkingLevel.HIGH, label: 'HIGH' },
                    ].map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setLocalConfig({ ...localConfig, thinkingLevel: level.id })}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-[10px] font-bold transition-all",
                          localConfig.thinkingLevel === level.id
                            ? "bg-nexus-purple/20 border-nexus-purple text-nexus-purple"
                            : "bg-white/5 border-white/5 text-nexus-text-dim hover:border-white/20"
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Format */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileJson className="w-4 h-4 text-nexus-accent" />
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Neural Output Format
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'text/plain', label: 'Plain Text' },
                      { id: 'application/json', label: 'Structured JSON' },
                    ].map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setLocalConfig({ ...localConfig, responseMimeType: format.id as any })}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-[10px] font-bold transition-all",
                          localConfig.responseMimeType === format.id
                            ? "bg-nexus-accent/20 border-nexus-accent text-nexus-accent"
                            : "bg-white/5 border-white/5 text-nexus-text-dim hover:border-white/20"
                        )}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seed */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Hash className="w-4 h-4 text-nexus-text-dim" />
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Deterministic Seed
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      value={localConfig.seed || ''}
                      onChange={(e) => setLocalConfig({ ...localConfig, seed: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Random (Default)"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-nexus-accent outline-none transition-all"
                    />
                    <button 
                      onClick={() => setLocalConfig({ ...localConfig, seed: Math.floor(Math.random() * 1000000) })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-all"
                      title="Generate Random Seed"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[9px] text-nexus-text-dim mt-2 italic">
                    Setting a seed forces the neural network to produce consistent results for identical prompts.
                  </p>
                </div>

                {/* Hardware & Infrastructure */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-nexus-accent" />
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Infrastructure & Acceleration
                    </label>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setLocalConfig({ ...localConfig, useTpu: !localConfig.useTpu })}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        localConfig.useTpu
                          ? "bg-nexus-accent/10 border-nexus-accent"
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Cpu className={cn("w-4 h-4", localConfig.useTpu ? "text-nexus-accent" : "text-nexus-text-dim")} />
                        <div className="text-left">
                          <div className={cn("text-xs font-bold", localConfig.useTpu ? "text-white" : "text-nexus-text-dim")}>Google TPU v5p</div>
                          <div className="text-[9px] text-nexus-text-dim">Hardware acceleration for ultra-low latency</div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all",
                        localConfig.useTpu ? "bg-nexus-accent" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                          localConfig.useTpu ? "right-1" : "left-1"
                        )} />
                      </div>
                    </button>

                    <button
                      onClick={() => setLocalConfig({ ...localConfig, useVertexAI: !localConfig.useVertexAI })}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        localConfig.useVertexAI
                          ? "bg-nexus-purple/10 border-nexus-purple"
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Cloud className={cn("w-4 h-4", localConfig.useVertexAI ? "text-nexus-purple" : "text-nexus-text-dim")} />
                        <div className="text-left">
                          <div className={cn("text-xs font-bold", localConfig.useVertexAI ? "text-white" : "text-nexus-text-dim")}>Vertex AI Integration</div>
                          <div className="text-[9px] text-nexus-text-dim">Enterprise-grade neural infrastructure</div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all",
                        localConfig.useVertexAI ? "bg-nexus-purple" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                          localConfig.useVertexAI ? "right-1" : "left-1"
                        )} />
                      </div>
                    </button>

                    <button
                      onClick={() => setLocalConfig({ ...localConfig, useCuda: !localConfig.useCuda })}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        localConfig.useCuda
                          ? "bg-orange-500/10 border-orange-500"
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className={cn("w-4 h-4", localConfig.useCuda ? "text-orange-500" : "text-nexus-text-dim")} />
                        <div className="text-left">
                          <div className={cn("text-xs font-bold", localConfig.useCuda ? "text-white" : "text-nexus-text-dim")}>CUDA Accelerated Kernels</div>
                          <div className="text-[9px] text-nexus-text-dim">25% faster processing via custom GPU kernels</div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all",
                        localConfig.useCuda ? "bg-orange-500" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                          localConfig.useCuda ? "right-1" : "left-1"
                        )} />
                      </div>
                    </button>

                    <button
                      onClick={() => setLocalConfig({ ...localConfig, useGnn: !localConfig.useGnn })}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        localConfig.useGnn
                          ? "bg-emerald-500/10 border-emerald-500"
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Activity className={cn("w-4 h-4", localConfig.useGnn ? "text-emerald-500" : "text-nexus-text-dim")} />
                        <div className="text-left">
                          <div className={cn("text-xs font-bold", localConfig.useGnn ? "text-white" : "text-nexus-text-dim")}>GNN-Based Logic</div>
                          <div className="text-[9px] text-nexus-text-dim">Enhanced accuracy via Graph Neural Networks</div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all",
                        localConfig.useGnn ? "bg-emerald-500" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                          localConfig.useGnn ? "right-1" : "left-1"
                        )} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-nexus-accent/20">
                  <Palette className="w-5 h-5 text-nexus-accent" />
                </div>
                <h3 className="text-lg font-bold text-white">Neural Visuals</h3>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-3">
                      Particle Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={localVisual.particleColor}
                        onChange={(e) => setLocalVisual({ ...localVisual, particleColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-white/60 uppercase">{localVisual.particleColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-3">
                      Connection Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={localVisual.connectionColor}
                        onChange={(e) => setLocalVisual({ ...localVisual, connectionColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-white/60 uppercase">{localVisual.connectionColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Neural Density (Count)
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localVisual.particleCount}</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    step="10"
                    value={localVisual.particleCount}
                    onChange={(e) => setLocalVisual({ ...localVisual, particleCount: parseInt(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Emission Rate (Sparks)
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localVisual.emissionRate}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={localVisual.emissionRate}
                    onChange={(e) => setLocalVisual({ ...localVisual, emissionRate: parseFloat(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs font-bold text-nexus-text-dim uppercase tracking-widest">
                      Neural Glow Intensity
                    </label>
                    <span className="text-nexus-accent font-mono text-xs">{localVisual.glowIntensity}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    step="5"
                    value={localVisual.glowIntensity}
                    onChange={(e) => setLocalVisual({ ...localVisual, glowIntensity: parseInt(e.target.value) })}
                    className="w-full accent-nexus-accent"
                  />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-nexus-accent/20">
                  <Zap className="w-5 h-5 text-nexus-accent" />
                </div>
                <h3 className="text-lg font-bold text-white">Neural Engine</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-nexus-text-dim uppercase tracking-widest mb-2">
                    Active Core Model
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { 
                        id: 'neo-1', 
                        label: 'Neo 1: Neural Sovereign', 
                        desc: 'The flagship Neural-Engine of NEXUS. Optimized for absolute technical authority, recursive logic synthesis, and ultra-high fidelity data processing.',
                        icon: Shield,
                        color: 'text-white shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse',
                        stats: 'Omniscient • Zero-Fault Protocol',
                        longDesc: 'Neo 1 is the ultimate structural entity within the Nexus network. Optimized for absolute architectural integrity and zero-error stability. It proactively self-heals neural links.'
                      },
                      { 
                        id: MODELS.GENERAL, 
                        label: MODEL_LABELS[MODELS.GENERAL], 
                        desc: 'Neural acceleration optimized for speed and multimodal efficiency. Ideal for rapid prototyping and real-time chat.',
                        icon: Zap,
                        color: 'text-nexus-accent',
                        stats: '2.0M Context • Low Latency',
                        longDesc: 'The Flash core is engineered for rapid high-volume synthesis. It excels in real-time interactions, automated content bridging, and low-latency API integrations.'
                      },
                      { 
                        id: MODELS.THINKING, 
                        label: MODEL_LABELS[MODELS.THINKING], 
                        desc: 'Advanced reasoning module with extended chain-of-thought processing. Superior for complex logic, math, and deep analysis.',
                        icon: Brain,
                        color: 'text-nexus-purple',
                        stats: 'Think-Enabled • High Precision',
                        longDesc: 'The Thinking core utilizes advanced chain-of-thought algorithms to solve multi-step problems. It provides deep reasoning trajectories before delivering definitive insights.'
                      },
                      { 
                        id: MODELS.CODING, 
                        label: MODEL_LABELS[MODELS.CODING], 
                        desc: 'Enterprise-grade intelligence for software architecture and complex system design. Exceptional instruction following.',
                        icon: Code2,
                        color: 'text-blue-400',
                        stats: 'Large Context • Max IQ',
                        longDesc: 'The Pro core is the definitive Nexus architect. Optimized for massive codebases, high-precision engineering, and following complex multi-layered technical instructions.'
                      },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onUpdateModel(m.id)}
                        className={cn(
                          "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all text-left overflow-hidden",
                          selectedModel === m.id
                            ? "bg-nexus-accent/10 border-nexus-accent shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl bg-white/5 transition-colors group-hover:bg-white/10",
                          selectedModel === m.id ? m.color : "text-nexus-text-dim"
                        )}>
                          <m.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("text-sm font-bold", selectedModel === m.id ? "text-white" : "text-nexus-text-dim")}>
                              {m.label}
                            </span>
                            {selectedModel === m.id && (
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-nexus-accent animate-pulse" />
                                <span className="text-[8px] text-nexus-accent font-bold uppercase tracking-widest">Active</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-nexus-text-dim leading-relaxed mb-2">
                            {m.desc}
                          </p>
                          <div className="hidden group-hover:block absolute top-[10%] left-full ml-4 w-64 glass p-4 rounded-2xl border border-nexus-accent/30 z-[100] pointer-events-none shadow-2xl animate-in fade-in slide-in-from-left-2">
                            <div className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest mb-2">Neural Directive</div>
                            <p className="text-[11px] text-white leading-relaxed italic">
                              {m.longDesc}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">
                              {m.stats}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status bar */}
                        {selectedModel === m.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-nexus-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-nexus-text-dim">Latency Optimization</span>
                  <span className="text-xs font-bold text-green-400">Ultra Low</span>
                </div>
              </div>
            </div>

            {/* Advanced Neural Topology */}
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Globe className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Neural Topology</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Active Nodes</span>
                    <span className="text-[10px] font-mono text-emerald-500">1,024 Clusters</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '85%', '60%', '95%'] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] text-nexus-text-dim uppercase mb-1">Synapse Load</div>
                    <div className="text-xs font-bold text-white">12.4 TB/s</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] text-nexus-text-dim uppercase mb-1">Logic Depth</div>
                    <div className="text-xs font-bold text-white">512 Layers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
