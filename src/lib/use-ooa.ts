'use client'

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { readContract } from 'wagmi/actions'
import { parseUnits, type Address } from 'viem'
import abi from '@/data/abi/OptimisticOracleArbitration.json'
import { erc20Abi } from 'viem'
import { config } from './web3-config'
import { useWallet } from './use-wallet'

const CONTRACT_ADDRESS = '0xDAb94888b43577eC2D974ffEc5bA56909573e3a5' as Address
const USD_ADDRESS = '0x75F827F0334a18E40b31342161579246b8447C4c' as Address // test:0x75F827F0334a18E40b31342161579246b8447C4c base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

export function useOOA() {
  const { address } = useWallet()
  const challengeBondDecimals = 6
  const currentAccount = address

  /* ======================================================
   * 声明式读（用于 UI）
   * ====================================================== */

  const { data: isArbitratorData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'arbitrators',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const isArbitrator = Boolean(isArbitratorData)

  const { data: isProposerData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'proposers',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const isProposer = isProposerData && Array.isArray(isProposerData) ? Boolean(isProposerData[0]) : false
  const isPlatformProposer = isProposerData && Array.isArray(isProposerData) ? Boolean(isProposerData[1]) : false

  const { data: proposeBond } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'proposeBond',
  })

  const { data: challengeBond } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'challengeBond',
  })

  const { data: challengeWindow } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'challengeWindow',
  })

  const { data: arbitratorCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'arbitratorCount',
  })

  /* ======================================================
   * 即时读（action，用于函数调用）
   * ====================================================== */

  const getAllowance = async (account: Address) => {
    return await readContract(config, {
      address: USD_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, CONTRACT_ADDRESS],
    })
  }

  const getResolution = async (resolutionId: bigint) => {
    return readContract(config, {
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getResolution',
      args: [resolutionId],
    })
  }

  const getDispute = async (disputeId: bigint) => {
    return readContract(config, {
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getDispute',
      args: [disputeId],
    })
  }

  const getArbitration = async (disputeId: bigint) => {
    return readContract(config, {
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getArbitration',
      args: [disputeId],
    })
  }

  const getVote = async (disputeId: bigint, arbitrator: Address) => {
    return readContract(config, {
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getVote',
      args: [disputeId, arbitrator],
    })
  }

  const checkHasVoted = async (disputeId: bigint): Promise<boolean> => {
    if (!address) return false
    const vote = await getVote(disputeId, address)
    return Array.isArray(vote) ? Boolean(vote[1]) : false
  }

  /* ======================================================
   * 写合约
   * ====================================================== */

  const {
    data: hash,
    mutateAsync: writeContractAsync,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  })

  const approveBond = (amount: number) =>
    writeContractAsync({
      address: USD_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, parseUnits(amount.toString(), challengeBondDecimals)],
    })


  const createResolution = (
    marketId: bigint,
    resolutionId: bigint,
    disputeWindowTime: bigint,
    endTime: bigint,
  ) =>
    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createResolution',
      args: [marketId, resolutionId, disputeWindowTime, endTime],
    })

  const proposeOutcome = (marketId: bigint, outcome: `0x${string}`) =>
    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'proposeOutcome',
      args: [marketId, outcome],
    })

  const challenge = (
    disputeId: bigint,
    resolutionId: bigint,
    marketId: bigint,
    disputeType: 0 | 1,
    challengedOutcome: `0x${string}`,
    reason: string,
  ) =>
    writeContractAsync({
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

  const vote = (disputeId: bigint, support: boolean) =>
    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'vote',
      args: [disputeId, support],
    })

  const finalizeResolution = (marketId: bigint) =>
    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'finalizeResolution',
      args: [marketId],
    })

  /* ======================================================
   * 工具函数
   * ====================================================== */

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

  return {
    // 常量
    challengeBondDecimals,
    // 状态
    currentAccount,
    isArbitrator,
    isProposer,
    isPlatformProposer,
    proposeBond,
    challengeBond,
    challengeWindow,
    arbitratorCount: Number(arbitratorCount),

    // 读
    getAllowance,
    getResolution,
    getDispute,
    getArbitration,
    getVote,
    checkHasVoted,

    // 写
    approveBond,
    createResolution,
    proposeOutcome,
    challenge,
    vote,
    finalizeResolution,

    // 交易状态
    transactionHash: hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    isWriteError,
    writeError,

    // utils
    outcomeToBytes32,
    bytes32ToOutcome,
  }
}