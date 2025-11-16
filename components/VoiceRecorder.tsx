import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, StopCircle, MicOff, Loader } from './icons';

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing' | 'saving';

interface VoiceRecorderProps {
  maxDuration: number;
  onRecordingComplete: (blob: Blob) => void;
  existingRecording: Blob | null;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ maxDuration, onRecordingComplete, existingRecording }) => {
  const [status, setStatus] = useState<RecordingStatus>(existingRecording ? 'recorded' : 'idle');
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  // Fix: Cannot find namespace 'NodeJS'. Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimeLeft(maxDuration);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const startRecording = () => {
    setStatus('recording');
    startTimer();
  };

  const stopRecording = () => {
    stopTimer();
    setStatus('saving');
    // Simulate saving the recording
    setTimeout(() => {
      const mockBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
      onRecordingComplete(mockBlob);
      setStatus('recorded');
    }, 1000);
  };
  
  const startPlayback = () => {
    setStatus('playing');
    startTimer(); // Use timer to simulate playback duration
  };

  const stopPlayback = () => {
    stopTimer();
    setTimeLeft(maxDuration);
    setStatus('recorded');
  };
  
  const resetRecording = () => {
    stopTimer();
    setTimeLeft(maxDuration);
    setStatus('idle');
  };

  const Waveform: React.FC<{ status: RecordingStatus }> = ({ status }) => {
    const bars = Array.from({ length: 30 });
    const isAnimating = status === 'recording' || status === 'playing';
    return (
      <div className="flex items-center justify-center h-12 w-full">
        {bars.map((_, i) => (
          <div
            key={i}
            className="w-1 bg-[#B3B3B3] rounded-full mx-0.5 transition-all duration-300 ease-in-out"
            style={{
              height: isAnimating ? `${Math.random() * 80 + 20}%` : '20%',
              animation: isAnimating ? `wave 1.${i % 5}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </div>
    );
  };
  
  const renderControls = () => {
    switch (status) {
      case 'recording':
        return (
          <button onClick={stopRecording} className="bg-[#FF6B6B] text-white rounded-full p-6 transition-transform hover:scale-105">
            <StopCircle size={48} />
          </button>
        );
      case 'recorded':
        return (
          <div className="flex items-center gap-4">
            <button onClick={resetRecording} className="bg-gray-600 text-white rounded-full p-4 transition-transform hover:scale-105">
              <MicOff size={24} />
            </button>
            <button onClick={startPlayback} className="bg-green-500 text-white rounded-full p-6 transition-transform hover:scale-105">
              <Play size={48} />
            </button>
          </div>
        );
      case 'playing':
        return (
            <button onClick={stopPlayback} className="bg-green-500 text-white rounded-full p-6 transition-transform hover:scale-105">
              <StopCircle size={48} />
            </button>
        );
       case 'saving':
        return (
            <div className="bg-[#FF6B6B] text-white rounded-full p-6">
              <Loader size={48} className="animate-spin" />
            </div>
        );
      case 'idle':
      default:
        return (
          <button onClick={startRecording} className="bg-[#FF6B6B] text-white rounded-full p-6 transition-transform hover:scale-105">
            <Mic size={48} />
          </button>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#282828] p-6 rounded-lg w-full">
      <div className="text-4xl font-bold mb-4 text-white tabular-nums">00:{timeLeft.toString().padStart(2, '0')}</div>
      <Waveform status={status} />
      <div className="mt-6 h-24 flex items-center justify-center">
        {renderControls()}
      </div>
    </div>
  );
};

export default VoiceRecorder;
