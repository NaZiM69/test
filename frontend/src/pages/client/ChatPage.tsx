import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  Loader2,
  Sparkles,
  MessageSquare,
  Info,
} from "lucide-react";
import { api } from "../../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: " Hi! I'm Doku, your fitness coach. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.chat([...messages, userMessage]);
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection interrupted. Reconnecting... please resend your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-orange-500 rounded-[1.5rem] shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <MessageSquare className="text-white" size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light text-white tracking-tight leading-none uppercase">
                <span className="italic font-serif text-orange-500">Coach</span>
              </h1>
              <span className="text-orange-500 text-[10px] font-bold px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-widest">
                v2.0
              </span>
            </div>
            <p className="text-gray-500 text-sm font-light uppercase tracking-widest">
              Advanced Personal Synthesis
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
          <Sparkles size={14} className="text-orange-500 animate-pulse" />
          Quantum Intelligence Mode
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-orange-500/[0.01] pointer-events-none"></div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                  msg.role === "assistant"
                    ? "bg-black border-orange-500/30 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    : "bg-white/10 border-white/10 text-gray-400"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={22} strokeWidth={1.5} />
                ) : (
                  <User size={22} strokeWidth={1.5} />
                )}
              </div>

              <div
                className={`max-w-[75%] md:max-w-[65%] p-7 rounded-[2.5rem] text-sm leading-relaxed shadow-xl ${
                  msg.role === "assistant"
                    ? "bg-black/40 border border-white/10 text-gray-300 rounded-tl-none font-light"
                    : "bg-orange-500 text-white rounded-tr-none font-bold shadow-orange-500/10"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-6 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-black border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Bot size={22} strokeWidth={1.5} />
              </div>
              <div className="p-7 rounded-[2.5rem] rounded-tl-none bg-black/40 border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/5 bg-black/30 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-black border border-white/10 rounded-[2rem] py-6 pl-8 pr-20 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/[0.02] transition-all placeholder:text-gray-700 italic font-serif text-white tracking-wide"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-3 bottom-3 px-6 bg-orange-500 hover:bg-white hover:text-black disabled:opacity-30 rounded-[1.5rem] text-white transition-all duration-500 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} strokeWidth={2.5} />
              )}
            </button>
          </form>
          <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">
            <Info size={12} className="text-orange-500/50" />
            AI can make mistakes. Verify critical personal data.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
