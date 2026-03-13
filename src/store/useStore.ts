import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localForage from 'localforage';
import type { Account } from '../types';

// 配置 localForage
localForage.config({
  name: 'CloudProU',
  storeName: 'app_state',
});

interface AppState {
  isAuthenticated: boolean;
  accounts: Account[];
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
  setAuthenticated: (status: boolean) => void;
  updateAccount: (account: Account) => void;
}

// Custom storage adapter for Zustand
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localForage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localForage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localForage.removeItem(name);
  },
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accounts: [],
      addAccount: (account) => set((state) => ({ 
        accounts: [...state.accounts, account] 
      })),
      removeAccount: (id) => set((state) => ({ 
        accounts: state.accounts.filter(a => a.id !== id) 
      })),
      updateAccount: (account) => set((state) => ({
        accounts: state.accounts.map(a => a.id === account.id ? account : a)
      })),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
    }),
    {
      name: 'cloud-pro-u-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ accounts: state.accounts }), // Don't persist auth state
    }
  )
);
