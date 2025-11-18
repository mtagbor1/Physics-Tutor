import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from '../../constants';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, [onTranscript]);

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  if (!SpeechRecognition) {
    return null; // Don't render if the browser doesn't support the API
  }

  return (
    <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          type="button"
          onClick={handleToggleListening}
          className={`p-3 rounded-full transition-colors ${
            isListening
              ? 'text-red-500 animate-pulse'
              : 'text-gray-400 hover:text-indigo-400'
          }`}
          aria-label={isListening ? 'Stop recording' : 'Start voice input'}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>
    </div>
  );
};