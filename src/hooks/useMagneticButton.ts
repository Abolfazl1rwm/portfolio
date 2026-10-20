import { useRef, useEffect } from 'react';

// تعریف رابط برای گزینه‌های (Options) هوک useMagneticButton
interface MagneticButtonOptions {
  strength?: number; // قدرت جذب دکمه
  maxDistance?: number; // حداکثر فاصله برای فعال شدن اثر مغناطیسی
}

// هوک useMagneticButton برای ایجاد اثر مغناطیسی روی دکمه‌ها هنگام حرکت ماوس
export function useMagneticButton(options: MagneticButtonOptions = {}) {
  const { strength = 0.3, maxDistance = 100 } = options; // مقادیر پیش‌فرض برای قدرت و حداکثر فاصله
  const buttonRef = useRef<HTMLButtonElement>(null); // رفرنس برای المنت دکمه

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return; // اگر دکمه موجود نیست، خارج شو

    // هندلر حرکت ماوس
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect(); // دریافت ابعاد و موقعیت دکمه
      const buttonCenterX = rect.left + rect.width / 2; // مرکز X دکمه
      const buttonCenterY = rect.top + rect.height / 2; // مرکز Y دکمه

      // محاسبه فاصله ماوس از مرکز دکمه
      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
      );

      // اگر ماوس در محدوده حداکثر فاصله قرار دارد
      if (distance < maxDistance) {
        const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX); // محاسبه زاویه بین ماوس و مرکز دکمه
        const moveX = Math.cos(angle) * (maxDistance - distance) * strength; // محاسبه میزان حرکت در محور X
        const moveY = Math.sin(angle) * (maxDistance - distance) * strength; // محاسبه میزان حرکت در محور Y

        button.style.transform = `translate(${moveX}px, ${moveY}px)`; // اعمال ترنسفورم برای حرکت دکمه
      } else {
        button.style.transform = 'translate(0, 0)'; // بازگرداندن دکمه به موقعیت اولیه
      }
    };

    // هندلر خروج ماوس از دکمه
    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)'; // بازگرداندن دکمه به موقعیت اولیه
    };

    document.addEventListener('mousemove', handleMouseMove); // افزودن شنونده رویداد حرکت ماوس به سند
    button.addEventListener('mouseleave', handleMouseLeave); // افزودن شنونده رویداد خروج ماوس از دکمه

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, maxDistance]); // وابستگی‌ها

  return buttonRef; // بازگرداندن رفرنس دکمه
}
