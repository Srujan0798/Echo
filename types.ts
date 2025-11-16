
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Profile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | '';
  lookingFor: 'Men' | 'Women' | 'Everyone' | '';
  vibeGraphic: string;
  vibeHook: Blob | null | 'recorded'; // Using Blob to simulate file object
  voicePrompts: { id: number; prompt: string; answer: Blob | null | 'recorded' }[];
}

export type MatchStatus = 
  | 'NEW_MATCH'
  | 'QUESTION_SENT_BY_ME'
  | 'QUESTION_RECEIVED'
  | 'QNA_COMPLETE'
  | 'CALL_READY'
  | 'IN_CALL'
  | 'CALL_COMPLETED_WAITING'
  | 'CHAT_ACTIVE';

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  distance: number;
  vibeGraphic: string;
  likesYou: boolean; // To simulate mutual attraction for demo
  vibeHookUrl?: string; // Mock URL
  prompts?: { question: string; answerText: string }[];
  imageUrl?: string; // For progressive reveal
}

export interface Match {
  id: string;
  profile: DiscoveryProfile;
  status: MatchStatus;
  timestamp: number; // Unix timestamp for last status change
  chatStartedTimestamp?: number; // Unix timestamp for when chat begins
  revealStatus?: {
    softRevealUnlockedAt?: number;
    userReadyAt?: number;
    theirReadyAt?: number;
    fullRevealAt?: number;
  };
  customQuestion?: {
    askedBy: string; // User ID of the asker
    questionAudio: Blob | null | 'recorded';
    questionTimestamp?: number;
    answerAudio?: Blob | null | 'recorded';
    answerTimestamp?: number;
  };
  callDecision?: {
    userDecision: 'CONTINUE' | 'NO_CONNECTION' | null;
    theirDecision: 'CONTINUE' | 'NO_CONNECTION' | null;
    decidedAt?: number;
  }
}

export type MessageType = 'TEXT' | 'VOICE' | 'SYSTEM';

export interface ChatMessage {
    id: string;
    senderId: 'USER' | string; // 'USER' for the current user
    type: MessageType;
    content: string; // Text content or mock URL for voice
    timestamp: number;
}

export interface UserSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
  };
  privacy: {
    showOnEcho: boolean;
    distance: number;
  };
}


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  isProfileComplete: boolean;
  completeOnboarding: (profile: Profile) => void;
}

export interface OnboardingContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export interface MatchContextType {
  matches: Match[];
  addMatch: (profile: DiscoveryProfile, options?: { status?: MatchStatus, customQuestion?: Match['customQuestion'] }) => void;
  updateMatch: (matchId: string, updates: Partial<Omit<Match, 'id' | 'profile'>>) => void;
  removeMatch: (matchId: string) => void;
}