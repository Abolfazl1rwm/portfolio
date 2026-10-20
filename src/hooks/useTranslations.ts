import { useLanguage } from '@/contexts/LanguageContext';

// هوک useTranslations برای دسترسی آسان به تابع ترجمه (t)
export function useTranslations() {
  const { t } = useLanguage(); // استفاده از هوک useLanguage برای دسترسی به تابع ترجمه
  return { t }; // بازگرداندن تابع ترجمه
}
