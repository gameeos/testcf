import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddressDisplay } from '@/components/shared/address-display';
import { mockArbitrators } from '@/data/mock-data';
import type { Arbitration } from '@/types';
import { Check, X, Clock } from 'lucide-react';
import { useOOA } from '@/lib/use-ooa';

interface ArbitratorListProps {
  arbitration: Arbitration;
  className?: string;
}

export function ArbitratorList({ arbitration, className }: ArbitratorListProps) {
  const { t } = useTranslation();
  const { votes } = arbitration;
  let { arbitratorCount: totalArbitrators } = useOOA();
  if (totalArbitrators === 0) {
    totalArbitrators = 3;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {votes.map((vote) => (
        <div
          key={vote.arbitrator}
          className={cn(
            'flex items-center justify-between rounded-lg border px-3 py-2',
            vote.support === true &&
            'border-emerald-500/30 bg-emerald-500/5',
            vote.support === false &&
            'border-red-500/30 bg-red-500/5',
            vote === undefined &&
            'border-muted-foreground/20 bg-muted/10'
          )}
        >
          <div className="flex items-center gap-3">
            {/* <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {arbitrator.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar> */}
            <div>
              <div className="text-sm font-medium text-foreground">
                {vote.arbitrator || t('arbitratorList.unknownMember')}
              </div>
              {/* <AddressDisplay
                address={arbitrator.address}
                chars={4}
                className="text-xs"
              /> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {vote ? (
              <>
                {vote.support ? (
                  <span className="flex items-center gap-1 text-sm text-emerald-400">
                    <Check className="h-4 w-4" />
                    {t('arbitratorList.support')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-red-400">
                    <X className="h-4 w-4" />
                    {t('arbitratorList.oppose')}
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {t('arbitratorList.pendingVote')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
