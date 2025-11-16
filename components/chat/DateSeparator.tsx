
import React from 'react';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <div className="text-center my-4">
      <span className="bg-[#282828] text-[#B3B3B3] text-xs font-semibold px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
};

export default DateSeparator;