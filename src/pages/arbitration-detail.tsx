import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { VoteProgress } from '@/components/arbitration/vote-progress';
import { VotePanel } from '@/components/arbitration/vote-panel';
import { ArbitratorList } from '@/components/arbitration/arbitrator-list';
import { AddressDisplay } from '@/components/shared/address-display';
import { EmptyState } from '@/components/shared/empty-state';
import {
  getResolutionByDisputeId,
  currentUserAddress,
  isArbitrator,
  hasVoted,
} from '@/data/mock-data';
import {
  ArrowLeft,
  FileText,
  Gavel,
  ExternalLink,
  FileIcon,
  Info,
  Scale,
} from 'lucide-react';

export function ArbitrationDetailPage() {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const resolution = disputeId
    ? getResolutionByDisputeId(disputeId)
    : undefined;

  const [voted, setVoted] = useState(false);
  const [userVoteResult, setUserVoteResult] = useState<boolean | undefined>(
    undefined
  );

  // 检查用户投票状态
  const existingVote = disputeId
    ? hasVoted(disputeId, currentUserAddress)
    : undefined;
  const userHasVoted = voted || !!existingVote;
  const userVote = userVoteResult ?? existingVote?.support;

  const isUserArbitrator = isArbitrator(currentUserAddress);

  const handleVote = (support: boolean) => {
    // 模拟投票
    setVoted(true);
    setUserVoteResult(support);
  };

  if (!resolution || !resolution.dispute || !resolution.arbitration) {
    return (
      <PageLayout>
        <EmptyState
          title={t('arbitration.caseNotFound')}
          description={t('arbitration.caseNotFoundDesc')}
          action={
            <Button variant="outline" onClick={() => navigate('/arbitration')}>
              {t('common.backToList')}
            </Button>
          }
        />
      </PageLayout>
    );
  }

  const { dispute, arbitration } = resolution;
  const isUnanimousRequired = arbitration.totalArbitrators < 3;
  const threshold = isUnanimousRequired
    ? arbitration.totalArbitrators
    : Math.ceil((arbitration.totalArbitrators * 2) / 3);

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
            onClick={() => navigate('/arbitration')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                Dispute #{dispute.id}
              </h1>
              <Badge
                variant="outline"
                className={
                  arbitration.finalized
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                }
              >
                {arbitration.finalized ? t('arbitration.finished') : t('arbitration.inProgress')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Resolution #{resolution.id} | Market #{resolution.marketId}
            </p>
          </div>
        </div>

        {/* 双方主张对比 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* 原始提案 */}
          <Card className="border-muted-foreground/30 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                {t('arbitration.originalProposal')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('arbitration.proposalResult')}</span>
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
                <span className="text-sm text-muted-foreground">{t('resolution.proposer')}</span>
                <AddressDisplay address={resolution.proposer} chars={4} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('resolution.proposeTime')}</span>
                <span className="text-sm text-foreground">
                  {formatTime(resolution.proposeTime)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 争议方主张 */}
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-orange-400">
                <Scale className="h-4 w-4" />
                {t('arbitration.challengerClaim')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('arbitration.claimedResult')}</span>
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
                <span className="text-sm text-muted-foreground">{t('dispute.challenger')}</span>
                <AddressDisplay address={dispute.challenger} chars={4} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('dispute.disputeTime')}</span>
                <span className="text-sm text-foreground">
                  {formatTime(dispute.disputeTime)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 市场信息 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">{t('resolution.marketInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-medium text-foreground">
              {resolution.market.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {resolution.market.description}
            </p>
            <Separator />
            <div>
              <span className="text-sm text-muted-foreground">{t('resolution.settlementRules')}</span>
              <p className="mt-1 text-sm text-foreground">
                {resolution.market.rules}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 争议理由和证据 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">{t('arbitration.disputeReason')}</CardTitle>
            <CardDescription>
              {t('arbitration.disputeTypeLabel')}
              {dispute.disputeType === 'Outcome' ? t('dispute.typeOutcome') : t('dispute.typeRule')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/20 p-4">
              <p className="text-foreground">{dispute.reason}</p>
            </div>

            {(dispute.evidenceUrls.length > 0 ||
              dispute.evidenceFiles.length > 0) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    {t('dispute.evidence')}
                  </span>
                  <div className="space-y-2">
                    {dispute.evidenceUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 px-3 py-2 text-sm text-blue-400 transition-colors hover:bg-muted/20"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                    {dispute.evidenceFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 px-3 py-2 text-sm text-foreground"
                      >
                        <FileIcon className="h-4 w-4 shrink-0" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {dispute.txHash && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('txHash')}
                  </span>
                  <code className="rounded bg-muted/20 px-2 py-1 font-mono text-sm text-foreground">
                    {dispute.txHash}
                  </code>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 投票规则 */}
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-blue-400">
              <Info className="h-4 w-4" />
              {t('arbitration.votingRules')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('arbitration.currentArbitrators')}</span>
                <span className="ml-1 font-medium text-foreground">
                  {arbitration.totalArbitrators}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('arbitration.requiredToPass')}</span>
                <span className="ml-1 font-medium text-foreground">
                  {threshold}/{arbitration.totalArbitrators} {t('arbitration.votes')} (
                  {isUnanimousRequired ? t('arbitration.unanimousRequired') : t('arbitration.majority')})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('arbitration.ifNotMet')}</span>
                <span className="ml-1 font-medium text-foreground">
                  {t('arbitration.maintainOriginal')}
                </span>
              </div>
            </div>
            {isUnanimousRequired && (
              <p className="mt-3 text-xs text-amber-400">
                {t('arbitration.unanimousNote')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 投票进度 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gavel className="h-4 w-4" />
              {t('arbitration.voteStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <VoteProgress arbitration={arbitration} />
            <Separator />
            <ArbitratorList arbitration={arbitration} />
          </CardContent>
        </Card>

        {/* 投票面板（仅委员可见） */}
        {isUserArbitrator && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">{t('arbitration.myVote')}</CardTitle>
              <CardDescription>
                {t('arbitration.myVoteDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VotePanel
                hasVoted={userHasVoted}
                userVote={userVote}
                finalized={arbitration.finalized}
                onVote={handleVote}
              />
            </CardContent>
          </Card>
        )}

        {/* 非委员提示 */}
        {!isUserArbitrator && (
          <Card className="border-muted-foreground/20 bg-muted/10">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">
                {t('arbitration.notArbitrator')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
