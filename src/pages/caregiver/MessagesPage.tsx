import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SidebarNav } from '../../components/layout/SidebarNav';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/common/Button';
import { VoiceIcon } from '../../components/common/Icons';

export const MessagesPage: React.FC = () => {
  const { voiceMessages, sendCaregiverTextReply, sendVoiceMessage, patient } = useHealth();
  const { language, t } = useLanguage();
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendCaregiverTextReply(textInput);
    setTextInput('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Stop after 5s demo recording
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      const msg = language === 'te' ? 'దయచేసి సమయానికి మందు తీసుకోండి.' : language === 'hi' ? 'कृपया समय पर दवा लें।' : 'Please remember to take your afternoon tablet.';
      sendVoiceMessage(msg, 5);
    }, 4000);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'te') utterance.lang = 'te-IN';
      else if (language === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{t('messages.title')}</h2>
            <p className="text-secondary text-sm mt-1">{t('messages.searchPlaceholder')} ({patient.name})</p>
          </div>

          {/* Voice Note Recorder Card (Section 21) */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs text-center">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">{t('assistant.title')}</h3>
            <p className="text-xs text-secondary mb-4">
              {t('assistant.tapToSpeak')}
            </p>

            <div className="flex items-center justify-center my-4">
              <button
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold transition-transform cursor-pointer shadow-lg ${
                  isRecording ? 'bg-status-danger animate-pulse scale-105' : 'bg-accent-secondary hover:scale-102'
                }`}
              >
                <VoiceIcon size={32} />
                <span className="text-[10px] mt-1">{isRecording ? `${recordingSeconds}s` : t('assistant.tapToSpeak')}</span>
              </button>
            </div>

            {isRecording && (
              <div className="flex justify-center items-center gap-1 my-2">
                <div className="w-1.5 h-6 bg-status-danger animate-bounce" />
                <div className="w-1.5 h-10 bg-status-danger animate-bounce delay-100" />
                <div className="w-1.5 h-8 bg-status-danger animate-bounce delay-200" />
                <div className="w-1.5 h-4 bg-status-danger animate-bounce delay-300" />
              </div>
            )}
          </div>

          {/* Messages History List */}
          <div className="bg-surface border border-hairline rounded-[24px] p-6 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-xl text-primary border-b border-hairline pb-3">{t('messages.title')}</h3>

            {voiceMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border ${
                  msg.senderRole === 'caregiver'
                    ? 'bg-sunken border-hairline ml-auto max-w-[85%]'
                    : 'bg-accent-primary/10 border-accent-primary/30 mr-auto max-w-[85%]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-bold text-primary">{msg.senderName} ({msg.senderRole})</span>
                  <span className="text-muted">{msg.timestamp}</span>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-hairline mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-accent-secondary flex items-center gap-1">
                    🎵 Voice Note ({msg.durationSeconds}s)
                  </span>
                  <button
                    onClick={() => speakMessage(msg.transcription)}
                    className="text-accent-primary font-bold hover:underline"
                  >
                    🔊 {t('assistant.title')}
                  </button>
                </div>

                <p className="text-xs text-primary font-medium leading-relaxed">
                  "{msg.transcription}"
                </p>
              </div>
            ))}

            {/* Caregiver Text Reply Bar */}
            <form onSubmit={handleSendText} className="flex gap-2 pt-4 border-t border-hairline">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t('messages.typeMessage')}
                className="flex-1 p-3 rounded-2xl bg-sunken border border-hairline text-primary text-sm focus:outline-none"
              />
              <Button variant="primary" size="md" type="submit" className="bg-accent-primary">
                {t('messages.send')}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
