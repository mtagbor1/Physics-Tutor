import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../../services/geminiService';
import { decode, decodeAudioData } from '../../utils/audioUtils';
import { SpeakerWaveIcon, StopCircleIcon } from '../../constants';
import { Spinner } from './Spinner';

interface AudioPlayerProps {
  textToSpeak: string;
}

const AUDIO_SAMPLE_RATE = 24000;
const AUDIO_CHANNELS = 1;

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToSpeak }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      sourceNodeRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);
  
  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null; // Prevent onended from firing on manual stop
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    if (isLoading) return;
    setError('');

    if (isPlaying) {
      stopPlayback();
      return;
    }
    
    // Initialize AudioContext on first use
    if (!audioContextRef.current) {
      // Fix: Cast window to any to support webkitAudioContext for Safari compatibility.
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: AUDIO_SAMPLE_RATE,
      });
    }
    // Handle suspended audio context
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsLoading(true);
    try {
      const base64Audio = await generateSpeech(textToSpeak);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(
        audioBytes,
        audioContextRef.current,
        AUDIO_SAMPLE_RATE,
        AUDIO_CHANNELS
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      setError('Audio failed');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isPlaying ? StopCircleIcon : SpeakerWaveIcon;

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:opacity-50"
      aria-label={isPlaying ? "Stop reading aloud" : "Read aloud"}
    >
      {isLoading ? <Spinner /> : <Icon className="w-5 h-5" />}
    </button>
  );
};
