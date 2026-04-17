import { ThinkingLevel } from "@google/genai";

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessagePart {
  text?: string;
  thought?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface VisualConfig {
  particleColor: string;
  connectionColor: string;
  particleCount: number;
  emissionRate: number;
  glowIntensity: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | MessagePart[];
  timestamp: number;
  type?: 'text' | 'image' | 'video' | 'code' | 'thinking' | 'research';
  modelUsed?: string;
  attachments?: { mimeType: string; data: string }[];
  isError?: boolean;
  isStreaming?: boolean;
  groundingMetadata?: any;
  videoOperation?: any;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: number;
  createdAt: number;
}

export interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  thinkingLevel?: ThinkingLevel;
  responseMimeType?: 'text/plain' | 'application/json';
  seed?: number;
  useTpu?: boolean;
  useVertexAI?: boolean;
  useCuda?: boolean;
  useGnn?: boolean;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export enum NexusErrorType {
  API_KEY_INVALID = 'API_KEY_INVALID',
  PROMPT_UNSUPPORTED = 'PROMPT_UNSUPPORTED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SAFETY_VIOLATION = 'SAFETY_VIOLATION',
  UNKNOWN = 'UNKNOWN'
}

export interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  createdAt: number;
  isLocal: boolean;
}
