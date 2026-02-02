import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/page-layout';
import { ResolutionCard } from '@/components/resolution/resolution-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResolutions } from '@/lib/use-resolutions';
import type { ResolutionStatus } from '@/types';
import { FileSearch } from 'lucide-react';

type FilterStatus = 'all' | ResolutionStatus;

export function ResolutionsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterStatus>('all');

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
    1,
    100, // 获取更多数据
    filter === 'all' ? undefined : statusMap[filter]
  );

  const filteredResolutions = resolutions || [];

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
          onValueChange={(value) => setFilter(value as FilterStatus)}
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
        ) : filteredResolutions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResolutions.map((resolution) => (
              <ResolutionCard key={resolution.id} resolution={resolution} />
            ))}
          </div>
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
