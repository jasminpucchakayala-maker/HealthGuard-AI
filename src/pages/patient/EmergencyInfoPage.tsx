import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/common/Button';
import { SOSIcon, PhoneIcon } from '../../components/common/Icons';

export const EmergencyInfoPage: React.FC = () => {
  const { patient } = useHealth();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `EMERGENCY MEDICAL CARD FOR ${patient.name}:\nBlood Group: ${patient.bloodGroup}\nEmergency Contact: ${patient.emergencyContact}\nCaregiver: ${patient.caregiverName} (${patient.caregiverPhone})\nAllergies: ${patient.allergies.join(', ')}\nNotes: ${patient.medicalNotes}`;

    if (navigator.share) {
      navigator.share({ title: 'Emergency Info', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary pb-28 md:pb-12">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-status-danger/10 text-status-danger flex items-center justify-center mx-auto mb-2">
            <SOSIcon size={36} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-primary">{t('nav.emergencyInfo')}</h2>
          <p className="text-secondary text-xs mt-1">{t('sos.alertDescription')}</p>
        </div>

        <div className="bg-surface border-2 border-status-danger/40 rounded-[28px] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-hairline">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-status-danger">{t('profile.fullName')}</span>
              <h3 className="text-2xl font-heading font-bold text-primary">{patient.name}</h3>
              <p className="text-xs text-secondary">{t('profile.age')}: {patient.age} • {t('profile.phone')}: {patient.phone}</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-status-danger text-white font-bold text-xl">
              {patient.bloodGroup}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sunken border border-hairline">
              <span className="text-xs font-bold uppercase text-secondary block mb-1">{t('profile.emergencyContacts')}</span>
              <p className="font-bold text-primary text-base flex items-center gap-2">
                <PhoneIcon size={18} className="text-status-danger" /> {patient.emergencyContact}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sunken border border-hairline">
              <span className="text-xs font-bold uppercase text-secondary block mb-1">{t('profile.primaryCaregiver')}</span>
              <p className="font-bold text-primary text-base">{patient.caregiverName || t('common.none')}</p>
              <p className="text-xs text-secondary">{patient.caregiverPhone}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-status-warn/10 border border-status-warn/30">
            <span className="text-xs font-bold uppercase text-status-warn block mb-1">⚠️ {t('profile.allergies')}</span>
            <p className="font-semibold text-primary">{patient.allergies.join(', ') || t('common.none')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-sunken border border-hairline">
            <span className="text-xs font-bold uppercase text-secondary block mb-1">{t('profile.medicalConditions')}</span>
            <p className="text-sm text-primary leading-relaxed">{patient.medicalNotes}</p>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleShare} className="bg-status-danger">
            {copied ? `✓ ${t('common.success')}` : `📲 ${t('nav.emergencyInfo')}`}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
