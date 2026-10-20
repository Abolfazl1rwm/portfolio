import { useEffect } from 'react';

// هوک useSmoothScroll برای فعال کردن اسکرول نرم و مدیریت لینک‌های لنگر (anchor links)
export function useSmoothScroll() {
  useEffect(() => {
    // فعال کردن رفتار اسکرول نرم برای کل سند
    document.documentElement.style.scrollBehavior = 'smooth';

    // هندلر کلیک بر روی لینک‌های لنگر
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // پیدا کردن نزدیک‌ترین المنت <a>
      const anchor = target.closest('a');
      if (!anchor) return; // اگر المنت <a> پیدا نشد، خارج شو

      const href = anchor.getAttribute('href'); // دریافت مقدار ویژگی href
      if (!href?.startsWith('#')) return; // اگر href با '#' شروع نمی‌شود، خارج شو
      
      // بررسی اینکه href فقط '#' نباشد
      if (href === '#') return;

      e.preventDefault(); // جلوگیری از رفتار پیش‌فرض مرورگر (پرش ناگهانی)
      
      try {
        const element = document.querySelector(href); // پیدا کردن المنت هدف با استفاده از سلکتور href
        if (!element) return; // اگر المنت هدف پیدا نشد، خارج شو
        
        // دریافت ارتفاع هدر ثابت (در صورت وجود)
        const header = document.querySelector('nav');
        const headerHeight = header?.offsetHeight || 0;
        
        // محاسبه موقعیت المنت هدف با در نظر گرفتن اسکرول صفحه و ارتفاع هدر
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 20; // 20px پدینگ اضافی

        // اسکرول نرم به موقعیت محاسبه شده
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } catch (error) {
        // در صورت سلکتور نامعتبر، خطا را به صورت بی‌صدا نادیده بگیر
        console.debug('Invalid anchor selector:', href);
      }
    };

    document.addEventListener('click', handleAnchorClick); // افزودن شنونده رویداد کلیک به سند

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []); // این useEffect فقط یک بار پس از رندر اولیه اجرا می‌شود
}
