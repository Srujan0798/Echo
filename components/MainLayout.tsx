
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import { useDeveloper } from '../hooks/useDeveloper';

const MainLayout: React.FC = () => {
  // Mock data for UI state
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasActiveConnection, setHasActiveConnection] = useState(true);
  const { isDeveloperMode } = useDeveloper();

  return (
    <div className="bg-[#121212] text-white h-screen flex flex-col max-w-md mx-auto relative">
      {isDeveloperMode && (
        <div className="absolute top-2.5 left-2.5 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20">
          DEV
        </div>
      )}
      <TopHeader unreadNotifications={hasNotifications} />
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav activeConnection={hasActiveConnection} />
    </div>
  );
};

export default MainLayout;