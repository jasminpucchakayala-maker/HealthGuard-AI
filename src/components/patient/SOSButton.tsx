import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOSIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';

export const SOSButton: React.FC<{ isFloating?: boolean }> = ({ isFloating = true }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { triggerSOS, accessibility } = useHealth();
  const { t } = useLanguage();

  const handleSOSConfirm = () => {
    setIsActivating(true);
    setTimeout(() => {
      triggerSOS('sos_button');
      setIsActivating(false);
      setShowConfirmModal(false);
    }, 600);
  };

  return (
    <>
      {/* Floating or Embedded Container */}
      <div className={isFloating ? 'fixed bottom-20 right-5 z-40' : 'relative flex justify-center'}>
        {/* The single allowed radial glow wash behind SOS button (Section 3.4) */}
        <div className="absolute inset-0 rounded-full sos-radial-glow transform scale-150 pointer-events-none" />

        {/* SOS Panic Button Component (Section 3.7 & 3.5) */}
        <motion.button
          animate={
            accessibility.reduceAnimation
              ? { scale: 1 }
              : { scale: [1, 1.03, 1] }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileTap={{ y: 4, scale: 0.95 }}
          onClick={() => setShowConfirmModal(true)}
          className="relative group w-20 h-20 md:w-24 md:h-24 rounded-full bg-status-danger text-white flex flex-col items-center justify-center shadow-lg transition-transform focus:outline-none border-4 border-surface cursor-pointer"
          style={{
            boxShadow: '0 8px 24px rgba(193, 59, 44, 0.4), inset 0 -4px 0 rgba(0,0,0,0.25)',
          }}
          aria-label="Trigger Emergency SOS"
        >
          <SOSIcon size={32} className="mb-0.5 text-white" />
          <span className="font-heading font-bold text-xs tracking-wider uppercase">{t('sos.title')}</span>
        </motion.button>
      </div>

      {/* SOS Confirmation Modal (Section 11) */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative z-10 w-full max-w-md bg-surface border border-hairline rounded-[24px] p-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-status-danger/10 text-status-danger mx-auto flex items-center justify-center mb-4">
                <SOSIcon size={36} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                {t('sos.title')}
              </h3>
              <p className="text-secondary text-base mb-6 leading-relaxed">
                {t('sos.pressToTrigger')}
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={handleSOSConfirm}
                  disabled={isActivating}
                >
                  {isActivating ? t('common.loading') : `🚨 ${t('sos.triggerButton')}`}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowConfirmModal(false)}
                >
                  {t('sos.cancelSos')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
