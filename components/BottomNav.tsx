import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Phone, User } from './icons';

interface BottomNavProps {
  activeConnection: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  hasBadge?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, hasBadge = false }) => {
  const baseClasses = "flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200";
  const activeClasses = "text-[#FF6B6B]";
  const inactiveClasses = "text-[#B3B3B3] hover:text-white";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="relative">
        <Icon className="h-6 w-6" />
        {hasBadge && (
          <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-[#FF6B6B] ring-2 ring-[#282828]"></span>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeConnection }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Discover' },
    { to: '/matches', icon: Heart, label: 'Matches' },
    { to: '/connection', icon: Phone, label: 'Connect', hasBadge: activeConnection },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-[#282828] sticky bottom-0 z-10">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
