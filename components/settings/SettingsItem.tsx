
import React from 'react';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, children, onClick }) => {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 text-white first:rounded-t-lg last:rounded-b-lg ${isClickable ? 'cursor-pointer hover:bg-white/5' : ''} border-b border-white/10 last:border-b-0`}
    >
      <div className="text-[#FF6B6B] mr-4">
        {icon}
      </div>
      <span className="flex-grow font-semibold">{label}</span>
      <div>
        {children}
      </div>
    </div>
  );
};

export default SettingsItem;