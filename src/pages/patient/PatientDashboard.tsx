import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { NextMedicineCard } from '../../components/patient/NextMedicineCard';
import { WaterTrackerCard } from '../../components/patient/WaterTrackerCard';
import { VoiceAssistantWidget } from '../../components/patient/VoiceAssistantWidget';
import { SOSButton } from '../../components/patient/SOSButton';
import { ReminderModal } from '../../components/patient/ReminderModal';
import { Card } from '../../components/common/Card';
import { MedicineIcon, SafeStatusIcon, WarnStatusIcon, CaregiverIcon } from '../../components/common/Icons';
import { Link } from 'react-router-dom';

export const PatientDashboard: React.FC = () => {
  const { todayLogs, patient, activeReminder, setActiveReminder } = useHealth();
  const { t } = useLanguage();

  const nextMedLog = todayLogs.find((l) => l.status === 'pending') || todayLogs[0];
  const completedCount = todayLogs.filter((l) => l.status === 'taken').length;

  return (
    <div className="min-h-screen bg-canvas text-primary pb-28 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Offline Banner if offline */}
        <div className="mb-4 text-xs font-semibold px-4 py-2 rounded-2xl bg-status-warn/10 border border-status-warn/30 text-status-warn flex items-center justify-between">
          <span>🟢 {t('dashboard.subtitle')}</span>
          <span className="text-[10px] opacity-80">{t('dashboard.adherenceRate')}: {patient.adherencePercentage}%</span>
        </div>

        {/* Bento Asymmetric Grid Layout (Section 3.6) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1 & 2: Hero Next Medicine (2 cols on desktop) */}
          <div className="lg:col-span-2">
            {nextMedLog ? (
              <NextMedicineCard log={nextMedLog} />
            ) : (
              <Card className="p-8 text-center">
                <SafeStatusIcon size={48} className="mx-auto mb-3 text-status-safe" />
                <h3 className="text-2xl font-heading font-bold">{t('medicine.emptyList')}</h3>
                <p className="text-secondary text-sm mt-1">
                  {t('assistant.intentNextMedEmpty')}
                </p>
              </Card>
            )}
          </div>

          {/* Column 3: Water Tracker Card */}
          <div className="lg:col-span-1">
            <WaterTrackerCard />
          </div>
        </div>

        {/* Wide Strip: Voice Assistant Bar (Section 3.6) */}
        <div className="mt-5">
          <VoiceAssistantWidget isCompact={false} />
        </div>

        {/* Today's Full Schedule & Caregiver Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          {/* Today's All Medicines Schedule (2 cols) */}
          <div className="lg:col-span-2 bg-surface border border-hairline rounded-[24px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MedicineIcon size={24} className="text-accent-secondary" />
                <h3 className="font-heading font-bold text-xl text-primary">{t('medicine.title')}</h3>
              </div>
              <span className="text-xs font-semibold text-secondary">
                {t('medicine.takenCount', { count: completedCount, total: todayLogs.length })}
              </span>
            </div>

            <div className="space-y-3">
              {todayLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-sunken border border-hairline flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-hairline flex items-center justify-center font-bold text-sm text-primary">
                      {log.scheduledTime.split(' ')[0]}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-primary">{log.medicineName}</h4>
                      <p className="text-xs text-secondary">{log.dosage} • {t('medicine.afterFood')}</p>
                    </div>
                  </div>

                  <div>
                    {log.status === 'taken' ? (
                      <span className="px-3 py-1 rounded-full bg-status-safe/10 text-status-safe font-semibold text-xs border border-status-safe/30 flex items-center gap-1">
                        <SafeStatusIcon size={14} /> {t('common.taken')}
                      </span>
                    ) : log.status === 'skipped' ? (
                      <span className="px-3 py-1 rounded-full bg-status-warn/10 text-status-warn font-semibold text-xs border border-status-warn/30">
                        {t('common.skipped')}
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveReminder(log)}
                        className="px-3 py-1.5 rounded-xl bg-accent-secondary text-white font-semibold text-xs hover:opacity-90"
                      >
                        {t('medicine.takeMedicine')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caregiver Connection Quick Card */}
          <div className="lg:col-span-1 bg-surface border border-hairline rounded-[24px] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CaregiverIcon size={24} className="text-accent-primary" />
                <h3 className="font-heading font-semibold text-lg text-primary">{t('nav.caregiver')}</h3>
              </div>

              {patient.caregiverId ? (
                <div className="p-4 rounded-2xl bg-sunken border border-hairline space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold">
                      {patient.caregiverName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">{patient.caregiverName}</h4>
                      <p className="text-xs text-secondary">{patient.caregiverPhone}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-hairline flex items-center gap-2 text-xs text-status-safe font-medium">
                    <SafeStatusIcon size={14} /> {t('common.active')}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-status-warn/10 border border-status-warn/30 text-xs text-primary space-y-2">
                  <p className="font-medium text-status-warn flex items-center gap-1">
                    <WarnStatusIcon size={16} /> {t('caregiver.statusAttention')}
                  </p>
                  <p className="text-secondary">
                    {t('caregiver.enterPatientCode')}
                  </p>
                  <Link
                    to="/patient/caregiver"
                    className="inline-block px-3 py-1.5 rounded-xl bg-accent-primary text-white font-semibold text-xs mt-1"
                  >
                    {t('caregiver.connectButton')}
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-hairline text-center">
              <Link to="/patient/emergency-info" className="text-xs text-status-danger font-semibold hover:underline">
                📄 {t('nav.emergencyInfo')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Floating SOS Panic Button (Section 3.7) */}
      <SOSButton isFloating={true} />

      {/* Active Scheduled Reminder Modal */}
      <ReminderModal log={activeReminder} onClose={() => setActiveReminder(null)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
