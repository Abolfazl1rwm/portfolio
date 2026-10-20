import { useEffect } from 'react';
import gsap from 'gsap';

// هوک usePageTransition برای مدیریت انیمیشن‌های انتقال صفحه با استفاده از GSAP
export function usePageTransition() {
  useEffect(() => {
    // انیمیشن ورود صفحه هنگام mount شدن کامپوننت
    const tl = gsap.timeline(); // ایجاد یک تایم‌لاین GSAP
    
    // محو شدن پس‌زمینه (fade in)
    tl.from('body', {
      opacity: 0,
      duration: 0.5,
    }, 0); // انیمیشن از opacity 0 به 1 در مدت 0.5 ثانیه، شروع از زمان 0

    // ورود تدریجی بخش‌ها (stagger in)
    tl.from(
      'section',
      {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1, // تاخیر 0.1 ثانیه بین انیمیشن هر بخش
      },
      0.2 // شروع این انیمیشن 0.2 ثانیه پس از شروع تایم‌لاین
    );

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      tl.kill(); // از بین بردن تایم‌لاین GSAP
    };
  }, []); // این useEffect فقط یک بار پس از رندر اولیه اجرا می‌شود
}
