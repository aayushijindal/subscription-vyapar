import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', hoverEffect = false, children, ...props }) => {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-[16px] p-6 shadow-sm transition-all duration-250 ${
        hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
