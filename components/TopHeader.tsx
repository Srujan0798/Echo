import React from 'react';
import Logo from './Logo';
import { Bell } from './icons';

interface TopHeaderProps {
  unreadNotifications: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ unreadNotifications }) => {
  return (
    <header className="bg-[#282828] flex items-center justify-between p-3 shadow-md sticky top-0 z-10">
      <Logo size="text-2xl" />
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Notifications">
        <Bell className="h-6 w-6 text-white" />
        {unreadNotifications && (
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#FF6B6B] ring-2 ring-[#282828]" aria-hidden="true"></span>
        )}
        <span className="sr-only">You have new notifications</span>
      </button>
    </header>
  );
};

export default TopHeader;
