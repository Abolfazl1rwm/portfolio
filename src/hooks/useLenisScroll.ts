import { useEffect } from 'react';
import Lenis from 'lenis';

// هوک useLenisScroll: اسکرول نرم و لغزان (momentum scrolling) در کل سایت با کتابخانه Lenis
// + مدیریت کلیک روی لینک‌های لنگر (anchor) با استفاده از همان موتور اسکرول Lenis
// تا حرکت اسکرول کاربر و حرکت ناوبری با کلیک، کاملاً هماهنگ و یکدست باشند
export function useLenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15, // مدت زمان انیمیشن اسکرول
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // تابع easing برای حس طبیعی‌تر
    });

    // حلقه انیمیشن برای به‌روزرسانی Lenis در هر فریم
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // هندلر کلیک روی لینک‌های لنگر (نویگیشن، Command Palette و...) — با اسکرول Lenis به‌جای پرش ناگهانی مرورگر
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href?.startsWith('#') || href === '#') return;

      event.preventDefault();

      try {
        const element = document.querySelector(href);
        if (!element) return;

        // دریافت ارتفاع هدر ثابت برای جبران آفست
        const header = document.querySelector('nav');
        const headerHeight = header?.getBoundingClientRect().height ?? 0;

        lenis.scrollTo(element as HTMLElement, { offset: -(headerHeight + 20) });
      } catch {
        // در صورت سلکتور نامعتبر، خطا را به‌صورت بی‌صدا نادیده بگیر
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []); // این useEffect فقط یک بار پس از رندر اولیه اجرا می‌شود
}
