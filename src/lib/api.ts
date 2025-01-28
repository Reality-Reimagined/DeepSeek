// import { Groq } from 'groq-sdk';

// // Configure the Groq client
// const configureGroqClient = (apiKey: string) => {
//   if (!apiKey) {
//     throw new Error('API key is required');
//   }

//   return new Groq({
//     dangerouslyAllowBrowser: true,
//     apiKey,
//   });
// };

// // Custom error class for stream handling
// export class StreamError extends Error {
//   constructor(message: string, public status?: number) {
//     super(message);
//     this.name = 'StreamError';
//   }
// }

// // Configuration interface
// interface StreamConfig {
//   model: string;
//   temperature: number;
//   maxTokens: number;
//   topP: number;
//   contextWindow: number;
//   systemPrompt: string;
// }

// // Default configuration
// const DEFAULT_CONFIG: StreamConfig = {
//   model: 'deepseek-r1-distill-llama-70b',
//   temperature: 0.6,
//   maxTokens: 12600,
//   topP: 0.95,
//   contextWindow: 4,
//   systemPrompt: 'You are a helpful AI assistant. Be concise and clear in your responses.',
// };

// interface Message {
//   role: string;
//   content: string;
// }

// export const streamCompletion = async (
//   messages: Message[],
//   onChunk: (chunk: string, chainOfThought?: string[]) => void,
//   config: Partial<StreamConfig> = {}
// ) => {
//   try {
//     // Merge default configuration with provided config
//     const mergedConfig = {
//       ...DEFAULT_CONFIG,
//       ...config,
//     };

//     // Validate environment variables
//     if (!import.meta.env.VITE_GROQ_API_KEY) {
//       throw new StreamError('API key is missing. Please check your environment variables.');
//     }

//     // Create Groq client
//     const groq = configureGroqClient(import.meta.env.VITE_GROQ_API_KEY);

//     // Prepare context messages
//     const recentMessages = messages.slice(-mergedConfig.contextWindow);
//     const contextMessages = [
//       { role: 'system', content: mergedConfig.systemPrompt },
//       ...recentMessages,
//     ];

//     // Start chat completion
//     const chatCompletion = await groq.chat.completions.create({
//       messages: contextMessages,
//       model: mergedConfig.model,
//       temperature: mergedConfig.temperature,
//       max_tokens: mergedConfig.maxTokens,
//       top_p: mergedConfig.topP,
//       stream: true,
//       stop: mergedConfig.stopSequence || null,
//     });

//     const chainOfThought: string[] = [];

//     // Process chunks
//     for await (const chunk of chatCompletion) {
//       const content = chunk.choices[0]?.delta?.content || '';
      
//       if (content) {
//         // Handle chain of thought
//         if (content.startsWith('Thinking:')) {
//           chainOfThought.push(content);
//         }

//         // Call the onChunk callback
//         onChunk(content, chainOfThought);
//       }
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new StreamError(error.message);
//     }
//     throw new StreamError('An unexpected error occurred while streaming the response');
//   }
// };

// // Example usage:
// export const handleStreamResponse = async (messages: Message[], onChunk: (chunk: string) => void) => {
//   try {
//     const customConfig = {
//       temperature: 0.7,
//       maxTokens: 15000,
//     };

//     await streamCompletion(messages, onChunk, customConfig);
//   } catch (error) {
//     if (error instanceof StreamError) {
//       console.error('Stream error:', error.message);
//       // Handle the error appropriately
//     }
//   }
// };




// import { Groq } from 'groq-sdk';

// const groq = new Groq({
//   dangerouslyAllowBrowser: true,
//   apiKey: import.meta.env.VITE_GROQ_API_KEY,
// });

// export class StreamError extends Error {
//   constructor(message: string, public status?: number) {
//     super(message);
//     this.name = 'StreamError';
//   }
// }

// const MAX_CONTEXT_MESSAGES = 10;
// const SYSTEM_PROMPT = `You are a helpful AI assistant. Be concise and clear in your responses.`;

// export const streamCompletion = async (
//   messages: { role: string; content: string }[],
//   onChunk: (chunk: string, chainOfThought?: string[]) => void
// ) => {
//   try {
//     if (!import.meta.env.VITE_GROQ_API_KEY) {
//       throw new StreamError('API key is missing. Please check your environment variables.');
//     }

//     // Get the last few messages for context
//     const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    
//     // Add system prompt
//     const contextMessages = [
//       { role: 'system', content: SYSTEM_PROMPT },
//       ...recentMessages
//     ];

//     const chatCompletion = await groq.chat.completions.create({
//       messages: contextMessages,
//       model: 'deepseek-r1-distill-llama-70b',
//       temperature: 0.6,
//       max_tokens: 12600,
//       top_p: 0.95,
//       stream: true,
//       stop: null,
//       MAX_CONTEXT_MESSAGES: 3,
      
//     });

//     const chainOfThought: string[] = [];

//     for await (const chunk of chatCompletion) {
//       const content = chunk.choices[0]?.delta?.content || '';
//       if (content.includes('Thinking:')) {
//         chainOfThought.push(content);
//       }
//       onChunk(content, chainOfThought);
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new StreamError(error.message);
//     }
//     throw new StreamError('An unexpected error occurred while streaming the response');
//   }
// };

// import { Groq } from 'groq-sdk';

// const groq = new Groq({
//   dangerouslyAllowBrowser: true,
//   apiKey: import.meta.env.VITE_GROQ_API_KEY,
// });

// export class StreamError extends Error {
//   constructor(message: string, public status?: number) {
//     super(message);
//     this.name = 'StreamError';
//   }
// }

// export const streamCompletion = async (
//   messages: { role: string; content: string }[],
//   onChunk: (chunk: string, chainOfThought?: string[]) => void
// ) => {
//   try {
//     if (!import.meta.env.VITE_GROQ_API_KEY) {
//       throw new StreamError('API key is missing. Please check your environment variables.');
//     }

//     const chatCompletion = await groq.chat.completions.create({
//       messages,
//       model: 'deepseek-r1-distill-llama-70b',
//       temperature: 0.6,
//       max_tokens: 12600,
//       top_p: 0.95,
//       stream: true,
//       stop: null
//     });

//     const chainOfThought: string[] = [];

//     for await (const chunk of chatCompletion) {
//       const content = chunk.choices[0]?.delta?.content || '';
//       if (content.includes('Thinking:')) {
//         chainOfThought.push(content);
//       }
//       onChunk(content, chainOfThought);
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new StreamError(error.message);
//     }
//     throw new StreamError('An unexpected error occurred while streaming the response');
//   }
// };

import { Groq } from 'groq-sdk';

const groq = new Groq({
  dangerouslyAllowBrowser: true,
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export class StreamError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'StreamError';
  }
}

export const streamCompletion = async (
  messages: { role: string; content: string }[],
  onChunk: (chunk: string, chainOfThought?: string[]) => void
) => {
  try {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new StreamError('API key is missing. Please check your environment variables.');
    }

    const chatCompletion = await groq.chat.completions.create({
      // messages,
      messages: messages as { role: 'user' | 'assistant'; content: string; }[],
      model: 'deepseek-r1-distill-llama-70b',
      temperature: 0.6,
      max_tokens: 12600,
      top_p: 0.95,
      stream: true,
      stop: null
    });

    const chainOfThought: string[] = [];

    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content.includes('Thinking:')) {
        chainOfThought.push(content);
      }
      onChunk(content, chainOfThought);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new StreamError(error.message);
    }
    throw new StreamError('An unexpected error occurred while streaming the response');
  }
};