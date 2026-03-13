import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
// import { Toaster } from 'sonner';
import { Capacitor } from '@capacitor/core';
// import { SafeArea } from '@capacitor-community/safe-area';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className 
}) => {
  const [insets, _setInsets] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // 这里的逻辑实际需要 @capacitor-community/safe-area 插件支持
      // 暂时用 CSS env() 变量作为 Web 端的 fallback
      // 如果安装了 safe-area 插件：
      // SafeArea.getSafeAreaInsets().then(({ insets }) => setInsets(insets));
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-secondary/30 flex justify-center">
      <div 
        className={cn(
          "w-full max-w-md bg-background min-h-screen shadow-2xl overflow-hidden relative flex flex-col",
          className
        )}
        style={{
          paddingTop: `max(env(safe-area-inset-top), ${insets.top}px)`,
          paddingBottom: `max(env(safe-area-inset-bottom), ${insets.bottom}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
