# NEXUS Project Context

## Overview
NEXUS is an advanced multimodal AI assistant built with React, Tailwind CSS, and Firebase. It integrates the Gemini API for text, image, and video generation.

## Key Features
- **Neural Chat:** Multi-model chat interface with support for Gemini 2.0 Flash/Pro.
- **Vision Gen:** Image generation using Gemini 2.5 Flash Image.
- **Motion Gen:** Video generation using Veo 3.1.
- **Neural Canvas:** Interactive drawing board with AI object synthesis.
- **Neural Architect:** Customizable LLM parameters (temperature, topP, etc.).
- **Gallery:** Persistent storage for generated visions in Firestore.

## Technical Stack
- **Frontend:** React 19, Vite, Tailwind CSS 4.
- **Animations:** Framer Motion (motion/react).
- **Icons:** Lucide React.
- **Database/Auth:** Firebase (Firestore & Auth).
- **AI SDK:** @google/genai (v1.29.0+).

## Important Rules
- **API Keys:** Always prioritize the platform-provided `API_KEY` via `window.aistudio.openSelectKey()`.
- **Firestore Security:** Rules are strictly enforced. Users can only access their own subcollections.
- **Error Handling:** Use `handleFirestoreError` for database operations and `handleGeminiError` for AI calls.
- **Responsive Design:** Desktop-first precision with mobile-first code.
