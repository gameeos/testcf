// 决议状态
export type ResolutionStatus =
  | 'Unresolved'
  | 'Proposed'
  | 'Challenged'
  | 'Resolved'
  | 'Invalid';

// 争议类型
export type DisputeType = 'Outcome' | 'Rule';

// 市场信息
export interface Market {
  id: string;
  title: string;
  description: string;
  rules: string;
  endTime: number; // timestamp
}

// 决议信息
export interface Resolution {
  id: string;
  marketId: string;
  market: Market;
  proposedOutcome: 'YES' | 'NO';
  proposer: string;
  proposeTime: number;
  challengeDeadline: number;
  status: ResolutionStatus;
  bondAmount: number;
  dispute?: Dispute;
  arbitration?: Arbitration;
}

// 争议信息
export interface Dispute {
  id: string;
  resolutionId: string;
  marketId: string;
  disputeType: DisputeType;
  challengedOutcome: 'YES' | 'NO';
  challenger: string;
  bondAmount: number;
  disputeTime: number;
  reason: string;
  evidenceUrls: string[];
  evidenceFiles: string[];
  txHash?: string;
  resolved: boolean;
}

// 仲裁投票
export interface ArbitrationVote {
  arbitrator: string;
  support: boolean;
  timestamp: number;
}

// 仲裁信息
export interface Arbitration {
  disputeId: string;
  resolutionId: string;
  yesVotes: number;
  noVotes: number;
  startTime: number;
  finalized: boolean;
  finalOutcome?: 'YES' | 'NO';
  invalidate: boolean;
  votes: ArbitrationVote[];
  totalArbitrators: number;
}

// 仲裁委员
export interface Arbitrator {
  address: string;
  name?: string;
  role: 'platform' | 'external' | 'community';
}
