import React, { createContext, useContext, ReactNode } from 'react';
import jaysonPromiseBrowserClient from 'jayson/promise/lib/client/browser';

// RPC 客户端类型
export interface RPCClient {
  request<T = any>(method: string, params?: any[]): Promise<T>;
}

// 创建浏览器端 RPC 客户端
function createRPCClient(url: string): RPCClient {
  // 自定义请求函数
  const callServer = (request: any) => {
    const options = {
      method: 'POST' as const,
      body: request,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch(url, options).then((res) => res.text());
  };

  const client = new jaysonPromiseBrowserClient(callServer, {});

  return {
    request: async <T = any>(method: string, params?: any[]): Promise<T> => {
      try {
        const response = await client.request(method, params || []);
        return response.result as T;
      } catch (error) {
        console.error('RPC request failed:', error);
        throw error;
      }
    },
  };
}

// Context 类型
interface RPCContextValue {
  client: RPCClient;
}

const RPCContext = createContext<RPCContextValue | null>(null);

// Provider Props
interface RPCProviderProps {
  children: ReactNode;
  url?: string;
}

// RPC Provider 组件
export function RPCProvider({ children, url = 'http://localhost:3000' }: RPCProviderProps) {
  const client = React.useMemo(() => createRPCClient(url), [url]);

  return <RPCContext.Provider value={{ client }}>{children}</RPCContext.Provider>;
}

// Hook 使用 RPC 客户端
export function useRPC() {
  const context = useContext(RPCContext);

  if (!context) {
    throw new Error('useRPC must be used within RPCProvider');
  }

  return context.client;
}
