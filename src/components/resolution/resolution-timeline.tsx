import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Resolution } from '@/types';
import { Check, Circle, Clock, XCircle } from 'lucide-react';

interface ResolutionTimelineProps {
  resolution: Resolution;
  className?: string;
}

type TimelineStep = {
  labelKey: string;
  status: 'completed' | 'current' | 'pending' | 'skipped';
  timestamp?: number;
};

function getTimelineSteps(resolution: Resolution): TimelineStep[] {
  const steps: TimelineStep[] = [];

  // 1. 提案
  steps.push({
    labelKey: 'timeline.proposal',
    status: 'completed',
    timestamp: resolution.proposeTime,
  });

  // 2. 挑战期
  const now = Date.now();
  const inChallengeWindow =
    resolution.status === 'Proposed' &&
    resolution.challengeDeadline > now;

  if (resolution.status === 'Proposed') {
    steps.push({
      labelKey: 'timeline.challengeWindow',
      status: inChallengeWindow ? 'current' : 'completed',
      timestamp: resolution.challengeDeadline,
    });
  } else if (resolution.dispute) {
    steps.push({
      labelKey: 'timeline.challengeWindow',
      status: 'completed',
      timestamp: resolution.challengeDeadline,
    });
  } else {
    steps.push({
      labelKey: 'timeline.challengeWindow',
      status: 'completed',
      timestamp: resolution.challengeDeadline,
    });
  }

  // 3. 仲裁申请（如有）
  if (resolution.dispute) {
    steps.push({
      labelKey: 'timeline.challengeFiled',
      status: 'completed',
      timestamp: resolution.dispute.disputeTime,
    });

    // 4. 仲裁
    if (resolution.arbitration) {
      const arbitrationFinalized = resolution.arbitration.finalized;
      steps.push({
        labelKey: 'timeline.arbitrationVoting',
        status: arbitrationFinalized ? 'completed' : 'current',
        timestamp: resolution.arbitration.startTime,
      });
    }
  }

  // 5. 最终结算
  if (resolution.status === 'Resolved') {
    steps.push({
      labelKey: resolution.arbitration?.finalized ? 'timeline.arbitrationComplete' : 'timeline.resolved',
      status: 'completed',
    });
  } else if (resolution.status === 'Invalid') {
    steps.push({
      labelKey: 'timeline.marketInvalid',
      status: 'completed',
    });
  } else if (resolution.status === 'Proposed' && !inChallengeWindow) {
    steps.push({
      labelKey: 'timeline.autoConfirm',
      status: 'pending',
    });
  } else if (!resolution.dispute) {
    steps.push({
      labelKey: 'timeline.awaitingConfirm',
      status: 'pending',
    });
  } else {
    steps.push({
      labelKey: 'timeline.awaitingRuling',
      status: 'pending',
    });
  }

  return steps;
}

function getStepIcon(status: TimelineStep['status']) {
  switch (status) {
    case 'completed':
      return <Check className="h-4 w-4" />;
    case 'current':
      return <Clock className="h-4 w-4" />;
    case 'pending':
      return <Circle className="h-4 w-4" />;
    case 'skipped':
      return <XCircle className="h-4 w-4" />;
  }
}

export function ResolutionTimeline({
  resolution,
  className,
}: ResolutionTimelineProps) {
  const { t, i18n } = useTranslation();
  const steps = getTimelineSteps(resolution);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    timestamp = Number(timestamp) > 1e12 ? timestamp : timestamp * 1000
    const locale = i18n.language === 'zh-TW' ? 'zh-TW' : 'en-US';
    return new Date(timestamp).toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2',
                  step.status === 'completed' &&
                  'border-emerald-500 bg-emerald-500/20 text-emerald-400',
                  step.status === 'current' &&
                  'border-blue-500 bg-blue-500/20 text-blue-400',
                  step.status === 'pending' &&
                  'border-muted-foreground/30 bg-muted/20 text-muted-foreground/50',
                  step.status === 'skipped' &&
                  'border-red-500/50 bg-red-500/10 text-red-400'
                )}
              >
                {getStepIcon(step.status)}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs',
                  step.status === 'completed' && 'text-emerald-400',
                  step.status === 'current' && 'text-blue-400',
                  step.status === 'pending' && 'text-muted-foreground/50',
                  step.status === 'skipped' && 'text-red-400'
                )}
              >
                {t(step.labelKey)}
              </span>
              {step.timestamp && (
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  {formatTimestamp(step.timestamp)}
                </span>
              )}
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1',
                  step.status === 'completed'
                    ? 'bg-emerald-500/50'
                    : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
