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
  Zap,
  Calendar,
  AlertTriangle,
  Clock,
  Edit2,
  Save,
  X
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
  onUpdate: (id: string, updates: Partial<NeuralTask>) => void;
}

function SortableTaskItem({ task, onToggle, onDelete, onUpdate }: SortableItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);
  const [editDate, setEditDate] = React.useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handleSave = () => {
    onUpdate(task.id, {
      text: editText,
      dueDate: editDate ? new Date(editDate).getTime() : null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const now = Date.now();
  const isOverdue = task.dueDate && !task.completed && task.dueDate < now;
  const isUpcoming = task.dueDate && !task.completed && task.dueDate >= now && task.dueDate - now < 24 * 60 * 60 * 1000;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group glass flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border transition-all",
        task.completed ? "border-emerald-500/20 bg-emerald-500/5 opacity-60" : "border-white/5 bg-white/5 hover:border-nexus-accent/30",
        isOverdue && "border-red-500/30 bg-red-500/5 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]",
        isUpcoming && "border-amber-500/30 bg-amber-500/5 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]",
        isDragging && "shadow-[0_0_20px_rgba(0,242,255,0.2)] border-nexus-accent/50 bg-nexus-accent/5",
        isEditing && "border-nexus-accent ring-1 ring-nexus-accent/20"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {!isEditing && (
          <button 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 text-nexus-text-dim"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

        <button 
          onClick={() => onToggle(task.id, !task.completed)}
          disabled={isEditing}
          className={cn(
            "transition-colors",
            task.completed ? "text-emerald-400" : "text-nexus-text-dim hover:text-white"
          )}
        >
          {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>

        <div className="flex flex-col gap-0.5 flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input 
                autoFocus
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-nexus-accent outline-none"
              />
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-nexus-accent" />
                <input 
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-[10px] text-white focus:border-nexus-accent outline-none uppercase font-bold tracking-widest"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          ) : (
            <>
              <span 
                onClick={() => !task.completed && setIsEditing(true)}
                className={cn(
                  "text-sm transition-all font-medium cursor-pointer hover:text-nexus-accent",
                  task.completed ? "text-nexus-text-dim line-through" : "text-white"
                )}
              >
                {task.text}
              </span>
              
              {task.dueDate && (
                <div 
                  onClick={() => !task.completed && setIsEditing(true)}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:opacity-80 transition-opacity",
                    task.completed ? "text-nexus-text-dim" : 
                    isOverdue ? "text-red-400 animate-pulse" : 
                    isUpcoming ? "text-amber-400" : "text-nexus-accent/60"
                  )}
                >
                  {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>Deadline: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {isOverdue && <span className="ml-1 opacity-70">[Expired]</span>}
                  {isUpcoming && <span className="ml-1 opacity-70 text-[8px]">[T-Minus 24h]</span>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pl-12 md:pl-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button 
              onClick={handleSave}
              className="p-2 rounded-lg bg-nexus-accent/20 text-nexus-accent hover:bg-nexus-accent/30 transition-all"
              title="Save Changes"
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCancel}
              className="p-2 rounded-lg bg-white/5 text-nexus-text-dim hover:text-white transition-all"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg text-nexus-text-dim hover:text-nexus-accent hover:bg-nexus-accent/10 opacity-0 md:opacity-0 group-hover:opacity-100 transition-all"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg text-nexus-text-dim hover:text-red-400 hover:bg-red-400/10 opacity-0 md:opacity-0 group-hover:opacity-100 transition-all"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function NeuralTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState<NeuralTask[]>([]);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [newTaskDueDate, setNewTaskDueDate] = React.useState('');
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
        createdAt: Date.now(),
        dueDate: newTaskDueDate ? new Date(newTaskDueDate).getTime() : null
      });
      setNewTaskText('');
      setNewTaskDueDate('');
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

  const updateTask = async (id: string, updates: Partial<NeuralTask>) => {
    if (!user) return;
    const path = `users/${user.uid}/tasks/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
        <form onSubmit={addTask} className="flex flex-col gap-3 group">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Initialize new objective..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-nexus-accent outline-none transition-all group-hover:border-white/20"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-accent pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <input 
                type="date" 
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white focus:border-nexus-accent outline-none transition-all appearance-none uppercase tracking-widest font-bold"
                style={{ colorScheme: 'dark' }}
              />
              {!newTaskDueDate && (
                <span className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] text-nexus-text-dim pointer-events-none font-bold uppercase tracking-widest">
                  Set Deadline (Optional)
                </span>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isAdding || !newTaskText.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-nexus-accent text-nexus-bg font-bold uppercase tracking-widest text-xs hover:opacity-90 disabled:opacity-50 transition-all neon-glow flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isAdding ? 'Core Syncing...' : 'Initialize'}
            </button>
          </div>
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
                    onUpdate={updateTask}
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
