import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-sunken rounded-xl border border-hairline ${className}`}
      title={t('header.switchLanguage')}
    >
      <button
        onClick={() => setLanguage('en')}
        aria-label="English Language"
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
          language === 'en' ? 'bg-surface text-accent-secondary shadow-xs' : 'text-secondary hover:text-primary'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('te')}
        aria-label="Telugu Language (తెలుగు)"
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
          language === 'te' ? 'bg-surface text-accent-secondary shadow-xs' : 'text-secondary hover:text-primary'
        }`}
      >
        తెలుగు
      </button>
      <button
        onClick={() => setLanguage('hi')}
        aria-label="Hindi Language (हिन्दी)"
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
          language === 'hi' ? 'bg-surface text-accent-secondary shadow-xs' : 'text-secondary hover:text-primary'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};
