import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { OnboardingProvider } from '../contexts/OnboardingContext';

// Layouts
import MainLayout from '../components/MainLayout';
import OnboardingLayout from '../pages/onboarding/OnboardingLayout';

// Auth & General Screens
import SplashScreen from '../pages/SplashScreen';
import WelcomeScreen from '../pages/WelcomeScreen';
import TermsScreen from '../pages/TermsScreen';
import PrivacyScreen from '../pages/PrivacyScreen';
import ChatScreen from '../pages/chat/ChatScreen';

// Main App Screens (Tabs)
import DiscoverScreen from '../pages/discover/DiscoverScreen';
import MatchesScreen from '../pages/matches/MatchesScreen';
import ConnectionScreen from '../pages/connection/ConnectionScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';

// Onboarding Steps
import BasicInfoStep from '../pages/onboarding/steps/BasicInfoStep';
import VibeGraphicStep from '../pages/onboarding/steps/VibeGraphicStep';
import VibeHookStep from '../pages/onboarding/steps/VibeHookStep';
import VoicePromptsStep from '../pages/onboarding/steps/VoicePromptsStep';
import ProfilePreviewStep from '../pages/onboarding/steps/ProfilePreviewStep';


const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading, isProfileComplete } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  if (showSplash || (isLoading && !isAuthenticated)) {
    return <SplashScreen />;
  }

  return (
    <HashRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/terms" element={<TermsScreen />} />
            <Route path="/privacy" element={<PrivacyScreen />} />
            <Route path="*" element={<Navigate to="/welcome" />} />
          </>
        ) : !isProfileComplete ? (
          <Route path="/onboarding" element={<OnboardingProvider><OnboardingLayout /></OnboardingProvider>}>
            <Route index element={<Navigate to="basic-info" replace />} />
            <Route path="basic-info" element={<BasicInfoStep />} />
            <Route path="vibe-graphic" element={<VibeGraphicStep />} />
            <Route path="vibe-hook" element={<VibeHookStep />} />
            <Route path="voice-prompts" element={<VoicePromptsStep />} />
            <Route path="preview" element={<ProfilePreviewStep />} />
            <Route path="*" element={<Navigate to="/onboarding" />} />
          </Route>
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DiscoverScreen />} />
            <Route path="matches" element={<MatchesScreen />} />
            <Route path="connection" element={<ConnectionScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="chat/:matchId" element={<ChatScreen />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
        
        {/* Redirect logic after login */}
        {isAuthenticated && !isProfileComplete && <Route path="/*" element={<Navigate to="/onboarding" replace />} />}
        {isAuthenticated && isProfileComplete && <Route path="/welcome" element={<Navigate to="/" replace />} />}
        
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;