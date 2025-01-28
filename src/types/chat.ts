export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  chainOfThought?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface ChatSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
}