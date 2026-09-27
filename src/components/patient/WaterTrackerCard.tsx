import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WaterIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';

export const WaterTrackerCard: React.FC = () => {
  const { waterLog, addWaterGlass, updateWaterSettings } = useHealth();
  const { t } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);

  const percentage = Math.round((waterLog.consumedGlasses / waterLog.targetGlasses) * 100);
  const radius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-surface border border-hairline rounded-[24px] p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <WaterIcon size={24} className="text-accent-primary" />
          <h3 className="font-heading font-semibold text-lg text-primary">{t('water.title')}</h3>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-secondary hover:text-primary transition-colors underline"
        >
          {showSettings ? t('common.close') : t('settings.title')}
        </button>
      </div>

      {!showSettings ? (
        <div className="flex items-center gap-5 my-2">
          {/* Animated SVG Progress Ring (Section 3.5) */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="var(--bg-sunken)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                stroke="var(--accent-primary)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-heading text-primary">{waterLog.consumedGlasses}/{waterLog.targetGlasses}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider">{t('water.currentIntake')}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-secondary mb-2">
              {t('water.dailyGoal')}: {waterLog.targetGlasses} | {waterLog.lastLogTimestamp || t('common.none')}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={addWaterGlass}
              disabled={waterLog.consumedGlasses >= waterLog.targetGlasses}
              className="bg-accent-primary hover:bg-accent-primary/90 text-white font-medium self-start"
            >
              {t('water.addGlass')}
            </Button>
          </div>
        </div>
      ) : (
        /* Interval Settings Panel */
        <div className="p-3 bg-sunken rounded-2xl border border-hairline text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">{t('water.reminderText')}</span>
            <input
              type="checkbox"
              checked={waterLog.enabled}
              onChange={(e) => updateWaterSettings({ enabled: e.target.checked })}
              className="w-4 h-4 accent-accent-primary cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-secondary mb-1">{t('settings.notifications')}</label>
            <select
              value={waterLog.intervalMinutes}
              onChange={(e) => updateWaterSettings({ intervalMinutes: Number(e.target.value) })}
              className="w-full p-2 rounded-xl bg-surface border border-hairline text-primary focus:outline-none"
            >
              <option value={30}>Every 30 Minutes</option>
              <option value={60}>Every 1 Hour</option>
              <option value={120}>Every 2 Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-secondary mb-1">{t('water.dailyGoal')}</label>
            <input
              type="number"
              min={4}
              max={16}
              value={waterLog.targetGlasses}
              onChange={(e) => updateWaterSettings({ targetGlasses: Number(e.target.value) })}
              className="w-full p-2 rounded-xl bg-surface border border-hairline text-primary focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
