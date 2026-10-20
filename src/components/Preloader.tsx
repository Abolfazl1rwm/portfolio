import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const FULL_TEXT = 'Abolfazl Ranjbaran';
const SESSION_KEY = 'preloader-shown';

// کامپوننت Preloader: انیمیشن ورود اختصاصی که فقط یک بار در هر session نمایش داده می‌شود
export function Preloader() {
  // سرور و کلاینت هر دو با visible=false شروع می‌کنند (تا HTML یکسان باشد و خطای hydration رخ ندهد)؛
  // بعد از mount اگر در این session قبلاً نمایش داده نشده بود، preloader نشان داده می‌شود.
  const [visible, setVisible] = useState<boolean>(false);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(SESSION_KEY)) setVisible(true);
    } catch {
      /* sessionStorage در حالت‌های خاص در دسترس نیست */
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    let index = 0;
    const typeInterval = window.setInterval(() => {
      index += 1;
      setTypedText(FULL_TEXT.slice(0, index));
      if (index >= FULL_TEXT.length) {
        window.clearInterval(typeInterval);
        // کمی مکث بعد از تایپ کامل، سپس پنهان‌کردن preloader
        window.setTimeout(() => {
          setVisible(false);
          try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
        }, 550);
      }
    }, 55);

    return () => window.clearInterval(typeInterval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }}
        >
          <div className="flex flex-col items-center gap-4" dir="ltr">
            <div className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              <span className="text-primary">&gt;</span> {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="text-accent"
              >
                _
              </motion.span>
            </div>
            <div className="h-0.5 w-40 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${(typedText.length / FULL_TEXT.length) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
