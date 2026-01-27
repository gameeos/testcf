import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

interface BondWarningProps {
  amount: number;
}

export function BondWarning({ amount }: BondWarningProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-400" />
        <div className="space-y-2">
          <h4 className="font-medium text-orange-400">{t('bondWarning.title')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('bondWarning.description')} <span className="font-semibold text-foreground">{amount} USDT</span>
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="text-emerald-400">{t('bondWarning.win')}</span>: {t('bondWarning.winResult')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>
                <span className="text-red-400">{t('bondWarning.lose')}</span>: {t('bondWarning.loseResult')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
