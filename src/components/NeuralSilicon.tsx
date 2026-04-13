import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  Settings2, 
  Layers, 
  Microchip, 
  CircuitBoard,
  Database,
  Search,
  Plus,
  Play,
  Save,
  X,
  Thermometer,
  Battery,
  Trash2,
  Check,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const components = [
  // Logic & Processing
  { id: 'core', name: 'Neural Core', type: 'Logic', status: 'Optimized', category: 'Logic' },
  { id: 'tensor', name: 'Tensor Core', type: 'GPU', status: 'Active', category: 'Logic' },
  { id: 'nvidia-tensor', name: 'NVIDIA Tensor Core', type: 'GPU', status: 'Active', category: 'Logic' },
  { id: 'transformer', name: 'Transformer Engine', type: 'NPU', status: 'Experimental', category: 'Logic' },
  { id: 'vector', name: 'Vector Processor', type: 'NPU', status: 'Stable', category: 'Logic' },
  { id: 'gnn', name: 'GNN Logic Block', type: 'Logic', status: 'High-End', category: 'Logic' },
  { id: 'fpga', name: 'Neural FPGA', type: 'Logic', status: 'Flexible', category: 'Logic' },
  
  // Memory Architectures
  { id: 'hbm3', name: 'HBM3e Stack', type: 'Memory', status: 'Active', category: 'Memory' },
  { id: 'gddr7', name: 'GDDR7 Controller', type: 'Memory', status: 'Testing', category: 'Memory' },
  { id: 'sram', name: 'SRAM Cache', type: 'Memory', status: 'Stable', category: 'Memory' },
  { id: 'vram', name: 'VRAM Controller', type: 'Memory', status: 'Active', category: 'Memory' },
  { id: 'l3cache', name: 'L3 Neural Cache', type: 'Memory', status: 'Optimized', category: 'Memory' },
  
  // Interconnect & Fabric
  { id: 'nvlink', name: 'NVLink 5.0', type: 'Fabric', status: 'Active', category: 'Fabric' },
  { id: 'infinity', name: 'Infinity Fabric', type: 'Fabric', status: 'Stable', category: 'Fabric' },
  { id: 'pcie6', name: 'PCIe 6.0 Bus', type: 'Interconnect', status: 'Active', category: 'Fabric' },
  { id: 'cxl', name: 'CXL 3.0 Link', type: 'Interconnect', status: 'Testing', category: 'Fabric' },
  { id: 'neuralbus', name: 'Neural Bus v2', type: 'Fabric', status: 'Stable', category: 'Fabric' },
  
  // Power & Thermal
  { id: 'pmic', name: 'Neural PMIC', type: 'Power', status: 'Stable', category: 'Power' },
  { id: 'vrm', name: 'Digital VRM', type: 'Power', status: 'Active', category: 'Power' },
  { id: 'liquid', name: 'Liquid Block', type: 'Thermal', status: 'Active', category: 'Power' },
  { id: 'cryo', name: 'Cryo-Chiller', type: 'Thermal', status: 'Experimental', category: 'Power' },
  { id: 'peltier', name: 'Peltier Cooler', type: 'Thermal', status: 'Active', category: 'Power' }
];

export default function NeuralSilicon() {
  const { user } = useAuth();
  const [placedComponents, setPlacedComponents] = React.useState<any[]>([]);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [aiFeedback, setAiFeedback] = React.useState("Initialize your architecture by adding components from the Silicon Library.");
  const [clockSpeed, setClockSpeed] = React.useState(0);
  const [temperature, setTemperature] = React.useState(35);
  const [powerDraw, setPowerDraw] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showThermal, setShowThermal] = React.useState(false);
  const [showPower, setShowPower] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = React.useState({ x: 0, y: 0 });
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Simulation Loop
  React.useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setClockSpeed(prev => {
          const base = 4.2;
          const jitter = (Math.random() - 0.5) * 0.1;
          return Number((base + jitter).toFixed(2));
        });
        
        setTemperature(prev => {
          const target = showThermal ? 65 : 45;
          const diff = target - prev;
          return Number((prev + diff * 0.1 + (Math.random() - 0.5)).toFixed(1));
        });

        setPowerDraw(prev => {
          const base = placedComponents.length * 25;
          const jitter = Math.random() * 10;
          return Math.floor(base + jitter);
        });

        // Dynamic AI Feedback during simulation
        if (Math.random() > 0.9) {
          const feedbacks = [
            "Neural pathways are showing optimal throughput.",
            "Voltage regulation is nominal across all sectors.",
            "Detecting minor thermal variance in the logic block.",
            "Clock gating efficiency is at 98.4%.",
            "Branch prediction accuracy is peaking at 99.2%."
          ];
          setAiFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
        }
      }, 1000);
    } else {
      setClockSpeed(0);
      setTemperature(35);
      setPowerDraw(0);
    }
    return () => clearInterval(interval);
  }, [isSimulating, showThermal, placedComponents.length]);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addComponent = (comp: any) => {
    const newComp = {
      ...comp,
      instanceId: Date.now(),
      x: Math.random() * 200 - 100,
      y: Math.random() * 100 - 50
    };
    setPlacedComponents(prev => [...prev, newComp]);
    updateAiFeedback([...placedComponents, newComp]);
  };

  const updateAiFeedback = (currentComponents: any[]) => {
    const hasGpu = currentComponents.some(c => c.type === 'GPU');
    
    if (currentComponents.length === 0) {
      setAiFeedback("Initialize your architecture by adding components from the Silicon Library.");
    } else if (hasGpu) {
      setAiFeedback("GPU Architecture detected. Ensure high-bandwidth VRAM interconnects are established to prevent memory bottlenecks during parallel neural processing.");
    } else if (currentComponents.length < 3) {
      setAiFeedback("Architecture detected. Recommend adding a Neural Bus to stabilize interconnect bandwidth.");
    } else {
      setAiFeedback("Complex architecture detected. To optimize for 25% faster tensor processing, I recommend increasing the L2 cache bandwidth and integrating a dedicated GNN-based logic block.");
    }
  };

  const removeComponent = (instanceId: number) => {
    const updated = placedComponents.filter(c => c.instanceId !== instanceId);
    setPlacedComponents(updated);
    updateAiFeedback(updated);
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    if (!isSimulating) {
      setClockSpeed(4.2);
      setAiFeedback("Simulation active. Neural pathways are stabilizing at 4.2 GHz. Monitoring thermal dissipation...");
    } else {
      setClockSpeed(0);
      setShowThermal(false);
      setShowPower(false);
      setAiFeedback("Simulation suspended. Architecture in standby mode.");
    }
  };

  const commitDesign = async () => {
    if (!user || placedComponents.length === 0) return;
    setIsSaving(true);
    const path = `users/${user.uid}/architectures`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'architectures'), {
        components: placedComponents,
        createdAt: Date.now(),
        name: `Neural Architecture ${new Date().toLocaleDateString()}`
      });
      showNotify("Design committed to neural archives");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      showNotify("Failed to commit design");
    } finally {
      setIsSaving(false);
    }
  };

  const autoOptimize = () => {
    setPlacedComponents(prev => prev.map(c => ({ ...c, status: 'Optimized' })));
    setAiFeedback("Neural optimization complete. All components are now operating at peak efficiency.");
  };

  const panCanvas = (dx: number, dy: number) => {
    setCanvasOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden relative">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Neural Silicon</h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Architect custom AI-optimized Circuits, CPUs, and GPUs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setPlacedComponents([]); updateAiFeedback([]); }}
            className="px-4 py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Architecture
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-y-auto no-scrollbar pr-2">
        {/* Component Library */}
        <div className="lg:col-span-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Silicon Library</span>
            <Microchip className="w-4 h-4 text-nexus-text-dim" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {['Logic', 'Memory', 'Fabric', 'Power'].map((cat) => (
              <div key={cat} className="space-y-2">
                <label className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-widest">{cat} Architectures</label>
                <div className="space-y-2">
                  {components.filter(c => c.category === cat).map((comp) => (
                    <div 
                      key={comp.id} 
                      onClick={() => addComponent(comp)}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-nexus-accent/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-nexus-accent transition-colors">{comp.name}</span>
                        <span className="text-[8px] text-nexus-accent font-bold uppercase">{comp.status}</span>
                      </div>
                      <span className="text-[9px] text-nexus-text-dim">{comp.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schematic Canvas */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-white/10 relative overflow-hidden bg-black/40">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {placedComponents.map((comp) => (
                    <motion.div
                      key={comp.instanceId}
                      drag
                      dragMomentum={false}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute p-4 rounded-xl glass border border-nexus-accent/30 cursor-move group"
                      style={{ 
                        left: `calc(50% + ${comp.x + canvasOffset.x}px)`, 
                        top: `calc(50% + ${comp.y + canvasOffset.y}px)` 
                      }}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeComponent(comp.instanceId); }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-nexus-accent/10">
                          <Cpu className="w-4 h-4 text-nexus-accent" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-white">{comp.name}</div>
                          <div className="text-[8px] text-nexus-text-dim uppercase">{comp.type}</div>
                        </div>
                      </div>
                      {isSimulating && (
                        <motion.div 
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-nexus-accent shadow-[0_0_10px_#00f5ff]"
                        />
                      )}
                      {showThermal && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-xl animate-pulse pointer-events-none" />
                      )}
                      {showPower && (
                        <div className="absolute inset-0 bg-yellow-500/10 rounded-xl animate-pulse pointer-events-none" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {placedComponents.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center opacity-20">
                      <CircuitBoard className="w-16 h-16 text-white mx-auto mb-4" />
                      <p className="text-sm text-white uppercase tracking-widest">Canvas Empty</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Neural Navigator */}
            <div className="absolute top-6 left-6 flex flex-col items-center gap-1 glass p-3 rounded-2xl border border-white/10 shadow-2xl z-20">
              <button 
                onClick={() => panCanvas(0, 100)}
                className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-nexus-accent transition-colors"
                title="Pan Up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                <button 
                  onClick={() => panCanvas(100, 0)}
                  className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-nexus-accent transition-colors"
                  title="Pan Left"
                >
                  <ChevronUp className="w-5 h-5 -rotate-90" />
                </button>
                <button 
                  onClick={() => setCanvasOffset({ x: 0, y: 0 })}
                  className="p-2 rounded-lg bg-nexus-accent/10 text-nexus-accent hover:bg-nexus-accent/20 transition-colors"
                  title="Reset View"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-nexus-accent animate-pulse" />
                </button>
                <button 
                  onClick={() => panCanvas(-100, 0)}
                  className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-nexus-accent transition-colors"
                  title="Pan Right"
                >
                  <ChevronUp className="w-5 h-5 rotate-90" />
                </button>
              </div>
              <button 
                onClick={() => panCanvas(0, -100)}
                className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-nexus-accent transition-colors"
                title="Pan Down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <span className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-[0.2em] mt-2">Neural Nav</span>
            </div>

            {/* Toolbar */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                <Layers className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleSimulation}
                className={cn(
                  "p-3 rounded-xl font-bold transition-all",
                  isSimulating ? "bg-red-500 text-white" : "bg-nexus-accent text-nexus-bg"
                )}
              >
                {isSimulating ? <X className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <Activity className={cn("w-4 h-4", isSimulating ? "text-nexus-accent animate-pulse" : "text-nexus-text-dim")} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Simulation {isSimulating ? 'Active' : 'Standby'}
                  </span>
                  {isSimulating && (
                    <div className="flex gap-3 mt-1">
                      <span className="text-[8px] text-nexus-accent font-mono">{clockSpeed} GHz</span>
                      <span className="text-[8px] text-red-400 font-mono">{temperature}°C</span>
                      <span className="text-[8px] text-yellow-400 font-mono">{powerDraw}W</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Design Assistant */}
          <div className="h-48 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-nexus-accent" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Silicon Architect</span>
              </div>
              <button 
                onClick={commitDesign}
                disabled={isSaving || placedComponents.length === 0}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-nexus-accent/10 border border-nexus-accent/20 text-[10px] font-bold text-nexus-accent hover:bg-nexus-accent/20 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Commit Design
              </button>
            </div>
            <div className="flex-1 p-4 flex gap-4">
              <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 overflow-y-auto">
                <p className="text-xs text-nexus-text-dim leading-relaxed italic">
                  "{aiFeedback}"
                </p>
              </div>
              <div className="w-48 space-y-2">
                <button 
                  onClick={autoOptimize}
                  className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-all"
                >
                  Auto-Optimize
                </button>
                <button 
                  onClick={() => {
                    if (!isSimulating) return;
                    setShowThermal(!showThermal);
                    setAiFeedback(showThermal ? "Thermal analysis suspended." : "Thermal analysis active. Core temperature stabilized at 65°C. Heat dissipation within safe parameters.");
                  }}
                  className={cn(
                    "w-full py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-2",
                    showThermal ? "bg-red-500/20 border-red-500 text-red-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  )}
                >
                  <Thermometer className="w-3 h-3" />
                  Thermal Analysis
                </button>
                <button 
                  onClick={() => {
                    if (!isSimulating) return;
                    setShowPower(!showPower);
                    setAiFeedback(showPower ? "Power simulation suspended." : "Power simulation active. Current draw: 245W. Voltage regulation stable.");
                  }}
                  className={cn(
                    "w-full py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-2",
                    showPower ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  )}
                >
                  <Battery className="w-3 h-3" />
                  Power Simulation
                </button>
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] text-nexus-text-dim uppercase">Clock Gating</span>
                    <div className="w-6 h-3 bg-nexus-accent/20 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-nexus-accent rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] text-nexus-text-dim uppercase">Branch Prediction</span>
                    <div className="w-6 h-3 bg-white/10 rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl border border-nexus-accent/20 bg-nexus-accent/10 backdrop-blur-md text-nexus-accent shadow-2xl flex items-center gap-3"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
