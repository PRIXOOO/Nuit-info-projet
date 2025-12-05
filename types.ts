export interface MeditationSession {
  id: string;
  topic: string;
  duration: string;
  mood: string;
  script: string;
  imageUrl?: string;
  audioBuffer?: AudioBuffer;
}

export enum ImageSize {
  Resolution1K = "1K",
  Resolution2K = "2K",
  Resolution4K = "4K"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// Declare the window interface for the AI Studio key selection
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}