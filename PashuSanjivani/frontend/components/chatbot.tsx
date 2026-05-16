'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { chatAPI } from '@/lib/api';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I am your Pashu Sanjivani assistant. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatAPI.chat({
        message: userMsg,
        history: messages,
        language: i18n.language
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-semibold whitespace-nowrap">
            Chat with AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden border border-green-100 flex flex-col animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Pashu Assistant</h3>
                <p className="text-xs text-green-100">AI Support Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-green-100' : 'bg-white shadow-sm border border-gray-100'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-green-700" /> : <Bot className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about symptoms..."
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 transition outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl disabled:opacity-50 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
