import * as React from "react";

// نقطه شکست (breakpoint) برای تشخیص دستگاه موبایل
const MOBILE_BREAKPOINT = 768;

// هوک useIsMobile برای تشخیص اینکه آیا صفحه در حالت موبایل است یا خیر
export function useIsMobile() {
  // وضعیت (state) برای نگهداری وضعیت موبایل بودن، با مقدار اولیه undefined
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  // useEffect برای اضافه کردن شنونده رویداد تغییر اندازه صفحه
  React.useEffect(() => {
    // ایجاد یک Media Query List برای تشخیص عرض صفحه
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // تابع هندلر برای به‌روزرسانی وضعیت isMobile
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // اضافه کردن شنونده رویداد تغییر Media Query
    mql.addEventListener("change", onChange);
    // تنظیم وضعیت اولیه isMobile
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // تابع cleanup برای حذف شنونده رویداد هنگام unmount شدن کامپوننت
    return () => mql.removeEventListener("change", onChange);
  }, []); // این useEffect فقط یک بار پس از رندر اولیه اجرا می‌شود

  // بازگرداندن وضعیت isMobile (تبدیل undefined به false)
  return !!isMobile;
}
