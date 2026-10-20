import { useRef, useEffect } from 'react';

// تعریف رابط برای گزینه‌های (Options) هوک useCustomCursor
interface CustomCursorOptions {
  size?: number; // اندازه نشانگر
  color?: string; // رنگ نشانگر
  borderWidth?: number; // ضخامت حاشیه
  borderColor?: string; // رنگ حاشیه
}

// هوک useCustomCursor برای ایجاد نشانگر ماوس سفارشی
export function useCustomCursor(options: CustomCursorOptions = {}) {
  const {
    size = 20, // اندازه پیش‌فرض
    color = 'transparent', // رنگ پیش‌فرض
    borderWidth = 2, // ضخامت حاشیه پیش‌فرض
    borderColor = '#7C5CFC', // رنگ حاشیه پیش‌فرض
  } = options;

  const cursorRef = useRef<HTMLDivElement>(null); // رفرنس برای نشانگر اصلی
  const cursorFollowerRef = useRef<HTMLDivElement>(null); // رفرنس برای دنبال‌کننده نشانگر
  const animationFrameRef = useRef<number | null>(null); // رفرنس برای مدیریت requestAnimationFrame

  useEffect(() => {
    // بررسی ترجیح کاربر برای کاهش حرکت
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // بررسی اینکه آیا دستگاه لمسی است یا خیر
    const isTouchDevice = () => {
      return (
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches
      );
    };

    // اگر دستگاه لمسی است یا کاربر کاهش حرکت را ترجیح می‌دهد، نشانگر سفارشی را اعمال نکن
    if (isTouchDevice() || prefersReducedMotion) {
      return;
    }

    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;

    if (!cursor || !cursorFollower) return; // اگر المنت‌ها موجود نیستند، خارج شو

    // پنهان کردن نشانگر پیش‌فرض سیستم
    document.body.style.cursor = 'none';

    let mouseX = 0; // موقعیت X ماوس
    let mouseY = 0; // موقعیت Y ماوس
    let followerX = 0; // موقعیت X دنبال‌کننده
    let followerY = 0; // موقعیت Y دنبال‌کننده

    // هندلر حرکت ماوس
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // به‌روزرسانی موقعیت نشانگر اصلی
      cursor.style.left = `${mouseX - size / 2}px`;
      cursor.style.top = `${mouseY - size / 2}px`;
    };

    // تابع انیمیشن برای حرکت نرم دنبال‌کننده
    const animate = () => {
      // انیمیشن نرم دنبال‌کننده
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

      cursorFollower.style.left = `${followerX - size / 2}px`;
      cursorFollower.style.top = `${followerY - size / 2}px`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove); // افزودن شنونده رویداد حرکت ماوس
    animationFrameRef.current = requestAnimationFrame(animate); // شروع انیمیشن

    // تابع cleanup هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = 'auto'; // بازگرداندن نشانگر پیش‌فرض
    };
  }, [size, color, borderWidth, borderColor]); // وابستگی‌ها

  return { cursorRef, cursorFollowerRef }; // بازگرداندن رفرنس‌ها
}
