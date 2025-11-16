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
      content: `Hey! Loved your vibehook.`,
      timestamp: now - 10000,
    },
    {
      id: `msg-${now - 5000}`,
      senderId: matchProfile.id,
      type: 'VOICE',
      content: 'mock_voice_url_1',
      timestamp: now - 5000,
    },
  ];
};
