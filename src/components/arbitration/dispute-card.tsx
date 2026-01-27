import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddressDisplay } from '@/components/shared/address-display';
import type { Resolution } from '@/types';
import { ArrowRight, Clock, Gavel } from 'lucide-react';

interface DisputeCardProps {
  resolution: Resolution;
}

export function DisputeCard({ resolution }: DisputeCardProps) {
  if (!resolution.dispute || !resolution.arbitration) {
    return null;
  }

  const { dispute, arbitration } = resolution;
  const votedCount = arbitration.yesVotes + arbitration.noVotes;
  const pendingCount = arbitration.totalArbitrators - votedCount;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="flex flex-col bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={
              arbitration.finalized
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
            }
          >
            {arbitration.finalized ? '已完成' : '待投票'}
          </Badge>
          <Badge variant="outline">
            {dispute.disputeType === 'Outcome' ? '结果仲裁' : '规则仲裁'}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dispute #{dispute.id}</span>
            <span>|</span>
            <span>Resolution #{resolution.id}</span>
          </div>
          <h3 className="line-clamp-2 font-medium leading-tight text-foreground">
            {resolution.market.title}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">争议方</span>
            <AddressDisplay address={dispute.challenger} chars={4} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">原提案</span>
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
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">主张结果</span>
            <Badge
              variant="outline"
              className={
                dispute.challengedOutcome === 'YES'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/50 bg-red-500/10 text-red-400'
              }
            >
              {dispute.challengedOutcome}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              提交时间
            </span>
            <span className="text-foreground">
              {formatTime(dispute.disputeTime)}
            </span>
          </div>
        </div>

        {/* 投票进度 */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Gavel className="h-3.5 w-3.5" />
              投票进度
            </span>
            <span className="text-foreground">
              {votedCount}/{arbitration.totalArbitrators}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-400">{arbitration.yesVotes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-400">{arbitration.noVotes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">{pendingCount}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/arbitration/${dispute.id}`}>
            查看详情
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
