import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { BellIcon, CaregiverIcon, SafeStatusIcon, WarnStatusIcon } from '../common/Icons';
import { NotificationPanel } from '../common/NotificationPanel';

export const Header: React.FC = () => {
  const { userRole, switchRole } = useAuth();
  const { patient, caregiver, notifications } = useHealth();
  const { t, formatDate } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isConnected = !!patient.caregiverId;

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? 'dashboard.greetingMorning'
      : hour < 17
      ? 'dashboard.greetingAfternoon'
      : 'dashboard.greetingEvening';

  const userName = userRole === 'patient' ? patient.name.split(' ')[0] : caregiver.name.split(' ')[0];

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-hairline px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Greeting & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent-secondary overflow-hidden bg-sunken flex-shrink-0">
            <img
              src={userRole === 'patient' ? patient.avatarUrl : caregiver.avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg md:text-xl text-primary leading-tight">
                {t(greetingKey, { name: userName })} 👋
              </h2>
            </div>
            <p className="text-xs text-secondary font-medium">{formatDate(new Date())}</p>
          </div>
        </div>

        {/* Center: Caregiver Connection Status Chip (Patient Mode) */}
        {userRole === 'patient' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sunken border border-hairline text-xs">
            <CaregiverIcon size={16} className="text-accent-primary" />
            <span className="text-secondary font-medium">{t('caregiver.primaryCaregiver')}:</span>
            {isConnected ? (
              <span className="flex items-center gap-1 font-semibold text-status-safe">
                <SafeStatusIcon size={14} /> {patient.caregiverName}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-status-warn">
                <WarnStatusIcon size={14} /> {t('caregiver.statusAttention')}
              </span>
            )}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <LanguageSelector className="hidden sm:inline-flex" />
          <ThemeToggle />

          {/* Role Switcher Demo Badge */}
          <button
            onClick={switchRole}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 hover:bg-accent-primary/20 transition-colors cursor-pointer"
            title={t('demo.quickRole')}
          >
            {userRole === 'patient' ? `${t('header.patientView')} 👤` : `${t('header.caregiverView')} 👨‍⚕️`}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2.5 rounded-full border border-hairline bg-surface text-primary hover:bg-sunken transition-colors relative flex items-center justify-center cursor-pointer"
              aria-label={t('header.notifications')}
              title={t('header.notifications')}
            >
              <BellIcon size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-surface">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={showNotifs} onClose={() => setShowNotifs(false)} />
          </div>
        </div>
      </div>
    </header>
  );
};
