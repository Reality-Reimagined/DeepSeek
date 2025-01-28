import { useState, useEffect } from 'react';
import { Menu, X, Plus, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import type { Conversation, Message } from '@/types/chat';

interface ChatLayoutProps {
  children: React.ReactNode;
  messages: Message[];
  onNewChat: () => void;
  onSelectChat: (conversation: Conversation) => void;
  activeConversation: Conversation | null;
}

export function ChatLayout({ 
  children, 
  messages, 
  onNewChat, 
  onSelectChat,
  activeConversation 
}: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateConversationTitle = (conversation: Conversation) => {
    if (conversation.messages.length > 0) {
      const firstMessage = conversation.messages[0];
      const title = firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
      return {
        ...conversation,
        title
      };
    }
    return conversation;
  };

  const startNewChat = () => {
    if (activeConversation && messages.length > 0) {
      const updatedConversation = updateConversationTitle({
        ...activeConversation,
        messages: [...messages]
      });
      
      const existingIndex = conversations.findIndex(conv => conv.id === updatedConversation.id);
      
      if (existingIndex === -1) {
        setConversations(prev => [updatedConversation, ...prev]);
      } else {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === updatedConversation.id ? updatedConversation : conv
          )
        );
      }
    }
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    onNewChat();
  };

  const handleSelectChat = (conversation: Conversation) => {
    if (activeConversation && messages.length > 0) {
      const updatedConversation = updateConversationTitle({
        ...activeConversation,
        messages: [...messages]
      });
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      );
    }
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    onSelectChat(conversation);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative w-72 h-full bg-white border-r z-30
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'shadow-xl' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <Button
              onClick={startNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectChat(conversation)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeConversation?.id === conversation.id
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{conversation.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <Link to="/">
              <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Exit Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-xl font-semibold ml-2">
              {activeConversation?.title || 'New Chat'}
            </h1>
          </div>
        </nav>

        {/* Chat Content */}
        {children}
      </div>
    </div>
  );
}