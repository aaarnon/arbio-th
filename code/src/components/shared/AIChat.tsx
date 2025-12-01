import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  context?: string;
  guestName?: string;
}

export function AIChat({ context }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Chat');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const agentDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowChatDropdown(false);
      }
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
        setShowAgentDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can help you with that. This is a simulated response to: "${userMessage.content}"`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with New Chat Dropdown */}
      <div className="flex-shrink-0 px-4 py-3">
        <div>
          {/* New AI chat dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowChatDropdown(!showChatDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-700"
            >
              New AI chat
              <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showChatDropdown && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 py-3 z-50">
                {/* Previous chats section */}
                <div className="px-4">
                  <h3 className="text-xs font-medium text-neutral-500 mb-2">Previous chats</h3>
                  <div className="flex items-center justify-center py-6">
                    <svg className="w-6 h-6 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm text-neutral-500 mb-2">Start a conversation</p>
            <p className="text-xs text-neutral-400 max-w-xs">
              Ask questions about this reservation, get assistance, or request information.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-lg px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Cursor-like */}
      <div className="flex-shrink-0 p-4">
        <div className="border border-neutral-200 rounded-lg bg-neutral-50 hover:border-neutral-300 transition-colors">
          <div className="px-3 pt-3">
            {/* Tag at top left */}
            {context && (
              <div className="mb-2 flex items-start">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full">
                  <span>@</span>
                  <span>{context}</span>
                </span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask questions related to this reservation"
              rows={2}
              className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 border-0 focus:outline-none resize-none bg-transparent"
              style={{ maxHeight: '200px', minHeight: '48px' }}
            />
          </div>
          
          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-3 pb-2 pt-2">
            <div className="flex items-center gap-2">
              {/* Agent Dropdown */}
              <div className="relative" ref={agentDropdownRef}>
                <button 
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                  className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
                >
                  {selectedAgent === 'Chat' ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  <span>{selectedAgent}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Agent Dropdown Menu */}
                {showAgentDropdown && (
                  <div className="absolute bottom-full left-0 mb-1 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setSelectedAgent('Chat');
                        setShowAgentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 transition-colors flex items-center gap-2 ${
                        selectedAgent === 'Chat' ? 'text-neutral-900 font-medium' : 'text-neutral-600'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAgent('Agent');
                        setShowAgentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 transition-colors flex items-center gap-2 ${
                        selectedAgent === 'Agent' ? 'text-neutral-900 font-medium' : 'text-neutral-600'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Agent</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Icon Buttons */}
              <button className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

