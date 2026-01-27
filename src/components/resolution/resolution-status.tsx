import { Badge } from '@/components/ui/badge';
import type { Resolution, ResolutionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ResolutionStatusBadgeProps {
  status: ResolutionStatus;
  resolution?: Resolution;
  className?: string;
}

const statusConfig: Record<
  ResolutionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  Unresolved: { label: '待提案', variant: 'secondary' },
  Proposed: { label: '挑战期', variant: 'default' },
  Challenged: { label: '仲裁中', variant: 'outline' },
  Resolved: { label: '已生效', variant: 'secondary' },
  Invalid: { label: '已作废', variant: 'destructive' },
};

const statusColorClass: Record<ResolutionStatus, string> = {
  Unresolved: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  Proposed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Challenged: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  Resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  Invalid: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export function ResolutionStatusBadge({
  status,
  resolution,
  className,
}: ResolutionStatusBadgeProps) {
  const config = statusConfig[status];

  // 对于 Resolved 状态，区分"已生效"和"已仲裁"
  let label = config.label;
  if (status === 'Resolved' && resolution?.arbitration?.finalized) {
    label = '已仲裁';
  }

  return (
    <Badge
      variant={config.variant}
      className={cn(statusColorClass[status], className)}
    >
      {label}
    </Badge>
  );
}
