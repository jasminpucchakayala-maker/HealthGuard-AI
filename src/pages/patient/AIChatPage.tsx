import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/common/Button';
import type { ChatMessage } from '../../types';

export const AIChatPage: React.FC = () => {
  const { waterLog, patient, medicines } = useHealth();
  const { t } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `${t('aiChat.title')} — ${t('aiChat.subtitle')}`,
      timestamp: 'Just now',
      suggestedActions: [
        t('aiChat.prompt1'),
        t('aiChat.prompt2'),
        t('aiChat.prompt3'),
      ],
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Answer from local data only (No medical diagnosis)
    setTimeout(() => {
      const lower = query.toLowerCase();
      let replyText = '';

      if (lower.includes('medicine') || lower.includes('dose') || lower.includes('tablet')) {
        const medList = medicines.map((m) => `${m.name} (${m.dosage}) at ${m.time}`).join('\n• ');
        replyText = `Here is your current daily medicine schedule:\n• ${medList}\n\nYour current adherence rate is ${patient.adherencePercentage}%.`;
      } else if (lower.includes('water') || lower.includes('hydration')) {
        replyText = t('water.loggedSuccess', { count: waterLog.consumedGlasses });
      } else if (lower.includes('caregiver') || lower.includes('family')) {
        replyText = patient.caregiverName
          ? `Your connected caregiver is ${patient.caregiverName} (${patient.caregiverPhone}).`
          : t('caregiver.enterPatientCode');
      } else if (lower.includes('sos') || lower.includes('emergency') || lower.includes('help')) {
        replyText = t('sos.pressToTrigger');
      } else {
        replyText = t('aiChat.disclaimer');
      }

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-canvas text-primary pb-28 md:pb-12 flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        {/* Persistent Non-Alarming Medical Disclaimer (Section 41) */}
        <div className="p-3 mb-4 rounded-2xl bg-sunken border border-hairline text-xs text-secondary leading-snug">
          ℹ️ <strong>Medical Disclaimer:</strong> {t('aiChat.disclaimer')}
        </div>

        {/* Chat History Box */}
        <div className="flex-1 bg-surface border border-hairline rounded-[24px] p-5 shadow-xs overflow-y-auto max-h-[500px] space-y-4 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-accent-secondary text-white rounded-br-none font-medium'
                    : 'bg-sunken border border-hairline text-primary rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>

              {m.suggestedActions && m.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action)}
                      className="px-3 py-1.5 rounded-xl bg-sunken hover:bg-surface border border-hairline text-xs font-semibold text-primary transition-colors cursor-pointer"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('aiChat.placeholder')}
            className="flex-1 p-3.5 rounded-2xl bg-surface border border-hairline text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
          />
          <Button variant="primary" size="md" type="submit" className="bg-accent-primary">
            {t('aiChat.send')}
          </Button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};
