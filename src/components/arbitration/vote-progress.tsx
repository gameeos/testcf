import { cn } from '@/lib/utils';
import type { Arbitration } from '@/types';

interface VoteProgressProps {
  arbitration: Arbitration;
  className?: string;
}

export function VoteProgress({ arbitration, className }: VoteProgressProps) {
  const { yesVotes, noVotes, totalArbitrators } = arbitration;
  const votedCount = yesVotes + noVotes;
  const pendingCount = totalArbitrators - votedCount;

  const yesPercentage = totalArbitrators > 0 ? (yesVotes / totalArbitrators) * 100 : 0;
  const noPercentage = totalArbitrators > 0 ? (noVotes / totalArbitrators) * 100 : 0;

  // 判断是否通过（2/3多数）
  const threshold = Math.ceil((totalArbitrators * 2) / 3);
  const passed = yesVotes >= threshold;
  const rejected = noVotes > totalArbitrators - threshold;

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
            <span className="text-emerald-400">支持 {yesVotes}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-red-400">反对 {noVotes}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="text-muted-foreground">待投 {pendingCount}</span>
          </span>
        </div>

        <span className="text-muted-foreground">
          通过需要 {threshold}/{totalArbitrators} 票
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
            ? '争议通过：结果已改判'
            : '争议驳回：维持原判'}
        </div>
      )}
    </div>
  );
}
