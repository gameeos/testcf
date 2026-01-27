import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { Resolution, ResolutionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ResolutionStatusBadgeProps {
  status: ResolutionStatus;
  resolution?: Resolution;
  className?: string;
}

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
  const { t } = useTranslation();

  const statusLabelMap: Record<ResolutionStatus, string> = {
    Unresolved: t('status.unresolved'),
    Proposed: t('status.proposed'),
    Challenged: t('status.challenged'),
    Resolved: t('status.resolved'),
    Invalid: t('status.invalid'),
  };

  // 对于 Resolved 状态，区分"已生效"和"已仲裁"
  let label = statusLabelMap[status];
  if (status === 'Resolved' && resolution?.arbitration?.finalized) {
    label = t('status.arbitrated');
  }

  return (
    <Badge
      variant="outline"
      className={cn(statusColorClass[status], className)}
    >
      {label}
    </Badge>
  );
}
