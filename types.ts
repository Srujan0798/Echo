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
  vibeHook: Blob | null; // Using Blob to simulate file object
  voicePrompts: { id: number; prompt: string; answer: Blob | null }[];
}

export type MatchStatus = 
  | 'NEW_MATCH'
  | 'CALL_REQUESTED_BY_ME'
  | 'CALL_REQUESTED_BY_THEM'
  | 'CALL_ACCEPTED'
  | 'IN_CALL'
  | 'CHAT_ACTIVE';

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  distance: number;
  vibeGraphic: string;
  likesYou: boolean; // To simulate mutual attraction for demo
  vibeHookUrl?: string; // Mock URL
  prompts?: { question: string; answerUrl: string }[];
  imageUrl?: string; // For progressive reveal
}

export interface Match {
  id: string;
  profile: DiscoveryProfile;
  status: MatchStatus;
  timestamp: number; // Unix timestamp for last status change
  chatStartedTimestamp?: number; // Unix timestamp for when chat begins
  iAmReadyToReveal?: boolean;
  theyAreReadyToReveal?: boolean;
  isRevealed?: boolean;
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