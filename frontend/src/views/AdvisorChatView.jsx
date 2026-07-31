import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function AdvisorChatView() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your Fair-Pay Advisor. You can ask me about your rights, fare fairness, or how to draft a complaint.' }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: 'Based on local gig worker benchmarks, that fare is approximately 18% below the standard rate. Would you like me to draft a complaint message for you?' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-50">
      <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 shrink-0">
        <div className="bg-teal-100 p-2 rounded-full">
          <Sparkles className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 leading-tight">GigShield AI</h2>
          <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span> Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.sender === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a fare or shift..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-teal-500 text-sm"
          />
          <button type="submit" className="absolute right-2 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
