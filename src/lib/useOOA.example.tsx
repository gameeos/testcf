/**
 * useOOA Hook 使用示例
 *
 * 这个文件展示了如何使用 useOOA hook 与 Optimistic Oracle Arbitration 合约交互
 */

import { useOOA } from '@/lib/use-ooa'

// ============================================
// 示例 1: 检查用户是否为仲裁委员
// ============================================
export function ArbitratorCheck() {
  const { isArbitrator, refetchIsArbitrator } = useOOA()

  return (
    <div>
      <p>是否为仲裁委员: {isArbitrator ? '是' : '否'}</p>
      <button onClick={() => refetchIsArbitrator()}>刷新</button>
    </div>
  )
}

// ============================================
// 示例 2: 挑战提案
// ============================================
export function ChallengeProposal() {
  const {
    challenge,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    outcomeToBytes32,
  } = useOOA()

  const handleChallenge = async () => {
    try {
      await challenge(
        1n, // disputeId
        1001n, // resolutionId
        1001n, // marketId
        0, // disputeType: 0 = Outcome, 1 = Rule
        outcomeToBytes32('NO'), // challengedOutcome
        '根据最新数据，实际结果应该是 NO' // reason
      )
    } catch (error) {
      console.error('挑战失败:', error)
    }
  }

  return (
    <div>
      <button
        onClick={handleChallenge}
        disabled={isWritePending || isConfirming}
      >
        {isWritePending ? '提交中...' : isConfirming ? '确认中...' : '发起挑战'}
      </button>

      {writeError && (
        <p className="text-red-500">
          错误: {writeError.message}
        </p>
      )}

      {isConfirmed && (
        <p className="text-green-500">
          挑战成功！
        </p>
      )}
    </div>
  )
}

// ============================================
// 示例 3: 获取合约参数
// ============================================
export function ContractParams() {
  const {
    proposeBond,
    challengeBond,
    challengeWindow,
  } = useOOA()

  return (
    <div>
      <p>提案 Bond: {proposeBond?.toString()} wei</p>
      <p>挑战 Bond: {challengeBond?.toString()} wei</p>
      <p>挑战窗口: {challengeWindow ? Number(challengeWindow) / 60 : 0} 分钟</p>
    </div>
  )
}

// ============================================
// 示例 4: 获取提案信息
// ============================================
export function ResolutionInfo() {
  const { getResolution } = useOOA()
  const resolutionQuery = getResolution(1001n)

  if (resolutionQuery.isLoading) return <div>加载中...</div>
  if (resolutionQuery.error) return <div>加载失败</div>

  const resolution = resolutionQuery.data

  if (!resolution) return null

  return (
    <div>
      <p>提案ID: {resolution.resolutionId.toString()}</p>
      <p>市场ID: {resolution.marketId.toString()}</p>
      <p>状态: {resolution.status} // 0=Unresolved, 1=Proposed, 2=Challenged, 3=Resolved, 4=Invalid</p>
    </div>
  )
}

// ============================================
// 示例 5: 仲裁投票
// ============================================
export function ArbitratorVote() {
  const { vote, isWritePending, isConfirming } = useOOA()

  const handleVote = async (support: boolean) => {
    try {
      await vote(1n, support) // disputeId, support (true=yes, false=no)
    } catch (error) {
      console.error('投票失败:', error)
    }
  }

  return (
    <div>
      <button
        onClick={() => handleVote(true)}
        disabled={isWritePending || isConfirming}
      >
        投赞成票 (YES)
      </button>
      <button
        onClick={() => handleVote(false)}
        disabled={isWritePending || isConfirming}
      >
        投反对票 (NO)
      </button>
    </div>
  )
}

// ============================================
// 示例 6: Outcome 类型转换
// ============================================
export function OutcomeConverter() {
  const { outcomeToBytes32, bytes32ToOutcome } = useOOA()

  const outcome1 = outcomeToBytes32('YES')
  const outcome2 = outcomeToBytes32('NO')

  console.log('YES -> bytes32:', outcome1)
  console.log('NO -> bytes32:', outcome2)

  const back1 = bytes32ToOutcome(outcome1)
  const back2 = bytes32ToOutcome(outcome2)

  return (
    <div>
      <p>YES -&gt; {outcome1} -&gt; {back1}</p>
      <p>NO -&gt; {outcome2} -&gt; {back2}</p>
    </div>
  )
}

// ============================================
// 示例 7: 完整的挑战流程
// ============================================
export function CompleteChallengeFlow() {
  const {
    challengeBond,
    challenge,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    outcomeToBytes32,
  } = useOOA()

  const handleSubmitChallenge = async (
    disputeId: bigint,
    resolutionId: bigint,
    marketId: bigint,
    disputeType: 'Outcome' | 'Rule',
    challengedOutcome: 'YES' | 'NO',
    reason: string
  ) => {
    try {
      await challenge(
        disputeId,
        resolutionId,
        marketId,
        disputeType === 'Outcome' ? 0 : 1,
        outcomeToBytes32(challengedOutcome),
        reason
      )
    } catch (error) {
      console.error('挑战提交失败:', error)
    }
  }

  return (
    <div>
      <p>所需挑战 Bond: {challengeBond?.toString()} wei</p>

      {/* Outcome Dispute 示例 */}
      <button
        onClick={() => handleSubmitChallenge(
          1n,
          1001n,
          1001n,
          'Outcome',
          'NO',
          '根据最新数据，实际结果应该是 NO'
        )}
        disabled={isWritePending || isConfirming}
      >
        发起 Outcome 挑战
      </button>

      {/* Rule Dispute 示例 */}
      <button
        onClick={() => handleSubmitChallenge(
          2n,
          1002n,
          1002n,
          'Rule',
          'NO',
          '市场规则存在争议，应判定为无效'
        )}
        disabled={isWritePending || isConfirming}
      >
        发起 Rule 挑战
      </button>

      {writeError && (
        <p className="text-red-500">
          错误: {writeError.message}
        </p>
      )}

      {isConfirmed && (
        <p className="text-green-500">
          挑战提交成功，等待确认...
        </p>
      )}
    </div>
  )
}
