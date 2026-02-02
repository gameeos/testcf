import type { Arbitration, Dispute, Resolution, ResolutionStatus } from '@/types';

// RPC 返回的数据类型（与后端保持一致）
export interface RPCResolution {
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
  dispute?: Dispute;
  arbitration?: Arbitration;
  proposedOutcome: 'YES' | 'NO';
  proposer: string;
  proposeTime: number;
  endTime: number;
  disputeWindowTime: number;
  status: number;
  bondAmount: number;
}

// 状态映射：数字 -> 字符串
export const statusMap: Record<number, ResolutionStatus> = {
  0: 'Unresolved',
  1: 'Proposed',
  2: 'Challenged',
  3: 'Resolved',
  4: 'Invalid',
};

// 转换 RPC 数据为前端类型
export function transformResolution(data: RPCResolution): Resolution {
  const reso = {
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
    dispute: data.dispute ? data.dispute : null,
    arbitration: data.arbitration ? data.arbitration : null,
    proposedOutcome: data.proposedOutcome,
    proposer: data.proposer,
    proposeTime: Number(data.proposeTime),
    endTime: data.endTime,
    disputeWindowTime: data.disputeWindowTime,
    challengeDeadline: Number(data.proposeTime) * 1000 + Number(data.disputeWindowTime) * 1000,
    status: statusMap[data.status] || 'Unresolved',
    bondAmount: data.bondAmount,
  };


  return reso as Resolution
}
