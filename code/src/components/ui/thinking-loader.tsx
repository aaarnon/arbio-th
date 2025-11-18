import { useState, useEffect } from 'react';

interface ThinkingLoaderProps {
  title?: string;
  description?: string;
}

const thinkingMessages = [
  "Analyzing case description and extracting key information...",
  "Identifying issue type and severity level...",
  "Determining required team expertise and resources...",
  "Breaking down the problem into actionable subtasks...",
  "Assigning appropriate team members based on skillsets...",
  "Estimating time requirements for each task...",
  "Checking for dependencies between tasks...",
  "Prioritizing tasks based on urgency and impact...",
  "Generating detailed task descriptions and requirements...",
  "Finalizing task list and team assignments...",
];

// Self-correction configuration for line 2 (index 1)
// The AI will type the wrong part, realize the mistake, delete back to the prefix, then continue with the correct part
const commonPrefix = "Identifying ";
const mistakePart = "whether humans like pineapple pizza";
const mistakeMessage = commonPrefix + mistakePart + "...";

/**
 * ThinkingLoader Component
 * Displays an animated thinking/processing indicator similar to Cursor's thinking animation
 * with realistic self-correction behavior
 */
export function ThinkingLoader({ 
  title = "AI Agents Processing", 
  description = "Analyzing your case and generating task recommendations..." 
}: ThinkingLoaderProps) {
  const [currentText, setCurrentText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPausing, setIsPausing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);
  const [isTypingMistake, setIsTypingMistake] = useState(false);

  useEffect(() => {
    if (messageIndex >= thinkingMessages.length) {
      return;
    }

    // Initialize mistake typing mode for message index 1 (second line)
    if (messageIndex === 1 && charIndex === 0 && !isDeleting && !isTypingMistake && deleteCount === 0) {
      setIsTypingMistake(true);
    }
    
    // Determine which message to type
    const currentMessage = (messageIndex === 1 && isTypingMistake && !isDeleting) 
      ? mistakeMessage 
      : thinkingMessages[messageIndex];
    
    // Handle deletion phase (self-correction)
    if (isDeleting) {
      const timeout = setTimeout(() => {
        // Only delete back to the common prefix (not the entire message)
        // Delete mistakePart + "..." but keep the commonPrefix
        const charsToDelete = mistakePart.length + 3; // +3 for "..."
        
        // Check if we've deleted enough BEFORE deleting this character
        if (deleteCount >= charsToDelete) {
          setIsDeleting(false);
          setIsTypingMistake(false); // Turn off mistake mode
          setDeleteCount(0);
          // Continue typing from the space character (one before the end of prefix)
          // This ensures we retype the space and then continue with the correct part
          setCharIndex(commonPrefix.length - 1);
        } else {
          // Delete one character
          setCurrentText(prev => prev.slice(0, -1));
          setDeleteCount(deleteCount + 1);
        }
      }, 40); // Faster deletion speed
      
      return () => clearTimeout(timeout);
    }
    
    if (charIndex < currentMessage.length) {
      // Randomly add interruptions/hesitations during typing (8% chance, reduced for slower pace)
      const shouldPause = !isPausing && Math.random() < 0.08 && charIndex > 5 && charIndex < currentMessage.length - 10;
      
      if (shouldPause) {
        // Pause in the middle of typing (300-800ms)
        setIsPausing(true);
        const pauseDuration = 300 + Math.random() * 500;
        const timeout = setTimeout(() => {
          setIsPausing(false);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
      
      // Typing speed (30-50ms per character for faster pace)
      const typingSpeed = 30 + Math.random() * 20;
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + currentMessage[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    } else {
      // Message complete - check if this is the mistake message that needs correction
      if (messageIndex === 1 && isTypingMistake && currentMessage === mistakeMessage) {
        // Pause before starting to delete (simulate "realizing the mistake")
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 600 + Math.random() * 400);
        return () => clearTimeout(timeout);
      }
      
      // Move to next message with random pause
      // Random pause between 600ms and 2000ms for more deliberate, realistic variation
      const randomPause = 600 + Math.random() * 1400;
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + '\n');
        setMessageIndex(messageIndex + 1);
        setCharIndex(0);
      }, randomPause);
      
      return () => clearTimeout(timeout);
    }
  }, [charIndex, messageIndex, isPausing, isDeleting, deleteCount, isTypingMistake]);

  return (
    <div className="flex flex-col min-h-[400px] p-8 max-w-2xl mx-auto">
      {/* Fixed header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          {description}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-200 mb-4" />

      {/* Real-time thinking text - grows downward */}
      <div className="flex-1 text-xs text-neutral-700 font-mono whitespace-pre-wrap leading-loose">
        {currentText}
        <span className="inline-block w-1.5 h-3.5 bg-neutral-900 animate-pulse ml-0.5" />
      </div>
    </div>
  );
}

