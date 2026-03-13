import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatUsage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
import { PageTransition } from '../components/layout/PageTransition';
import { CountUp } from '../components/ui/CountUp';

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accounts, removeAccount } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const account = accounts.find(a => a.id === id);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h2 className="text-xl font-bold mb-2">未找到账户</h2>
        <p className="text-muted-foreground mb-6">该账户可能已被移除或不存在。</p>
        <Button onClick={() => navigate('/dashboard')}>返回概览</Button>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleRemove = () => {
    if (confirm('确定要移除此账户吗？本地数据将被删除。')) {
      removeAccount(account.id);
      navigate('/dashboard');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '告警';
      case 'expired': return '已过期';
      default: return status;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-background relative">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="-ml-2 rounded-full hover:bg-secondary/80">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold text-lg truncate max-w-[200px]">{account.name}</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 rounded-full hover:bg-secondary/80">
                <MoreVertical className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={handleRefresh} className="cursor-pointer rounded-lg">
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                  className="mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                刷新数据
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemove} className="text-red-600 cursor-pointer rounded-lg focus:text-red-600 focus:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                移除账户
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-primary text-primary-foreground p-5 rounded-[1.5rem] shadow-lg shadow-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse" />
            <div className="relative z-10">
              <p className="text-primary-foreground/80 text-xs mb-1">账户余额</p>
              {loading ? (
                <Skeleton className="h-8 w-32 bg-white/20 mb-3 rounded-lg" />
              ) : (
                <h2 className="text-3xl font-bold tracking-tight mb-3">
                  <CountUp value={account.balance} prefix={account.currency === 'CNY' ? '¥' : '$'} />
                </h2>
              )}
              <div className="flex items-center text-xs text-primary-foreground/60 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                </motion.div>
                上次更新: {new Date(account.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>

          {/* Products List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base px-1">资源与服务</h3>
            
            {loading ? (
              // Skeleton loading state
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-secondary/30 rounded-[1.25rem] p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full mt-3" />
                </div>
              ))
            ) : (
              <AnimatePresence>
                {account.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Card className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300 rounded-[1.25rem]">
                      <CardHeader className="pb-1.5 p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                          <div className={`flex items-center text-[10px] px-1.5 py-0.5 rounded-full border ${
                            product.status === 'normal' ? 'bg-green-50 text-green-600 border-green-200' :
                            product.status === 'warning' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {getStatusIcon(product.status)}
                            <span className="ml-1">{getStatusText(product.status)}</span>
                          </div>
                        </div>
                        <CardDescription className="text-[10px]">ID: {product.id}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mt-2">
                          {product.type === 'package' ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">已用量</span>
                                <span className="font-medium">
                                  {formatUsage(product.usage, product.unit)} / {formatUsage(product.total || 0, product.unit)}
                                </span>
                              </div>
                              <ProgressBar 
                                value={(product.usage / (product.total || 1)) * 100} 
                                height={6}
                                color={
                                  product.status === 'warning' ? 'warning' :
                                  product.status === 'expired' ? 'danger' : 'primary'
                                }
                              />
                              {product.expiryDate && (
                                <p className="text-[10px] text-muted-foreground pt-0.5">
                                  到期时间: {product.expiryDate}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex justify-between items-end">
                              <span className="text-muted-foreground text-xs">当前用量</span>
                              <span className="text-base font-semibold">
                                {formatUsage(product.usage, product.unit)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProviderDetail;
