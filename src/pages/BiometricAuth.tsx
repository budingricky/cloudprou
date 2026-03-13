import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const BiometricAuth = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { setAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleAuth = async () => {
    setIsScanning(true);
    // Simulate biometric scan
    setTimeout(() => {
      setIsScanning(false);
      setAuthenticated(true);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/5">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">CloudPro U</h1>
        <p className="text-muted-foreground">多云资产一站式管理</p>
      </motion.div>

      <div className="relative cursor-pointer" onClick={handleAuth}>
        <motion.div
          animate={isScanning ? {
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center relative"
        >
          <Fingerprint className="w-12 h-12 text-primary" />
          
          {isScanning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100%", opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute w-full bg-primary/20 bottom-0 left-0 rounded-full overflow-hidden"
            />
          )}
        </motion.div>
        <p className="text-center mt-4 text-sm text-primary font-medium">
          {isScanning ? "正在验证..." : "点击进行生物验证"}
        </p>
      </div>

      <div className="absolute bottom-10 text-xs text-muted-foreground/50">
        Secured by Local Biometrics
      </div>
    </div>
  );
};

export default BiometricAuth;
