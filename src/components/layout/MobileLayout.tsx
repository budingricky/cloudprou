import React from 'react';
import { cn } from '../../lib/utils';
// import { Toaster } from 'sonner';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen w-full bg-secondary/30 flex justify-center">
      <div className={cn(
        "w-full max-w-md bg-background min-h-screen shadow-2xl overflow-hidden relative flex flex-col",
        className
      )}>
        {children}
      </div>
    </div>
  );
};
