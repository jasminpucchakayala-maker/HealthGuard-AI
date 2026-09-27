import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { SidebarNav } from '../../components/layout/SidebarNav';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { logout, userRole, switchRole } = useAuth();
  const { accessibility, toggleAccessibility } = useHealth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-primary flex">
      {userRole === 'caregiver' && <SidebarNav />}

      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-12">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{t('settings.title')}</h2>
            <p className="text-secondary text-sm mt-1">{t('settings.general')}</p>
          </div>

          {/* Theme & Language Controls */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-lg text-primary border-b border-hairline pb-2">
              {t('settings.general')}
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-hairline">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('settings.theme')}</span>
                <span className="text-xs text-secondary">{t('settings.lightTheme')} / {t('settings.darkTheme')}</span>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('settings.language')}</span>
                <span className="text-xs text-secondary">{t('settings.selectLanguage')}</span>
              </div>
              <LanguageSelector />
            </div>
          </div>

          {/* Accessibility Mode (Section 31) */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-lg text-primary border-b border-hairline pb-2">
              {t('settings.fontScale')}
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-hairline">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('settings.fontScale')}</span>
                <span className="text-xs text-secondary">{t('settings.fontScale')}</span>
              </div>
              <input
                type="checkbox"
                checked={accessibility.largeText}
                onChange={() => toggleAccessibility('largeText')}
                className="w-5 h-5 accent-accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-hairline">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('settings.theme')}</span>
                <span className="text-xs text-secondary">{t('settings.theme')}</span>
              </div>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={() => toggleAccessibility('highContrast')}
                className="w-5 h-5 accent-accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('settings.notifications')}</span>
                <span className="text-xs text-secondary">{t('settings.notifications')}</span>
              </div>
              <input
                type="checkbox"
                checked={accessibility.reduceAnimation}
                onChange={() => toggleAccessibility('reduceAnimation')}
                className="w-5 h-5 accent-accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Legal Compliance Links (Section 0 Tells 26 & 27) */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-lg text-primary border-b border-hairline pb-2">
              {t('privacy.title')}
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-hairline">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('privacy.title')}</span>
                <span className="text-xs text-secondary">{t('privacy.section1Title')}</span>
              </div>
              <Link to="/privacy" className="text-xs text-accent-primary font-bold hover:underline">
                {t('common.details')} ↗
              </Link>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-semibold text-sm text-primary block">{t('terms.title')}</span>
                <span className="text-xs text-secondary">{t('terms.section1Title')}</span>
              </div>
              <Link to="/terms" className="text-xs text-accent-primary font-bold hover:underline">
                {t('common.details')} ↗
              </Link>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-lg text-primary border-b border-hairline pb-2">
              {t('auth.title')}
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button variant="secondary" size="md" fullWidth onClick={switchRole}>
                {t('auth.patientRole')} / {t('auth.caregiverRole')}
              </Button>
              <Button variant="danger" size="md" fullWidth onClick={logout}>
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </main>

        {userRole === 'patient' && <BottomNav />}
      </div>
    </div>
  );
};
