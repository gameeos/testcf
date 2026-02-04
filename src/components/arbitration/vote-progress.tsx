import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Arbitration } from '@/types';
import { useOOA } from '@/lib/use-ooa';

interface VoteProgressProps {
  arbitration: Arbitration;
  className?: string;
}

export function VoteProgress({ arbitration, className }: VoteProgressProps) {
  const { t } = useTranslation();
  let { arbitratorCount: totalArbitrators } = useOOA();
  if (totalArbitrators === 0) {
    totalArbitrators = 3;
  }
  const { yesVotes, noVotes } = arbitration;  // yes表示支持原提议，no表示支持挑战者提议
  const votedCount = yesVotes + noVotes;
  const pendingCount = totalArbitrators - votedCount;

  const yesPercentage = totalArbitrators > 0 ? (noVotes / totalArbitrators) * 100 : 0; // 支持挑战者
  const noPercentage = totalArbitrators > 0 ? (yesVotes / totalArbitrators) * 100 : 0;   // 反对挑战者

  // 判断是否通过
  // 委员数量 < 3：必须全票通过
  // 委员数量 ≥ 3：需 ≥ 2/3 赞成票
  const isUnanimousRequired = totalArbitrators < 3;
  const threshold = isUnanimousRequired
    ? totalArbitrators
    : Math.ceil((totalArbitrators * 2) / 3);
  const passed = noVotes >= threshold;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 进度条 */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted/30">
        <div className="flex h-full">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${yesPercentage}%` }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${noPercentage}%` }}
          />
        </div>
      </div>

      {/* 统计 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">{t('voteProgress.support')} {noVotes}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-red-400">{t('voteProgress.oppose')} {yesVotes}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="text-muted-foreground">{t('voteProgress.pending')} {pendingCount}</span>
          </span>
        </div>

        <span className="text-muted-foreground">
          {t('voteProgress.passRequired')} {threshold}/{totalArbitrators}
          {isUnanimousRequired ? ` (${t('voteProgress.unanimous')})` : ` (${t('voteProgress.twoThirds')})`}
        </span>
      </div>

      {/* 结果提示 */}
      {arbitration.finalized && (
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-sm',
            passed
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          )}
        >
          {passed
            ? t('voteProgress.disputePassed')
            : t('voteProgress.disputeRejected')}
        </div>
      )}
    </div>
  );
}
