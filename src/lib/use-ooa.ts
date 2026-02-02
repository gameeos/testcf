'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWallet } from './use-wallet'
import abi from '@/data/abi/OptimisticOracleArbitration.json'
import { type Address } from 'viem'

// 合约地址 - 需要根据实际部署情况配置
const CONTRACT_ADDRESS = '0xDAb94888b43577eC2D974ffEc5bA56909573e3a5' as Address

// 定义返回类型
export interface UseOOAReturnType {
  // 读方法结果
  isArbitrator: boolean
  isProposer: boolean
  isPlatformProposer: boolean
  proposeBond: bigint | undefined
  challengeBond: bigint | undefined
  challengeWindow: bigint | undefined

  // 读方法函数
  refetchIsArbitrator: () => void
  getResolution: (resolutionId: bigint) => any
  getDispute: (disputeId: bigint) => any
  getArbitration: (disputeId: bigint) => any
  getVote: (disputeId: bigint, arbitrator: Address) => any

  // 写方法
  createResolution: (marketId: bigint, resolutionId: bigint, disputeWindowTime: bigint, endTime: bigint) => Promise<void>
  proposeOutcome: (marketId: bigint, outcome: `0x${string}`) => Promise<void>
  challenge: (disputeId: bigint, resolutionId: bigint, marketId: bigint, disputeType: 0 | 1, challengedOutcome: `0x${string}`, reason: string) => Promise<void>
  vote: (disputeId: bigint, support: boolean) => Promise<void>
  finalizeResolution: (marketId: bigint) => Promise<void>

  // 交易状态
  isWritePending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  writeError: Error | null
  transactionHash: Address | undefined

  // 辅助函数
  outcomeToBytes32: (outcome: 'YES' | 'NO') => `0x${string}`
  bytes32ToOutcome: (bytes32: `0x${string}`) => 'YES' | 'NO'
  checkHasVoted: (disputeId: bigint) => Promise<boolean>
}

/**
 * Optimistic Oracle Arbitration 合约交互 Hook
 */
export function useOOA(): UseOOAReturnType {
  const { address } = useWallet()

  // ============ 读方法 ============

  /**
   * 检查指定地址是否为仲裁委员
   */
  const { data: isArbitratorData, refetch: refetchIsArbitrator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'arbitrators',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const isArbitrator = isArbitratorData ? Boolean(isArbitratorData) : false

  /**
   * 获取提案 Bond 金额
   */
  const { data: proposeBond } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'proposeBond',
  })

  /**
   * 获取挑战 Bond 金额
   */
  const { data: challengeBond } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'challengeBond',
  })

  /**
   * 获取挑战窗口时间（秒）
   */
  const { data: challengeWindow } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'challengeWindow',
  })

  /**
   * 检查是否为提案者
   */
  const { data: isProposerData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'proposers',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const isProposer = isProposerData && Array.isArray(isProposerData) ? Boolean(isProposerData[0]) : false
  const isPlatformProposer = isProposerData && Array.isArray(isProposerData) ? Boolean(isProposerData[1]) : false

  /**
   * 获取提案信息
   */
  const getResolution = (resolutionId: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getResolution',
      args: [resolutionId],
    })
  }

  /**
   * 获取争议信息
   */
  const getDispute = (disputeId: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getDispute',
      args: [disputeId],
    })
  }

  /**
   * 获取仲裁信息
   */
  const getArbitration = (disputeId: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getArbitration',
      args: [disputeId],
    })
  }

  /**
   * 获取投票状态
   */
  const getVote = (disputeId: bigint, arbitrator: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getVote',
      args: [disputeId, arbitrator],
    })
  }

  // ============ 写方法 ============

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * 创建提案
   */
  const createResolution = async (
    marketId: bigint,
    resolutionId: bigint,
    disputeWindowTime: bigint,
    endTime: bigint
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createResolution',
      args: [marketId, resolutionId, disputeWindowTime, endTime],
    })
  }

  /**
   * 提出结果
   */
  const proposeOutcome = async (marketId: bigint, outcome: `0x${string}`) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'proposeOutcome',
      args: [marketId, outcome],
    })
  }

  /**
   * 挑战提案
   * @param disputeId 争议ID
   * @param resolutionId 提案ID
   * @param marketId 市场ID
   * @param disputeType 争议类型 (0 = Outcome, 1 = Rule)
   * @param challengedOutcome 挑战的结果 (bytes32)
   * @param reason 挑战理由
   */
  const challenge = async (
    disputeId: bigint,
    resolutionId: bigint,
    marketId: bigint,
    disputeType: 0 | 1, // 0 = Outcome, 1 = Rule
    challengedOutcome: `0x${string}`,
    reason: string
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'challenge',
      args: [
        disputeId,
        resolutionId,
        marketId,
        disputeType,
        challengedOutcome,
        reason,
      ],
    })
  }

  /**
   * 仲裁投票
   */
  const vote = async (disputeId: bigint, support: boolean) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'vote',
      args: [disputeId, support],
    })
  }

  /**
   * 最终确认提案
   */
  const finalizeResolution = async (marketId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'finalizeResolution',
      args: [marketId],
    })
  }

  // ============ 辅助函数 ============

  /**
   * 转换 YES/NO 到 bytes32
   */
  const outcomeToBytes32 = (outcome: 'YES' | 'NO'): `0x${string}` => {
    if (outcome === 'YES') {
      return '0x5945530000000000000000000000000000000000000000000000000000000000' // 'YES' padded to 32 bytes
    } else {
      return '0x4e4f000000000000000000000000000000000000000000000000000000000000' // 'NO' padded to 32 bytes
    }
  }

  /**
   * 从 bytes32 转换 YES/NO
   */
  const bytes32ToOutcome = (bytes32: `0x${string}`): 'YES' | 'NO' => {
    const str = Buffer.from(bytes32.slice(2), 'hex').toString('utf8').replace(/\0/g, '')
    return str === 'YES' ? 'YES' : 'NO'
  }

  /**
   * 检查当前用户是否已投票
   */
  const checkHasVoted = async (disputeId: bigint): Promise<boolean> => {
    if (!address) return false
    const voteResult = getVote(disputeId, address)
    const voteData = await new Promise<any>((resolve) => {
      if (voteResult.data !== undefined) {
        resolve(voteResult.data)
      } else {
        resolve(undefined)
      }
    })
    return voteData && Array.isArray(voteData) ? Boolean(voteData[1]) : false // 第二个参数是 voted
  }

  return {
    // 读方法结果
    isArbitrator,
    isProposer,
    isPlatformProposer,
    proposeBond: (proposeBond as bigint | undefined),
    challengeBond: (challengeBond as bigint | undefined),
    challengeWindow: (challengeWindow as bigint | undefined),

    // 读方法函数
    refetchIsArbitrator,
    getResolution,
    getDispute,
    getArbitration,
    getVote,

    // 写方法
    createResolution,
    proposeOutcome,
    challenge,
    vote,
    finalizeResolution,

    // 交易状态
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    transactionHash: hash,

    // 辅助函数
    outcomeToBytes32,
    bytes32ToOutcome,
    checkHasVoted,
  }
}
