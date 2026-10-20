import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isAIAssistantConfigured, sendAIMessage, type AIChatMessage } from '@/lib/ai-assistant';

// یک پیام قابل‌نمایش در رابط کاربری (شامل شناسه و زمان، علاوه بر role/content که برای API لازم است)
interface DisplayMessage extends AIChatMessage {
  id: number;
  timestamp: number;
}

// پیشنهادهای پاسخ سریع که فقط قبل از ارسال اولین پیام نمایش داده می‌شوند
const QUICK_REPLY_KEYS = ['skills', 'projects', 'contact'] as const;

// فرمت کردن زمان پیام به‌صورت ساعت:دقیقه
function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// نشانگر «در حال تایپ» با سه نقطهٔ متحرک (به‌جای متن ساده «...»)
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-foreground/40"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// کامپوننت ویجت شناور دستیار هوش مصنوعی (Floating AI Assistant Widget)
// این ویجت در گوشهٔ پایین صفحه نمایش داده می‌شود و با کلیک، یک پنجرهٔ چت باز می‌کند.
// پیام‌های کاربر به یک API خارجی (پیکربندی‌شده از طریق متغیرهای محیطی) ارسال می‌شود.
export function AIChatWidget() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false); // وضعیت باز/بسته بودن پنجرهٔ چت
  const [messages, setMessages] = useState<DisplayMessage[]>([]); // تاریخچهٔ پیام‌های گفت‌وگو
  const [input, setInput] = useState(''); // متن ورودی کاربر
  const [isSending, setIsSending] = useState(false); // وضعیت در حال ارسال بودن پیام
  const [showProactive, setShowProactive] = useState(false); // نمایش حباب دعوت‌کنندهٔ اولیه
  const scrollRef = useRef<HTMLDivElement>(null); // رفرنس برای اسکرول خودکار به آخرین پیام
  const idRef = useRef(0);

  const configured = isAIAssistantConfigured(); // آیا API دستیار هوش مصنوعی پیکربندی شده است؟

  // نمایش یک حباب دعوت‌کنندهٔ کوچک چند ثانیه پس از ورود کاربر به سایت (فقط یک‌بار در هر session)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('ai-proactive-shown')) return;

    const timer = window.setTimeout(() => {
      setShowProactive(true);
      window.sessionStorage.setItem('ai-proactive-shown', '1');
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  // بستن حباب دعوت‌کننده به محض باز شدن چت
  useEffect(() => {
    if (isOpen) setShowProactive(false);
  }, [isOpen]);

  // اسکرول خودکار به پایین لیست پیام‌ها هنگام افزودن پیام جدید
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen, isSending]);

  // هندل کردن ارسال پیام (چه از ورودی متنی، چه از یک چیپ پاسخ سریع)
  const handleSend = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isSending) return;

    const userMessage: DisplayMessage = {
      role: 'user',
      content: trimmed,
      id: (idRef.current += 1),
      timestamp: Date.now(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      if (!configured) {
        // اگر API هنوز پیکربندی نشده، پیام راهنما نمایش داده می‌شود (بدون خطا در کنسول)
        setMessages((current) => [
          ...current,
          { role: 'assistant', content: t('ai.unconfigured'), id: (idRef.current += 1), timestamp: Date.now() },
        ]);
        return;
      }
      const reply = await sendAIMessage(nextMessages.map(({ role, content }) => ({ role, content })));
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: reply || t('ai.error'), id: (idRef.current += 1), timestamp: Date.now() },
      ]);
    } catch (error) {
      console.error('[ai-assistant] خطا در دریافت پاسخ:', error);
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: t('ai.error'), id: (idRef.current += 1), timestamp: Date.now() },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // هندل کردن فشردن کلید Enter برای ارسال پیام
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  // پاک کردن تاریخچهٔ گفت‌وگو
  const handleClear = () => setMessages([]);

  return (
    <>
      {/* حباب دعوت‌کنندهٔ اولیه (Proactive greeting bubble) */}
      <AnimatePresence>
        {showProactive && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`glass-card fixed bottom-24 ${isRTL ? 'right-6' : 'left-6'} z-40 flex max-w-[15rem] items-start gap-2 rounded-2xl p-3 text-sm shadow-lg`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <p className="flex-1 text-foreground/85">{t('ai.proactive')}</p>
            <button
              type="button"
              onClick={() => setShowProactive(false)}
              className="shrink-0 rounded-full p-0.5 text-foreground/40 hover:text-foreground"
              aria-label={t('common.close')}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* دکمهٔ شناور برای باز/بسته کردن چت — سمت مخالف دکمهٔ Command Palette قرار می‌گیرد */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90`}
        style={{ boxShadow: 'var(--shadow-glow)' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? t('ai.close') : t('ai.open')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* پنجرهٔ چت */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`glass-card fixed bottom-24 ${isRTL ? 'right-6' : 'left-6'} z-40 flex h-[30rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* سربرگ پنجرهٔ چت */}
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot size={18} />
                  <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('ai.assistant')}</p>
                  <p className="text-xs text-foreground/60">{t('ai.status')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={t('ai.clear')}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={t('ai.close')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* بدنهٔ پیام‌ها */}
            <div ref={scrollRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <>
                  <div className="flex items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Bot size={14} />
                    </div>
                    <div className="rounded-2xl rounded-es-sm bg-secondary/60 px-3 py-2 text-sm text-foreground/80">
                      {t('ai.welcome')}
                    </div>
                  </div>

                  {/* چیپ‌های پاسخ سریع — فقط قبل از ارسال اولین پیام */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_REPLY_KEYS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => void handleSend(t(`ai.quickReply.${key}`))}
                        className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                      >
                        {t(`ai.quickReply.${key}`)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Bot size={14} />
                        </div>
                      )}
                      <div className={`flex max-w-[78%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-3 py-2 text-sm ${
                            isUser
                              ? 'rounded-2xl rounded-ee-sm bg-primary text-primary-foreground'
                              : 'rounded-2xl rounded-es-sm bg-secondary/60 text-foreground/85'
                          }`}
                        >
                          {message.content}
                        </div>
                        <span className="mt-1 px-1 text-[10px] text-foreground/40">{formatTime(message.timestamp)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isSending && (
                <div className="flex items-end gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-es-sm bg-secondary/60 px-2">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>

            {/* فرم ورودی پیام */}
            <div className="flex items-center gap-2 border-t border-border/50 p-3">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.placeholder')}
                className="flex-1"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void handleSend()}
                disabled={isSending || !input.trim()}
                aria-label={t('ai.send')}
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
