import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Server, Bot, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  const { accounts } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'cloud' | 'ai'>('all');
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-full bg-secondary/30">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-background rounded-b-[2rem] shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm text-muted-foreground font-medium">总资产估值</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {formatCurrency(totalBalance)}
              </span>
              <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                +2.4%
              </span>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full bg-secondary">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-secondary rounded-full w-full">
          {(['all', 'cloud', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'all' ? '全部' : tab === 'cloud' ? '云厂商' : 'AI模型'}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-24 no-scrollbar">
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
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/30 overflow-x-auto no-scrollbar">
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

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-8 right-1/2 translate-x-1/2 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => navigate('/add-provider')}
          className="h-14 px-8 rounded-full shadow-lg shadow-primary/30 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加服务
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
