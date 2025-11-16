import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import DebugPanel from './DebugPanel';

const MainLayout: React.FC = () => {
  // Mock data for UI state
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasActiveConnection, setHasActiveConnection] = useState(true);

  // In a real app, this would be based on process.env.NODE_ENV
  const isDevelopment = true;

  return (
    <div className="bg-[#121212] text-white h-screen flex flex-col max-w-md mx-auto">
      <TopHeader unreadNotifications={hasNotifications} />
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav activeConnection={hasActiveConnection} />
      {isDevelopment && <DebugPanel />}
    </div>
  );
};

export default MainLayout;