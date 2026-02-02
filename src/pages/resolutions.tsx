import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { ResolutionCard } from '@/components/resolution/resolution-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResolutions } from '@/data/use-resolutions';
import type { Resolution, ResolutionStatus } from '@/types';
import { FileSearch } from 'lucide-react';

type FilterStatus = 'all' | ResolutionStatus;

export function ResolutionsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || undefined;
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const [allResolutions, setAllResolutions] = useState<Resolution[]>([]);
  const pageSize = 6;

  // 状态映射到后端数字
  const statusMap: Record<ResolutionStatus, number> = {
    Unresolved: 0,
    Proposed: 1,
    Challenged: 2,
    Resolved: 3,
    Invalid: 4,
  };

  // 调用 RPC 获取数据
  const { data: resolutions, isLoading, error } = useResolutions(
    page,
    pageSize,
    filter === 'all' ? undefined : statusMap[filter],
    undefined,
    searchQuery
  );

  // 当页码为1时（初始加载或切换筛选），重置累积数据
  // 当页码大于1时，追加新数据
  useEffect(() => {
    if (page === 1) {
      setAllResolutions(resolutions || []);
    } else if (resolutions) {
      setAllResolutions((prev) => [...prev, ...resolutions]);
    }
  }, [resolutions, page]);

  const hasMore = resolutions?.length === pageSize;

  // 当筛选条件改变时，重置页码
  const handleFilterChange = (value: string) => {
    setPage(1);
    setFilter(value as FilterStatus);
  };

  // 当搜索关键词变化时，重置页码
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('resolutions.title')}</h1>
          <p className="mt-1 text-muted-foreground">
            {t('resolutions.subtitle')}
          </p>
        </div>

        {/* 筛选器 */}
        <Tabs
          value={filter}
          onValueChange={handleFilterChange}
        >
          <TabsList className="bg-card/50">
            <TabsTrigger value="all">{t('resolutions.filterAll')}</TabsTrigger>
            <TabsTrigger value="Proposed">{t('resolutions.filterProposed')}</TabsTrigger>
            <TabsTrigger value="Challenged">{t('resolutions.filterChallenged')}</TabsTrigger>
            <TabsTrigger value="Resolved">{t('resolutions.filterResolved')}</TabsTrigger>
            <TabsTrigger value="Invalid">{t('resolutions.filterInvalid')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 提案列表 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t('loading.loading')}</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive">{t('loading.error')} {(error as Error).message}</div>
          </div>
        ) : allResolutions.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allResolutions.map((resolution) => (
                <ResolutionCard key={resolution.id} resolution={resolution} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="ghost" onClick={handleLoadMore} disabled={isLoading}>
                  {isLoading ? t('loading.loading') : t('resolutions.loadMore')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<FileSearch className="h-12 w-12" />}
            title={t('resolutions.empty')}
            description={t('resolutions.emptyDesc')}
            action={
              <Button variant="outline" onClick={() => setFilter('all')}>
                {t('resolutions.viewAll')}
              </Button>
            }
          />
        )}
      </div>
    </PageLayout>
  );
}
