import { PROVIDERS } from "../types";
import type { Account, Product } from "../types";

// Mock data generator
export const mockService = {
  // 生成随机账户数据
  getAccountData: async (providerId: string, _apiKey: string): Promise<Account> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const provider = PROVIDERS.find(p => p.id === providerId);
    if (!provider) throw new Error('Provider not found');

    const isAI = provider.type === 'AI';
    const balance = isAI ? Math.random() * 500 : Math.random() * 5000;
    
    // 生成一些产品/资源包数据
    const products: Product[] = [];
    
    if (isAI) {
      products.push({
        id: 'tokens-gpt4',
        name: 'GPT-4 Tokens',
        type: 'usage',
        status: 'normal',
        usage: Math.floor(Math.random() * 100000),
        unit: 'Tokens',
      });
      products.push({
        id: 'tokens-embedding',
        name: 'Embedding V2',
        type: 'package',
        status: Math.random() > 0.8 ? 'warning' : 'normal',
        usage: Math.floor(Math.random() * 500000),
        total: 1000000,
        unit: 'Tokens',
        expiryDate: '2025-12-31'
      });
    } else {
      products.push({
        id: 'ecs-instance',
        name: 'ECS 实例 (华东1)',
        type: 'resource',
        status: 'normal',
        usage: 1,
        unit: '台',
      });
      products.push({
        id: 'oss-storage',
        name: 'OSS 标准存储包',
        type: 'package',
        status: Math.random() > 0.9 ? 'expired' : 'normal',
        usage: Math.floor(Math.random() * 400),
        total: 500,
        unit: 'GB',
        expiryDate: '2024-06-30'
      });
      products.push({
        id: 'cdn-traffic',
        name: 'CDN 流量包',
        type: 'package',
        status: 'warning',
        usage: 450,
        total: 500,
        unit: 'GB',
        expiryDate: '2024-05-20'
      });
    }

    return {
      id: crypto.randomUUID(),
      providerId: provider.id,
      name: `${provider.name}默认账号`,
      balance: parseFloat(balance.toFixed(2)),
      currency: 'CNY',
      products,
      lastUpdated: new Date().toISOString(),
    };
  }
};
