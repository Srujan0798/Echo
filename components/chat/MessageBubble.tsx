
import React from 'react';
import { ChatMessage } from '../../types';
import VoiceMessagePlayer from './VoiceMessagePlayer';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.senderId === 'USER';

  if (message.type === 'SYSTEM') {
    return (
      <div className="text-center text-xs text-gray-400 my-2">
        {message.content}
      </div>
    );
  }

  const bubbleClasses = isUser
    ? 'bg-[#FF6B6B] text-white rounded-br-none'
    : 'bg-[#282828] text-white rounded-bl-none';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-2xl max-w-xs ${bubbleClasses}`}>
        {message.type === 'TEXT' && <p>{message.content}</p>}
        {message.type === 'VOICE' && <VoiceMessagePlayer isUser={isUser} />}
      </div>
    </div>
  );
};

export default MessageBubble;