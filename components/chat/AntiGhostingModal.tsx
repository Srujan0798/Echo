import React, { useState } from 'react';
import Button from '../Button';
import { X } from '../icons';

interface AntiGhostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

const templates = [
    "Hey, I've enjoyed talking but I don't think we're a match. Best of luck!",
    "I'm not feeling the connection I'm looking for. Wish you the best!",
    "It was nice getting to know you, but I'd like to leave it here. Take care."
];

const AntiGhostingModal: React.FC<AntiGhostingModalProps> = ({ isOpen, onClose, onSend }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;
  
  const handleSend = () => {
      if (message.trim()) {
          onSend(message);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">End Connection</h2>
        <p className="text-sm text-[#B3B3B3] mb-4">To encourage respectful interactions, please send one final message before ending the connection.</p>

        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a final message..."
            className="w-full bg-[#121212] text-white rounded-lg p-3 h-24 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none mb-3"
        />
        <div className="flex flex-wrap gap-2 mb-6">
            {templates.map(t => (
                <button key={t} onClick={() => setMessage(t)} className="text-xs bg-[#121212] hover:bg-white/20 text-[#B3B3B3] px-2 py-1 rounded-full">
                    {t}
                </button>
            ))}
        </div>

        <Button onClick={handleSend} disabled={!message.trim()}>Send & End Connection</Button>
      </div>
    </div>
  );
};

export default AntiGhostingModal;