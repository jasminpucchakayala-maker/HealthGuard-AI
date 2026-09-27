import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  const { permissions, togglePermission } = useHealth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-primary pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">{t('privacy.title')}</h1>
            <p className="text-secondary text-sm mt-1">{t('privacy.section1Title')}</p>
          </div>
          <Link to="/settings" className="text-xs text-accent-primary font-bold hover:underline">
            ← {t('common.back')}
          </Link>
        </div>

        {/* Live Device Permissions Controls (Tell 27) */}
        <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4">
          <h2 className="font-heading font-bold text-xl text-primary border-b border-hairline pb-2">
            {t('privacy.title')}
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <div>
              <span className="font-semibold text-sm text-primary block">{t('sos.locationShared')}</span>
              <span className="text-xs text-secondary">{t('sos.alertDescription')}</span>
            </div>
            <input
              type="checkbox"
              checked={permissions.location}
              onChange={() => togglePermission('location')}
              className="w-5 h-5 accent-accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <div>
              <span className="font-semibold text-sm text-primary block">{t('assistant.title')}</span>
              <span className="text-xs text-secondary">{t('assistant.subtitle')}</span>
            </div>
            <input
              type="checkbox"
              checked={permissions.voice}
              onChange={() => togglePermission('voice')}
              className="w-5 h-5 accent-accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <div>
              <span className="font-semibold text-sm text-primary block">{t('settings.notifications')}</span>
              <span className="text-xs text-secondary">{t('settings.notifications')}</span>
            </div>
            <input
              type="checkbox"
              checked={permissions.notifications}
              onChange={() => togglePermission('notifications')}
              className="w-5 h-5 accent-accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-semibold text-sm text-primary block">{t('analytics.title')}</span>
              <span className="text-xs text-secondary">{t('analytics.title')}</span>
            </div>
            <input
              type="checkbox"
              checked={permissions.analyticsData}
              onChange={() => togglePermission('analyticsData')}
              className="w-5 h-5 accent-accent-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy Policy Text */}
        <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4 text-sm text-secondary leading-relaxed">
          <h3 className="font-heading font-bold text-lg text-primary">{t('privacy.title')}</h3>
          <p>{t('privacy.section1Text')}</p>
          <h4 className="font-bold text-primary">{t('privacy.section2Title')}</h4>
          <p>{t('privacy.section2Text')}</p>
        </div>
      </main>
    </div>
  );
};
