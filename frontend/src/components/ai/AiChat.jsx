import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import aiService from '../../services/aiService';
import './AiChat.css';

export function AiChat() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi there! I'm your AI Scheduling & Study Assistant. Ask me to break down topics, design study intervals, or recommend focus routines for your developer journey.",
      suggestions: [
        'How to balance coding with conceptual review?',
        'Break down Spring Boot microservices into tasks',
        'Suggest routine for low energy days',
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText) => {
    const text = messageText || inputVal;
    if (!text || !text.trim() || loading) return;

    const userMessage = { sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await aiService.chatWithAi(text.trim());
      const aiReply = {
        sender: 'ai',
        text: response.reply,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having trouble connecting right now. Try breaking down your tasks manually or check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-card">
      <div className="ai-chat-header">
        <div className="chat-avatar-ai">
          <Bot size={20} />
        </div>
        <div className="chat-header-info">
          <h4 className="chat-header-title">AI Study Coach & Planner</h4>
          <span className="chat-status-online">
            <span className="online-dot"></span> Ready to assist
          </span>
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-row msg-${msg.sender}`}>
            <div className={`chat-bubble bubble-${msg.sender}`}>
              <div className="bubble-content">{msg.text}</div>

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="prompt-chips">
                  {msg.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      className="prompt-chip"
                      onClick={() => handleSend(sug)}
                    >
                      <Sparkles size={11} />
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message-row msg-ai">
            <div className="chat-bubble bubble-ai typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="ai-chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask AI anything about your study schedule..."
          className="chat-text-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!inputVal.trim() || loading}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default AiChat;
