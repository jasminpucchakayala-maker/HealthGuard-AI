import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/common/Button';
import { SafeStatusIcon, WarnStatusIcon } from '../../components/common/Icons';

export const CaregiverConnectPage: React.FC = () => {
  const { patient, caregiver, connectionRequests, sendCaregiverConnectionRequest } = useHealth();
  const { t } = useLanguage();
  const [name, setName] = useState('Ravi Kumar');
  const [phone, setPhone] = useState('+91 98765 43211');
  const [relationship, setRelationship] = useState('Son');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCaregiverConnectionRequest(name, phone, relationship);
    setIsSent(true);
  };

  const isConnected = !!patient.caregiverId;

  return (
    <div className="min-h-screen bg-canvas text-primary pb-28 md:pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-heading font-bold text-primary">{t('caregiver.title')}</h2>
          <p className="text-secondary text-sm mt-1">{t('caregiver.monitoredPatients')}</p>
        </div>

        {isConnected ? (
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-2xl">
                {patient.caregiverName?.charAt(0)}
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-status-safe/10 text-status-safe font-semibold text-xs border border-status-safe/30 inline-flex items-center gap-1 mb-1">
                  <SafeStatusIcon size={14} /> {t('caregiver.patientStatus')}
                </span>
                <h3 className="text-2xl font-heading font-bold text-primary">{patient.caregiverName}</h3>
                <p className="text-sm text-secondary">{caregiver.relationship} • {patient.caregiverPhone}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sunken border border-hairline text-xs text-secondary space-y-2">
              <p className="font-semibold text-primary">{t('caregiver.statusNormal')}:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('medicine.title')}</li>
                <li>{t('sos.title')}</li>
                <li>{t('water.title')}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs mb-6">
            <div className="flex items-center gap-3 mb-4">
              <WarnStatusIcon size={28} className="text-status-warn" />
              <div>
                <h3 className="text-xl font-heading font-bold text-primary">{t('caregiver.statusAttention')}</h3>
                <p className="text-xs text-secondary">{t('caregiver.enterPatientCode')}</p>
              </div>
            </div>

            {isSent ? (
              <div className="p-4 rounded-2xl bg-status-safe/10 border border-status-safe/30 text-status-safe text-sm font-semibold text-center">
                🎉 {t('caregiver.connectionSuccess')} ({name} - {phone})
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-secondary mb-1">{t('caregiver.patientName')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-sunken border border-hairline text-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-secondary mb-1">{t('profile.phone')}</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-sunken border border-hairline text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-secondary mb-1">{t('common.details')}</label>
                    <input
                      type="text"
                      required
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Son, Daughter, Doctor"
                      className="w-full p-3 rounded-2xl bg-sunken border border-hairline text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <Button variant="primary" size="lg" fullWidth type="submit" className="bg-accent-primary">
                  {t('caregiver.connectButton')}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Pending Requests List */}
        {connectionRequests.length > 0 && (
          <div className="bg-surface border border-hairline rounded-[24px] p-6">
            <h4 className="font-heading font-bold text-lg text-primary mb-3">{t('dashboard.recentActivity')}</h4>
            {connectionRequests.map((req) => (
              <div key={req.id} className="p-3 rounded-2xl bg-sunken border border-hairline flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-primary">{req.patientName}</span> {'->'} {' '}
                  <span className="font-semibold text-accent-secondary">{req.caregiverPhone}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-status-warn/20 text-status-warn font-semibold uppercase">
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
