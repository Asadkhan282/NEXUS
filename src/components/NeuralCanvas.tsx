import React from 'react';
import * as fabric from 'fabric';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Square, 
  Circle, 
  Type, 
  Pencil, 
  Eraser, 
  Trash2, 
  Download, 
  Zap,
  MousePointer2,
  Undo2,
  Layers,
  Sparkles,
  Loader2,
  X,
  Video,
  Clapperboard,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateImage, generateVideo, getVideoStatus, fetchVideoBlob, generateResponse } from '../services/gemini';
import { MODELS } from '../constants';

export default function NeuralCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = React.useState<'select' | 'pencil' | 'rect' | 'circle' | 'text'>('select');
  const [color, setColor] = React.useState('#00f2ff');
  const [zoom, setZoom] = React.useState(1);
  const [isPanning, setIsPanning] = React.useState(false);
  const [showAiPrompt, setShowAiPrompt] = React.useState(false);
  const [promptMode, setPromptMode] = React.useState<'object' | 'vision'>('object');
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoStatus, setVideoStatus] = React.useState<string>('');
  const [lastGeneratedUrl, setLastGeneratedUrl] = React.useState<string | null>(null);
  const [motionStyle, setMotionStyle] = React.useState<'cinematic' | 'cyberpunk' | 'cinematic-cyberpunk' | 'abstract' | 'blueprint' | 'surreal' | 'minimalist'>('cinematic');

  const MOTION_STYLES = [
    { id: 'cinematic', label: 'Cinematic', description: 'High-end film look with dramatic lighting, deep shadows, shallow depth of field, and smooth, sweeping camera pans. Focus on texture and atmosphere.' },
    { id: 'cyberpunk', label: 'Cyberpunk', description: 'Neon-drenched, high-tech noir aesthetic with rain-slicked surfaces, flickering holographic glitches, and high-contrast vibrant colors. Focus on urban grit and digital artifacts.' },
    { id: 'cinematic-cyberpunk', label: 'Cinematic Cyberpunk', description: 'A hybrid of cinematic scale and cyberpunk grit. Epic wide shots of neon megastructures with anamorphic lens flares and heavy atmospheric haze.' },
    { id: 'abstract', label: 'Abstract', description: 'Fluid, non-representational motion with shifting gradients, organic morphing shapes, and ethereal light trails. Focus on color harmony, rhythmic flow, and emotional resonance through movement.' },
    { id: 'blueprint', label: 'Blueprint', description: 'Technical, schematic animation style with glowing white lines on a deep blueprint blue background. Features grid overlays, rotating wireframes, and scrolling data readouts. Focus on precision and structural evolution.' },
    { id: 'surreal', label: 'Surreal', description: 'Dream-like, physics-defying visual sequences with melting objects, floating islands, and impossible geometry. Focus on wonder, the subversion of reality, and unexpected transformations.' },
    { id: 'minimalist', label: 'Minimalist', description: 'Clean, simple, and purposeful movement with a focus on negative space, subtle transitions, and a limited color palette. Focus on elegance, clarity, and the beauty of essential forms.' },
  ];

  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#0a0a0a',
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Zoom and Pan Handlers
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoomLevel = canvas.getZoom();
      zoomLevel *= 0.999 ** delta;
      if (zoomLevel > 20) zoomLevel = 20;
      if (zoomLevel < 0.01) zoomLevel = 0.01;
      canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoomLevel);
      setZoom(zoomLevel);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      if (evt.altKey === true || activeTool === 'select') {
        setIsPanning(true);
        canvas.selection = false;
        // @ts-ignore
        canvas.lastPosX = evt.clientX;
        // @ts-ignore
        canvas.lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isPanning) {
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        if (!vpt) return;
        // @ts-ignore
        vpt[4] += e.clientX - canvas.lastPosX;
        // @ts-ignore
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        // @ts-ignore
        canvas.lastPosX = e.clientX;
        // @ts-ignore
        canvas.lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', () => {
      setIsPanning(false);
      canvas.selection = true;
      canvas.requestRenderAll();
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      canvas.setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Sync isPanning with selection
  React.useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.selection = !isPanning && activeTool === 'select';
  }, [isPanning, activeTool, fabricCanvas]);

  React.useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pencil';
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = 3;
    }
  }, [activeTool, color, fabricCanvas]);

  const resetZoom = () => {
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(1);
    fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    fabricCanvas.requestRenderAll();
    setZoom(1);
  };

  const addRect = () => {
    if (!fabricCanvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      width: 100,
      height: 100,
      rx: 8,
      ry: 8
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    setActiveTool('select');
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      radius: 50,
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    setActiveTool('select');
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.IText('Neural Node', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fontSize: 20,
      fill: color,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    setActiveTool('select');
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#0a0a0a';
    fabricCanvas.renderAll();
  };

  const generateAiObject = async () => {
    if (!aiPrompt.trim() || !fabricCanvas) return;
    
    setIsGenerating(true);
    setVideoStatus(promptMode === 'object' ? 'Synthesizing Neural Object...' : 'Synthesizing Neural Vision...');
    try {
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      
      let finalPrompt = aiPrompt;

      if (promptMode === 'object') {
        // 1. Use Gemini to refine the prompt for a high-quality isolated object
        const refinedPromptResponse = await generateResponse(
          `Refine this object description for a high-quality 3D asset generation: "${aiPrompt}". 
          The asset should be isolated on a solid, pure white background, centered, with professional studio lighting and high-resolution textures. 
          Return ONLY the refined prompt.`,
          [],
          MODELS.GENERAL,
          { temperature: 0.7 },
          userKey
        );
        finalPrompt = refinedPromptResponse.candidates?.[0]?.content?.parts?.[0]?.text || aiPrompt;
      } else {
        // Full Vision Refinement
        const refinedPromptResponse = await generateResponse(
          `Refine this image description for a high-quality cinematic visual: "${aiPrompt}". 
          The description should be evocative, detailed, and specify lighting, composition, and mood. 
          Return ONLY the refined prompt.`,
          [],
          MODELS.GENERAL,
          { temperature: 0.8 },
          userKey
        );
        finalPrompt = refinedPromptResponse.candidates?.[0]?.content?.parts?.[0]?.text || aiPrompt;
      }
      
      // 2. Generate the image
      const imageUrl = await generateImage(finalPrompt, "1:1", userKey);
      setLastGeneratedUrl(imageUrl);
      
      // 3. Load into Fabric
      // @ts-ignore - Fabric 6/7 usage
      const img = await fabric.FabricImage.fromURL(imageUrl, {
        crossOrigin: 'anonymous'
      });
      
      // Scale down if too large
      const maxSize = 400;
      if (img.width > maxSize || img.height > maxSize) {
        const scale = maxSize / Math.max(img.width, img.height);
        img.scale(scale);
      }

      // Center on canvas
      const vpt = fabricCanvas.viewportTransform;
      if (vpt) {
        const center = fabricCanvas.getCenterPoint();
        img.set({
          left: center.x - (img.width! * img.scaleX!) / 2,
          top: center.y - (img.height! * img.scaleY!) / 2,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 30,
            offsetX: 15,
            offsetY: 15
          })
        });
      }

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      
      setShowAiPrompt(false);
      setAiPrompt('');
      setVideoStatus('');
    } catch (error) {
      console.error("AI Object generation failed:", error);
      setVideoStatus('Neural Desync: Synthesis Failed');
      setTimeout(() => setVideoStatus(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCanvas = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    } as any);
    const link = document.createElement('a');
    link.download = 'nexus-architecture.png';
    link.href = dataUrl;
    link.click();
  };

  const exportSvg = () => {
    if (!fabricCanvas) return;
    const svgData = fabricCanvas.toSVG();
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'nexus-architecture.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportMotion = async () => {
    if (!fabricCanvas) return;
    
    setIsGeneratingVideo(true);
    setVideoStatus('Analyzing Neural Architecture...');
    
    try {
      const userKey = localStorage.getItem('nexus_user_key') || undefined;
      
      // 1. Capture canvas as image
      const dataUrl = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1
      } as any);
      
      const base64Data = dataUrl.split(',')[1];
      
      // 2. Use Gemini to describe the scene and generate a motion prompt
      setVideoStatus('Synthesizing Motion Prompt...');
      const styleContext = MOTION_STYLES.find(s => s.id === motionStyle)?.description || '';
      const response = await generateResponse(
        `Analyze the visual elements, composition, and mood of this image. 
        Create a highly detailed and evocative motion prompt for a 5-second video.
        
        Style Target: ${motionStyle.toUpperCase()}
        Style Context: ${styleContext}
        
        Requirements:
        - Describe specific camera movements (e.g., slow dolly in, tracking shot, low-angle tilt).
        - Detail the lighting behavior (e.g., volumetric rays, pulsing neon, shifting shadows).
        - Specify how the elements on the canvas should move or evolve (e.g., rotating slowly, glowing with energy, disintegrating into particles).
        - Use cinematic and technical terminology.
        
        Return ONLY the motion prompt text. Do not include any preamble or explanation.`,
        [],
        MODELS.GENERAL,
        { temperature: 0.8 },
        userKey,
        [{ mimeType: 'image/png', data: base64Data }]
      );
      
      const motionPrompt = response.candidates?.[0]?.content?.parts?.[0]?.text || "Cinematic futuristic motion sequence based on neural architecture";
      
      // 3. Generate Video
      setVideoStatus('Initiating Motion Synthesis...');
      const operation = await generateVideo(motionPrompt, userKey);
      
      // 4. Poll for status
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max
      
      while (!isDone && attempts < maxAttempts) {
        attempts++;
        const status = await getVideoStatus(operation, userKey);
        
        if (status.done) {
          isDone = true;
          setVideoStatus('Fetching Neural Sequence...');
          const videoUri = status.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
            const url = await fetchVideoBlob(videoUri, userKey);
            setVideoUrl(url);
          }
        } else {
          setVideoStatus(`Synthesizing... ${Math.round((attempts / maxAttempts) * 100)}%`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      if (!isDone) throw new Error("Motion synthesis timed out");
      
    } catch (error) {
      console.error("Motion Export failed:", error);
      setVideoStatus('Neural Desync: Motion Export Failed');
      setTimeout(() => setVideoStatus(''), 3000);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10 glass">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
            {[
              { id: 'select', icon: MousePointer2, label: 'Select' },
              { id: 'pencil', icon: Pencil, label: 'Draw' },
              { id: 'rect', icon: Square, label: 'Rect', action: addRect },
              { id: 'circle', icon: Circle, label: 'Circle', action: addCircle },
              { id: 'text', icon: Type, label: 'Text', action: addText },
              { 
                id: 'vision', 
                icon: ImageIcon, 
                label: 'Vision Gen', 
                action: () => {
                  setPromptMode('vision');
                  setShowAiPrompt(true);
                } 
              },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.action) tool.action();
                  else setActiveTool(tool.id as any);
                }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2",
                  activeTool === tool.id 
                    ? "bg-nexus-accent text-nexus-bg" 
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                )}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </button>
            ))}
            <button
              onClick={() => setShowAiPrompt(true)}
              className="p-2 rounded-lg text-nexus-accent hover:bg-nexus-accent/10 transition-all"
              title="AI Object"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 border-l border-white/10">
            {['#00f2ff', '#bf00ff', '#ff0055', '#00ff88', '#ffffff'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  color === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-nexus-text-dim">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <button onClick={resetZoom} className="hover:text-white transition-colors">Reset</button>
          </div>
          <button 
            onClick={clearCanvas}
            className="p-2 rounded-lg text-nexus-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={downloadCanvas}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
            title="Export as PNG"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button 
            onClick={exportSvg}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
            title="Export as SVG"
          >
            <FileCode className="w-4 h-4" />
            SVG
          </button>
          <div className="flex items-center gap-2 px-3 border-l border-white/10">
            <select 
              value={motionStyle}
              onChange={(e) => setMotionStyle(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-nexus-accent uppercase tracking-wider outline-none focus:border-nexus-accent/50 transition-all cursor-pointer"
            >
              {MOTION_STYLES.map(style => (
                <option key={style.id} value={style.id} className="bg-nexus-bg text-white">
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportMotion}
            disabled={isGeneratingVideo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clapperboard className="w-4 h-4" />}
            Motion
          </button>
          <button 
            onClick={() => {
              setPromptMode('object');
              setShowAiPrompt(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nexus-accent text-nexus-bg font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Sparkles className="w-4 h-4" />
            Synthesize
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all">
            <Zap className="w-4 h-4" />
            AI Architect
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 bg-[#050505] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
               backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, 
               backgroundSize: `${20 * zoom}px ${20 * zoom}px` 
             }} 
        />
        <canvas ref={canvasRef} />

        {/* Video Preview Overlay */}
        <AnimatePresence>
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-8"
            >
              <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-nexus-accent/30 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                  <div className="px-3 py-1 rounded-lg bg-nexus-accent/20 border border-nexus-accent/30 backdrop-blur-md">
                    <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Motion Sequence Synthesized</span>
                  </div>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = videoUrl;
                      link.download = `nexus-motion-${Date.now()}.mp4`;
                      link.click();
                    }}
                    className="pointer-events-auto p-3 rounded-xl bg-nexus-accent text-nexus-bg hover:scale-105 transition-all shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlay */}
        <AnimatePresence>
          {videoStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl glass border border-nexus-accent/30 flex items-center gap-3 z-50"
            >
              <div className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse" />
              <span className="text-xs font-mono text-nexus-accent uppercase tracking-widest">{videoStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Prompt Overlay */}
        <AnimatePresence>
          {showAiPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md glass p-6 rounded-2xl border border-nexus-accent/30 shadow-[0_0_50px_rgba(0,242,255,0.1)] z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {promptMode === 'object' ? <Sparkles className="w-4 h-4 text-nexus-accent" /> : <ImageIcon className="w-4 h-4 text-nexus-accent" />}
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {promptMode === 'object' ? 'Synthesize Neural Object' : 'Generate Neural Vision'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 mr-2">
                    <button 
                      onClick={() => setPromptMode('object')}
                      className={cn(
                        "px-2 py-1 rounded-md text-[8px] font-bold uppercase transition-all",
                        promptMode === 'object' ? "bg-nexus-accent text-nexus-bg" : "text-nexus-text-dim hover:text-white"
                      )}
                    >
                      Object
                    </button>
                    <button 
                      onClick={() => setPromptMode('vision')}
                      className={cn(
                        "px-2 py-1 rounded-md text-[8px] font-bold uppercase transition-all",
                        promptMode === 'vision' ? "bg-nexus-accent text-nexus-bg" : "text-nexus-text-dim hover:text-white"
                      )}
                    >
                      Vision
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowAiPrompt(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-nexus-text-dim" />
                  </button>
                </div>
              </div>

              {lastGeneratedUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 aspect-square group relative">
                  <img src={lastGeneratedUrl} alt="Synthesized Object" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setLastGeneratedUrl(null)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateAiObject()}
                  placeholder={promptMode === 'object' ? "Describe an object (e.g., 'A futuristic drone')..." : "Enter vision prompt (e.g., 'Cyberpunk city at night')..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-nexus-accent outline-none transition-all pr-12"
                  autoFocus
                />
                <button
                  onClick={generateAiObject}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-nexus-accent text-nexus-bg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-nexus-text-dim mt-3 uppercase tracking-widest text-center">
                Neural rendering will place the object in the center
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
