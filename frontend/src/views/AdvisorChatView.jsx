import { useState, useContext, useRef, useEffect } from 'react';
import { EarningsContext } from '../context/EarningsContext';
import { sendChatMessage } from '../api';
import { Send, Sparkles, Loader2, Bot, User, ArrowRight } from 'lucide-react';

export default function AdvisorChatView() {
  const { dashboardSummary, jobs } = useContext(EarningsContext);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'assistant',
      content:
        'Hello! I am your GigShield Fair-Pay Advisor. You can ask me about your rights, fare calculation, underpayment disputes, or earnings optimization.',
      suggestedActions: [
        'Which platform offered my best rate?',
        'How do I file an underpayment dispute?',
        'Calculate fuel expense impact',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isThinking) return;

    setErrorMessage(null);
    const userMsgId = `user_${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    try {
      const userContext = {
        totalWeeklyEarnings: dashboardSummary?.totalEarnings || 0,
        primaryPlatform: jobs[0]?.platform || 'Uber',
      };

      const res = await sendChatMessage({
        message: text,
        userContext,
      });

      if (res?.data) {
        const aiMsg = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: res.data.reply,
          suggestedActions: res.data.suggestedActions || [],
          confidenceScore: res.data.confidenceScore,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('[Chatbot Error]:', err);
      setErrorMessage(err?.message || 'Failed to connect to AI Advisor. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 text-white p-2 rounded-xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base leading-tight">GigShield Advisor</h2>
            <p className="text-xs text-teal-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block animate-pulse"></span> Gemini AI Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.sender === 'assistant' && (
                <div className="bg-slate-900 text-teal-400 p-1.5 rounded-lg shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-3.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-md font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{msg.content}</p>

                {msg.confidenceScore && msg.sender === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>AI Confidence: {Math.round(msg.confidenceScore * 100)}%</span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="bg-teal-600 text-white p-1.5 rounded-lg shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Suggested Actions Chips */}
            {msg.sender === 'assistant' && msg.suggestedActions?.length > 0 && (
              <div className="mt-2.5 ml-8 flex flex-wrap gap-1.5 max-w-[85%]">
                {msg.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action)}
                    disabled={isThinking}
                    className="text-xs font-semibold bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 flex items-center gap-1 transition-all shadow-2xs hover:border-teal-300 disabled:opacity-50"
                  >
                    <span>{action}</span>
                    <ArrowRight className="w-3 h-3 text-teal-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-teal-700 font-bold bg-teal-50 border border-teal-200 rounded-xl p-3 w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>AI Fair-Pay Advisor is generating analysis...</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-slate-100 shrink-0 shadow-lg">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask about shift fairness, gas costs, or dispute rights..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3.5 pl-4 pr-12 focus:outline-none focus:border-teal-500 text-sm font-medium text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white p-2.5 rounded-full transition-all shadow-md"
          >
            {isThinking ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
            ) : (
              <Send className="w-4 h-4 text-teal-400" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}