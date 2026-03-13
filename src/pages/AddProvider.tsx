import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cloud, Cpu, ChevronRight, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { mockService } from '../services/mock';
import { PROVIDERS } from '../types';

const AddProvider = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'CLOUD' | 'AI' | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const { addAccount } = useStore();
  const navigate = useNavigate();

  const handleSelectType = (type: 'CLOUD' | 'AI') => {
    setSelectedType(type);
    setStep(2);
  };

  const handleSelectProvider = (id: string) => {
    setSelectedProviderId(id);
    setStep(3);
  };

  const handleConnect = async () => {
    if (!selectedProviderId) return;
    
    setIsLoading(true);
    try {
      const account = await mockService.getAccountData(selectedProviderId, apiKey);
      addAccount(account);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-8">选择服务类型</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleSelectType('CLOUD')}
                className="flex items-center p-6 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-colors shadow-sm active:scale-95 duration-200"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mr-4">
                  <Cloud className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">云服务商</h3>
                  <p className="text-sm text-muted-foreground">阿里云、腾讯云、AWS等</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground" />
              </button>

              <button
                onClick={() => handleSelectType('AI')}
                className="flex items-center p-6 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-colors shadow-sm active:scale-95 duration-200"
              >
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mr-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">AI 模型提供商</h3>
                  <p className="text-sm text-muted-foreground">OpenAI, Anthropic, Midjourney等</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        );

      case 2:
        const filteredProviders = PROVIDERS.filter(p => p.type === selectedType);
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">选择提供商</h2>
            <div className="grid grid-cols-2 gap-4">
              {filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSelectProvider(provider.id)}
                  className="flex flex-col items-center p-4 bg-card rounded-2xl border border-border/40 hover:border-primary/50 transition-all shadow-sm active:scale-95 duration-200 aspect-square justify-center text-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    provider.type === 'AI' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {provider.type === 'AI' ? <Cpu className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
                  </div>
                  <span className="font-medium text-sm">{provider.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        const provider = PROVIDERS.find(p => p.id === selectedProviderId);
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                provider?.type === 'AI' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {provider?.type === 'AI' ? <Cpu className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">连接 {provider?.name}</h2>
                <p className="text-sm text-muted-foreground">请输入 API 密钥以访问数据</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Access Key ID</label>
                <Input 
                  placeholder="例如: LTAI5t7..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Access Key Secret</label>
                <Input 
                  type="password" 
                  placeholder="••••••••••••••••" 
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-8">
              <Button 
                className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20" 
                onClick={handleConnect}
                disabled={!apiKey || !apiSecret || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <header className="flex items-center justify-between mb-8 pt-4">
        {step > 1 ? (
          <Button variant="ghost" size="icon" onClick={() => setStep(step - 1)} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
            <X className="w-6 h-6" />
          </Button>
        )}
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= i ? 'w-8 bg-primary' : 'w-2 bg-secondary'
              }`} 
            />
          ))}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default AddProvider;
