import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useKonamiCode } from '@/hooks/useKonamiCode';

interface Piece {
  id: number;
  left: number; // درصد موقعیت افقی
  delay: number;
  duration: number;
  rotate: number;
  emoji: string;
}

const EMOJIS = ['🍍', '⭐', '🍍', '🌟', '🍍'];

// کامپوننت EasterEgg: با وارد کردن Konami Code (بالا بالا پایین پایین چپ راست چپ راست B A)
// یک باران بامزهٔ آناناس (اشاره به شوخی پاتریک در بخش درباره‌ من) به همراه یک پیام کوچک نمایش می‌دهد
export function EasterEgg() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);

  useKonamiCode(() => {
    if (active) return; // از فعال‌سازی همزمان چندباره جلوگیری می‌کند
    const generated: Piece[] = Array.from({ length: 24 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.6,
      rotate: Math.random() * 360,
      emoji: EMOJIS[index % EMOJIS.length],
    }));
    setPieces(generated);
    setActive(true);
    window.setTimeout(() => setActive(false), 4200);
  });

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
          {/* آناناس‌های در حال ریزش */}
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute top-[-10%] text-3xl"
              style={{ left: `${piece.left}%` }}
              initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
              animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: piece.rotate }}
              transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
            >
              {piece.emoji}
            </motion.span>
          ))}

          {/* پیام کوچک وسط صفحه */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="glass-card rounded-2xl px-6 py-4 shadow-2xl">
              <p className="text-base font-semibold text-foreground">{t('easterEgg.found')}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
