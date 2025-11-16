
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatches } from '../../hooks/useMatches';
import { ChatMessage, Match } from '../../types';
import { generateInitialChat, generateAutoReply } from '../../data/mockChat';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import DateSeparator from '../../components/chat/DateSeparator';
import { formatChatTimestampGroup } from '../../utils/time';
import SoftRevealCard from '../../components/chat/SoftRevealCard';
import ReadyToRevealModal from '../../components/chat/ReadyToRevealModal';
import AntiGhostingModal from '../../components/chat/AntiGhostingModal';
import { getChat, saveChat } from '../../utils/localStorage';
import ChatSkeleton from '../../components/skeletons/ChatSkeleton';
import Button from '../../components/Button';
import { calculateRevealStatus, RevealStatusInfo } from '../../utils/reveal';
import RevealCountdown from '../../components/chat/RevealCountdown';
import RevealTimeline from '../../components/chat/RevealTimeline';
import { useAuth } from '../../hooks/useAuth';
import { simulatePartnerReadyToReveal } from '../../utils/mockBehaviors';
import DeveloperControls from '../../components/DeveloperControls';

type ChatItem = ChatMessage | { type: 'DATE_SEPARATOR'; date: string; id: string } | { type: 'SOFT_REVEAL'; id: string };

const ChatScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, updateMatch, removeMatch } = useMatches();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const [isReadyModalOpen, setReadyModalOpen] = useState(false);
  const [isAntiGhostingModalOpen, setAntiGhostingModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (matchId) {
      const currentMatch = matches.find(m => m.id === matchId);
      if (currentMatch) {
        setMatch(currentMatch);
        let chatHistory = getChat(matchId);
        if (!chatHistory) {
          chatHistory = generateInitialChat(currentMatch.profile);
          saveChat(matchId, chatHistory);
        }
        setMessages(chatHistory);
      }
    }
    setIsLoading(false);
  }, [matchId, matches]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
      return () => {
          if (replyTimeoutRef.current) {
              clearTimeout(replyTimeoutRef.current);
          }
      }
  }, []);

  const revealStatus = useMemo<RevealStatusInfo | null>(() => {
    if (!match) return null;
    return calculateRevealStatus(match);
  }, [match]);

  const handleReadyToReveal = () => {
    if (!match || !revealStatus || !revealStatus.canInitiateFullReveal || !user || !matchId) return;

    const userReadyTime = Date.now();
    
    updateMatch(match.id, { 
        revealStatus: { ...match.revealStatus, userReadyAt: userReadyTime }
    });
    setReadyModalOpen(false);
    
    // Use mock behavior to simulate partner action
    simulatePartnerReadyToReveal(match.id, user.id);
  };

  const handleEndConnection = () => {
    if (match) {
      removeMatch(match.id);
      navigate('/matches', { replace: true });
    }
  };

  const handleSendMessage = (content: string, type: 'TEXT' | 'VOICE') => {
    if (!match || !matchId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'USER',
      type: type,
      content: content,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveChat(matchId, updatedMessages);

    setIsTyping(true);
    const replyDelay = Math.random() * 3000 + 2000; // 2-5 seconds

    replyTimeoutRef.current = setTimeout(() => {
      const replyMessage = generateAutoReply(newMessage);
      replyMessage.senderId = match.profile.id; // Set correct sender ID
      
      const finalMessages = [...updatedMessages, replyMessage];
      setMessages(finalMessages);
      saveChat(matchId, finalMessages);
      setIsTyping(false);
    }, replyDelay);
  };

  const chatItems = useMemo<ChatItem[]>(() => {
    const items: ChatItem[] = [];
    let lastDate: string | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (messageDate !== lastDate) {
        const dateLabel = formatChatTimestampGroup(message.timestamp);
        items.push({ type: 'DATE_SEPARATOR', date: dateLabel, id: `date-${message.timestamp}` });
        lastDate = messageDate;
      }
      items.push(message);
    });

    if (revealStatus && ['SOFT_AVAILABLE', 'WAITING_FOR_PARTNER', 'WAITING_FOR_YOU'].includes(revealStatus.phase)) {
        items.push({ type: 'SOFT_REVEAL', id: 'soft-reveal-card' });
    }

    return items;
  }, [messages, revealStatus]);

  const devActions = revealStatus ? [
    revealStatus.phase === 'COUNTDOWN' ? {
      label: 'Skip to Soft Reveal',
      onClick: () => {
        if (match) {
          updateMatch(match.id, {
            revealStatus: { 
              ...match.revealStatus, 
              softRevealUnlockedAt: Date.now() - 1000 
            }
          });
        }
      },
      variant: 'primary' as const
    } : null,
    revealStatus.canInitiateFullReveal ? {
      label: 'Trigger Full Reveal',
      onClick: () => handleReadyToReveal(),
      variant: 'primary' as const
    } : null,
  ].filter(Boolean) : [];
  
  if (isLoading) {
    return (
        <div className="flex flex-col h-full bg-[#121212]">
            <header className="bg-[#282828] h-[68px] flex-shrink-0 animate-pulse"></header>
            <ChatSkeleton />
        </div>
    );
  }

  if (!match) {
    return <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
        <h2 className="text-xl font-bold">Chat not found</h2>
        <p className="text-[#B3B3B3] mt-2">This conversation no longer exists.</p>
        <Button onClick={() => navigate('/matches')} className="mt-6 !w-auto px-6">Back to Matches</Button>
    </div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#121212]">
      <ChatHeader 
        match={match}
        revealStatus={revealStatus}
        onReadyClick={() => setReadyModalOpen(true)}
        onEndConnectionClick={() => setAntiGhostingModalOpen(true)}
      />
      
      {revealStatus?.phase === 'COUNTDOWN' && match.revealStatus?.softRevealUnlockedAt && (
          <RevealCountdown unlockTime={match.revealStatus.softRevealUnlockedAt} />
      )}
      
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {revealStatus && ['SOFT_AVAILABLE', 'WAITING_FOR_PARTNER', 'WAITING_FOR_YOU', 'FULLY_REVEALED'].includes(revealStatus.phase) && (
            <RevealTimeline status={revealStatus} />
        )}

        {chatItems.map((item) => {
          if (item.type === 'DATE_SEPARATOR') {
            return <DateSeparator key={item.id} date={item.date} />;
          }
          if (item.type === 'SOFT_REVEAL' && match.profile.imageUrl) {
              return <SoftRevealCard key={item.id} profileImageUrl={match.profile.imageUrl} />;
          }
          if (item.type !== 'SOFT_REVEAL') {
             return <MessageBubble key={item.id} message={item as ChatMessage} />;
          }
          return null;
        })}
        {isTyping && (
           <div className="flex items-start gap-3 mt-2 animate-fade-in">
             <div className={`w-8 h-8 rounded-full ${match.profile.vibeGraphic} flex-shrink-0`}></div>
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
        isPhotosLocked={!revealStatus?.isFullyRevealed}
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
            // Give a moment for the message to appear before ending
            setTimeout(() => handleEndConnection(), 500);
        }}
      />
      <DeveloperControls contextActions={devActions as any[]} />
    </div>
  );
};

export default ChatScreen;