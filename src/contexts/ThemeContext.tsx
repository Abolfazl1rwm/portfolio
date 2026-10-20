import React, { createContext, useContext, useEffect, useState } from "react";

// تعریف انواع تم‌های پشتیبانی شده
type Theme = "light" | "dark";

// تعریف رابط برای محتوای Context تم
interface ThemeContextType {
  theme: Theme; // تم فعلی
  toggleTheme?: () => void; // تابع برای تغییر تم (اختیاری، فقط در صورت switchable بودن)
  setTheme?: (next: Theme, origin?: { x: number; y: number }) => void; // تابع برای تنظیم مستقیم یک تم مشخص (اختیاری، فقط در صورت switchable بودن)
  switchable: boolean; // آیا قابلیت تغییر تم فعال است؟
}

// ایجاد Context تم
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// تعریف رابط برای ویژگی‌های (Props) کامپوننت ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode; // محتوای فرزندان کامپوننت
  defaultTheme?: Theme; // تم پیش‌فرض
  switchable?: boolean; // آیا قابلیت تغییر تم فعال باشد؟
}

// نوع سند با پشتیبانی احتمالی از View Transition API
// (به‌جای @ts-expect-error، از یک cast امن استفاده می‌کنیم که با هر نسخه‌ای از تایپ‌های DOM کار می‌کند)
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

// بررسی پشتیبانی مرورگر از View Transition API (برای گذار نرم تصویری بین تم‌ها)
function supportsViewTransition(): boolean {
  return typeof document !== "undefined" && typeof (document as DocumentWithViewTransition).startViewTransition === "function";
}

// کامپوننت ThemeProvider برای فراهم کردن Context تم در سراسر برنامه
export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // مقدار اولیه امن برای SSR: همیشه defaultTheme (چون در سرور به localStorage دسترسی نداریم)
    return defaultTheme;
  });

  const [hydrated, setHydrated] = useState(false); // تا قبل از خواندن تم ذخیره‌شده، چیزی ذخیره نمی‌کنیم (وگرنه انتخاب کاربر پاک می‌شد)

  // useEffect برای بازیابی تم ذخیره‌شده از localStorage پس از mount شدن در مرورگر (فقط وقتی switchable فعال است)
  useEffect(() => {
    if (!switchable || typeof window === "undefined") return;
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchable]);

  // useEffect برای اعمال تم به تگ html و ذخیره در localStorage
  useEffect(() => {
    const root = document.documentElement; // دسترسی به تگ html
    if (theme === "dark") {
      root.classList.add("dark"); // افزودن کلاس dark برای تم تیره
    } else {
      root.classList.remove("dark"); // حذف کلاس dark برای تم روشن
    }

    // اگر قابلیت تغییر تم فعال باشد، تم را در localStorage ذخیره می‌کند
    if (switchable && hydrated) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable, hydrated]); // وابستگی‌ها: theme و switchable

  // تنظیم مستقیم یک تم مشخص، با گذار نرم و انیمیشنی (افکت دایره‌ای از نقطهٔ کلیک) به‌جای پرش ناگهانی رنگ‌ها
  // از View Transition API استفاده می‌کند (در مرورگرهایی که پشتیبانی نمی‌کنند، به‌صورت معمولی تغییر می‌کند)
  const setTheme = (next: Theme, origin?: { x: number; y: number }) => {
    if (!switchable || next === theme) return;

    const root = document.documentElement;
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);

    if (supportsViewTransition()) {
      (document as DocumentWithViewTransition).startViewTransition?.(() => {
        setThemeState(next);
      });
    } else {
      setThemeState(next);
    }
  };

  // تابع toggleTheme برای تغییر بین تم روشن و تیره (با همان گذار نرم)
  const toggleTheme = () => {
    if (!switchable) return;
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

// هوک سفارشی برای استفاده از Context تم
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider"); // اطمینان از استفاده صحیح از هوک
  }
  return context;
}
