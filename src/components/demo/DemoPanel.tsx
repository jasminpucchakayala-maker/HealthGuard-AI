import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const DemoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFallModal, setShowFallModal] = useState(false);
  const [fallCountdown, setFallCountdown] = useState(10);
  const {
    todayLogs,
    markMedicineTaken,
    skipMedicineDose,
    triggerSOS,
    sendCaregiverTextReply,
    updatePatientProfile,
    isOffline,
    toggleOfflineState,
    resetDemoData,
    setActiveReminder,
  } = useHealth();
  const { switchRole } = useAuth();
  const { t } = useLanguage();

  const handleSimulateFall = () => {
    setShowFallModal(true);
    setFallCountdown(10);
    const interval = setInterval(() => {
      setFallCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowFallModal(false);
          triggerSOS('fall_detection');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTriggerReminder = () => {
    const pending = todayLogs.find((l) => l.status === 'pending') || todayLogs[0];
    if (pending) setActiveReminder(pending);
  };

  const handleChangeLocation = (locName: string, lat: number, lng: number) => {
    updatePatientProfile({
      location: {
        latitude: lat,
        longitude: lng,
        address: `${locName}, India`,
        lastUpdated: 'Just now',
        isSharing: true,
      },
    });
  };

  return (
    <>
      {/* Demo Floating Toggle Button */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-full bg-accent-secondary text-white font-bold text-xs shadow-lg hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡ {t('demo.title')}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            {isOpen ? t('common.close') : t('common.edit')}
          </span>
        </button>
      </div>

      {/* Demo Controls Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-32 right-4 z-40 w-80 bg-surface border border-hairline rounded-[24px] shadow-2xl p-4 text-xs text-primary space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <span className="font-heading font-bold text-sm text-primary">{t('demo.title')}</span>
              <span className="px-2 py-0.5 rounded-full bg-sunken text-secondary text-[10px]">{t('common.active')}</span>
            </div>

            <p className="text-secondary leading-tight">
              {t('demo.subtitle')}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTriggerReminder}
                className="p-2 rounded-xl bg-sunken hover:bg-surface border border-hairline font-semibold text-primary text-left cursor-pointer"
              >
                ⏰ {t('medicine.nextDose')}
              </button>
              <button
                onClick={() => {
                  const pending = todayLogs.find((l) => l.status === 'pending') || todayLogs[0];
                  if (pending) markMedicineTaken(pending.id);
                }}
                className="p-2 rounded-xl bg-sunken hover:bg-surface border border-hairline font-semibold text-primary text-left cursor-pointer"
              >
                ✅ {t('medicine.takeMedicine')}
              </button>
              <button
                onClick={() => {
                  const pending = todayLogs.find((l) => l.status === 'pending') || todayLogs[0];
                  if (pending) skipMedicineDose(pending.id, 'Simulated missed dose');
                }}
                className="p-2 rounded-xl bg-sunken hover:bg-surface border border-hairline font-semibold text-primary text-left text-status-warn cursor-pointer"
              >
                ⚠️ {t('demo.simulateMissed')}
              </button>
              <button
                onClick={() => triggerSOS('sos_button')}
                className="p-2 rounded-xl bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/30 font-semibold text-status-danger text-left cursor-pointer"
              >
                🚨 {t('demo.simulateSos')}
              </button>
              <button
                onClick={handleSimulateFall}
                className="p-2 rounded-xl bg-sunken hover:bg-surface border border-hairline font-semibold text-primary text-left cursor-pointer"
              >
                🤸 Fall Detect
              </button>
              <button
                onClick={() => sendCaregiverTextReply('Amma, please take your afternoon tablet!')}
                className="p-2 rounded-xl bg-sunken hover:bg-surface border border-hairline font-semibold text-primary text-left cursor-pointer"
              >
                💬 Caregiver Msg
              </button>
              <button
                onClick={toggleOfflineState}
                className={`p-2 rounded-xl border font-semibold text-left cursor-pointer ${
                  isOffline ? 'bg-status-warn/10 border-status-warn text-status-warn' : 'bg-sunken border-hairline text-primary'
                }`}
              >
                {isOffline ? '🟢 Online' : '🟠 Offline'}
              </button>
              <button
                onClick={switchRole}
                className="p-2 rounded-xl bg-accent-primary/10 border border-accent-primary/30 font-semibold text-accent-primary text-left cursor-pointer"
              >
                🔄 {t('demo.quickRole')}
              </button>
            </div>

            {/* Location selector */}
            <div>
              <label className="block text-secondary font-medium mb-1">{t('sos.locationShared')}:</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => handleChangeLocation('Banjara Hills, Hyderabad', 17.385, 78.4867)}
                  className="p-1 rounded-lg bg-sunken border border-hairline text-[10px] font-semibold text-primary cursor-pointer"
                >
                  Hyderabad
                </button>
                <button
                  onClick={() => handleChangeLocation('Indiranagar, Bengaluru', 12.9716, 77.5946)}
                  className="p-1 rounded-lg bg-sunken border border-hairline text-[10px] font-semibold text-primary cursor-pointer"
                >
                  Bengaluru
                </button>
                <button
                  onClick={() => handleChangeLocation('Connaught Place, New Delhi', 28.6139, 77.209)}
                  className="p-1 rounded-lg bg-sunken border border-hairline text-[10px] font-semibold text-primary cursor-pointer"
                >
                  Delhi
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-hairline flex justify-end">
              <button
                onClick={resetDemoData}
                className="text-status-danger hover:underline font-semibold text-[11px] cursor-pointer"
              >
                {t('demo.resetData')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fall Detection Simulation Modal */}
      <AnimatePresence>
        {showFallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 w-full max-w-md bg-surface border-2 border-status-danger rounded-[28px] p-6 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-status-danger/20 text-status-danger flex items-center justify-center mx-auto mb-3 animate-pulse">
                🤸
              </div>
              <span className="px-3 py-1 rounded-full bg-status-warn/20 text-status-warn font-bold text-xs uppercase tracking-wider">
                {t('sos.title')}
              </span>
              <h3 className="text-2xl font-heading font-bold text-primary mt-2">
                {t('sos.statusTriggered')}
              </h3>
              <p className="text-secondary text-sm my-3">
                {t('sos.pressToTrigger')}
              </p>

              <div className="w-20 h-20 rounded-full border-4 border-status-danger text-status-danger font-heading font-bold text-3xl flex items-center justify-center mx-auto my-4">
                {fallCountdown}s
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowFallModal(false)}
                  className="bg-status-safe text-white"
                >
                  {t('sos.cancelSos')}
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setShowFallModal(false);
                    triggerSOS('fall_detection');
                  }}
                >
                  🚨 {t('sos.triggerButton')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
