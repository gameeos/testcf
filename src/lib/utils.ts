import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBondAmount = (amount: number, i18n: any) => {
  const formatted = formatUnits(BigInt(amount), 6); // USDT 通常有 6 位小数
  return `${Number(formatted).toLocaleString(i18n.language === 'zh-TW' ? 'zh-TW' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} USDT`;
};
