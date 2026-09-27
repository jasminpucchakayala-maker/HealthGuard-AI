import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MedicineLog } from '../../types';
import { MedicineIcon, CheckIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ReminderModalProps {
  log: MedicineLog | null;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ log, onClose }) => {
  const { markMedicineTaken, skipMedicineDose } = useHealth();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (log) {
      // 1. Play Audio Chime via Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // Audio fallback
      }

      // 2. Speech Synthesis Announcement
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `${t('medicine.nextDose')}: ${log.medicineName} ${log.dosage}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        if (language === 'te') utterance.lang = 'te-IN';
        else if (language === 'hi') utterance.lang = 'hi-IN';
        else utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }

      // 3. Browser Notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${t('medicine.nextDose')}: ${log.medicineName}`, {
          body: `${t('common.time')}: ${log.scheduledTime} — ${log.dosage}`,
          icon: '/favicon.svg',
        });
      }
    }
  }, [log, language, t]);

  if (!log) return null;

  const handleTake = () => {
    markMedicineTaken(log.id);
    onClose();
  };

  const handleSkip = () => {
    skipMedicineDose(log.id, 'Skipped via reminder prompt');
    onClose();
  };

  const handleSnooze = (minutes: number) => {
    alert(`Snoozed ${minutes}m`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
          className="relative z-10 w-full max-w-md bg-surface border border-hairline rounded-[28px] p-6 shadow-2xl text-center"
        >
          <div className="w-16 h-16 rounded-full bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mx-auto mb-4 animate-bounce">
            <MedicineIcon size={36} />
          </div>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-sunken text-accent-secondary border border-hairline uppercase tracking-wider">
            ⏰ {t('medicine.scheduledTime')} • {log.scheduledTime}
          </span>

          <h3 className="text-3xl font-heading font-bold text-primary mt-3 mb-1">
            {log.medicineName}
          </h3>
          <p className="text-lg text-secondary font-medium mb-4">
            {t('medicine.dosage')}: <strong className="text-primary">{log.dosage}</strong> ({t('medicine.afterFood')})
          </p>

          <div className="p-3 bg-sunken rounded-2xl border border-hairline text-xs text-muted mb-6">
            ℹ️ {t('notifications.title')}
          </div>

          <div className="space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={handleTake} className="bg-status-safe text-white font-bold text-lg">
              <CheckIcon size={22} /> {t('medicine.takeMedicine')}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="md" onClick={() => handleSnooze(10)}>
                ⏱️ 10m
              </Button>
              <Button variant="secondary" size="md" onClick={handleSkip}>
                {t('medicine.skipMedicine')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
