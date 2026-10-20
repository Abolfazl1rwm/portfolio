import { useRef } from "react";

type noop = (...args: any[]) => any;

/**
 * usePersistFn به جای useCallback برای کاهش بار شناختی
 */
// هوک usePersistFn برای ایجاد یک تابع پایدار که همیشه به آخرین نسخه خود اشاره می‌کند
export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn); // رفرنس برای نگهداری آخرین نسخه تابع
  fnRef.current = fn; // به‌روزرسانی رفرنس با آخرین نسخه تابع در هر رندر

  const persistFn = useRef<T>(null); // رفرنس برای نگهداری تابع پایدار
  if (!persistFn.current) {
    // اگر تابع پایدار هنوز ایجاد نشده است، آن را ایجاد کن
    persistFn.current = function (this: unknown, ...args) {
      // فراخوانی آخرین نسخه تابع با حفظ context (this) و آرگومان‌ها
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current!; // بازگرداندن تابع پایدار
}
