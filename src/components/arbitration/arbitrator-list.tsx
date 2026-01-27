import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddressDisplay } from '@/components/shared/address-display';
import { mockArbitrators } from '@/data/mock-data';
import type { Arbitration } from '@/types';
import { Check, X, Clock } from 'lucide-react';

interface ArbitratorListProps {
  arbitration: Arbitration;
  className?: string;
}

export function ArbitratorList({ arbitration, className }: ArbitratorListProps) {
  const { votes, totalArbitrators } = arbitration;

  // 构建委员投票状态
  const arbitratorVotes = mockArbitrators.slice(0, totalArbitrators).map((arbitrator) => {
    const vote = votes.find((v) => v.arbitrator === arbitrator.address);
    return {
      ...arbitrator,
      vote,
    };
  });

  return (
    <div className={cn('space-y-2', className)}>
      {arbitratorVotes.map((arbitrator) => (
        <div
          key={arbitrator.address}
          className={cn(
            'flex items-center justify-between rounded-lg border px-3 py-2',
            arbitrator.vote?.support === true &&
              'border-emerald-500/30 bg-emerald-500/5',
            arbitrator.vote?.support === false &&
              'border-red-500/30 bg-red-500/5',
            arbitrator.vote === undefined &&
              'border-muted-foreground/20 bg-muted/10'
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {arbitrator.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-foreground">
                {arbitrator.name || '未知委员'}
              </div>
              <AddressDisplay
                address={arbitrator.address}
                chars={4}
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {arbitrator.vote ? (
              <>
                {arbitrator.vote.support ? (
                  <span className="flex items-center gap-1 text-sm text-emerald-400">
                    <Check className="h-4 w-4" />
                    支持
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-red-400">
                    <X className="h-4 w-4" />
                    反对
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                待投票
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
