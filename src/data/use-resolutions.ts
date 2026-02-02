import { useQuery } from '@tanstack/react-query';
import { useRPC } from '../lib/rpc-client';
import { type RPCResolution, transformResolution } from './resolution-utils';

// 调用 RPC 获取提案列表
export function useResolutions(
  page: number = 1,
  pageSize: number = 10,
  status?: number,
  slug?: string,
  title?: string
) {
  const rpc = useRPC();

  return useQuery({
    queryKey: ['resolutions', page, pageSize, status, slug, title],
    queryFn: async () => {
      const result = await rpc.request<RPCResolution[]>('fetchResolutions', [
        page,
        pageSize,
        status,
        slug,
        title,
      ]);
      return result.map(transformResolution);
    },
    staleTime: 30_000, // 30秒内数据视为新鲜
    refetchOnWindowFocus: false,
  });
}
