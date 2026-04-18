import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MessageRole, MessagePart, ChatMessage, GenerationConfig, NexusErrorType } from '../types';
import { MODELS, MODEL_LABELS } from '../constants';

const SYSTEM_API_KEY = process.env.GEMINI_API_KEY;

export function getGeminiClient(userApiKey?: string) {
  // Prioritize: 1. Explicitly passed key, 2. Platform selected key, 3. System environment key
  const key = userApiKey || process.env.API_KEY || SYSTEM_API_KEY;
  
  if (!key || key === 'undefined') {
    const isVercel = window.location.hostname.includes('vercel.app');
    const message = isVercel 
      ? "Neural Link Offline: No API key detected. Please add GEMINI_API_KEY to your Vercel Environment Variables."
      : "Neural Link Offline: No API key detected. Please select a personal key using the 'Auth' button or check your environment configuration.";
    
    throw new NexusError(NexusErrorType.API_KEY_INVALID, message);
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function validateApiKey(key: string) {
  try {
    const client = new GoogleGenAI({ apiKey: key });
    await client.models.generateContent({ 
      model: MODELS.GENERAL,
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) throw error;
    // Only retry on transient errors (rate limits, overloaded, etc.)
    const isTransient = 
      error.message?.includes('overloaded') || 
      error.message?.includes('rate limit') || 
      error.message?.includes('exhausted') ||
      error.message?.includes('INTERNAL') ||
      error.message?.includes('DEADLINE_EXCEEDED');

    if (!isTransient) throw error;
    
    console.warn(`Neural connection unstable. Re-attempting sync... (${retries} attempts remaining)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

export async function generateResponse(
  prompt: string,
  history: ChatMessage[] = [],
  model: string = MODELS.GENERAL,
  config?: GenerationConfig,
  userApiKey?: string,
  attachments?: { mimeType: string; data: string }[]
) {
  return withRetry(async () => {
    const client = getGeminiClient(userApiKey);
    
    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: Array.isArray(msg.content) 
        ? msg.content.map(p => {
            const part: any = {};
            if (p.text) part.text = p.text;
            if (p.inlineData) part.inlineData = p.inlineData;
            // Filter out custom fields like 'thought'
            return part;
          })
        : [{ text: msg.content as string }]
    }));

    // Add current prompt with attachments
    const currentParts: MessagePart[] = [{ text: prompt }];
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        currentParts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    const response = await client.models.generateContent({
      model,
      contents,
      config: {
        temperature: config?.temperature ?? 0.7,
        topP: config?.topP ?? 0.95,
        topK: config?.topK ?? 40,
        maxOutputTokens: config?.maxOutputTokens ?? 8192,
        systemInstruction: `${config?.systemInstruction || "You are NEXUS, an advanced multimodal AI assistant."}${config?.useTpu ? "\n[ACCELERATION: GOOGLE TPU v5p ACTIVE]" : ""}${config?.useVertexAI ? "\n[INFRASTRUCTURE: VERTEX AI ENTERPRISE ACTIVE]" : ""}${config?.useCuda ? "\n[ACCELERATION: CUSTOM CUDA KERNELS ACTIVE - 25% SPEED BOOST]" : ""}${config?.useGnn ? "\n[LOGIC: GNN-BASED NEURAL GRAPH ACTIVE - ENHANCED ACCURACY]" : ""}`,
        thinkingConfig: (config?.thinkingLevel && model.toLowerCase().includes('thinking')) ? { thinkingLevel: config.thinkingLevel } : undefined,
        responseMimeType: config?.responseMimeType,
        seed: config?.seed,
        tools: (model.toLowerCase().includes('flash') || model.toLowerCase().includes('pro') || model.toLowerCase().includes('neo')) ? [{ googleSearch: {} }] : undefined,
      }
    });

    return response;
  });
}

export async function* generateResponseStream(
  prompt: string,
  history: ChatMessage[] = [],
  model: string = MODELS.GENERAL,
  config?: GenerationConfig,
  userApiKey?: string,
  attachments?: { mimeType: string; data: string }[]
) {
  try {
    const client = getGeminiClient(userApiKey);
    
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: Array.isArray(msg.content) 
        ? msg.content.map(p => {
            const part: any = {};
            if (p.text) part.text = p.text;
            if (p.inlineData) part.inlineData = p.inlineData;
            return part;
          })
        : [{ text: msg.content as string }]
    }));

    const currentParts: MessagePart[] = [{ text: prompt }];
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        currentParts.push({
          inlineData: { mimeType: att.mimeType, data: att.data }
        });
      });
    }

    contents.push({ role: 'user', parts: currentParts });

    const stream = await client.models.generateContentStream({
      model,
      contents,
      config: {
        temperature: config?.temperature ?? 0.7,
        topP: config?.topP ?? 0.95,
        topK: config?.topK ?? 40,
        maxOutputTokens: config?.maxOutputTokens ?? 8192,
        systemInstruction: `${config?.systemInstruction || "You are NEXUS, an advanced multimodal AI assistant."}${config?.useTpu ? "\n[ACCELERATION: GOOGLE TPU v5p ACTIVE]" : ""}${config?.useCuda ? "\n[ACCELERATION: CUSTOM CUDA KERNELS ACTIVE]" : ""}`,
        thinkingConfig: (config?.thinkingLevel && model.toLowerCase().includes('thinking')) ? { thinkingLevel: config.thinkingLevel } : undefined,
        tools: (model.toLowerCase().includes('flash') || model.toLowerCase().includes('pro') || model.toLowerCase().includes('neo')) ? [{ googleSearch: {} }] : undefined,
      }
    });

    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error: any) {
    console.error("Error in streaming response:", error);
    handleGeminiError(error);
    throw error;
  }
}

function getIsAuthError(error: any): boolean {
  if (!error) return false;
  
  // Check common status codes
  const status = error.status || error.code || error.error?.code;
  if (status === 403 || status === 401) return true;
  
  // Check statusText/status strings
  const statusText = error.statusText || error.error?.status || "";
  if (statusText === "PERMISSION_DENIED" || statusText === "UNAUTHENTICATED") return true;
  
  // Check message strings
  const message = (error.message || "").toUpperCase();
  const keywords = ["PERMISSION_DENIED", "API_KEY_INVALID", "API_KEY_NOT_FOUND", "403", "UNAUTHORIZED", "ACCESS DENIED"];
  return keywords.some(keyword => message.includes(keyword));
}

function handleGeminiError(error: any) {
  const isAuth = getIsAuthError(error);
  const message = error.message || "";
  
  if (isAuth) {
    throw new NexusError(NexusErrorType.API_KEY_INVALID, "Neural Core Access Denied [403]. This model requires a personal API key with the correct permissions. Please authorize using the 'Auth' button in settings.");
  } else if (message.includes("Requested entity was not found") || message.includes("404")) {
    throw new NexusError(NexusErrorType.UNKNOWN, "Neural Link Error [404]: The requested AI model or resource was not found. This can happen if the selected model is not available in your region or your API key doesn't have access to this specific core.");
  } else if (message.includes("SAFETY") || message.includes("blocked")) {
    throw new NexusError(NexusErrorType.SAFETY_VIOLATION, "The request was flagged by neural safety protocols.");
  } else if (message.includes("quota") || message.includes("rate limit")) {
    throw new NexusError(NexusErrorType.QUOTA_EXCEEDED, "Neural bandwidth exceeded. Please check your API quota.");
  } else if (message.includes("exceeds the maximum allowed size")) {
    throw new NexusError(NexusErrorType.UNKNOWN, "The generated vision is too large for the neural archives.");
  } else if (message.includes("max tokens limit") || message.includes("16384")) {
    throw new NexusError(NexusErrorType.QUOTA_EXCEEDED, "Generation exceeded token limits (16k). Try a shorter prompt or a different model.");
  } else if (message.includes("not found") || message.includes("404")) {
    throw new NexusError(NexusErrorType.UNKNOWN, `Model not found: ${message}. Please ensure your API key has access to the selected core.`);
  } else if (message.includes("Rpc failed") || message.includes("xhr error")) {
    throw new NexusError(NexusErrorType.UNKNOWN, "Neural Link unstable (RPC/XHR Error). This is often a transient issue with the AI gateway. Please try again in a few moments.");
  }
  
  throw new NexusError(NexusErrorType.UNKNOWN, `Neural Desync [${status || 'Error'}]: ${message || "An unexpected neural desync occurred."}`);
}

export async function generateImage(prompt: string, aspectRatio: string = "1:1", userApiKey?: string, model: string = MODELS.IMAGE) {
  try {
    const client = getGeminiClient(userApiKey);
    const response = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio,
          // Only include imageSize for Gemini 3.1+ models
          ...(model.includes('3.1') ? { imageSize: "1K" } : {})
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error: any) {
    console.error("Error generating image:", error);
    handleGeminiError(error);
    throw error;
  }
}

export async function saveToGallery(userId: string, imageUrl: string, prompt: string, aspectRatio: string = "1:1") {
  const path = `users/${userId}/gallery`;
  try {
    const galleryRef = collection(db, 'users', userId, 'gallery');
    
    // Check if the image is too large for Firestore (1MB limit)
    // We use a more conservative limit (800KB) to account for document overhead
    const isTooLarge = imageUrl.length > 800000; 

    if (isTooLarge) {
      // Save metadata to Firestore and image to localStorage
      try {
        const docRef = await addDoc(galleryRef, {
          prompt,
          aspectRatio,
          createdAt: Date.now(),
          isLocal: true,
          // Save a tiny placeholder or just omit the url
          url: 'local_storage_fallback'
        });

        // Store in localStorage with the doc ID
        localStorage.setItem(`nexus_gallery_${docRef.id}`, imageUrl);
        return docRef.id;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }

    try {
      const docRef = await addDoc(galleryRef, {
        url: imageUrl,
        prompt,
        aspectRatio,
        createdAt: Date.now(),
        isLocal: false
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  } catch (error: any) {
    console.error("Error saving to gallery:", error);
    // If it still fails due to size (though we checked), handle it
    if (error.message?.includes('exceeds the maximum allowed size')) {
       // Fallback logic if the initial check missed it
       const galleryRef = collection(db, 'users', userId, 'gallery');
       try {
         const docRef = await addDoc(galleryRef, {
           prompt,
           aspectRatio,
           createdAt: Date.now(),
           isLocal: true,
           url: 'local_storage_fallback'
         });
         localStorage.setItem(`nexus_gallery_${docRef.id}`, imageUrl);
         return docRef.id;
       } catch (innerError) {
         handleFirestoreError(innerError, OperationType.WRITE, path);
       }
    }
    throw error;
  }
}

export class NexusError extends Error {
  constructor(public type: NexusErrorType, message: string) {
    super(message);
    this.name = 'NexusError';
  }
}

export async function generateVideo(prompt: string, userApiKey?: string) {
  try {
    const client = getGeminiClient(userApiKey);
    // @ts-ignore - generateVideos is part of the experimental/preview SDK
    const operation = await client.models.generateVideos({
      model: MODELS.VIDEO,
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    return operation;
  } catch (error: any) {
    if (!getIsAuthError(error)) {
      console.error("Error generating video:", error);
    }
    handleGeminiError(error);
    
    const message = error.message || "";
    if (message.includes("not found") || message.includes("404") || message.includes("not enabled")) {
      throw new NexusError(NexusErrorType.PROMPT_UNSUPPORTED, "The Motion Generation engine (Veo) is not accessible with this API key. Ensure you have the required permissions in Google AI Studio.");
    }
    
    throw new NexusError(NexusErrorType.UNKNOWN, "An unexpected neural desync occurred during video synthesis.");
  }
}

export async function optimizeVideoPrompt(prompt: string, userApiKey?: string) {
  try {
    const ai = getGeminiClient(userApiKey);
    const response = await ai.models.generateContent({
      model: MODELS.GENERAL,
      contents: [{
        parts: [{
          text: `You are a cinematic prompt engineer for Veo 3.1. Enhance the following user prompt into a detailed, high-fidelity video generation prompt. 
          Focus on:
          1. Dramatic camera angles (e.g., dynamic drone shot, handheld intimacy, low-angle grandeur).
          2. Specific lighting (e.g., cinematic golden hour, neon noir, volumetric fog).
          3. Motion styles (e.g., slow-motion fluidity, glitch transitions, hyper-lapse energy).
          4. Textural details (e.g., hyper-realistic 8k, bokeh background, particle effects).
          
          Return ONLY the enhanced prompt string.
          
          User Prompt: ${prompt}`
        }]
      }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 200
      }
    });

    return response.text?.trim() || prompt;
  } catch (error) {
    console.error("Neural optimization failed:", error);
    return prompt;
  }
}

export async function getVideoStatus(operation: any, userApiKey?: string) {
  try {
    const client = getGeminiClient(userApiKey);
    // @ts-ignore
    const updatedOperation = await client.operations.getVideosOperation({ operation });
    return updatedOperation;
  } catch (error: any) {
    if (!getIsAuthError(error)) {
      console.error("Error checking video status:", error);
    }
    handleGeminiError(error);
    throw error;
  }
}

export async function generateSpeech(
  text: string,
  userApiKey?: string,
  voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Kore'
): Promise<string> {
  try {
    const ai = getGeminiClient(userApiKey);
    const response = await ai.models.generateContent({
      model: MODELS.TTS,
      contents: [{ parts: [{ text: `Say this with high fidelity and natural inflection: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned from neural core.");
    
    return base64Audio;
  } catch (error: any) {
    console.error("Neural Voice synthesis failed:", error);
    handleGeminiError(error);
    throw error;
  }
}

export async function fetchVideoBlob(uri: string, userApiKey?: string) {
  const key = userApiKey || process.env.API_KEY || SYSTEM_API_KEY;
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'x-goog-api-key': key || '',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
