import { useQuery } from '@tanstack/react-query';
import { useRPC } from '../lib/rpc-client';
import type { Resolution, ResolutionStatus } from '@/types';

// RPC 返回的数据类型（与后端保持一致）
interface RPCResolution {
  id: string;
  resolutionId: string;
  marketId: string;
  market: {
    id: string;
    title: string;
    description: string;
    rules: string;
    endTime: number;
  };
  proposedOutcome: 'YES' | 'NO';
  proposer: string;
  proposeTime: number;
  endTime: number;
  disputeWindowTime: number;
  status: number;
  bondAmount: number;
}

// 状态映射：数字 -> 字符串
const statusMap: Record<number, ResolutionStatus> = {
  0: 'Unresolved',
  1: 'Proposed',
  2: 'Challenged',
  3: 'Resolved',
  4: 'Invalid',
};

// 转换 RPC 数据为前端类型
function transformResolution(data: RPCResolution): Resolution {
  const d= {
    id: data.id,
    resolutionId: data.resolutionId,
    marketId: data.marketId,
    market: {
      id: data.market.id,
      title: data.market.title,
      description: data.market.description,
      rules: data.market.rules,
      endTime: data.market.endTime,
    },
    proposedOutcome: data.proposedOutcome,
    proposer: data.proposer,
    proposeTime: data.proposeTime,
    endTime: data.endTime,
    disputeWindowTime: data.disputeWindowTime,
    challengeDeadline: Number(data.proposeTime)*1000 + Number(data.disputeWindowTime)*1000,
    status: statusMap[data.status] || 'Unresolved',
    bondAmount: data.bondAmount,
  };
  console.log("d:",d)
  return d
}

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
