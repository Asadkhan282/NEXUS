import React from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Activity, Zap, Cpu, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'concept' | 'model' | 'capability';
  val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

export default function NeuralGraph() {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  const data = React.useMemo(() => {
    const nodes: Node[] = [
      { id: 'nexus', label: 'Nexus Core', type: 'model', val: 50 },
      { id: 'gemini', label: 'Gemini 3.1 Pro', type: 'model', val: 40 },
      { id: 'vision', label: 'Vision Gen', type: 'capability', val: 30 },
      { id: 'motion', label: 'Motion Gen', type: 'capability', val: 30 },
      { id: 'reasoning', label: 'Reasoning', type: 'concept', val: 25 },
      { id: 'code', label: 'Nexus Code', type: 'capability', val: 30 },
      { id: 'architect', label: 'Architect', type: 'capability', val: 25 },
      { id: 'canvas', label: 'Neural Canvas', type: 'capability', val: 25 },
      { id: 'tpuv5p', label: 'TPU v5p', type: 'concept', val: 20 },
      { id: 'cuda', label: 'CUDA', type: 'concept', val: 20 },
      { id: 'research', label: 'Grounding', type: 'capability', val: 25 },
    ];

    const links: Link[] = [
      { source: 'nexus', target: 'gemini' },
      { source: 'nexus', target: 'vision' },
      { source: 'nexus', target: 'motion' },
      { source: 'nexus', target: 'code' },
      { source: 'gemini', target: 'reasoning' },
      { source: 'gemini', target: 'research' },
      { source: 'nexus', target: 'tpuv5p' },
      { source: 'nexus', target: 'cuda' },
      { source: 'code', target: 'architect' },
      { source: 'vision', target: 'canvas' },
    ];

    return { nodes, links };
  }, []);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "rgba(0, 242, 255, 0.15)")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(data.links)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => d.val / 2)
      .attr("fill", d => d.type === 'model' ? '#00f2ff' : d.type === 'capability' ? '#bc13fe' : '#888888')
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("style", "filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.3))");

    node.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", d => d.val / 2 + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("style", "pointer-events: none; text-transform: uppercase; letter-spacing: 0.1em;");

    node.on("click", (event, d) => {
      setSelectedNode(d);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="h-full flex flex-col bg-[#020203] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">NEURAL MAP</h2>
          <p className="text-nexus-text-dim text-sm mt-1 uppercase tracking-widest font-mono">Real-time synaptic architecture visualization</p>
        </div>
        <div className="flex gap-4">
          <div className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-nexus-text-dim uppercase font-bold">Synapse Count</span>
              <span className="text-lg font-mono text-nexus-accent font-bold">14,204</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-nexus-text-dim uppercase font-bold">Active Nodes</span>
              <span className="text-lg font-mono text-nexus-purple font-bold">82</span>
            </div>
          </div>
        </div>
      </div>

      <svg ref={svgRef} className="flex-1 w-full relative z-0" />

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-0 top-0 bottom-0 w-80 glass border-l border-white/10 p-8 z-20 flex flex-col gap-6 shadow-2xl"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-nexus-accent/20 flex items-center justify-center neon-glow">
              <Cpu className="w-6 h-6 text-nexus-accent" />
            </div>
            <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/5 rounded-full">
              <Zap className="w-5 h-5 text-nexus-text-dim" />
            </button>
          </div>

          <div>
            <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">{selectedNode.type}</span>
            <h3 className="text-2xl font-bold text-white mt-1 uppercase tracking-tight">{selectedNode.label}</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-nexus-text-dim leading-relaxed">
                Core synaptic intensity for {selectedNode.label} is currently stabilized at {selectedNode.val}% through Nexus dynamic load balancing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 overflow-hidden relative">
                <span className="text-[8px] text-nexus-text-dim uppercase font-bold">Latency</span>
                <div className="text-sm font-mono text-white mt-1">12ms</div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-nexus-accent w-[80%]" />
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 overflow-hidden relative">
                <span className="text-[8px] text-nexus-text-dim uppercase font-bold">Uptime</span>
                <div className="text-sm font-mono text-white mt-1">99.9%</div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-nexus-purple w-[99%]" />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Configure Synapse
            </button>
          </div>
        </motion.div>
      )}

      <div className="absolute bottom-8 left-8 flex items-center gap-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-nexus-accent" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Model Nodes</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-nexus-purple" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Capabilities</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#888888]" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Concepts</span>
        </div>
      </div>
    </div>
  );
}
