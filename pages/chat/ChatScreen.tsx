import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Match, ChatMessage } from '../../types';
import { generateInitialChat } from '../../data/mockChat';
import ChatHeader from '../../components/chat/ChatHeader';
import RestrictionBanner from '../../components/chat/RestrictionBanner';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import DateSeparator from '../../components/chat/DateSeparator';
import { formatChatTimestampGroup } from '../../utils/time';
import SoftRevealCard from '../../components/chat/SoftRevealCard';
import ReadyToRevealModal from '../../components/chat/ReadyToRevealModal';
import AntiGhostingModal from '../../components/chat/AntiGhostingModal';

type ChatItem = ChatMessage | { type: 'DATE_SEPARATOR'; date: string; id: string } | { type: 'SOFT_REVEAL'; id: string };

const ChatScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [isReadyModalOpen, setReadyModalOpen] = useState(false);
  const [isAntiGhostingModalOpen, setAntiGhostingModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const loadChat = useCallback(() => {
    if (user && matchId) {
      const allMatches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user.id}`) || '[]');
      const currentMatch = allMatches.find(m => m.id === matchId);
      
      if (currentMatch) {
        setMatch(currentMatch);
        const chatHistory: ChatMessage[] = JSON.parse(localStorage.getItem(`echo-chat-${matchId}`) || 'null');
        if (chatHistory) {
          setMessages(chatHistory);
        } else {
          const initialMessages = generateInitialChat(currentMatch.profile);
          setMessages(initialMessages);
          localStorage.setItem(`echo-chat-${matchId}`, JSON.stringify(initialMessages));
        }
      }
    }
  }, [user, matchId]);

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 2000); // Poll for changes (e.g., other user becoming ready)
    return () => clearInterval(interval);
  }, [loadChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateMatchInStorage = (updatedMatch: Match) => {
    if (!user) return;
    const allMatches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user.id}`) || '[]');
    const updatedMatches = allMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    localStorage.setItem(`echo-matches-${user.id}`, JSON.stringify(updatedMatches));
  };
  
  const handleReadyToReveal = () => {
    if (!match) return;
    // Mocking the other user becoming ready after a short delay for demo
    const updatedMatch = { ...match, iAmReadyToReveal: true, theyAreReadyToReveal: true };
    if (updatedMatch.iAmReadyToReveal && updatedMatch.theyAreReadyToReveal) {
        updatedMatch.isRevealed = true;
    }
    setMatch(updatedMatch);
    updateMatchInStorage(updatedMatch);
    setReadyModalOpen(false);
  };

  const handleEndConnection = () => {
    if (!user || !match) return;
    const allMatches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user.id}`) || '[]');
    const filteredMatches = allMatches.filter(m => m.id !== match.id);
    localStorage.setItem(`echo-matches-${user.id}`, JSON.stringify(filteredMatches));
    navigate('/matches');
  };

  const handleSendMessage = (content: string, type: 'TEXT' | 'VOICE') => {
    if (!match) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'USER',
      type: type,
      content: content,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`echo-chat-${matchId}`, JSON.stringify(updatedMessages));

    setIsTyping(true);
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `msg-${Date.now() + 2000}`,
        senderId: match.profile.id,
        type: 'TEXT',
        content: "That's cool! Tell me more.",
        timestamp: Date.now() + 2000,
      };
      const finalMessages = [...updatedMessages, replyMessage];
      setMessages(finalMessages);
      localStorage.setItem(`echo-chat-${matchId}`, JSON.stringify(finalMessages));
      setIsTyping(false);
    }, 2500);
  };

  const chatItems = useMemo<ChatItem[]>(() => {
    const items: ChatItem[] = [];
    let lastDate: string | null = null;
    const showSoftReveal = match?.chatStartedTimestamp && (Date.now() - match.chatStartedTimestamp) > 24 * 60 * 60 * 1000 && !match.isRevealed;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (messageDate !== lastDate) {
        const dateLabel = formatChatTimestampGroup(message.timestamp);
        items.push({ type: 'DATE_SEPARATOR', date: dateLabel, id: `date-${message.timestamp}` });
        lastDate = messageDate;
      }
      items.push(message);
    });

    if (showSoftReveal) {
        items.push({ type: 'SOFT_REVEAL', id: 'soft-reveal-card' });
    }

    return items;
  }, [messages, match]);
  
  if (!match) {
    return <div className="flex items-center justify-center h-full text-white">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#121212]">
      <ChatHeader 
        match={match} 
        onReadyClick={() => setReadyModalOpen(true)}
        onEndConnectionClick={() => setAntiGhostingModalOpen(true)}
      />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {chatItems.map((item) => {
          if (item.type === 'DATE_SEPARATOR') {
            return <DateSeparator key={item.id} date={item.date} />;
          }
          if (item.type === 'SOFT_REVEAL') {
              return <SoftRevealCard key={item.id} profileImageUrl={match.profile.imageUrl || ''} />;
          }
          return <MessageBubble key={item.id} message={item} />;
        })}
        {isTyping && (
           <div className="flex items-start gap-3 mt-2">
             <div className={`w-8 h-8 rounded-full ${match.profile.vibeGraphic}`}></div>
             <div className="bg-[#282828] px-4 py-2 rounded-2xl rounded-bl-none max-w-xs">
                 <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                 </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isPhotosLocked={!match.isRevealed}
      />
      
      <ReadyToRevealModal 
        isOpen={isReadyModalOpen}
        onClose={() => setReadyModalOpen(false)}
        onConfirm={handleReadyToReveal}
      />

      <AntiGhostingModal
        isOpen={isAntiGhostingModalOpen}
        onClose={() => setAntiGhostingModalOpen(false)}
        onSend={(message) => {
            handleSendMessage(message, 'TEXT');
            handleEndConnection();
        }}
      />
    </div>
  );
};

export default ChatScreen;