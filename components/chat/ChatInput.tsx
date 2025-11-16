
import React, { useState } from 'react';
import { Mic, Paperclip, Send } from '../icons';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'TEXT' | 'VOICE') => void;
  isPhotosLocked: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isPhotosLocked }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text, 'TEXT');
      setText('');
    }
  };

  return (
    <div className="bg-[#282828] p-3 flex items-center gap-3">
      <button className="text-gray-400 hover:text-white">
        <Mic size={24} />
      </button>
      <div className="relative flex-grow">
        <button 
          className="text-gray-400 hover:text-white absolute left-3 top-1/2 -translate-y-1/2 disabled:text-gray-600 group"
          disabled={isPhotosLocked}
        >
          <Paperclip size={22} />
          {isPhotosLocked && (
             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Photos unlock after 24 hours
            </div>
          )}
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="w-full bg-[#121212] text-white rounded-full py-2.5 pr-12 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
        />
        <button 
            onClick={handleSend}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF6B6B] rounded-full p-2 text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;