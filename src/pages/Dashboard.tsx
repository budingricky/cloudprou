import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Server, Bot, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CountUp } from '../components/ui/CountUp';
import { PageTransition } from '../components/layout/PageTransition';
import { Spinner } from '../components/ui/Spinner';

const Dashboard = () => {
  const { accounts } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'cloud' | 'ai'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const cloudAccounts = accounts.filter(a => 
    a.providerId === 'aliyun' || 
    a.providerId === 'tencent' || 
    a.providerId === 'huawei' || 
    a.providerId === 'baidu' || 
    a.providerId === 'volcengine'
  );
  
  const aiAccounts = accounts.filter(a => !cloudAccounts.includes(a));
  
  const displayedAccounts = activeTab === 'all' 
    ? accounts 
    : activeTab === 'cloud' 
      ? cloudAccounts 
      : aiAccounts;

  const totalBalance = displayedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const resourceStatus = displayedAccounts.reduce((acc, account) => {
    account.products.forEach(product => {
      acc[product.status] = (acc[product.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-secondary/30 relative">
        {/* Header */}
        <header className="px-5 pt-6 pb-2 bg-background rounded-b-[1.5rem] shadow-sm z-10 sticky top-0">
          {/* Top Bar: Title & Actions */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-base font-bold tracking-tight">云集控</h1>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={handleRefresh} className="h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary">
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </Button>
              <Button size="icon" onClick={() => navigate('/add-provider')} className="h-8 w-8 rounded-full shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Card Area */}
          <div className="mb-3">
             <h2 className="text-[10px] text-muted-foreground font-medium mb-0.5">总余额</h2>
             <div className="flex items-baseline gap-2 mb-2">
               <span className="text-2xl font-bold tracking-tight text-foreground">
                 <CountUp value={totalBalance} prefix="¥" />
               </span>
             </div>
             
             {/* Resource Status Chips */}
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
               <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[10px] font-medium text-green-700">正常 {resourceStatus['normal'] || 0}</span>
               </div>
               <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                 <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                 <span className="text-[10px] font-medium text-yellow-700">告警 {resourceStatus['warning'] || 0}</span>
               </div>
               <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                 <span className="text-[10px] font-medium text-red-700">过期 {resourceStatus['expired'] || 0}</span>
               </div>
             </div>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-secondary rounded-full w-full">
            {(['all', 'cloud', 'ai'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 relative py-2 text-sm font-medium rounded-full transition-colors duration-300 z-0"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-full shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}>
                  {tab === 'all' ? '全部' : tab === 'cloud' ? '云厂商' : 'AI模型'}
                </span>
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-10 no-scrollbar">
          {isRefreshing && (
             <div className="flex justify-center py-2">
               <Spinner size="sm" className="text-muted-foreground" />
             </div>
          )}
          <AnimatePresence mode="popLayout">
            {displayedAccounts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Layers className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">暂无服务商</h3>
                <p className="text-muted-foreground mb-8 max-w-[200px]">
                  添加您的第一个云服务或AI模型提供商以开始监控
                </p>
                <Button onClick={() => navigate('/add-provider')}>
                  立即添加
                </Button>
              </motion.div>
            ) : (
              displayedAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/provider/${account.id}`}>
                    <div className="bg-background p-5 rounded-[1.5rem] shadow-sm border border-border/40 hover:shadow-md transition-shadow active:scale-[0.98] duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            account.providerId.includes('ai') || ['openai', 'moonshot', 'minimax'].includes(account.providerId) 
                              ? 'bg-purple-50 text-purple-600' 
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {account.providerId.includes('ai') || ['openai', 'moonshot', 'minimax'].includes(account.providerId) ? (
                              <Bot className="w-6 h-6" />
                            ) : (
                              <Server className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{account.name}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              ID: {account.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(account.balance)}
                          </p>
                          <p className="text-xs text-muted-foreground">可用余额</p>
                        </div>
                      </div>
                      
                      {/* Mini stats */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border/30 overflow-x-auto no-scrollbar touch-pan-x overscroll-contain">
                        {account.products.slice(0, 3).map(product => (
                          <div key={product.id} className="flex-shrink-0 bg-secondary/50 px-3 py-1.5 rounded-lg text-xs">
                            <span className="text-muted-foreground block mb-0.5">{product.name}</span>
                            <span className={`font-medium ${
                              product.status === 'warning' ? 'text-yellow-600' : 
                              product.status === 'expired' ? 'text-red-600' : 'text-foreground'
                            }`}>
                              {product.type === 'usage' ? product.usage.toLocaleString() : 
                               `${product.usage}/${product.total}`} {product.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
