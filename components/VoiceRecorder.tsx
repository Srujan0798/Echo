
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, StopCircle, MicOff, Loader } from './icons';
import PermissionModal from './modals/PermissionModal';

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing' | 'saving' | 'error';
type PermissionStatus = 'prompt' | 'granted' | 'denied';

interface VoiceRecorderProps {
  maxDuration: number;
  onRecordingComplete: (blob: Blob) => void;
  existingRecording: Blob | null;
}

const MIN_DURATION = 2; // Minimum 2 seconds for a valid recording

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ maxDuration, onRecordingComplete, existingRecording }) => {
  const [status, setStatus] = useState<RecordingStatus>(existingRecording ? 'recorded' : 'idle');
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartTime = useRef<number>(0);

  useEffect(() => {
    // Check permission status on mount
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
        setPermissionStatus(result.state);
        result.onchange = () => setPermissionStatus(result.state);
    });
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
  
  const handleStartRecording = async () => {
    setErrorMessage('');
    if (permissionStatus === 'denied') {
        setPermissionModalOpen(true);
        return;
    }
    try {
        // Request permission if not granted
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setStatus('recording');
        recordingStartTime.current = Date.now();
        startTimer();
    } catch (err) {
        console.error("Microphone access was denied.", err);
        setPermissionStatus('denied');
        setPermissionModalOpen(true);
    }
  };

  const stopRecording = () => {
    stopTimer();
    const duration = (Date.now() - recordingStartTime.current) / 1000;
    
    if (duration < MIN_DURATION) {
        setStatus('error');
        setErrorMessage(`Recording must be at least ${MIN_DURATION} seconds.`);
        setTimeout(() => resetRecording(), 2000); // Reset after showing error
        return;
    }

    setStatus('saving');
    setTimeout(() => {
      const mockBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
      onRecordingComplete(mockBlob);
      setStatus('recorded');
    }, 1000);
  };
  
  const startPlayback = () => {
    setStatus('playing');
    startTimer();
  };

  const stopPlayback = () => {
    stopTimer();
    setTimeLeft(maxDuration);
    setStatus('recorded');
  };
  
  const resetRecording = () => {
    stopTimer();
    setErrorMessage('');
    setTimeLeft(maxDuration);
    setStatus('idle');
  };

  const Waveform: React.FC<{ status: RecordingStatus }> = ({ status }) => {
    // ... (same as before)
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
        return <button onClick={stopRecording} className="bg-[#FF6B6B] text-white rounded-full p-6 transition-transform hover:scale-105"><StopCircle size={48} /></button>;
      case 'recorded':
        return (
          <div className="flex items-center gap-4">
            <button onClick={resetRecording} className="bg-gray-600 text-white rounded-full p-4 transition-transform hover:scale-105"><MicOff size={24} /></button>
            <button onClick={startPlayback} className="bg-green-500 text-white rounded-full p-6 transition-transform hover:scale-105"><Play size={48} /></button>
          </div>
        );
      case 'playing':
        return <button onClick={stopPlayback} className="bg-green-500 text-white rounded-full p-6 transition-transform hover:scale-105"><StopCircle size={48} /></button>;
       case 'saving':
        return <div className="bg-[#FF6B6B] text-white rounded-full p-6"><Loader size={48} className="animate-spin" /></div>;
       case 'error':
        return <div className="text-red-500 font-semibold animate-pulse">{errorMessage}</div>;
      case 'idle':
      default:
        return <button onClick={handleStartRecording} className="bg-[#FF6B6B] text-white rounded-full p-6 transition-transform hover:scale-105"><Mic size={48} /></button>;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-[#282828] p-6 rounded-lg w-full">
        <div className="text-4xl font-bold mb-4 text-white tabular-nums">00:{timeLeft.toString().padStart(2, '0')}</div>
        <Waveform status={status} />
        <div className="mt-6 h-24 flex items-center justify-center">
          {renderControls()}
        </div>
      </div>
      <PermissionModal isOpen={isPermissionModalOpen} onClose={() => setPermissionModalOpen(false)} />
    </>
  );
};

export default VoiceRecorder;
