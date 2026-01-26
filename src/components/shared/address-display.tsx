import { cn } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  className?: string;
  chars?: number;
}

export function AddressDisplay({
  address,
  className,
  chars = 6,
}: AddressDisplayProps) {
  const truncated = `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;

  return (
    <span
      className={cn('font-mono text-sm text-muted-foreground', className)}
      title={address}
    >
      {truncated}
    </span>
  );
}
