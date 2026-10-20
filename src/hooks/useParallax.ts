import { useRef, useEffect, useState } from 'react';

// تعریف رابط برای گزینه‌های (Options) هوک useParallax
interface ParallaxOptions {
  speed?: number; // سرعت اثر پارالاکس
  offset?: number; // آفست اولیه برای اثر پارالاکس
}

// هوک useParallax برای ایجاد اثر پارالاکس (حرکت پس‌زمینه با سرعت متفاوت از پیش‌زمینه)
export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, offset = 0 } = options; // مقادیر پیش‌فرض برای سرعت و آفست
  const elementRef = useRef<HTMLDivElement>(null); // رفرنس برای المنت مورد نظر
  const [offsetY, setOffsetY] = useState(0); // وضعیت برای نگهداری مقدار آفست عمودی

  useEffect(() => {
    // هندلر رویداد اسکرول
    const handleScroll = () => {
      if (!elementRef.current) return; // اگر المنت موجود نیست، خارج شو

      const element = elementRef.current;
      const elementTop = element.getBoundingClientRect().top; // موقعیت بالای المنت نسبت به viewport
      const elementHeight = element.offsetHeight; // ارتفاع المنت
      const windowHeight = window.innerHeight; // ارتفاع پنجره مرورگر

      // محاسبه پارالاکس فقط زمانی که المنت در viewport قابل مشاهده است
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        const scrolled = window.scrollY; // مقدار اسکرول صفحه
        // محاسبه میزان اسکرول المنت در viewport
        const elementScrolled = scrolled - (elementTop + window.scrollY - windowHeight);
        setOffsetY(elementScrolled * speed + offset); // تنظیم آفست عمودی بر اساس سرعت و آفست
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true }); // افزودن شنونده رویداد اسکرول
    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, offset]); // وابستگی‌ها

  return { elementRef, offsetY }; // بازگرداندن رفرنس المنت و مقدار آفست عمودی
}
