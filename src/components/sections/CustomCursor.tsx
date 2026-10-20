import { useCustomCursor } from '@/hooks/useCustomCursor';

// کامپوننت CustomCursor برای نمایش نشانگر ماوس سفارشی
export function CustomCursor() {
  // استفاده از هوک useCustomCursor برای مدیریت منطق نشانگر ماوس
  const { cursorRef, cursorFollowerRef } = useCustomCursor({
    size: 20, // اندازه نشانگر اصلی
    borderColor: 'var(--primary)', // رنگ حاشیه نشانگر (این مقدار فعلاً در هوک استفاده نمی‌شود؛ رنگ واقعی از کلاس Tailwind می‌آید)
    borderWidth: 2, // ضخامت حاشیه نشانگر
  });

  return (
    <>
      {/* نشانگر اصلی (Main cursor) */}
      <div
        ref={cursorRef} // رفرنس به المنت نشانگر اصلی
        className="pointer-events-none fixed z-[9999] w-5 h-5 border-2 border-primary rounded-full" // کلاس‌های Tailwind CSS برای استایل‌دهی
      />

      {/* دنبال‌کننده نشانگر (Cursor follower) */}
      <div
        ref={cursorFollowerRef} // رفرنس به المنت دنبال‌کننده نشانگر
        className="pointer-events-none fixed z-[9998] w-8 h-8 border-2 border-primary rounded-full opacity-50" // کلاس‌های Tailwind CSS برای استایل‌دهی
      />
    </>
  );
}
