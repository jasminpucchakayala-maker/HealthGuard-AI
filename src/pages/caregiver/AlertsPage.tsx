import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SidebarNav } from '../../components/layout/SidebarNav';
import { Header } from '../../components/layout/Header';
import { SOSIcon, WarnStatusIcon } from '../../components/common/Icons';
import { Button } from '../../components/common/Button';

export const AlertsPage: React.FC = () => {
  const { emergencyAlerts, todayLogs, resolveEmergency } = useHealth();
  const { t } = useLanguage();
  const missedLogs = todayLogs.filter((l) => l.status === 'skipped');

  return (
    <div className="min-h-screen bg-canvas text-primary flex">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-6 w-full space-y-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{t('alerts.title')}</h2>
            <p className="text-secondary text-sm mt-1">{t('alerts.filterAll')}</p>
          </div>

          {/* Active Emergencies */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs">
            <h3 className="font-heading font-bold text-xl text-primary mb-4 flex items-center gap-2">
              <SOSIcon size={24} className="text-status-danger" /> {t('alerts.typeSos')}
            </h3>

            {emergencyAlerts.length === 0 ? (
              <p className="text-secondary text-sm p-4 bg-sunken rounded-2xl text-center">
                ✓ {t('alerts.noAlerts')}
              </p>
            ) : (
              emergencyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border mb-3 flex items-center justify-between gap-4 text-xs ${
                    alert.status === 'active'
                      ? 'bg-status-danger/10 border-status-danger text-primary font-medium'
                      : 'bg-sunken border-hairline text-secondary'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{alert.patientName} — {alert.triggerType.replace('_', ' ')}</span>
                    <p>{t('common.time')}: {alert.timestamp} • {t('common.status')}: <strong className="uppercase">{alert.status === 'active' ? t('common.active') : t('common.resolved')}</strong></p>
                  </div>
                  {alert.status === 'active' && (
                    <Button variant="secondary" size="sm" onClick={() => resolveEmergency(alert.id)}>
                      {t('alerts.resolveAction')}
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Skipped Medicines */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs">
            <h3 className="font-heading font-bold text-xl text-primary mb-4 flex items-center gap-2">
              <WarnStatusIcon size={24} /> {t('alerts.typeMissedDose')}
            </h3>

            {missedLogs.length === 0 ? (
              <p className="text-secondary text-sm p-4 bg-sunken rounded-2xl text-center">
                ✓ {t('alerts.noAlerts')}
              </p>
            ) : (
              missedLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-sunken border border-hairline mb-2 text-xs flex justify-between">
                  <div>
                    <span className="font-bold text-primary">{log.medicineName} {log.dosage}</span>
                    <p className="text-secondary">{t('medicine.scheduledTime')}: {log.scheduledTime}</p>
                  </div>
                  <span className="text-status-warn font-semibold">{t('common.skipped')}</span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
