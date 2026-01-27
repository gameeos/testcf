import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Check, X, AlertTriangle } from 'lucide-react';

interface VotePanelProps {
  hasVoted: boolean;
  userVote?: boolean;
  finalized: boolean;
  onVote: (support: boolean) => void;
}

export function VotePanel({
  hasVoted,
  userVote,
  finalized,
  onVote,
}: VotePanelProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingVote, setPendingVote] = useState<boolean | null>(null);

  const handleVoteClick = (support: boolean) => {
    setPendingVote(support);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingVote !== null) {
      onVote(pendingVote);
    }
    setShowConfirm(false);
    setPendingVote(null);
  };

  if (finalized) {
    return (
      <div className="rounded-lg border border-muted-foreground/20 bg-muted/10 p-4 text-center">
        <p className="text-muted-foreground">该案件已完成裁决</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div
        className={`rounded-lg border p-4 ${
          userVote
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {userVote ? (
            <>
              <Check className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-emerald-400">
                您已投票：支持争议方
              </span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-red-400" />
              <span className="font-medium text-red-400">
                您已投票：反对争议方
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          投票已提交，不可更改
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
          <div className="flex items-center gap-2 text-sm text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            <span>投票后不可更改，请谨慎决策</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleVoteClick(true)}
          >
            <Check className="h-5 w-5" />
            支持争议方
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="gap-2"
            onClick={() => handleVoteClick(false)}
          >
            <X className="h-5 w-5" />
            反对争议方
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>支持：认可争议方的主张，改判结果</p>
          <p>反对：驳回争议，维持原判</p>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={pendingVote ? '确认支持争议方' : '确认反对争议方'}
        description={
          pendingVote
            ? '您将投票支持争议方的主张。如果通过，将修改市场结果。此操作不可撤销，确定要继续吗？'
            : '您将投票反对争议方的主张。如果驳回，将维持原判。此操作不可撤销，确定要继续吗？'
        }
        confirmText="确认投票"
        onConfirm={handleConfirm}
        variant={pendingVote ? 'default' : 'destructive'}
      />
    </>
  );
}
