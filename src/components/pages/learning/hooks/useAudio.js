'use client';

import { useCallback, useRef } from 'react';

export function useAudio() {
  const audioRef = useRef(null);

  const playSound = useCallback(async (url) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create and play new audio
      const audio = new Audio(url);
      audioRef.current = audio;
      
      await audio.play();
      
      // Cleanup after playback
      audio.onended = () => {
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }, []);

  const speak = useCallback((text, rate = 0.6) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return {
    playSound,
    speak,
    isPlaying: !!audioRef.current
  };
} 