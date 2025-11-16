
import React from 'react';

const ChatSkeleton: React.FC = () => {
  const SkeletonBubble: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-3/4 h-12 bg-[#282828] rounded-2xl ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}></div>
    </div>
  );

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 animate-pulse">
      <SkeletonBubble />
      <SkeletonBubble isUser />
      <SkeletonBubble />
      <SkeletonBubble />
      <SkeletonBubble isUser />
    </div>
  );
};

export default ChatSkeleton;