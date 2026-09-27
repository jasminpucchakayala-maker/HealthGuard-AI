import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BellIcon, MedicineIcon, SOSIcon, WaterIcon, CaregiverIcon, VoiceIcon } from './Icons';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useHealth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'medicine_reminder':
      case 'missed_medicine':
        return <MedicineIcon size={20} className="text-accent-secondary" />;
      case 'emergency_sos':
        return <SOSIcon size={20} className="text-status-danger" />;
      case 'water_reminder':
        return <WaterIcon size={20} className="text-accent-primary" />;
      case 'caregiver_connect':
        return <CaregiverIcon size={20} className="text-status-safe" />;
      case 'voice_message':
        return <VoiceIcon size={20} className="text-accent-secondary" />;
      default:
        return <BellIcon size={20} className="text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-hairline rounded-[24px] shadow-2xl z-50 p-4 text-primary"
      >
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <div className="flex items-center gap-2">
            <BellIcon size={20} className="text-accent-secondary" />
            <h4 className="font-heading font-bold text-base text-primary">{t('notifications.title')}</h4>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="text-accent-primary hover:underline font-medium cursor-pointer"
            >
              {t('notifications.markRead')}
            </button>
            <span className="text-muted">•</span>
            <button
              onClick={clearNotifications}
              className="text-secondary hover:underline cursor-pointer"
            >
              {t('notifications.clearAll')}
            </button>
            <span className="text-muted">•</span>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary font-bold cursor-pointer"
              aria-label={t('common.close')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto my-2 space-y-2 py-1">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-secondary text-sm">
              <p>{t('notifications.empty')}</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-2xl border border-hairline flex items-start gap-3 transition-colors cursor-pointer ${
                  n.read ? 'bg-surface opacity-75' : 'bg-sunken border-accent-primary/30 font-medium'
                }`}
              >
                <div className="p-2 rounded-xl bg-surface border border-hairline flex-shrink-0">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-primary truncate">{n.title}</h5>
                    <span className="text-[10px] text-muted flex-shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5 leading-snug">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
