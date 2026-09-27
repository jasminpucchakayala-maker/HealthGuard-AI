import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '../i18n';
import {
  getTranslationByKey,
  formatDate as i18nFormatDate,
  formatTime as i18nFormatTime,
  formatNumber as i18nFormatNumber,
} from '../i18n';

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number) => string;
  formatTime: (time: Date | string | number) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hg_language');
    if (saved === 'en' || saved === 'te' || saved === 'hi') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('hg_language', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return getTranslationByKey(language, key, params);
    },
    [language]
  );

  const formatDate = useCallback(
    (date: Date | string | number): string => {
      return i18nFormatDate(date, language);
    },
    [language]
  );

  const formatTime = useCallback(
    (time: Date | string | number): string => {
      return i18nFormatTime(time, language);
    },
    [language]
  );

  const formatNumber = useCallback(
    (num: number): string => {
      return i18nFormatNumber(num, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate, formatTime, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
