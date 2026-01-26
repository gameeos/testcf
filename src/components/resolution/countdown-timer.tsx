import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: number;
  className?: string;
  onExpire?: () => void;
}

export function CountdownTimer({
  deadline,
  className,
  onExpire,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = deadline - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  if (timeLeft <= 0) {
    return (
      <span className={cn('text-muted-foreground', className)}>已结束</span>
    );
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // 颜色逻辑
  const colorClass =
    hours >= 1
      ? 'text-emerald-500'
      : minutes >= 10
        ? 'text-yellow-500'
        : 'text-red-500';

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <span className={cn('font-mono font-medium', colorClass, className)}>
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
    </span>
  );
}
