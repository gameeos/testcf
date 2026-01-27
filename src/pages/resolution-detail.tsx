import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResolutionStatusBadge } from '@/components/resolution/resolution-status';
import { ResolutionTimeline } from '@/components/resolution/resolution-timeline';
import { CountdownTimer } from '@/components/resolution/countdown-timer';
import { VoteProgress } from '@/components/arbitration/vote-progress';
import { ArbitratorList } from '@/components/arbitration/arbitrator-list';
import { AddressDisplay } from '@/components/shared/address-display';
import { EmptyState } from '@/components/shared/empty-state';
import { getResolutionById } from '@/data/mock-data';
import {
  ArrowLeft,
  Clock,
  FileText,
  AlertTriangle,
  ExternalLink,
  FileIcon,
  Gavel,
} from 'lucide-react';

export function ResolutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const resolution = id ? getResolutionById(id) : undefined;

  if (!resolution) {
    return (
      <PageLayout>
        <EmptyState
          title={t('resolution.notFound')}
          description={t('resolution.notFoundDesc')}
          action={
            <Button variant="outline" onClick={() => navigate('/resolutions')}>
              {t('common.backToList')}
            </Button>
          }
        />
      </PageLayout>
    );
  }

  const isInChallengeWindow =
    resolution.status === 'Proposed' &&
    resolution.challengeDeadline > Date.now();

  const formatTime = (timestamp: number) => {
    const locale = i18n.language === 'zh-TW' ? 'zh-TW' : 'en-US';
    return new Date(timestamp).toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/resolutions')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                Resolution #{resolution.id}
              </h1>
              <ResolutionStatusBadge status={resolution.status} resolution={resolution} />
            </div>
            <p className="text-sm text-muted-foreground">
              Market ID: {resolution.marketId}
            </p>
          </div>
        </div>

        {/* 主要内容网格 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 市场信息 */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                {t('resolution.marketInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">
                  {resolution.market.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resolution.market.description}
                </p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('resolution.settlementRules')}</span>
                </div>
                <p className="text-foreground">{resolution.market.rules}</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('resolution.marketEndTime')}</span>
                  <span className="text-foreground">
                    {formatTime(resolution.market.endTime)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提案状态 */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gavel className="h-4 w-4" />
                {t('resolution.proposalStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('resolution.proposedOutcome')}</span>
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
                <span className="text-muted-foreground">{t('resolution.proposer')}</span>
                <AddressDisplay address={resolution.proposer} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('resolution.proposeTime')}</span>
                <span className="text-sm text-foreground">
                  {formatTime(resolution.proposeTime)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t('resolution.challengeDeadline')}
                </span>
                {isInChallengeWindow ? (
                  <CountdownTimer deadline={resolution.challengeDeadline} />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {formatTime(resolution.challengeDeadline)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('resolution.bondAmount')}</span>
                <span className="text-sm text-foreground">
                  {resolution.bondAmount} USDT
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 时间线 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">{t('resolution.processTimeline')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResolutionTimeline resolution={resolution} />
          </CardContent>
        </Card>

        {/* 操作区域 - 申请仲裁 */}
        {isInChallengeWindow && (
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-orange-400">
                <AlertTriangle className="h-4 w-4" />
                {t('resolution.applyArbitration')}
              </CardTitle>
              <CardDescription>
                {t('resolution.applyArbitrationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {t('resolution.remainingTime')}
                    <CountdownTimer
                      deadline={resolution.challengeDeadline}
                      className="ml-1"
                    />
                  </p>
                  <p className="text-muted-foreground">
                    {t('resolution.requiredBond')}<span className="text-foreground">500 USDT</span>
                  </p>
                </div>
                <Button asChild>
                  <Link to={`/challenge/new?resolutionId=${resolution.id}`}>
                    {t('resolution.applyArbitration')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 争议信息 */}
        {resolution.dispute && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                {t('dispute.info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('dispute.type')}</span>
                  <Badge variant="outline">
                    {resolution.dispute.disputeType === 'Outcome'
                      ? t('dispute.typeOutcome')
                      : t('dispute.typeRule')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('dispute.claimedOutcome')}</span>
                  <Badge
                    variant="outline"
                    className={
                      resolution.dispute.challengedOutcome === 'YES'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-red-500/50 bg-red-500/10 text-red-400'
                    }
                  >
                    {resolution.dispute.challengedOutcome}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('dispute.challenger')}</span>
                  <AddressDisplay address={resolution.dispute.challenger} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('dispute.disputeTime')}</span>
                  <span className="text-sm text-foreground">
                    {formatTime(resolution.dispute.disputeTime)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">{t('dispute.reason')}</span>
                <p className="rounded-lg bg-muted/20 p-3 text-sm text-foreground">
                  {resolution.dispute.reason}
                </p>
              </div>

              {(resolution.dispute.evidenceUrls.length > 0 ||
                resolution.dispute.evidenceFiles.length > 0) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">
                      {t('dispute.evidence')}
                    </span>
                    <div className="space-y-1">
                      {resolution.dispute.evidenceUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {url}
                        </a>
                      ))}
                      {resolution.dispute.evidenceFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <FileIcon className="h-3.5 w-3.5" />
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {resolution.dispute.txHash && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('txHash')}</span>
                    <code className="font-mono text-foreground">
                      {resolution.dispute.txHash}
                    </code>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* 仲裁进度 */}
        {resolution.arbitration && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gavel className="h-4 w-4" />
                {t('arbitration.voting')}
              </CardTitle>
              <CardDescription>
                {t('arbitration.votingDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VoteProgress arbitration={resolution.arbitration} />
              <Separator />
              <ArbitratorList arbitration={resolution.arbitration} />
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
