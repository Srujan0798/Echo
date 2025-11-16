
import React, { useState } from 'react';
import { useDeveloper } from '../hooks/useDeveloper';
import { Wrench, X, FastForward, Clock, Users } from './icons';

interface DeveloperControlsProps {
  contextActions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

const DeveloperControls: React.FC<DeveloperControlsProps> = ({ contextActions = [] }) => {
  const { isDeveloperMode, skipTimers, setSkipTimers, currentRole, switchRole, showTimerControls, setShowTimerControls } = useDeveloper();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isDeveloperMode) return null;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50 animate-pulse"
        aria-label="Open Developer Controls"
      >
        <Wrench size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-[#1a1a1a] border border-purple-600 rounded-lg p-4 shadow-xl z-50 w-72 animate-slideUp">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Wrench size={18} className="text-purple-400" /> Dev Controls
        </h3>
        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white" aria-label="Close Developer Controls">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 flex items-center gap-2">
            <FastForward size={16} /> Skip Timers
          </span>
          <input 
            type="checkbox" 
            checked={skipTimers} 
            onChange={(e) => setSkipTimers(e.target.checked)}
            className="toggle toggle-sm toggle-accent"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 flex items-center gap-2">
            <Clock size={16} /> Show Timers
          </span>
          <input 
            type="checkbox" 
            checked={showTimerControls} 
            onChange={(e) => setShowTimerControls(e.target.checked)}
            className="toggle toggle-sm toggle-accent"
          />
        </label>

        <div className="border-t border-gray-700 pt-3">
          <button
            onClick={switchRole}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Users size={16} />
            Role: {currentRole === 'sender' ? 'Sender' : 'Receiver'}
          </button>
        </div>

        {contextActions.length > 0 && (
          <div className="border-t border-gray-700 pt-3 space-y-2">
            <p className="text-xs text-gray-400 mb-2">Context Actions:</p>
            {contextActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`w-full py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  action.variant === 'danger' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : action.variant === 'secondary'
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperControls;