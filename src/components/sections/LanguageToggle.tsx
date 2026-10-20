import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

// کامپوننت LanguageToggle برای تغییر زبان سایت
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage(); // استفاده از هوک useLanguage برای دسترسی به زبان فعلی، تابع تغییر زبان و تابع ترجمه

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1" role="group" aria-label={t('command.category.language')} dir="ltr"> {/* کانتینر اصلی دکمه‌های تغییر زبان */}
      <Button
        type="button"
        variant={language === 'en' ? 'default' : 'ghost'} // تغییر ظاهر دکمه بر اساس زبان فعال
        size="sm"
        onClick={() => setLanguage('en')} // تنظیم زبان به انگلیسی
        className="px-3 rounded-full transition-all duration-300" // کلاس‌های Tailwind CSS برای استایل‌دهی
        aria-label={t('command.english')} // برچسب دسترسی‌پذیری
        aria-pressed={language === 'en'} // وضعیت فشرده بودن دکمه
      >
        EN {/* متن دکمه برای انگلیسی */}
      </Button>
      <Button
        type="button"
        variant={language === 'fa' ? 'default' : 'ghost'} // تغییر ظاهر دکمه بر اساس زبان فعال
        size="sm"
        onClick={() => setLanguage('fa')} // تنظیم زبان به فارسی
        className="px-3 rounded-full transition-all duration-300" // کلاس‌های Tailwind CSS برای استایل‌دهی
        aria-label={t('command.persian')} // برچسب دسترسی‌پذیری
        aria-pressed={language === 'fa'} // وضعیت فشرده بودن دکمه
      >
        فا {/* متن دکمه برای فارسی */}
      </Button>
    </div>
  );
}
