import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-[#B3B3B3] p-8 animate-fadeIn">
      <div className="mb-4 text-[#FF6B6B]">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="max-w-xs">{description}</p>
      {children && (
        <div className="mt-6 w-full max-w-xs">
          {children}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
