import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatUsage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accounts, removeAccount } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const account = accounts.find(a => a.id === id);

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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="-ml-2 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg truncate max-w-[200px]">{account.name}</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 rounded-full">
              <MoreVertical className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem onClick={handleRefresh} className="cursor-pointer rounded-lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新数据
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRemove} className="text-red-600 cursor-pointer rounded-lg focus:text-red-600 focus:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              移除账户
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground p-6 rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-sm mb-1">账户余额</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              {formatCurrency(account.balance, account.currency)}
            </h2>
            <div className="flex items-center text-xs text-primary-foreground/60 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              <RefreshCw className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              上次更新: {new Date(account.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>

        {/* Products List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg px-1">资源与服务</h3>
          
          {account.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="border-none shadow-sm bg-secondary/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{product.name}</CardTitle>
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full border ${
                      product.status === 'normal' ? 'bg-green-50 text-green-600 border-green-200' :
                      product.status === 'warning' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {getStatusIcon(product.status)}
                      <span className="ml-1">{getStatusText(product.status)}</span>
                    </div>
                  </div>
                  <CardDescription className="text-xs">ID: {product.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    {product.type === 'package' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">已用量</span>
                          <span className="font-medium">
                            {formatUsage(product.usage, product.unit)} / {formatUsage(product.total || 0, product.unit)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              product.status === 'warning' ? 'bg-yellow-500' :
                              product.status === 'expired' ? 'bg-red-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min((product.usage / (product.total || 1)) * 100, 100)}%` }}
                          />
                        </div>
                        {product.expiryDate && (
                          <p className="text-xs text-muted-foreground pt-1">
                            到期时间: {product.expiryDate}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-between items-end">
                        <span className="text-muted-foreground text-sm">当前用量</span>
                        <span className="text-xl font-semibold">
                          {formatUsage(product.usage, product.unit)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
