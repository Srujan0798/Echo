
import { Match, ChatMessage, UserSettings, Profile } from '../types';
import { safeGet, safeSet } from './storageManager';

// Matches
export const getMatches = (userId: string): Match[] => safeGet<Match[]>(`echo-matches-${userId}`, []);
export const saveMatches = (userId: string, matches: Match[]): void => { safeSet(`echo-matches-${userId}`, matches); };

// Chat
export const getChat = (matchId: string): ChatMessage[] | null => safeGet<ChatMessage[] | null>(`echo-chat-${matchId}`, null);
export const saveChat = (matchId: string, messages: ChatMessage[]): void => { safeSet(`echo-chat-${matchId}`, messages); };

// Settings
export const getSettings = (userId: string): UserSettings | null => safeGet<UserSettings | null>(`echo-settings-${userId}`, null);
export const saveSettings = (userId: string, settings: UserSettings): void => { safeSet(`echo-settings-${userId}`, settings); };

// Profile
export const getProfile = (userId: string): Profile | null => safeGet<Profile | null>(`echo-profile-${userId}`, null);
export const saveProfile = (userId: string, profile: Profile): void => {
    // We can't store Blobs in JSON, so we handle them as markers
    const profileToStore = {
        ...profile,
        vibeHook: profile.vibeHook ? 'recorded' : null,
        voicePrompts: profile.voicePrompts.map(p => ({...p, answer: p.answer ? 'recorded' : null }))
    };
    safeSet(`echo-profile-${userId}`, profileToStore);
}
