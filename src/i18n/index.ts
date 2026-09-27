import { en } from './translations/en';
import { te } from './translations/te';
import { hi } from './translations/hi';

export type Language = 'en' | 'te' | 'hi';

export const translations = {
  en,
  te,
  hi,
};

export type TranslationTree = typeof en;

/**
 * Retrieves a nested value from a translation object using dot notation (e.g. "dashboard.welcome")
 */
export function getTranslationByKey(
  lang: Language,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const currentDict = translations[lang] || translations.en;
  const fallbackDict = translations.en;

  const keys = keyPath.split('.');

  let value: any = currentDict;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  // Fallback to English dictionary if key not found in current language
  if (value === undefined || typeof value !== 'string') {
    let fallbackVal: any = fallbackDict;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    if (typeof fallbackVal === 'string') {
      value = fallbackVal;
    } else {
      // If missing in English too, return raw keyPath
      value = keyPath;
    }
  }

  // Dynamic parameter interpolation (e.g. {count} or {name})
  if (params && typeof value === 'string') {
    Object.entries(params).forEach(([pKey, pVal]) => {
      value = (value as string).replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    });
  }

  return value as string;
}

/**
 * Locale-aware date formatter
 */
export function formatDate(date: Date | string | number, lang: Language): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Locale-aware time formatter
 */
export function formatTime(date: Date | string | number, lang: Language): string {
  const d = typeof date === 'string' && !date.includes('T') ? new Date(`1970-01-01T${date}`) : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Locale-aware number formatter
 */
export function formatNumber(num: number, lang: Language): string {
  const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
}
