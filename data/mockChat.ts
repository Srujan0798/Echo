import { ChatMessage, DiscoveryProfile } from '../types';

export const generateInitialChat = (matchProfile: DiscoveryProfile): ChatMessage[] => {
  const now = Date.now();
  return [
    {
      id: `sys-${now}`,
      senderId: 'SYSTEM',
      type: 'SYSTEM',
      content: 'Connection started. For the first 24 hours, only text and voice messages are available.',
      timestamp: now - 20000,
    },
    {
      id: `msg-${now - 10000}`,
      senderId: matchProfile.id,
      type: 'TEXT',
      content: `Hey! Loved your vibehook. How's it going?`,
      timestamp: now - 10000,
    },
  ];
};

export const generateAutoReply = (lastMessage: ChatMessage): ChatMessage => {
    const content = lastMessage.content.toLowerCase();
    let replyText = "That's interesting! What else is on your mind?";

    if (content.includes('how are you') || content.includes('how about you') || content.includes("how's it going")) {
        replyText = "Doing great, thanks for asking! Just enjoying the day. What have you been up to?";
    } else if (content.includes('?')) {
        replyText = "Good question! I'd say my favorite thing to do is go for a long hike.";
    } else if (content.includes('vibe') || content.includes('prompt')) {
        replyText = "Haha, thanks! I had fun recording it.";
    } else if (content.includes('hey') || content.includes('hello')) {
        replyText = "Hey there! Good to hear from you.";
    }

    return {
        id: `msg-reply-${Date.now()}`,
        senderId: 'REPLY', // This will be replaced with the actual match ID
        type: 'TEXT',
        content: replyText,
        timestamp: Date.now(),
    };
};
