import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Lock, ShieldCheck, Scan } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

const BiometricAuth = () => {
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [isBound, setIsBound] = useState(false);
  const { setAuthenticated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkBindingStatus();
    
    // Listen for app state changes
    if (Capacitor.isNativePlatform()) {
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          // App went to background
          setAuthenticated(false);
          navigate('/');
          // Add blur effect logic if needed (usually handled by native code or a covering div)
        }
      });
    }
  }, []);

  const checkBindingStatus = async () => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: 'biometric_bound' });
      setIsBound(value === 'true');
      
      // Auto-trigger auth if bound
      if (value === 'true') {
        setTimeout(handleAuth, 500);
      }
    }
  };

  const handleAuth = async () => {
    if (authStatus !== 'idle') return;
    
    setAuthStatus('scanning');

    if (Capacitor.isNativePlatform()) {
      try {
        await NativeBiometric.verifyIdentity({
          reason: "请验证身份以进入 云集控",
          title: "生物验证",
          subtitle: "使用指纹或面容ID登录",
          description: "验证您的生物信息",
        });
        
        // If verifyIdentity doesn't throw, it means success
        if (!isBound) {
          await Preferences.set({ key: 'biometric_bound', value: 'true' });
          setIsBound(true);
        }
        handleSuccess();
      } catch (error: any) {
        console.error("Biometric error:", error);
        setAuthStatus('idle');
        
        // Handle cancellation or error
        // On iOS, error.message might be "User canceled"
        // On Android, code might be 10 or 13
      }
    } else {
      // Web Fallback
      setTimeout(() => {
        handleSuccess();
      }, 2000);
    }
  };

  const handleSuccess = () => {
    setAuthStatus('success');
    setTimeout(() => {
      setAuthenticated(true);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden h-screen touch-none">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 relative"
      >
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-background rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5 border border-border/50 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-primary/5"
              animate={authStatus === 'scanning' ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {authStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ShieldCheck className="w-10 h-10 text-green-500" />
              </motion.div>
            ) : (
              <Lock className="w-10 h-10 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">云集控</h1>
          <p className="text-sm text-muted-foreground">多云资产一站式管理</p>
        </div>

        <div className="relative flex flex-col items-center justify-center w-32" onClick={handleAuth}>
          {/* Ripple Effects - Simplified with CSS keyframes logic via framer-motion */}
          {authStatus === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "easeOut" 
                  }}
                  className="absolute w-24 h-24 rounded-full border border-primary/30 bg-primary/5 -z-10"
                />
              ))}
            </div>
          )}

          <motion.div
            animate={authStatus === 'scanning' ? { scale: 0.95 } : { scale: 1 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center relative cursor-pointer transition-colors duration-300 ${
              authStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-background border-primary/20'
            } border-2 shadow-sm z-10`}
          >
            {authStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </motion.div>
            ) : (
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Fingerprint className={`w-full h-full ${authStatus === 'scanning' ? 'text-primary' : 'text-muted-foreground'}`} />
                
                {/* Scan Line - Optimized */}
                {authStatus === 'scanning' && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ 
                      duration: 1.2, 
                      repeat: Infinity, 
                      ease: "linear",
                      repeatType: "reverse"
                    }}
                    className="absolute left-0 w-full h-0.5 bg-primary shadow-sm z-10"
                  />
                )}
              </div>
            )}
          </motion.div>
          
          <div className="h-8 mt-6 flex justify-center w-full">
            <AnimatePresence mode="wait">
              <motion.p 
                key={authStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`text-sm font-medium whitespace-nowrap ${
                  authStatus === 'scanning' ? 'text-primary' : 
                  authStatus === 'success' ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {authStatus === 'idle' && (isBound ? "正在验证..." : "点击进行生物验证")}
                {authStatus === 'scanning' && "正在验证身份..."}
                {authStatus === 'success' && "验证通过"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 pb-[env(safe-area-inset-bottom)]">
        <Scan className="w-4 h-4 text-muted-foreground/30" />
        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
          Secured by Local Biometrics
        </span>
      </div>
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default BiometricAuth;
