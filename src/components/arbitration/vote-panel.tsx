import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <p className="text-muted-foreground">{t('votePanel.caseFinished')}</p>
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
                {t('votePanel.votedSupport')}
              </span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-red-400" />
              <span className="font-medium text-red-400">
                {t('votePanel.votedOppose')}
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t('votePanel.voteSubmitted')}
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
            <span>{t('votePanel.voteWarning')}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleVoteClick(true)}
          >
            <Check className="h-5 w-5" />
            {t('votePanel.supportChallenger')}
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="gap-2"
            onClick={() => handleVoteClick(false)}
          >
            <X className="h-5 w-5" />
            {t('votePanel.opposeChallenger')}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>{t('votePanel.supportDesc')}</p>
          <p>{t('votePanel.opposeDesc')}</p>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={pendingVote ? t('votePanel.confirmSupport') : t('votePanel.confirmOppose')}
        description={
          pendingVote
            ? t('votePanel.confirmSupportDesc')
            : t('votePanel.confirmOpposeDesc')
        }
        confirmText={t('votePanel.confirmVote')}
        onConfirm={handleConfirm}
        variant={pendingVote ? 'default' : 'destructive'}
      />
    </>
  );
}
