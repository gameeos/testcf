import { AlertTriangle } from 'lucide-react';

interface BondWarningProps {
  amount: number;
}

export function BondWarning({ amount }: BondWarningProps) {
  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-400" />
        <div className="space-y-2">
          <h4 className="font-medium text-orange-400">押金说明</h4>
          <p className="text-sm text-muted-foreground">
            发起争议需质押 <span className="font-semibold text-foreground">{amount} USDT</span>
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="text-emerald-400">胜诉</span>：押金全额退还
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>
                <span className="text-red-400">败诉</span>：押金没收至平台金库
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
