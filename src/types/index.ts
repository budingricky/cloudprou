export type ProviderType = 'CLOUD' | 'AI';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  logo: string; // URL or icon name
  description: string;
}

export interface Account {
  id: string;
  providerId: string;
  name: string; // e.g. "我的阿里云主账号"
  apiKey?: string; // Mock 不真正存储，但结构上预留
  balance: number;
  currency: string;
  products: Product[];
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'usage' | 'resource' | 'package';
  status: 'normal' | 'warning' | 'expired';
  usage: number;
  total?: number;
  unit: string;
  expiryDate?: string;
}

export const PROVIDERS: Provider[] = [
  // Cloud Providers
  { id: 'aliyun', name: '阿里云', type: 'CLOUD', logo: 'aliyun', description: '全球领先的云计算及人工智能科技公司' },
  { id: 'tencent', name: '腾讯云', type: 'CLOUD', logo: 'tencent', description: '腾讯倾力打造的云计算品牌' },
  { id: 'huawei', name: '华为云', type: 'CLOUD', logo: 'huawei', description: '华为公司旗下的云计算服务品牌' },
  { id: 'baidu', name: '百度智能云', type: 'CLOUD', logo: 'baidu', description: '百度旗下的智能化云计算服务平台' },
  { id: 'volcengine', name: '火山引擎', type: 'CLOUD', logo: 'volcengine', description: '字节跳动旗下的云服务平台' },
  
  // AI Providers
  { id: 'openai', name: 'OpenAI', type: 'AI', logo: 'openai', description: 'ChatGPT, GPT-4 API' }, // 用户未明确要求但作为通用AI参考
  { id: 'baidu-ai', name: '百度千帆', type: 'AI', logo: 'baidu', description: '文心一言 API' },
  { id: 'ali-ai', name: '阿里百炼', type: 'AI', logo: 'aliyun', description: '通义千问 API' },
  { id: 'tencent-ai', name: '腾讯混元', type: 'AI', logo: 'tencent', description: '混元大模型 API' },
  { id: 'doubao', name: '字节豆包', type: 'AI', logo: 'volcengine', description: '豆包大模型 API' },
  { id: 'minimax', name: 'MiniMax', type: 'AI', logo: 'minimax', description: 'MiniMax 大模型' },
  { id: 'moonshot', name: '月之暗面', type: 'AI', logo: 'moonshot', description: 'Kimi 大模型' },
  { id: 'zhipu', name: '智谱AI', type: 'AI', logo: 'zhipu', description: 'ChatGLM 大模型' },
  { id: 'iflytek', name: '科大讯飞', type: 'AI', logo: 'iflytek', description: '星火大模型' },
  { id: '360', name: '360智脑', type: 'AI', logo: '360', description: '360智脑大模型' },
];
