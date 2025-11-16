import { Match } from '../types';

export const formatTimeUntil = (ms: number): string => {
  if (ms <= 0) return '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export type RevealPhase = 'LOCKED' | 'COUNTDOWN' | 'SOFT_AVAILABLE' | 'WAITING_FOR_YOU' | 'WAITING_FOR_PARTNER' | 'FULLY_REVEALED';

export interface RevealStatusInfo {
  phase: RevealPhase;
  timeUntilSoftReveal: number; // in ms
  isSoftRevealAvailable: boolean;
  isFullyRevealed: boolean;
  canInitiateFullReveal: boolean;
  waitingForPartner: boolean;
}

export const calculateRevealStatus = (match: Match): RevealStatusInfo => {
  const now = Date.now();
  const rs = match.revealStatus;

  const info: RevealStatusInfo = {
    phase: 'LOCKED',
    timeUntilSoftReveal: 0,
    isSoftRevealAvailable: false,
    isFullyRevealed: false,
    canInitiateFullReveal: false,
    waitingForPartner: false,
  };

  if (rs?.fullRevealAt) {
    info.phase = 'FULLY_REVEALED';
    info.isFullyRevealed = true;
    info.isSoftRevealAvailable = true;
    return info;
  }
  
  const unlockTime = rs?.softRevealUnlockedAt;
  if (!unlockTime) {
      return info; // Still locked, no timer started
  }

  info.timeUntilSoftReveal = unlockTime - now;

  if (now < unlockTime) {
    info.phase = 'COUNTDOWN';
    return info;
  }
  
  // After unlock time
  info.isSoftRevealAvailable = true;
  
  if (rs.userReadyAt && rs.theirReadyAt) {
      // This case should have fullRevealAt set, but as a fallback
      info.phase = 'FULLY_REVEALED';
      info.isFullyRevealed = true;
      return info;
  }

  if (rs.userReadyAt) {
    info.phase = 'WAITING_FOR_PARTNER';
    info.waitingForPartner = true;
  } else if (rs.theirReadyAt) {
      info.phase = 'WAITING_FOR_YOU';
      info.canInitiateFullReveal = true;
  } else {
      info.phase = 'SOFT_AVAILABLE';
      info.canInitiateFullReveal = true;
  }

  return info;
};
