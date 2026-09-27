import React from 'react';
import { Header } from '../../components/layout/Header';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-primary pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">{t('terms.title')}</h1>
            <p className="text-secondary text-sm mt-1">{t('terms.section1Title')}</p>
          </div>
          <Link to="/settings" className="text-xs text-accent-primary font-bold hover:underline">
            ← {t('common.back')}
          </Link>
        </div>

        <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4 text-sm text-secondary leading-relaxed">
          <div className="p-4 rounded-2xl bg-sunken border border-hairline text-primary font-semibold">
            🚨 <strong>Medical Disclaimer:</strong> {t('terms.section1Text')}
          </div>

          <h3 className="font-heading font-bold text-lg text-primary">{t('terms.section1Title')}</h3>
          <p>{t('terms.section1Text')}</p>
        </div>
      </main>
    </div>
  );
};
