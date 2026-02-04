import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/page-layout';
import { DisputeCard } from '@/components/arbitration/dispute-card';
import { EmptyState } from '@/components/shared/empty-state';
import { AddressDisplay } from '@/components/shared/address-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gavel, Shield, CheckCircle, Clock } from 'lucide-react';
import { useOOA } from '@/lib/use-ooa';
import { useArbitration } from '@/data/use-arbitration';

type TabValue = 'pending' | 'completed' | 'my-votes';

export function ArbitrationDashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const { isArbitrator, currentAccount } = useOOA();
  const isUserArbitrator = isArbitrator;

  const { statistics, pendingArbitrations, completedArbitrations, myVotes } = useArbitration({
    address: currentAccount,
    activeTab,
    page,
    pageSize
  })

  const { data: stats } = statistics
  const { data: pendingData, isLoading: pendingLoading, error: pendingError } = pendingArbitrations
  const { data: completedData, isLoading: completedLoading, error: completedError } = completedArbitrations
  const { data: myVotesData, isLoading: myVotesLoading, error: myVotesError } = myVotes

  // 累积数据
  const [allData, setAllData] = useState<Record<TabValue, any[]>>({
    pending: [],
    completed: [],
    'my-votes': [],
  });

  // 根据当前 tab 获取对应数据
  const currentData = activeTab === 'pending' ? pendingData :
                      activeTab === 'completed' ? completedData :
                      myVotesData;

  const currentLoading = activeTab === 'pending' ? pendingLoading :
                        activeTab === 'completed' ? completedLoading :
                        myVotesLoading;

  const currentError = activeTab === 'pending' ? pendingError :
                      activeTab === 'completed' ? completedError :
                      myVotesError;

  const hasMore = currentData?.length === pageSize;

  // 当数据加载时更新累积数据
  useEffect(() => {
    if (!currentData || currentLoading) return;

    if (page === 1) {
      // 第一页：替换数据
      setAllData((prev) => ({
        ...prev,
        [activeTab]: currentData
      }));
    } else {
      // 后续页：追加数据
      setAllData((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], ...currentData]
      }));
    }
  }, [currentData, currentLoading, page, activeTab]);

  // 切换 tab 时重置页码
  const handleTabChange = (value: TabValue) => {
    setActiveTab(value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

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
            <AddressDisplay address={currentAccount!} chars={4} />
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
                  {stats?.pendingCount ?? 0}
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
                  {stats?.resolvedCount ?? 0}
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
                  {stats?.votedCount ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">{t('arbitrationDashboard.myVotes')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => handleTabChange(value as TabValue)}
        >
          <TabsList className="bg-card/50">
            <TabsTrigger value="pending" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t('arbitrationDashboard.pending')}
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
            {currentLoading && allData.pending.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">{t('loading.loading')}</div>
              </div>
            ) : currentError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">{t('loading.error')} {(currentError as Error).message}</div>
              </div>
            ) : allData.pending.length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {allData.pending.map((arb: any) => (
                    <DisputeCard key={arb.id} arbitration={arb} />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button variant="ghost" onClick={handleLoadMore} disabled={currentLoading}>
                      {currentLoading ? t('loading.loading') : t('loading.loadMore')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<Clock className="h-12 w-12" />}
                title={t('arbitrationDashboard.noPendingCases')}
                description={t('arbitrationDashboard.noPendingCasesDesc')}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {currentLoading && allData.completed.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">{t('loading.loading')}</div>
              </div>
            ) : currentError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">{t('loading.error')} {(currentError as Error).message}</div>
              </div>
            ) : allData.completed.length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {allData.completed.map((arb: any) => (
                    <DisputeCard key={arb.id} arbitration={arb} />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button variant="ghost" onClick={handleLoadMore} disabled={currentLoading}>
                      {currentLoading ? t('loading.loading') : t('loading.loadMore')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<CheckCircle className="h-12 w-12" />}
                title={t('arbitrationDashboard.noCompletedCases')}
                description={t('arbitrationDashboard.noCompletedCasesDesc')}
              />
            )}
          </TabsContent>

          <TabsContent value="my-votes" className="mt-6">
            {currentLoading && allData['my-votes'].length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">{t('loading.loading')}</div>
              </div>
            ) : currentError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">{t('loading.error')} {(currentError as Error).message}</div>
              </div>
            ) : allData['my-votes'].length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {allData['my-votes'].map((arb: any) => (
                    <DisputeCard key={arb.id} arbitration={arb} />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button variant="ghost" onClick={handleLoadMore} disabled={currentLoading}>
                      {currentLoading ? t('loading.loading') : t('loading.loadMore')}
                    </Button>
                  </div>
                )}
              </>
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
