import { useState, useRef, useEffect } from 'react';
import { Send, Settings, Mic, MicOff } from 'lucide-react';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/ui/Button';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { streamCompletion, StreamError } from '@/lib/api';
import { transcribeAudio } from '@/lib/voice';
import type { Message, Conversation } from '@/types/chat';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(() => ({
    id: crypto.randomUUID(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
  }));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update conversation messages without causing infinite loop
  useEffect(() => {
    if (activeConversation && messages !== activeConversation.messages) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: messages
      } : null);
    }
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setActiveConversation(newConversation);
    setMessages([]);
  };

  const selectChat = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const text = await transcribeAudio(audioBlob);
          setInput(text);
          adjustTextareaHeight();
        } catch (error) {
          setError('Failed to transcribe audio. Please try again.');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setError('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        chainOfThought: [],
      };

      // Add the message first
      setMessages(prev => [...prev, assistantMessage]);

      await streamCompletion(
        messages.concat(userMessage).map(({ role, content }) => ({ role, content })),
        (chunk, chainOfThought) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              newMessages[newMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + chunk,
                chainOfThought: chainOfThought || lastMessage.chainOfThought,
              };
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      setError(
        error instanceof StreamError
          ? error.message
          : 'An error occurred while processing your request'
      );
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout
      messages={messages}
      onNewChat={startNewChat}
      onSelectChat={selectChat}
      activeConversation={activeConversation}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {error && (
            <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 min-h-[44px] relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-gray-300 p-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden min-h-[44px] max-h-[200px]"
                disabled={isLoading}
                rows={1}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={isRecording ? 'text-red-600' : ''}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* TODO: Implement settings panel */}}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white self-end h-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </ChatLayout>
  );
}