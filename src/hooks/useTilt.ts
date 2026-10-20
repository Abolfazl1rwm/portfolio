import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

interface TiltResult {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}

// هوک useTilt: افکت کج‌شدن سه‌بعدی ملایم کارت‌ها بر اساس موقعیت واقعی نشانگر ماوس
// (نه یک الگوی ثابت/تکراری) — همین باعث می‌شود حس دستی و طبیعی‌تری داشته باشد
export function useTilt(maxTilt = 8): TiltResult {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0); // موقعیت افقی نسبی ماوس داخل کارت (-0.5 تا 0.5)
  const y = useMotionValue(0); // موقعیت عمودی نسبی ماوس داخل کارت (-0.5 تا 0.5)

  // فنری‌سازی حرکت برای نرمی طبیعی به‌جای پرش ناگهانی
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.5 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
