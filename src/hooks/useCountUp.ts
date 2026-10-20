import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// هوک useCountUp: عددی را از صفر تا مقدار هدف می‌شمارد، فقط زمانی که عنصر وارد دید کاربر شود
// target: مقدار عددی هدف — suffix: پسوند نمایشی (مثل '+' یا '%')
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo برای شتاب طبیعی‌تر به‌جای شمارش خطی یکنواخت
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration]);

  return { ref, value };
}
