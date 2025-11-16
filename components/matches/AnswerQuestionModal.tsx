import React, { useState } from 'react';
import { Match } from '../../types';
import Button from '../Button';
import { X } from '../icons';
import VoiceRecorder from '../VoiceRecorder';
import AudioPlayer from '../common/AudioPlayer';

interface AnswerQuestionModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
  onSend: (blob: Blob) => void;
}

const AnswerQuestionModal: React.FC<AnswerQuestionModalProps> = ({ isOpen, match, onClose, onSend }) => {
  const [answer, setAnswer] = useState<Blob | null>(null);

  if (!isOpen || !match) return null;
  
  const handleSend = () => {
      if (answer) {
          onSend(answer);
          setAnswer(null);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative flex flex-col max-h-[90vh] animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white">{match.profile.name} asked you:</h2>
        </div>
        
        <div className="my-2">
            <AudioPlayer title="Their Question" />
        </div>

        <div className="my-4">
            <p className="text-center text-sm text-[#B3B3B3] mb-2">Record your answer (max 30s)</p>
            <VoiceRecorder 
                maxDuration={30}
                onRecordingComplete={setAnswer}
                existingRecording={answer}
            />
        </div>

        <Button onClick={handleSend} disabled={!answer}>Send Answer</Button>
      </div>
    </div>
  );
};

export default AnswerQuestionModal;