import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CaregiverIcon, SOSIcon, VoiceIcon, SettingsIcon, CalendarIcon, HeartIcon } from '../common/Icons';

export const SidebarNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/caregiver', labelKey: 'nav.dashboard', icon: HeartIcon },
    { to: '/caregiver/patients', labelKey: 'nav.patients', icon: CaregiverIcon },
    { to: '/caregiver/alerts', labelKey: 'nav.alerts', icon: SOSIcon },
    { to: '/caregiver/messages', labelKey: 'nav.messages', icon: VoiceIcon },
    { to: '/caregiver/analytics', labelKey: 'nav.analytics', icon: CalendarIcon },
    { to: '/settings', labelKey: 'nav.settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-hairline flex flex-col justify-between min-h-screen p-5 hidden md:flex flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold text-xl">
            🛡️
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-primary leading-tight">{t('common.appName')}</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded-full">
              {t('header.caregiverView')}
            </span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/caregiver'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-accent-primary text-white font-semibold shadow-xs'
                      : 'text-secondary hover:bg-sunken hover:text-primary'
                  }`
                }
              >
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 rounded-2xl bg-sunken border border-hairline text-xs text-secondary">
        <p className="font-semibold text-primary mb-1">{t('common.appName')} Support</p>
        <p>{t('privacy.section1Text')}</p>
      </div>
    </aside>
  );
};
