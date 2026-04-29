import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, MessageSquare, Info } from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Fitness Coach. How can I help you with your workout or nutrition today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // We send the history of messages
      const response = await api.chat([...messages, userMessage]);
      const assistantMessage: Message = { role: 'assistant', content: response.data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <MessageSquare className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">AI COACH <span className="text-blue-500 text-sm font-bold ml-2 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">BETA</span></h1>
            <p className="text-gray-500 text-sm">Personalized fitness & nutrition advice</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400">
          <Sparkles size={14} className="text-blue-400" />
          Powered by Advanced AI Models
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'assistant' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300'
              }`}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              
              <div className={`max-w-[80%] md:max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  : 'bg-blue-600 text-white rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div className="p-5 rounded-3xl rounded-tl-none bg-white/5 border border-white/10 text-gray-400">
                <Loader2 size={20} className="animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your workout, diet, or form..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl text-white transition-all flex items-center justify-center group-hover:scale-95 active:scale-90"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            <Info size={10} />
            AI can make mistakes. Verify important health info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
