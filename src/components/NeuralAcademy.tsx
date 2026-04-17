import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Brain, 
  Zap, 
  Cpu, 
  Shield, 
  Sparkles, 
  Code2, 
  ChevronRight,
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  BarChart3,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  locked?: boolean;
  content: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  lessons: Lesson[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const modules: Module[] = [
  {
    id: 'intro',
    title: 'Neural Foundations',
    description: 'Understand the core architecture of Large Language Models and how NEXUS processes information.',
    icon: Brain,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    duration: '15 min',
    difficulty: 'Beginner',
    lessons: [
      { id: 'l1', title: 'What is a Neural Link?', duration: '3 min', content: 'A Neural Link is the primary interface between human intent and machine intelligence. In this lesson, we explore how NEXUS interprets natural language as high-dimensional vectors.', completed: true },
      { id: 'l2', title: 'The Transformer Architecture', duration: '5 min', content: 'Deep dive into the attention mechanism. Learn how NEXUS "focuses" on specific parts of your prompt to generate contextually relevant responses.' },
      { id: 'l3', title: 'Tokenization & Latent Space', duration: '4 min', content: 'Understanding how words become numbers and how those numbers inhabit a mathematical space where meaning is distance.' },
      { id: 'l4', title: 'Inference vs. Training', duration: '3 min', content: 'Distinguishing between the learning phase and the execution phase of the model.' }
    ]
  },
  {
    id: 'prompting',
    title: 'Neural Architecture',
    description: 'Master the art of prompt engineering to architect precise and creative AI responses.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    duration: '25 min',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p1', title: 'System Instructions', duration: '5 min', content: 'How to set the "personality" and "rules" for NEXUS using system-level directives.' },
      { id: 'p2', title: 'Few-Shot Prompting', duration: '7 min', content: 'Providing examples to guide the model towards specific output formats and styles.' },
      { id: 'p3', title: 'Chain of Thought', duration: '8 min', content: 'Encouraging the model to "think step-by-step" to solve complex logical problems.' },
      { id: 'p4', title: 'Parameter Tuning', duration: '5 min', content: 'Adjusting temperature, topP, and topK for the perfect balance of creativity and precision.' }
    ]
  },
  {
    id: 'multimodal',
    title: 'Multimodal Synthesis',
    description: 'Learn how to bridge text, vision, and motion to create complex AI-driven experiences.',
    icon: Sparkles,
    color: 'text-nexus-accent',
    bg: 'bg-nexus-accent/10',
    duration: '20 min',
    difficulty: 'Advanced',
    lessons: [
      { id: 'm1', title: 'Vision Gen Fundamentals', duration: '5 min', content: 'Translating descriptive text into vibrant visual imagery using Gemini 2.5 Flash Image.' },
      { id: 'm2', title: 'Motion Gen & Veo', duration: '7 min', content: 'Understanding temporal consistency in video generation with the Veo 3.1 engine.' },
      { id: 'm3', title: 'Cross-Modal Context', duration: '8 min', content: 'How to use an image as a reference for text generation or video synthesis.' }
    ]
  },
  {
    id: 'ethics',
    title: 'Neural Ethics',
    description: 'Explore the safety protocols and ethical considerations in advanced AI development.',
    icon: Shield,
    color: 'text-nexus-purple',
    bg: 'bg-nexus-purple/10',
    duration: '10 min',
    difficulty: 'Beginner',
    lessons: [
      { id: 'e1', title: 'Safety Filters', duration: '3 min', content: 'How NEXUS prevents the generation of harmful or biased content.' },
      { id: 'e2', title: 'Data Privacy', duration: '4 min', content: 'Understanding how your data is handled and protected within the neural link.' },
      { id: 'e3', title: 'The Future of Alignment', duration: '3 min', content: 'Ensuring AI goals remain aligned with human values as intelligence scales.' }
    ]
  },
  {
    id: 'training_mastery',
    title: 'Neural Mastery: Training',
    description: 'Master the process of Knowledge Ingestion and Synthetic Fine-tuning to create custom intelligence profiles.',
    icon: Brain,
    color: 'text-nexus-accent',
    bg: 'bg-nexus-accent/10',
    duration: '30 min',
    difficulty: 'Advanced',
    lessons: [
      { id: 't1', title: 'Knowledge Core Ingestion', duration: '10 min', content: 'Learn how to upload and index custom datasets to expand the model\'s retrieval context. This allows NEXUS to answer questions about your specific projects or data.' },
      { id: 't2', title: 'Synthetic Dataset Synthesis', duration: '10 min', content: 'Creating Ground Truth examples. By providing pairs of high-quality prompts and completions, you can steer the model\'s tone and technical precision.' },
      { id: 't3', title: 'Weight Optimization Cycle', duration: '10 min', content: 'Executing training runs. Understand how the model recalculates its local weights to align with your newly ingested data.' }
    ]
  }
];

export default function NeuralAcademy() {
  const [selectedModule, setSelectedModule] = React.useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [showRegForm, setShowRegForm] = React.useState(false);
  const [regData, setRegData] = React.useState({ name: '', role: '', education: '' });
  const [completedLessons, setCompletedLessons] = React.useState<Set<string>>(new Set(['l1']));

  const quizQuestions = [
    {
      question: "How does NEXUS interpret natural language?",
      options: [
        "As a sequence of static strings",
        "As high-dimensional vectors in latent space",
        "As simple binary instructions",
        "As pre-defined templates"
      ],
      correct: 1
    },
    {
      question: "What is the primary role of the Attention Mechanism?",
      options: [
        "To speed up text rendering",
        "To focus on specific parts of input data",
        "To compress the model size",
        "To manage user authentication"
      ],
      correct: 1
    },
    {
      question: "Which engine powers NEXUS Motion Generation?",
      options: [
        "Gemini 1.5 Pro",
        "Stable Diffusion",
        "Veo 3.1",
        "DALL-E 3"
      ],
      correct: 2
    }
  ];

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    const firstIncomplete = module.lessons.find(l => !completedLessons.has(l.id)) || module.lessons[0];
    setSelectedLesson(firstIncomplete);
    setShowQuiz(false);
    setQuizScore(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
  };

  const handleBack = () => {
    if (selectedModule) {
      setSelectedModule(null);
      setSelectedLesson(null);
      setShowQuiz(false);
      setQuizScore(null);
      setCurrentQuestion(0);
      setSelectedAnswers({});
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quizQuestions.length) * 10);
    setQuizScore(finalScore);
  };

  const handleRegisterClick = () => {
    if (!isRegistered) {
      setShowRegForm(true);
    }
  };

  const confirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setShowRegForm(false);
    
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
    }, 2000);
  };

  const handleCompleteLesson = () => {
    if (selectedLesson && selectedModule) {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(selectedLesson.id);
      setCompletedLessons(newCompleted);

      // Find next lesson
      const currentIndex = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
      if (currentIndex < selectedModule.lessons.length - 1) {
        setSelectedLesson(selectedModule.lessons[currentIndex + 1]);
        setShowQuiz(false);
        setQuizScore(null);
      } else {
        // Module complete
        handleBack();
      }
    }
  };

  const calculateProgress = (module: Module) => {
    const completed = module.lessons.filter(l => completedLessons.has(l.id)).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedModule ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter flex items-center gap-3">
                  Neural <span className="text-nexus-accent">Academy</span>
                  <div className="px-2 py-0.5 rounded-md bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] uppercase tracking-widest text-nexus-accent">
                    Learning Active
                  </div>
                </h1>
                <p className="text-nexus-text-dim mt-2">Master the evolution of multimodal intelligence through structured neural pathways.</p>
              </div>
              <div className="flex items-center gap-4 glass px-6 py-3 rounded-2xl border border-white/5">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Global Rank</div>
                  <div className="text-sm font-bold text-white">Top 2%</div>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="text-right">
                  <div className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Neural XP</div>
                  <div className="text-sm font-bold text-nexus-accent">12,450</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {modules.map((module, i) => {
                  const progress = calculateProgress(module);
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleModuleSelect(module)}
                      className="glass p-6 rounded-3xl border border-white/10 hover:border-nexus-accent/30 transition-all group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <module.icon className="w-24 h-24" />
                      </div>

                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className={cn("p-4 rounded-2xl", module.bg)}>
                          <module.icon className={cn("w-6 h-6", module.color)} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">
                            <span>{module.lessons.length} Lessons</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{module.duration}</span>
                          </div>
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                            module.difficulty === 'Beginner' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                            module.difficulty === 'Intermediate' ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" :
                            "text-red-400 border-red-400/20 bg-red-400/5"
                          )}>
                            {module.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nexus-accent transition-colors relative z-10">{module.title}</h3>
                      <p className="text-sm text-nexus-text-dim leading-relaxed mb-6 relative z-10">
                        {module.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-nexus-bg bg-white/10" />
                              ))}
                            </div>
                            <span className="text-[10px] text-nexus-text-dim font-medium">1.2k Students</span>
                          </div>
                          {progress > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-nexus-accent" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-nexus-accent">{progress}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-nexus-accent group-hover:translate-x-1 transition-transform">
                          {progress === 100 ? 'Review Module' : progress > 0 ? 'Continue' : 'Begin Module'}
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-accent/10 blur-[100px] -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 rounded-2xl bg-nexus-accent flex items-center justify-center neon-glow flex-shrink-0">
                    <PlayCircle className="w-10 h-10 text-nexus-bg" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">Neural Workshop: Live Synthesis</h3>
                    <p className="text-nexus-text-dim text-sm max-w-xl">
                      Join our upcoming live session on architecting complex multimodal workflows using the new Gemini 2.0 Pro engine.
                    </p>
                  </div>
                  <button 
                    onClick={handleRegisterClick}
                    disabled={isRegistering || isRegistered}
                    className={cn(
                      "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 min-w-[160px] justify-center",
                      isRegistered 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                        : "bg-white text-nexus-bg hover:bg-nexus-accent"
                    )}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registered</span>
                      </>
                    ) : (
                      "Register Now"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
              {showRegForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRegForm(false)}
                    className="absolute inset-0 bg-nexus-bg/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md glass p-8 rounded-3xl border border-white/10 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-nexus-accent/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-nexus-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Workshop Registration</h3>
                    </div>

                    <form onSubmit={confirmRegistration} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest px-1">Who are you?</label>
                        <input 
                          required
                          type="text"
                          placeholder="Your Name"
                          value={regData.name}
                          onChange={(e) => setRegData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-nexus-accent/50 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest px-1">What is your role?</label>
                        <select 
                          required
                          value={regData.role}
                          onChange={(e) => setRegData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-nexus-bg border border-white/10 text-white focus:border-nexus-accent/50 focus:outline-none transition-all appearance-none"
                        >
                          <option value="" disabled>Select your role</option>
                          <option value="Student">Student</option>
                          <option value="Developer">Developer</option>
                          <option value="Researcher">Researcher</option>
                          <option value="Designer">Designer</option>
                          <option value="Architect">Architect</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest px-1">Education Level</label>
                        <input 
                          required
                          type="text"
                          placeholder="e.g. Computer Science Degree, Self-taught"
                          value={regData.education}
                          onChange={(e) => setRegData(prev => ({ ...prev, education: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-nexus-accent/50 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setShowRegForm(false)}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold neon-glow"
                        >
                          Confirm Sync
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="module"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Module Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-nexus-text-dim hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Back to Academy</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Your Progress</span>
                  <span className="text-sm font-bold text-white">{calculateProgress(selectedModule)}% Complete</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                    <circle 
                      cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="2" 
                      strokeDasharray="125.6" 
                      strokeDashoffset={125.6 - (125.6 * calculateProgress(selectedModule)) / 100} 
                      className="text-nexus-accent transition-all duration-500" 
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">
                    {selectedModule.lessons.filter(l => completedLessons.has(l.id)).length}/{selectedModule.lessons.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
              {/* Lesson Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-4">
                <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <selectedModule.icon className="w-32 h-32" />
                  </div>
                  
                  <div className="relative z-10">
                    {!showQuiz ? (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn("p-3 rounded-xl", selectedModule.bg)}>
                            <selectedModule.icon className={cn("w-5 h-5", selectedModule.color)} />
                          </div>
                          <span className="text-xs font-bold text-nexus-accent uppercase tracking-widest">{selectedModule.title}</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">{selectedLesson?.title}</h2>
                        <div className="flex items-center gap-6 mb-8 text-nexus-text-dim">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">{selectedLesson?.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-xs font-medium">{selectedModule.difficulty}</span>
                          </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                          <p className="text-nexus-text-dim leading-relaxed text-lg">
                            {selectedLesson?.content}
                          </p>
                          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                              <Code2 className="w-4 h-4 text-nexus-accent" />
                              Neural Insight
                            </h4>
                            <p className="text-sm text-nexus-text-dim italic">
                              "The architecture of intelligence is not just in the parameters, but in the structural alignment of intent and output."
                            </p>
                          </div>
                        </div>

                        <div className="mt-12 flex items-center justify-between">
                          <button 
                            disabled={selectedModule.lessons.findIndex(l => l.id === selectedLesson?.id) === 0}
                            onClick={() => {
                              const idx = selectedModule.lessons.findIndex(l => l.id === selectedLesson?.id);
                              setSelectedLesson(selectedModule.lessons[idx - 1]);
                            }}
                            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Previous Lesson
                          </button>
                          <div className="flex gap-4">
                            <button 
                              onClick={startQuiz}
                              className="px-8 py-3 rounded-xl border border-nexus-accent/30 text-nexus-accent font-bold hover:bg-nexus-accent/5 transition-all"
                            >
                              Take Quiz
                            </button>
                            <button 
                              onClick={handleCompleteLesson}
                              className="px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold neon-glow hover:scale-105 transition-all"
                            >
                              Complete & Continue
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-nexus-accent" />
                            <h2 className="text-2xl font-bold text-white">Neural Assessment</h2>
                          </div>
                          {quizScore === null && (
                            <div className="text-xs font-mono text-nexus-accent">
                              Question {currentQuestion + 1} of {quizQuestions.length}
                            </div>
                          )}
                        </div>

                        {quizScore === null ? (
                          <div className="space-y-8">
                            <motion.div 
                              key={currentQuestion}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                              <h3 className="text-lg font-bold text-white mb-6">
                                {quizQuestions[currentQuestion].question}
                              </h3>
                              <div className="space-y-3">
                                {quizQuestions[currentQuestion].options.map((option, i) => {
                                  const isSelected = selectedAnswers[currentQuestion] === i;
                                  return (
                                    <button 
                                      key={i} 
                                      onClick={() => handleAnswerSelect(i)}
                                      className={cn(
                                        "w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between group",
                                        isSelected 
                                          ? "bg-nexus-accent/10 border-nexus-accent text-white" 
                                          : "bg-white/5 border-white/5 text-nexus-text-dim hover:border-white/20 hover:text-white"
                                      )}
                                    >
                                      <span>{option}</span>
                                      {isSelected && <div className="w-2 h-2 rounded-full bg-nexus-accent shadow-[0_0_8px_rgba(0,242,255,0.8)]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>

                            <div className="flex items-center gap-4">
                              <button 
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              {currentQuestion < quizQuestions.length - 1 ? (
                                <button 
                                  disabled={selectedAnswers[currentQuestion] === undefined}
                                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                                  className="flex-1 py-4 rounded-2xl bg-nexus-accent text-nexus-bg font-bold neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Next Question
                                </button>
                              ) : (
                                <button 
                                  disabled={selectedAnswers[currentQuestion] === undefined}
                                  onClick={submitQuiz}
                                  className="flex-1 py-4 rounded-2xl bg-nexus-accent text-nexus-bg font-bold neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Submit Assessment
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-12"
                          >
                            <div className="w-32 h-32 rounded-full bg-nexus-accent/10 border-2 border-nexus-accent/30 flex items-center justify-center mx-auto mb-8 relative">
                              <div className="absolute inset-0 rounded-full border-2 border-nexus-accent animate-ping opacity-20" />
                              <span className="text-4xl font-bold text-nexus-accent">{quizScore}/10</span>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-4">
                              {quizScore >= 8 ? 'Neural Link Synchronized!' : 'Sync Incomplete'}
                            </h3>
                            <p className="text-nexus-text-dim mb-12 max-w-md mx-auto">
                              {quizScore >= 8 
                                ? 'Your cognitive alignment with the neural foundations is exceptional. You are ready for advanced synthesis.'
                                : 'The neural link requires further calibration. Review the lesson content and re-attempt the assessment.'}
                            </p>

                            <div className="flex items-center justify-center gap-4">
                              {quizScore < 8 && (
                                <button 
                                  onClick={startQuiz}
                                  className="px-8 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                                >
                                  Re-attempt
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setShowQuiz(false);
                                  if (quizScore >= 8) handleCompleteLesson();
                                }}
                                className="px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold neon-glow"
                              >
                                {quizScore >= 8 ? 'Continue Learning' : 'Back to Lesson'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lesson List Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Module Curriculum</h3>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                  {selectedModule.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setShowQuiz(false);
                        }}
                        className={cn(
                          "w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group",
                          selectedLesson?.id === lesson.id
                            ? "bg-nexus-accent/10 border-nexus-accent/30"
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs",
                          selectedLesson?.id === lesson.id
                            ? "bg-nexus-accent text-nexus-bg"
                            : isCompleted 
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/10 text-nexus-text-dim"
                        )}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-sm font-bold truncate",
                            selectedLesson?.id === lesson.id ? "text-white" : "text-nexus-text-dim group-hover:text-white"
                          )}>
                            {lesson.title}
                          </h4>
                          <span className="text-[10px] text-nexus-text-dim font-mono">{lesson.duration}</span>
                        </div>
                        {lesson.locked && <Lock className="w-3 h-3 text-white/20" />}
                      </button>
                    );
                  })}
                </div>

                <div className="glass p-6 rounded-3xl border border-white/10 mt-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Neural Mentor</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-nexus-accent flex items-center justify-center neon-glow">
                      <Cpu className="w-6 h-6 text-nexus-bg" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">NEXUS Core</div>
                      <div className="text-[10px] text-nexus-accent font-mono">AI Instructor</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-nexus-text-dim leading-relaxed">
                    "You are currently analyzing the foundational layers of neural links. Focus on the relationship between tokens and latent space."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
