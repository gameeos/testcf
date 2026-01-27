import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/page-layout';
import { DisputeCard } from '@/components/arbitration/dispute-card';
import { EmptyState } from '@/components/shared/empty-state';
import { AddressDisplay } from '@/components/shared/address-display';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getPendingArbitrations,
  getCompletedArbitrations,
  currentUserAddress,
  isArbitrator,
  mockResolutions,
} from '@/data/mock-data';
import { Gavel, Shield, CheckCircle, Clock } from 'lucide-react';

type TabValue = 'pending' | 'completed' | 'my-votes';

export function ArbitrationDashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabValue>('pending');

  const pendingArbitrations = getPendingArbitrations();
  const completedArbitrations = getCompletedArbitrations();

  // 我的投票记录
  const myVotes = mockResolutions.filter((r) => {
    if (!r.arbitration) return false;
    return r.arbitration.votes.some((v) => v.arbitrator === currentUserAddress);
  });

  const isUserArbitrator = isArbitrator(currentUserAddress);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('arbitrationDashboard.title')}</h1>
            <p className="mt-1 text-muted-foreground">
              {t('arbitrationDashboard.subtitle')}
            </p>
          </div>

          {/* 委员身份 */}
          <div className="flex items-center gap-2">
            {isUserArbitrator ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-emerald-400"
              >
                <Shield className="h-3.5 w-3.5" />
                {t('arbitrationDashboard.arbitrator')}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1.5 border-orange-500/50 bg-orange-500/10 px-3 py-1.5 text-orange-400"
              >
                {t('arbitrationDashboard.notArbitrator')}
              </Badge>
            )}
            <AddressDisplay address={currentUserAddress} chars={4} />
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingArbitrations.length}
                </p>
                <p className="text-sm text-muted-foreground">{t('arbitrationDashboard.pending')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {completedArbitrations.length}
                </p>
                <p className="text-sm text-muted-foreground">{t('arbitrationDashboard.completed')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Gavel className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {myVotes.length}
                </p>
                <p className="text-sm text-muted-foreground">{t('arbitrationDashboard.myVotes')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          <TabsList className="bg-card/50">
            <TabsTrigger value="pending" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t('arbitrationDashboard.pending')}
              {pendingArbitrations.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {pendingArbitrations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('arbitrationDashboard.completed')}
            </TabsTrigger>
            <TabsTrigger value="my-votes" className="gap-1.5">
              <Gavel className="h-3.5 w-3.5" />
              {t('arbitrationDashboard.myVotes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingArbitrations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingArbitrations.map((resolution) => (
                  <DisputeCard key={resolution.id} resolution={resolution} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Clock className="h-12 w-12" />}
                title={t('arbitrationDashboard.noPendingCases')}
                description={t('arbitrationDashboard.noPendingCasesDesc')}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedArbitrations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedArbitrations.map((resolution) => (
                  <DisputeCard key={resolution.id} resolution={resolution} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle className="h-12 w-12" />}
                title={t('arbitrationDashboard.noCompletedCases')}
                description={t('arbitrationDashboard.noCompletedCasesDesc')}
              />
            )}
          </TabsContent>

          <TabsContent value="my-votes" className="mt-6">
            {myVotes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myVotes.map((resolution) => (
                  <DisputeCard key={resolution.id} resolution={resolution} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Gavel className="h-12 w-12" />}
                title={t('arbitrationDashboard.noVoteRecords')}
                description={t('arbitrationDashboard.noVoteRecordsDesc')}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
