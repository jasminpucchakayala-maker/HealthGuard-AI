import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SidebarNav } from '../../components/layout/SidebarNav';
import { Header } from '../../components/layout/Header';
import { PhoneIcon } from '../../components/common/Icons';

export const PatientsPage: React.FC = () => {
  const { patient } = useHealth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-primary flex">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-6 w-full space-y-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{t('caregiver.monitoredPatients')}</h2>
            <p className="text-secondary text-sm mt-1">{t('caregiver.monitoredPatients')}</p>
          </div>

          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-hairline"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-heading font-bold text-primary">{patient.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-status-safe/10 text-status-safe font-semibold text-xs border border-status-safe/30">
                      {t('caregiver.patientStatus')}
                    </span>
                  </div>
                  <p className="text-sm text-secondary mt-1">{t('profile.age')}: {patient.age} • {t('profile.bloodGroup')}: {patient.bloodGroup}</p>
                  <p className="text-xs text-muted">{t('profile.allergies')}: {patient.allergies.join(', ')}</p>
                </div>
              </div>

              <a
                href={`tel:${patient.phone}`}
                className="px-4 py-2 rounded-2xl bg-accent-secondary text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneIcon size={16} /> {t('caregiver.quickCall')}
              </a>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-sunken border border-hairline text-xs space-y-2">
              <p className="font-semibold text-primary">{t('profile.medicalConditions')}:</p>
              <p className="text-secondary">{patient.medicalNotes}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
