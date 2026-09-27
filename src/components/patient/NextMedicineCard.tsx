import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MedicineLog } from '../../types';
import { Button } from '../common/Button';
import { MedicineIcon, CheckIcon, SafeStatusIcon } from '../common/Icons';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';

interface NextMedicineCardProps {
  log: MedicineLog;
}

export const NextMedicineCard: React.FC<NextMedicineCardProps> = ({ log }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const { markMedicineTaken, skipMedicineDose } = useHealth();
  const { t } = useLanguage();

  const handleMarkTaken = () => {
    setIsFlipped(true);
    setTimeout(() => {
      markMedicineTaken(log.id);
      setIsFlipped(false);
    }, 1200);
  };

  const handleSkip = () => {
    skipMedicineDose(log.id, 'Patient skipped via card action');
    setShowSkipConfirm(false);
  };

  const isTaken = log.status === 'taken';
  const isSkipped = log.status === 'skipped';

  return (
    <div className="perspective-1000 w-full">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="preserve-3d relative w-full bg-surface border border-hairline rounded-[24px] p-6 shadow-xs"
      >
        {/* Front Side */}
        <div className={`backface-hidden ${isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                <MedicineIcon size={28} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">
                  {t('nextMedicine')}
                </span>
                <h3 className="text-2xl font-heading font-bold text-primary">{log.medicineName}</h3>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sunken text-primary border border-hairline">
              ⏰ {log.scheduledTime}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="px-4 py-2 rounded-xl bg-sunken border border-hairline text-sm text-secondary">
              {t('medicine.dosage')}: <strong className="text-primary">{log.dosage}</strong>
            </div>
            <div className="px-4 py-2 rounded-xl bg-sunken border border-hairline text-sm text-secondary">
              {t('medicine.instructions')}: <strong className="text-primary">{t('medicine.afterFood')}</strong>
            </div>
          </div>

          {/* Action Buttons or Status Badge */}
          {isTaken ? (
            <div className="flex items-center gap-2 p-3 bg-status-safe/10 border border-status-safe/30 rounded-2xl text-status-safe font-medium">
              <SafeStatusIcon size={22} />
              <span>{t('medicine.takeMedicineSuccess', { name: log.medicineName })} ({log.timestamp || log.scheduledTime})</span>
            </div>
          ) : isSkipped ? (
            <div className="flex items-center gap-2 p-3 bg-status-warn/10 border border-status-warn/30 rounded-2xl text-status-warn font-medium">
              <span>⚠️ {t('medicine.skipMedicineSuccess', { name: log.medicineName })}</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleMarkTaken}
                className="bg-accent-secondary hover:bg-accent-secondary/90 text-white font-semibold"
              >
                <CheckIcon size={20} />
                {t('medicine.takeMedicine')}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto min-w-[110px]"
                onClick={() => setShowSkipConfirm(true)}
              >
                {t('medicine.skipMedicine')}
              </Button>
            </div>
          )}

          {/* Skip Confirmation Sub-Panel */}
          {showSkipConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-status-warn/10 border border-status-warn/30 rounded-2xl text-sm"
            >
              <p className="text-primary font-medium mb-3">
                {t('modal.confirmTitle')} ({t('medicine.skipMedicine')})
              </p>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" onClick={handleSkip}>
                  {t('medicine.skipMedicine')}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowSkipConfirm(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Back Side (Revealed during 3D Flip) */}
        <div className={`rotate-y-180 backface-hidden absolute inset-0 bg-status-safe text-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center ${isFlipped ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <CheckIcon size={36} className="text-white" />
          </div>
          <h4 className="text-2xl font-heading font-bold">{t('common.success')}!</h4>
          <p className="text-sm opacity-90 mt-1">{t('medicine.takeMedicineSuccess', { name: log.medicineName })}</p>
        </div>
      </motion.div>
    </div>
  );
};
