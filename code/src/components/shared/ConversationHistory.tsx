import type { ConversationThread } from '@/types/conversation';

interface ConversationHistoryProps {
  conversations: ConversationThread[];
  conversationTags?: Set<string>;
}

export function ConversationHistory({ conversations, conversationTags }: ConversationHistoryProps) {
  // Display conversation history with topic tags

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="mt-6 bg-white rounded-lg p-6">
      <h2 className="text-base font-semibold text-neutral-900 mb-4">Conversations</h2>
      
      {/* Conversation Tags */}
      {conversationTags && conversationTags.size > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {Array.from(conversationTags).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-neutral-50 text-neutral-700 border border-neutral-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {conversations.length === 0 ? (
        <div className="text-sm text-neutral-500 py-4">
          No conversations found
        </div>
      ) : (
        <>
          {/* Scrollable Conversations Container */}
          <div className="overflow-y-auto max-h-[300px] border border-neutral-200 rounded-lg p-4 bg-neutral-50">
            <div className="space-y-4">
              {conversations.map((thread) => (
            <div key={thread.id} className="space-y-3">
              {thread.messages.map((message, index) => {
                const isGuest = message.senderRole === 'guest';
                const isLastMessage = index === thread.messages.length - 1;
                
                return (
                  <div key={message.id}>
                    {/* Message */}
                    <div className={`flex gap-3 ${isGuest ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isGuest 
                          ? 'bg-neutral-200 text-neutral-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getInitials(message.senderName)}
                      </div>
                      {/* Status indicator for staff */}
                      {!isGuest && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                      
                      {/* Message Content */}
                      <div className={`flex-1 max-w-[70%] ${isGuest ? '' : ''}`}>
                      {/* Header */}
                      <div className={`flex items-baseline gap-1.5 mb-0.5 ${isGuest ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-xs font-medium text-neutral-900">
                          {message.senderName}
                          {!isGuest && <span className="text-neutral-500 font-normal ml-1">({message.senderName.split(' ')[0]})</span>}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {formatDate(message.timestamp)} at {formatTime(message.timestamp)}
                        </span>
                      </div>
                        
                      {/* Message Bubble */}
                      <div className={`rounded-lg p-3 ${
                        isGuest 
                          ? 'bg-neutral-100' 
                          : 'bg-blue-50'
                      }`}>
                        <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      </div>
                    </div>
                    
                  {/* Done Status */}
                  {message.isDone && (
                    <div className={`flex items-center gap-1.5 mt-1 text-[10px] text-neutral-500 ${
                      isGuest ? 'ml-11 justify-start' : 'mr-11 justify-end'
                    }`}>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          Marked as done by {message.doneBy}
                          {message.doneAt && (
                            <span className="ml-1">
                              {(() => {
                                const now = new Date();
                                const doneDate = new Date(message.doneAt);
                                const diffTime = Math.abs(now.getTime() - doneDate.getTime());
                                const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                                return diffWeeks > 0 ? `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago` : 'recently';
                              })()}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                    
                    {/* Thread separator */}
                    {isLastMessage && index < thread.messages.length - 1 && (
                      <div className="my-6 border-t border-neutral-200" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

