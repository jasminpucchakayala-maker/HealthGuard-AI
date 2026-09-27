import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceIcon, MedicineIcon, SOSIcon, WaterIcon, PhoneIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceAssistantWidget: React.FC<{ isCompact?: boolean }> = ({ isCompact = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { todayLogs, patient, triggerSOS, addWaterGlass } = useHealth();
  const { language, t } = useLanguage();

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'te') utterance.lang = 'te-IN';
      else if (language === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const processIntent = (input: string) => {
    const lower = input.toLowerCase();
    let reply = '';

    if (lower.includes('next') || lower.includes('medicine') || lower.includes('తరువాత') || lower.includes('మందు') || lower.includes('दवा') || lower.includes('अगली')) {
      const nextMed = todayLogs.find((l) => l.status === 'pending');
      if (nextMed) {
        reply = t('assistant.intentNextMed', { name: nextMed.medicineName, dosage: nextMed.dosage, time: nextMed.scheduledTime });
      } else {
        reply = t('assistant.intentNextMedEmpty');
      }
    } else if (lower.includes('water') || lower.includes('నీరు') || lower.includes('నీళ్లు') || lower.includes('पानी') || lower.includes('जल')) {
      addWaterGlass();
      reply = t('assistant.intentWaterLogged');
    } else if (lower.includes('sos') || lower.includes('emergency') || lower.includes('అత్యవసర') || lower.includes('आपत्कालीन') || lower.includes('మదత్')) {
      triggerSOS('voice_trigger');
      reply = t('assistant.intentSosTriggered');
    } else if (lower.includes('call') || lower.includes('caregiver') || lower.includes('రవి') || lower.includes('కాల్') || lower.includes('कॉल')) {
      reply = t('assistant.intentCallingCaregiver', { name: patient.caregiverName || 'Ravi', phone: patient.caregiverPhone || '9876543210' });
    } else {
      reply = t('assistant.intentFallback', { input });
    }

    setResponse(reply);
    speakText(reply);
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      if (language === 'te') recognition.lang = 'te-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processIntent(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        const fallbackText = language === 'te' ? 'నా తరువాత మందు ఏమిటి' : language === 'hi' ? 'मेरी अगली दवा क्या है' : 'What is my next medicine?';
        setTranscript(fallbackText);
        processIntent(fallbackText);
      };

      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        const sampleCmd = language === 'te' ? 'నా తరువాత మందు ఏమిటి' : language === 'hi' ? 'मेरी अगली दवा क्या है' : 'What is my next medicine?';
        setTranscript(sampleCmd);
        processIntent(sampleCmd);
      }, 1500);
    }
  };

  return (
    <div className="bg-surface border border-hairline rounded-[24px] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.button
            animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={isListening ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
            onClick={startListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isListening ? 'bg-accent-secondary text-white' : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
            }`}
            title={t('assistant.tapToSpeak')}
          >
            <VoiceIcon size={24} />
          </motion.button>
          <div>
            <h3 className="font-heading font-semibold text-lg text-primary">{t('assistant.title')}</h3>
            <p className="text-xs text-secondary">
              {isListening ? t('assistant.listening') : t('assistant.promptExample')}
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={startListening}>
          {isListening ? t('assistant.listening') : t('assistant.tapToSpeak')}
        </Button>
      </div>

      {/* Transcript & Response Area */}
      {transcript && (
        <div className="p-3 bg-sunken rounded-2xl border border-hairline mb-3 text-sm">
          <p className="text-xs font-semibold text-accent-secondary mb-1">{t('assistant.youSaid')}</p>
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') processIntent(transcript);
            }}
            className="w-full bg-surface border border-hairline rounded-xl p-2 text-primary text-sm font-medium mb-2 focus:outline-none"
          />
          {response && (
            <div className="pt-2 border-t border-hairline flex items-start gap-2">
              <span className="text-base">🤖</span>
              <div>
                <p className="text-xs font-semibold text-accent-primary">{t('assistant.aiReplied')}</p>
                <p className="text-primary font-medium">{response}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggested Quick Intent Buttons */}
      {!isCompact && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-hairline">
          <button
            onClick={() => processIntent(language === 'te' ? 'నా తరువాత మందు ఏమిటి' : 'What is my next medicine?')}
            className="px-3 py-1.5 rounded-xl bg-sunken hover:bg-surface border border-hairline text-xs font-medium text-primary flex items-center gap-1.5 transition-colors"
          >
            <MedicineIcon size={16} /> {t('medicine.nextDose')}
          </button>
          <button
            onClick={() => processIntent(language === 'te' ? 'నీళ్లు తాగాను' : 'Log one glass of water')}
            className="px-3 py-1.5 rounded-xl bg-sunken hover:bg-surface border border-hairline text-xs font-medium text-primary flex items-center gap-1.5 transition-colors"
          >
            <WaterIcon size={16} /> {t('water.addGlass')}
          </button>
          <button
            onClick={() => processIntent(language === 'te' ? 'కేర్‌గివర్‌కి కాల్ చేయి' : 'Call caregiver')}
            className="px-3 py-1.5 rounded-xl bg-sunken hover:bg-surface border border-hairline text-xs font-medium text-primary flex items-center gap-1.5 transition-colors"
          >
            <PhoneIcon size={16} /> {t('caregiver.quickCall')}
          </button>
          <button
            onClick={() => processIntent('SOS')}
            className="px-3 py-1.5 rounded-xl bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/30 text-xs font-medium text-status-danger flex items-center gap-1.5 transition-colors"
          >
            <SOSIcon size={16} /> {t('sos.title')}
          </button>
        </div>
      )}
    </div>
  );
};
