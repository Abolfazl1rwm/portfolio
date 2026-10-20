import { useRef, useEffect } from 'react';

// تعریف رابط برای گزینه‌های (Options) هوک useMouseSpotlight
interface MouseSpotlightOptions {
  size?: number; // اندازه نورافکن
  blur?: number; // میزان بلور (تاری)
  opacity?: number; // میزان شفافیت
}

// هوک useMouseSpotlight برای ایجاد اثر نورافکن (spotlight) دنبال‌کننده ماوس
export function useMouseSpotlight(options: MouseSpotlightOptions = {}) {
  const { size = 300, blur = 60, opacity = 0.15 } = options; // مقادیر پیش‌فرض برای اندازه، بلور و شفافیت
  const spotlightRef = useRef<HTMLDivElement>(null); // رفرنس برای المنت نورافکن

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return; // اگر المنت نورافکن موجود نیست، خارج شو

    // هندلر حرکت ماوس
    const handleMouseMove = (e: MouseEvent) => {
      // تنظیم موقعیت نورافکن بر اساس موقعیت ماوس
      spotlight.style.left = `${e.clientX - size / 2}px`;
      spotlight.style.top = `${e.clientY - size / 2}px`;
      spotlight.style.opacity = opacity.toString(); // تنظیم شفافیت
    };

    // هندلر خروج ماوس از صفحه
    const handleMouseLeave = () => {
      spotlight.style.opacity = '0'; // پنهان کردن نورافکن
    };

    document.addEventListener('mousemove', handleMouseMove); // افزودن شنونده رویداد حرکت ماوس
    document.addEventListener('mouseleave', handleMouseLeave); // افزودن شنونده رویداد خروج ماوس

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, blur, opacity]); // وابستگی‌ها

  return spotlightRef; // بازگرداندن رفرنس نورافکن
}
