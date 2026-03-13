import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResolutionStatusBadge } from './resolution-status';
import { CountdownTimer } from './countdown-timer';
import { AddressDisplay } from '@/components/shared/address-display';
import type { Resolution } from '@/types';
import { ArrowRight, Clock } from 'lucide-react';
import { getLocalString } from '@/lib/utils';

interface ResolutionCardProps {
  resolution: Resolution;
}

export function ResolutionCard({ resolution }: ResolutionCardProps) {
  const { t, i18n } = useTranslation();
  const isInChallengeWindow =
    resolution.status === 'Proposed' &&
    resolution.challengeDeadline > Date.now();

  return (
    <Card className="flex flex-col bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <ResolutionStatusBadge status={resolution.status} resolution={resolution} />
          {resolution.proposedOutcome != "" ?
            (
              <Badge
                variant="outline"
                className={
                  resolution.proposedOutcome === 'YES'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/50 bg-red-500/10 text-red-400'
                }
              >
                {resolution.proposedOutcome}
              </Badge>
            )
            : ""
          }
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground">
          {getLocalString(resolution.market.title, i18n)}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {getLocalString(resolution.market.description, i18n)}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('resolutionCard.proposer')}</span>
            <AddressDisplay address={resolution.proposer} chars={4} />
          </div>

          {isInChallengeWindow && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {t('resolutionCard.challengeDeadline')}
              </span>
              <CountdownTimer deadline={resolution.challengeDeadline} />
            </div>
          )}

          {resolution.status === 'Challenged' && resolution.dispute && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('resolutionCard.challenger')}</span>
              <AddressDisplay address={resolution.dispute.challenger} chars={4} />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/resolution/${resolution.hashId}`}>
            {t('resolutionCard.viewDetails')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
