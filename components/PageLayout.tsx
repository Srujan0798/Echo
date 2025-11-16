
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 ${className}`}>
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
