import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  Circle, 
  ListChecks,
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { NeuralTask } from '../types';
import { cn } from '../lib/utils';

interface SortableItemProps {
  task: NeuralTask;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

function SortableTaskItem({ task, onToggle, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group glass flex items-center gap-4 p-4 rounded-2xl border transition-all",
        task.completed ? "border-emerald-500/20 bg-emerald-500/5 opacity-60" : "border-white/5 bg-white/5 hover:border-nexus-accent/30",
        isDragging && "shadow-[0_0_20px_rgba(0,242,255,0.2)] border-nexus-accent/50 bg-nexus-accent/5"
      )}
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 text-nexus-text-dim"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button 
        onClick={() => onToggle(task.id, !task.completed)}
        className={cn(
          "transition-colors",
          task.completed ? "text-emerald-400" : "text-nexus-text-dim hover:text-white"
        )}
      >
        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>

      <span className={cn(
        "flex-1 text-sm transition-all",
        task.completed ? "text-nexus-text-dim line-through" : "text-white"
      )}>
        {task.text}
      </span>

      <button 
        onClick={() => onDelete(task.id)}
        className="p-2 rounded-lg text-nexus-text-dim hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function NeuralTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState<NeuralTask[]>([]);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NeuralTask[];
      setTasks(taskData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/tasks`);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !newTaskText.trim()) return;

    setIsAdding(true);
    const path = `users/${user.uid}/tasks`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        text: newTaskText.trim(),
        completed: false,
        order: tasks.length,
        createdAt: Date.now()
      });
      setNewTaskText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    if (!user) return;
    const path = `users/${user.uid}/tasks/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', id), { completed });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/tasks/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(item => item.id === active.id);
      const newIndex = tasks.findIndex(item => item.id === over.id);

      const newOrderedTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newOrderedTasks);

      if (!user) return;

      // Update Firebase with new orders
      const batch = writeBatch(db);
      newOrderedTasks.forEach((task, index) => {
        const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
        batch.update(taskRef, { order: index });
      });

      try {
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/tasks`);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Neural <span className="text-nexus-accent">Tasks</span>
            <div className="px-2 py-0.5 rounded-md bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] uppercase tracking-widest text-nexus-accent">
              Objectives & Sync
            </div>
          </h1>
          <p className="text-nexus-text-dim text-xs md:text-sm mt-1">Synchronize your objectives across the neural network</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Completed</span>
              <span className="text-lg font-bold text-emerald-400">{tasks.filter(t => t.completed).length}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Active</span>
              <span className="text-lg font-bold text-nexus-accent">{tasks.filter(t => !t.completed).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <form onSubmit={addTask} className="relative group">
          <input 
            type="text" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Initialize new objective..." 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-nexus-accent outline-none transition-all group-hover:border-white/20"
          />
          <button 
            type="submit"
            disabled={isAdding || !newTaskText.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-nexus-accent text-nexus-bg hover:opacity-90 disabled:opacity-50 transition-all neon-glow"
          >
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-white">Accessing Task Core...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-nexus-accent opacity-20" />
            </div>
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest">No objectives initialized</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {tasks.map((task) => (
                  <SortableTaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="mt-8 p-4 glass rounded-3xl border border-nexus-accent/20 bg-nexus-accent/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-nexus-accent" />
          <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-widest">Neural Sync Status</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-pulse" />
          <span className="text-[10px] font-bold text-nexus-accent uppercase tracking-widest leading-none mt-0.5">Real-time Core Linked</span>
        </div>
      </div>
    </div>
  );
}
