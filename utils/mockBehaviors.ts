
import { getMatches, saveMatches } from './localStorage';

// Helper to dispatch event to notify app of changes
const notifyStorageUpdate = () => {
    window.dispatchEvent(new CustomEvent('storageUpdated'));
};

/**
 * Simulates the other user becoming ready to reveal after a delay.
 */
export const simulatePartnerReadyToReveal = (matchId: string, userId: string, delay: number = 2000) => {
    setTimeout(() => {
        const matches = getMatches(userId);
        const matchIndex = matches.findIndex(m => m.id === matchId);
        if (matchIndex > -1 && matches[matchIndex].revealStatus) {
            const match = matches[matchIndex];
            if (match.revealStatus) {
                 match.revealStatus.theirReadyAt = Date.now();
                // If we are also ready, trigger full reveal
                if (match.revealStatus.userReadyAt) {
                    match.revealStatus.fullRevealAt = Date.now();
                }
                matches[matchIndex] = match;
                saveMatches(userId, matches);
                notifyStorageUpdate();
            }
        }
    }, delay);
};

/**
 * Simulates the other user answering a custom question after a delay.
 */
export const simulatePartnerAnsweringQuestion = (matchId: string, userId:string, delay: number = 3000) => {
    setTimeout(() => {
        const matches = getMatches(userId);
        const matchIndex = matches.findIndex(m => m.id === matchId);
        if (matchIndex > -1 && matches[matchIndex].customQuestion) {
            const match = matches[matchIndex];
            match.status = 'QNA_COMPLETE';
            if (match.customQuestion) {
                match.customQuestion.answerAudio = 'recorded';
                match.customQuestion.answerTimestamp = Date.now();
            }
            matches[matchIndex] = match;
            saveMatches(userId, matches);
            notifyStorageUpdate();
            // Also transition to CALL_READY
             setTimeout(() => {
                match.status = 'CALL_READY';
                saveMatches(userId, matches);
                notifyStorageUpdate();
            }, 1500);
        }
    }, delay);
};

/**
 * Simulates the other user's post-call decision.
 */
export const simulatePartnerCallDecision = (matchId: string, userId: string, theirDecision: 'CONTINUE' | 'NO_CONNECTION', delay: number = 2500) => {
    setTimeout(() => {
        const matches = getMatches(userId);
        const matchIndex = matches.findIndex(m => m.id === matchId);
        if (matchIndex > -1) {
            const match = matches[matchIndex];
            if (match.callDecision?.userDecision === 'CONTINUE' && theirDecision === 'CONTINUE') {
                const now = Date.now();
                match.status = 'CHAT_ACTIVE';
                match.chatStartedTimestamp = now;
                match.revealStatus = {
                    softRevealUnlockedAt: now + 24 * 60 * 60 * 1000,
                };
                if(match.callDecision) match.callDecision.theirDecision = 'CONTINUE';
                saveMatches(userId, matches);
            } else {
                // If either party says no, remove the match
                const updatedMatches = matches.filter(m => m.id !== matchId);
                saveMatches(userId, updatedMatches);
            }
            notifyStorageUpdate();
        }
    }, delay);
};