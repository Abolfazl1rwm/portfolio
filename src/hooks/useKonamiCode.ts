import { useEffect, useRef } from 'react';

// دنبالهٔ کلاسیک Konami Code: بالا بالا پایین پایین چپ راست چپ راست B A
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

// هوک useKonamiCode: با تشخیص دنبالهٔ کلیدهای بالا، تابع onUnlock را فراخوانی می‌کند
// (یک شوخی مخفی برای کاربران کنجکاو که کدهای قدیمی بازی‌ها را می‌شناسند)
export function useKonamiCode(onUnlock: () => void) {
  const progressRef = useRef(0);
  const callbackRef = useRef(onUnlock);
  callbackRef.current = onUnlock;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[progressRef.current];
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pressed === expected) {
        progressRef.current += 1;
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          callbackRef.current();
        }
      } else {
        // اگر کلید اشتباه بود، از اول شروع کن (مگر اینکه همان کلید شروع دنباله باشد)
        progressRef.current = pressed === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
