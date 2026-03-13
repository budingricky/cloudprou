import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cloud, Cpu, ChevronRight, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { mockService } from '../services/mock';
import { PROVIDERS } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { PageTransition } from '../components/layout/PageTransition';

const AddProvider = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [selectedType, setSelectedType] = useState<'CLOUD' | 'AI' | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const { addAccount } = useStore();
  const navigate = useNavigate();

  const handleSelectType = (type: 'CLOUD' | 'AI') => {
    setSelectedType(type);
    setDirection(1);
    setStep(2);
  };

  const handleSelectProvider = (id: string) => {
    setSelectedProviderId(id);
    setDirection(1);
    setStep(3);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handleConnect = async () => {
    if (!selectedProviderId) return;
    
    setIsLoading(true);
    try {
      const account = await mockService.getAccountData(selectedProviderId, apiKey);
      addAccount(account);
      setDirection(1);
      setStep(4); // Go to success step
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6 w-full absolute top-0 left-0 px-6"
          >
            <h2 className="text-2xl font-bold mb-8">选择服务类型</h2>
            <div className="grid grid-cols-1 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectType('CLOUD')}
                className="flex items-center p-6 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-colors shadow-sm duration-200"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mr-4 shadow-inner">
                  <Cloud className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">云服务商</h3>
                  <p className="text-sm text-muted-foreground">阿里云、腾讯云、AWS等</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectType('AI')}
                className="flex items-center p-6 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-colors shadow-sm duration-200"
              >
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mr-4 shadow-inner">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">AI 模型提供商</h3>
                  <p className="text-sm text-muted-foreground">OpenAI, Anthropic, Midjourney等</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 2:
        const filteredProviders = PROVIDERS.filter(p => p.type === selectedType);
        return (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-4 w-full absolute top-0 left-0 px-6"
          >
            <h2 className="text-2xl font-bold mb-6">选择提供商</h2>
            <div className="grid grid-cols-2 gap-4 pb-20 overflow-y-auto max-h-[70vh] no-scrollbar">
              {filteredProviders.map((provider) => (
                <motion.button
                  key={provider.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectProvider(provider.id)}
                  className="flex flex-col items-center p-4 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-all shadow-sm aspect-square justify-center text-center group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${
                    provider.type === 'AI' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {provider.type === 'AI' ? <Cpu className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
                  </div>
                  <span className="font-medium text-sm">{provider.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        const provider = PROVIDERS.find(p => p.id === selectedProviderId);
        return (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6 w-full absolute top-0 left-0 px-6"
          >
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-sm ${
                provider?.type === 'AI' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {provider?.type === 'AI' ? <Cpu className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">连接 {provider?.name}</h2>
                <p className="text-sm text-muted-foreground">请输入 API 密钥以访问数据</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-muted-foreground group-focus-within:text-primary transition-colors">Access Key ID</label>
                <Input 
                  placeholder="例如: LTAI5t7..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-secondary/30 focus:bg-background transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-muted-foreground group-focus-within:text-primary transition-colors">Access Key Secret</label>
                <Input 
                  type="password" 
                  placeholder="••••••••••••••••" 
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="bg-secondary/30 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="pt-8">
              <Button 
                className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" 
                onClick={handleConnect}
                disabled={!apiKey || !apiSecret || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2 border-white" />
                    正在验证...
                  </>
                ) : (
                  "确认连接"
                )}
              </Button>
              <p className="text-center mt-4 text-xs text-muted-foreground/60">
                密钥仅存储在您的本地设备上，不会上传至任何第三方服务器。
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center justify-center h-full space-y-8 w-full absolute top-0 left-0 px-6 -mt-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600"
            >
              <CheckCircle className="w-12 h-12" />
            </motion.div>
            
            <div className="text-center space-y-2">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold"
              >
                连接成功！
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                已成功添加服务提供商，正在同步数据...
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full pt-8"
            >
              <Button 
                className="w-full h-14 text-lg rounded-full shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700" 
                onClick={() => navigate('/dashboard')}
              >
                前往仪表盘
              </Button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-background relative overflow-hidden">
        <header className="flex items-center justify-between px-6 pt-10 pb-6 z-10">
          {step > 1 && step < 4 ? (
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-secondary/80">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          ) : step === 4 ? (
             <div className="w-10" /> 
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-secondary/80">
              <X className="w-6 h-6" />
            </Button>
          )}
          
          {step < 4 && (
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  layout
                  className={`h-1.5 rounded-full ${
                    step >= i ? 'bg-primary' : 'bg-secondary'
                  }`} 
                  initial={false}
                  animate={{ 
                    width: step === i ? 32 : 8,
                    opacity: step >= i ? 1 : 0.5
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ))}
            </div>
          )}
          
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="flex-1 relative mt-4">
          <AnimatePresence initial={false} custom={direction}>
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default AddProvider;
