
import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-wider mb-2 px-2">{title}</h2>
      <div className="bg-[#282828] rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;