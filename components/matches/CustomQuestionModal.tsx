import React, { useState } from 'react';
import { DiscoveryProfile } from '../../types';
import Button from '../Button';
import { X } from '../icons';
import VoiceRecorder from '../VoiceRecorder';

interface CustomQuestionModalProps {
  isOpen: boolean;
  profile: DiscoveryProfile | null;
  onClose: () => void;
  onSend: (blob: Blob) => void;
}

const exampleQuestions = [
    "What's making you smile today?",
    "If you could have any superpower, what would it be?",
    "What's a sound you love?",
];

const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({ isOpen, profile, onClose, onSend }) => {
  const [recording, setRecording] = useState<Blob | null>(null);

  if (!isOpen || !profile) return null;
  
  const handleSend = () => {
      if (recording) {
          onSend(recording);
          setRecording(null);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative flex flex-col max-h-[90vh] animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white">Ask {profile.name} a question</h2>
            <p className="text-sm text-[#B3B3B3]">Record a voice question to break the ice (max 30s).</p>
        </div>
        
        <div className="my-4">
            <VoiceRecorder 
                maxDuration={30}
                onRecordingComplete={setRecording}
                existingRecording={recording}
            />
        </div>

        <div className="text-left mb-6">
            <p className="text-xs text-[#B3B3B3] mb-2">Need ideas? Try one of these:</p>
            <div className="flex flex-wrap gap-2">
                {exampleQuestions.map(q => (
                    <span key={q} className="text-xs bg-[#121212] text-[#B3B3B3] px-2 py-1 rounded-full">{q}</span>
                ))}
            </div>
        </div>

        <Button onClick={handleSend} disabled={!recording}>Send Question</Button>
      </div>
    </div>
  );
};

export default CustomQuestionModal;