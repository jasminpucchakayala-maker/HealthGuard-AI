import React from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { VoiceAssistantWidget } from '../../components/patient/VoiceAssistantWidget';
import { SOSButton } from '../../components/patient/SOSButton';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceAssistantPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-primary pb-28 md:pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-heading font-bold text-primary">{t('assistant.title')}</h2>
          <p className="text-secondary text-sm mt-1">
            {t('assistant.subtitle')}
          </p>
        </div>

        <VoiceAssistantWidget isCompact={false} />
      </main>

      <SOSButton isFloating={true} />
      <BottomNav />
    </div>
  );
};
