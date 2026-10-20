import { useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

// کامپوننت ThemeToggle برای تغییر تم (روشن/تیره) سایت
export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // استفاده از هوک useTheme برای دسترسی به تم فعلی و تابع تغییر تم
  const { t } = useLanguage(); // استفاده از هوک useLanguage برای ترجمه
  const buttonRef = useRef<HTMLButtonElement>(null);
  const label = theme === 'dark' ? t('command.lightTheme') : t('command.darkTheme'); // برچسب دکمه بر اساس تم فعلی

  // تغییر تم به همراه مختصات کلیک، تا گذار دایره‌ای (View Transition) از همین نقطه شروع شود
  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined;
    setTheme?.(theme === 'dark' ? 'light' : 'dark', origin);
  };

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick} // فراخوانی تابع تغییر تم هنگام کلیک
      className="relative w-10 h-10 rounded-full transition-colors duration-300" // کلاس‌های Tailwind CSS برای استایل‌دهی
      aria-label={label} // برچسب دسترسی‌پذیری
      title={label} // عنوان دکمه
    >
      {/* آیکون خورشید برای تم روشن */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* آیکون ماه برای تم تیره */}
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
