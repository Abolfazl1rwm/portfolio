import { useRef, useEffect, useState } from 'react';

// تعریف رابط برای گزینه‌های (Options) هوک useScrollReveal
interface ScrollRevealOptions {
  threshold?: number; // آستانه (درصد) برای تشخیص قابل مشاهده بودن المنت
  rootMargin?: string; // حاشیه اطراف root برای گسترش یا کوچک کردن ناحیه دید
}

// هوک useScrollReveal برای تشخیص زمانی که یک المنت وارد viewport می‌شود
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options; // مقادیر پیش‌فرض برای آستانه و حاشیه root
  const elementRef = useRef<HTMLDivElement>(null); // رفرنس برای المنت مورد نظر
  const [isVisible, setIsVisible] = useState(false); // وضعیت برای نگهداری قابل مشاهده بودن المنت

  useEffect(() => {
    // ایجاد یک IntersectionObserver جدید
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true); // تنظیم isVisible به true زمانی که المنت قابل مشاهده است
          // پس از قابل مشاهده شدن المنت، مشاهده را متوقف کن
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin } // گزینه‌های IntersectionObserver
    );

    // شروع مشاهده المنت در صورت وجود
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin]); // وابستگی‌ها

  return { elementRef, isVisible }; // بازگرداندن رفرنس المنت و وضعیت قابل مشاهده بودن
}
