import { useQuery } from '@tanstack/react-query';
import { useRPC } from '../lib/rpc-client';
import type { RPCResolution } from './resolution-utils';
import { transformResolution } from './resolution-utils';

// 调用 RPC 获取单个提案详情
export function useResolution(id: string | undefined) {
  const rpc = useRPC();

  return useQuery({
    queryKey: ['resolution', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Resolution ID is required');
      }
      const result = await rpc.request<RPCResolution>('fetchResolution', [id]);
      return transformResolution(result);
    },
    enabled: !!id, // 只有当 id 存在时才执行查询
    staleTime: 30_000, // 30秒内数据视为新鲜
    refetchOnWindowFocus: false,
  });
}
