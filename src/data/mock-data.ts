import type {
  Resolution,
  Dispute,
  Arbitration,
  Arbitrator,
  ArbitrationVote,
} from '@/types';

// 当前时间
const now = Date.now();
const HOUR = 60 * 60 * 1000;

// 模拟仲裁委员
export const mockArbitrators: Arbitrator[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: '平台风控',
    role: 'platform',
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Chainlink 节点',
    role: 'external',
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: '社区代表',
    role: 'community',
  },
];

// 模拟提案数据
export const mockResolutions: Resolution[] = [
  // 1. 挑战期状态 - 还有较多时间
  {
    id: 'res-001',
    marketId: 'mkt-001',
    market: {
      id: 'mkt-001',
      title: '2024年欧洲杯决赛：西班牙 vs 英格兰 - 西班牙获胜',
      description:
        '预测2024年欧洲杯决赛中西班牙队是否能够击败英格兰队获得冠军。',
      rules:
        '以UEFA官方公布的比赛结果为准。加时赛和点球大战均计入最终结果。',
      endTime: now - 2 * HOUR,
    },
    proposedOutcome: 'YES',
    proposer: '0xProposer111111111111111111111111111111',
    proposeTime: now - 30 * 60 * 1000, // 30分钟前
    challengeDeadline: now + 2.5 * HOUR, // 还有2.5小时
    status: 'Proposed',
    bondAmount: 500,
  },

  // 2. 挑战期状态 - 即将到期
  {
    id: 'res-002',
    marketId: 'mkt-002',
    market: {
      id: 'mkt-002',
      title: 'BTC价格在2024年12月31日是否超过10万美元',
      description: '预测比特币价格在2024年12月31日UTC 00:00时是否超过100,000美元。',
      rules: '以CoinGecko API返回的价格数据为准，精确到小数点后两位。',
      endTime: now - 1 * HOUR,
    },
    proposedOutcome: 'YES',
    proposer: '0xProposer222222222222222222222222222222',
    proposeTime: now - 2.5 * HOUR,
    challengeDeadline: now + 30 * 60 * 1000, // 还有30分钟
    status: 'Proposed',
    bondAmount: 500,
  },

  // 3. 已争议状态 - 仲裁进行中
  {
    id: 'res-003',
    marketId: 'mkt-003',
    market: {
      id: 'mkt-003',
      title: '特斯拉Q4 2024营收是否超过300亿美元',
      description: '预测特斯拉公司2024年第四季度营收是否超过300亿美元。',
      rules: '以特斯拉官方财报披露数据为准。',
      endTime: now - 24 * HOUR,
    },
    proposedOutcome: 'YES',
    proposer: '0xProposer333333333333333333333333333333',
    proposeTime: now - 20 * HOUR,
    challengeDeadline: now - 17 * HOUR,
    status: 'Challenged',
    bondAmount: 500,
    dispute: {
      id: 'dis-001',
      resolutionId: 'res-003',
      marketId: 'mkt-003',
      disputeType: 'Outcome',
      challengedOutcome: 'NO',
      challenger: '0xChallenger111111111111111111111111111',
      bondAmount: 500,
      disputeTime: now - 18 * HOUR,
      reason:
        '根据特斯拉官方财报，Q4 2024营收为$25.71B（257.1亿美元），未达到300亿美元阈值。提案结果应为NO。',
      evidenceUrls: [
        'https://ir.tesla.com/press-release/tesla-q4-2024-financial-results',
      ],
      evidenceFiles: ['tesla_q4_2024_earnings.pdf'],
      txHash: '0x123abc456def789...',
      resolved: false,
    },
    arbitration: {
      disputeId: 'dis-001',
      resolutionId: 'res-003',
      yesVotes: 1,
      noVotes: 1,
      startTime: now - 18 * HOUR,
      finalized: false,
      invalidate: false,
      votes: [
        {
          arbitrator: '0x1234567890abcdef1234567890abcdef12345678',
          support: true,
          timestamp: now - 16 * HOUR,
        },
        {
          arbitrator: '0xabcdef1234567890abcdef1234567890abcdef12',
          support: false,
          timestamp: now - 14 * HOUR,
        },
      ],
      totalArbitrators: 3,
    },
  },

  // 4. 已生效状态 - 无仲裁自动确认
  {
    id: 'res-004',
    marketId: 'mkt-004',
    market: {
      id: 'mkt-004',
      title: '苹果2024年是否发布AR眼镜',
      description: '预测苹果公司在2024年内是否正式发布消费级AR眼镜产品。',
      rules: '以苹果官方发布会或新闻稿为准。Vision Pro不计入此预测。',
      endTime: now - 72 * HOUR,
    },
    proposedOutcome: 'NO',
    proposer: '0xProposer444444444444444444444444444444',
    proposeTime: now - 70 * HOUR,
    challengeDeadline: now - 67 * HOUR,
    status: 'Resolved',
    bondAmount: 500,
  },

  // 5. 已仲裁状态 - 仲裁后改判
  {
    id: 'res-005',
    marketId: 'mkt-005',
    market: {
      id: 'mkt-005',
      title: 'ETH价格在2024年11月30日是否超过4000美元',
      description:
        '预测以太坊价格在2024年11月30日UTC 00:00时是否超过4,000美元。',
      rules: '以CoinGecko API返回的价格数据为准。',
      endTime: now - 96 * HOUR,
    },
    proposedOutcome: 'NO',
    proposer: '0xProposer555555555555555555555555555555',
    proposeTime: now - 94 * HOUR,
    challengeDeadline: now - 91 * HOUR,
    status: 'Resolved',
    bondAmount: 500,
    dispute: {
      id: 'dis-002',
      resolutionId: 'res-005',
      marketId: 'mkt-005',
      disputeType: 'Outcome',
      challengedOutcome: 'YES',
      challenger: '0xChallenger222222222222222222222222222',
      bondAmount: 500,
      disputeTime: now - 92 * HOUR,
      reason:
        '根据CoinGecko历史数据，ETH在2024年11月30日 00:00 UTC的价格为$4,127.35，超过4000美元阈值。',
      evidenceUrls: [
        'https://www.coingecko.com/en/coins/ethereum/historical_data',
      ],
      evidenceFiles: ['eth_price_snapshot.png'],
      resolved: true,
    },
    arbitration: {
      disputeId: 'dis-002',
      resolutionId: 'res-005',
      yesVotes: 3,
      noVotes: 0,
      startTime: now - 92 * HOUR,
      finalized: true,
      finalOutcome: 'YES',
      invalidate: false,
      votes: [
        {
          arbitrator: '0x1234567890abcdef1234567890abcdef12345678',
          support: true,
          timestamp: now - 90 * HOUR,
        },
        {
          arbitrator: '0xabcdef1234567890abcdef1234567890abcdef12',
          support: true,
          timestamp: now - 89 * HOUR,
        },
        {
          arbitrator: '0x9876543210fedcba9876543210fedcba98765432',
          support: true,
          timestamp: now - 88 * HOUR,
        },
      ],
      totalArbitrators: 3,
    },
  },

  // 6. 作废状态
  {
    id: 'res-006',
    marketId: 'mkt-006',
    market: {
      id: 'mkt-006',
      title: '某某体育赛事结果预测',
      description: '预测某体育赛事的结果。',
      rules: '以官方赛事结果为准。',
      endTime: now - 120 * HOUR,
    },
    proposedOutcome: 'YES',
    proposer: '0xProposer666666666666666666666666666666',
    proposeTime: now - 118 * HOUR,
    challengeDeadline: now - 115 * HOUR,
    status: 'Invalid',
    bondAmount: 500,
    dispute: {
      id: 'dis-003',
      resolutionId: 'res-006',
      marketId: 'mkt-006',
      disputeType: 'Rule',
      challengedOutcome: 'NO',
      challenger: '0xChallenger333333333333333333333333333',
      bondAmount: 500,
      disputeTime: now - 116 * HOUR,
      reason: '该赛事因不可抗力因素取消，根据市场规则应判定为无效市场。',
      evidenceUrls: ['https://example.com/event-cancelled'],
      evidenceFiles: [],
      resolved: true,
    },
    arbitration: {
      disputeId: 'dis-003',
      resolutionId: 'res-006',
      yesVotes: 2,
      noVotes: 1,
      startTime: now - 116 * HOUR,
      finalized: true,
      invalidate: true,
      votes: [
        {
          arbitrator: '0x1234567890abcdef1234567890abcdef12345678',
          support: true,
          timestamp: now - 114 * HOUR,
        },
        {
          arbitrator: '0xabcdef1234567890abcdef1234567890abcdef12',
          support: true,
          timestamp: now - 113 * HOUR,
        },
        {
          arbitrator: '0x9876543210fedcba9876543210fedcba98765432',
          support: false,
          timestamp: now - 112 * HOUR,
        },
      ],
      totalArbitrators: 3,
    },
  },
];

// 获取所有待仲裁案件（委员视角）
export const getPendingArbitrations = (): Resolution[] => {
  return mockResolutions.filter(
    (r) => r.status === 'Challenged' && r.arbitration && !r.arbitration.finalized
  );
};

// 获取已完成的仲裁案件
export const getCompletedArbitrations = (): Resolution[] => {
  return mockResolutions.filter(
    (r) =>
      (r.status === 'Resolved' || r.status === 'Invalid') &&
      r.arbitration?.finalized
  );
};

// 根据ID获取提案
export const getResolutionById = (id: string): Resolution | undefined => {
  return mockResolutions.find((r) => r.id === id);
};

// 根据仲裁申请ID获取提案
export const getResolutionByDisputeId = (
  disputeId: string
): Resolution | undefined => {
  return mockResolutions.find((r) => r.dispute?.id === disputeId);
};

// 当前用户地址（模拟）
export const currentUserAddress = '0x1234567890abcdef1234567890abcdef12345678';

// 检查是否为仲裁委员
export const isArbitrator = (address: string): boolean => {
  return mockArbitrators.some((a) => a.address === address);
};

// 检查用户是否已对某争议投票
export const hasVoted = (
  disputeId: string,
  arbitratorAddress: string
): ArbitrationVote | undefined => {
  const resolution = getResolutionByDisputeId(disputeId);
  return resolution?.arbitration?.votes.find(
    (v) => v.arbitrator === arbitratorAddress
  );
};
