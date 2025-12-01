import { useState, useEffect } from 'react';
import { mockUsers } from '@/data/mockUsers';
import type { Note } from '@/types/note';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  reservationId: string;
  notes: Note[];
  onAddNote?: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

export function NotesSection({ reservationId, notes: initialNotes, onAddNote }: NotesSectionProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync notes when initialNotes changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newNoteText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new note
      const newNote: Note = {
        id: `note-${Date.now()}`,
        reservationId,
        author: 'user-1', // TODO: Use actual logged-in user
        text: newNoteText.trim(),
        createdAt: new Date().toISOString(),
      };
      
      // Add to local state immediately
      setNotes([newNote, ...notes]);
      
      // Call callback if provided
      if (onAddNote) {
        onAddNote({
          reservationId: newNote.reservationId,
          author: newNote.author,
          text: newNote.text,
        });
      }
      
      // Reset form
      setNewNoteText('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
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
      <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">NOTES</h2>
      
      {/* Existing Notes */}
      {notes.length > 0 && (
        <div className="divide-y divide-neutral-100 mb-6">
          {notes.map((note) => {
            const author = mockUsers.find((u) => u.id === note.author);
            const noteDate = new Date(note.createdAt).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            });

            return (
              <div key={note.id} className="py-4 first:pt-0">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium text-sm">
                      {author ? getInitials(author.name) : '?'}
                    </div>
                  </div>
                  
                  {/* Note Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {author?.name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {noteDate}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap font-normal leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note... (Use @ to mention users)"
            rows={4}
            className="resize-none border-neutral-200 focus:border-neutral-400 text-sm bg-neutral-50 focus:bg-white transition-colors pr-12 pb-12"
          />
          {/* Arrow Button - Bottom Right */}
          <button
            type="submit"
            disabled={isSubmitting || !newNoteText.trim()}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            title="Post note"
          >
            <svg 
              className="w-4 h-4 text-neutral-600 disabled:text-neutral-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

