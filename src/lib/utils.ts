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

export const getLocalString = (txt: string, i18n: any) => {
  try {
    const obj = JSON.parse(txt)
    const keys = Object.keys(obj)
    if (keys.includes(i18n.language)) {
      return obj[i18n.language]
    } else {
      const defaultLang = i18n.language.startsWith("zh") ? "zh" : "en"
      let result = obj[defaultLang]
      if (!result || result === "" || result === null) {
        for (let key of keys) {
          result = obj[key]
          if (result !== "") return result
        }
        return ""
      }
      return result
    }
  } catch {
    return txt
  }
}