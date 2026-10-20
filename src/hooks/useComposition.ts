import { useRef } from "react";
import { usePersistFn } from "./usePersistFn";

// تعریف رابط برای مقدار بازگشتی هوک useComposition
export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>; // هندلر شروع ترکیب ورودی
  onCompositionEnd: React.CompositionEventHandler<T>; // هندلر پایان ترکیب ورودی
  onKeyDown: React.KeyboardEventHandler<T>; // هندلر رویداد فشردن کلید
  isComposing: () => boolean; // تابعی برای بررسی اینکه آیا در حال ترکیب ورودی هستیم یا خیر
}

// تعریف رابط برای گزینه‌های (Options) هوک useComposition
export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>; // هندلر اختیاری برای رویداد فشردن کلید
  onCompositionStart?: React.CompositionEventHandler<T>; // هندلر اختیاری برای شروع ترکیب ورودی
  onCompositionEnd?: React.CompositionEventHandler<T>; // هندلر اختیاری برای پایان ترکیب ورودی
}

// تعریف نوع برای پاسخ تایمر (setTimeout)
type TimerResponse = ReturnType<typeof setTimeout>;

// هوک useComposition برای مدیریت رویدادهای ترکیب ورودی (مانند IME در زبان‌های آسیایی)
export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown, // هندلر اصلی onKeyDown
    onCompositionStart: originalOnCompositionStart, // هندلر اصلی onCompositionStart
    onCompositionEnd: originalOnCompositionEnd, // هندلر اصلی onCompositionEnd
  } = options;

  const c = useRef(false); // رفرنس برای نگهداری وضعیت ترکیب ورودی
  const timer = useRef<TimerResponse | null>(null); // رفرنس برای تایمر اول
  const timer2 = useRef<TimerResponse | null>(null); // رفرنس برای تایمر دوم

  // هندلر شروع ترکیب ورودی
  const onCompositionStart = usePersistFn((e: React.CompositionEvent<T>) => {
    // پاک کردن تایمرهای قبلی در صورت وجود
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (timer2.current) {
      clearTimeout(timer2.current);
      timer2.current = null;
    }
    c.current = true; // تنظیم وضعیت ترکیب ورودی به true
    originalOnCompositionStart?.(e); // فراخوانی هندلر اصلی (در صورت وجود)
  });

  // هندلر پایان ترکیب ورودی
  const onCompositionEnd = usePersistFn((e: React.CompositionEvent<T>) => {
    // استفاده از دو لایه setTimeout برای حل مشکل Safari که در آن compositionEnd زودتر از onKeyDown فعال می‌شود
    timer.current = setTimeout(() => {
      timer2.current = setTimeout(() => {
        c.current = false; // تنظیم وضعیت ترکیب ورودی به false
      });
    });
    originalOnCompositionEnd?.(e); // فراخوانی هندلر اصلی (در صورت وجود)
  });

  // هندلر رویداد فشردن کلید
  const onKeyDown = usePersistFn((e: React.KeyboardEvent<T>) => {
    // در حالت ترکیب ورودی، از انتشار رویدادهای ESC و Enter (به جز Shift+Enter) جلوگیری می‌کند
    if (
      c.current &&
      (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey))
    ) {
      e.stopPropagation(); // جلوگیری از انتشار رویداد
      return;
    }
    originalOnKeyDown?.(e); // فراخوانی هندلر اصلی (در صورت وجود)
  });

  // تابعی برای بررسی وضعیت ترکیب ورودی
  const isComposing = usePersistFn(() => {
    return c.current;
  });

  // بازگرداندن هندلرها و تابع بررسی وضعیت
  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}
