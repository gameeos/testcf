import { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ResolutionCard } from '@/components/resolution/resolution-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockResolutions } from '@/data/mock-data';
import type { ResolutionStatus } from '@/types';
import { FileSearch } from 'lucide-react';

type FilterStatus = 'all' | ResolutionStatus;

export function ResolutionsPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredResolutions =
    filter === 'all'
      ? mockResolutions
      : mockResolutions.filter((r) => r.status === filter);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">决议列表</h1>
          <p className="mt-1 text-muted-foreground">
            查看所有市场决议，在挑战窗口期内可对结果发起争议
          </p>
        </div>

        {/* 筛选器 */}
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as FilterStatus)}
        >
          <TabsList className="bg-card/50">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="Proposed">待挑战</TabsTrigger>
            <TabsTrigger value="Challenged">仲裁中</TabsTrigger>
            <TabsTrigger value="Resolved">已决议</TabsTrigger>
            <TabsTrigger value="Invalid">已作废</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 决议列表 */}
        {filteredResolutions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResolutions.map((resolution) => (
              <ResolutionCard key={resolution.id} resolution={resolution} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileSearch className="h-12 w-12" />}
            title="暂无决议"
            description="当前筛选条件下没有找到任何决议"
            action={
              <Button variant="outline" onClick={() => setFilter('all')}>
                查看全部
              </Button>
            }
          />
        )}
      </div>
    </PageLayout>
  );
}
