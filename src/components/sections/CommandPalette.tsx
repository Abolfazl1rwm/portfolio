import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  Code,
  Command as CommandIcon,
  Github,
  Globe,
  Home,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  PlayCircle,
  Search,
  Send,
  Sun,
  User,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CONTACT_EMAIL_HREF, LINKEDIN_URL, TELEGRAM_URL, GITHUB_URL } from '@/config/contact';
import { Input } from '@/components/ui/input';

// تعریف انواع دسته‌بندی دستورات
type CommandCategory = 'navigation' | 'social' | 'theme' | 'language' | 'action';

// تعریف رابط برای هر آیتم دستور
interface CommandItem {
  id: string; // شناسه منحصر به فرد دستور
  label: string; // برچسب قابل نمایش دستور
  description: string; // توضیحات دستور
  icon: React.ReactNode; // آیکون دستور
  action: () => void; // تابعی که با اجرای دستور فراخوانی می‌شود
  category: CommandCategory; // دسته‌بندی دستور
}

// URL ربات تلگرام پروژه (از متغیرهای محیطی خوانده می‌شود)
const telegramProjectUrl = TELEGRAM_URL;

// کامپوننت CommandPalette برای نمایش پالت دستورات
export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false); // وضعیت باز یا بسته بودن پالت
  const [search, setSearch] = useState(''); // وضعیت متن جستجو
  const [selectedIndex, setSelectedIndex] = useState(0); // وضعیت آیتم انتخاب شده
  const { language, setLanguage, t, isRTL } = useLanguage(); // هوک زبان برای ترجمه و جهت‌دهی
  const { theme, toggleTheme } = useTheme(); // هوک تم برای تغییر تم

  // تابع برای بستن پالت دستورات
  const close = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  // تابع برای اسکرول به یک بخش خاص در صفحه
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    close(); // بستن پالت پس از اسکرول
  };

  // تعریف لیست دستورات موجود با استفاده از useMemo برای بهینه‌سازی
  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: 'home',
        label: t('command.home'),
        description: t('command.home.description'),
        icon: <Home className="w-4 h-4" />,
        action: () => scrollTo('home'),
        category: 'navigation',
      },
      {
        id: 'about',
        label: t('command.about'),
        description: t('command.about.description'),
        icon: <User className="w-4 h-4" />,
        action: () => scrollTo('about'),
        category: 'navigation',
      },
      {
        id: 'timeline',
        label: t('nav.timeline'),
        description: t('timeline.subtitle'),
        icon: <Clock className="w-4 h-4" />,
        action: () => scrollTo('timeline'),
        category: 'navigation',
      },
      {
        id: 'services',
        label: t('command.services'),
        description: t('command.services.description'),
        icon: <Briefcase className="w-4 h-4" />,
        action: () => scrollTo('services'),
        category: 'navigation',
      },
      {
        id: 'portfolio',
        label: t('command.portfolio'),
        description: t('command.portfolio.description'),
        icon: <Code className="w-4 h-4" />,
        action: () => scrollTo('portfolio'),
        category: 'navigation',
      },
      {
        id: 'liveDemos',
        label: t('nav.liveDemos'),
        description: t('liveDemos.subtitle'),
        icon: <PlayCircle className="w-4 h-4" />,
        action: () => scrollTo('live-demos'),
        category: 'navigation',
      },
      {
        id: 'contact',
        label: t('command.contact'),
        description: t('command.contact.description'),
        icon: <Mail className="w-4 h-4" />,
        action: () => scrollTo('contact'),
        category: 'navigation',
      },
      {
        id: 'github',
        label: 'GitHub',
        description: t('command.github.description'),
        icon: <Github className="w-4 h-4" />,
        action: () => {
          window.open(GITHUB_URL, '_blank', 'noopener,noreferrer'); // باز کردن لینک گیت‌هاب
          close();
        },
        category: 'social',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        description: t('command.linkedin.description'),
        icon: <Linkedin className="w-4 h-4" />,
        action: () => {
          window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer'); // باز کردن لینک لینکدین
          close();
        },
        category: 'social',
      },
      {
        id: 'telegram',
        label: t('contact.telegram'),
        description: t('command.telegram.description'),
        icon: <Send className="w-4 h-4" />,
        action: () => {
          window.open(telegramProjectUrl, '_blank', 'noopener,noreferrer'); // باز کردن لینک تلگرام
          close();
        },
        category: 'social',
      },
      {
        id: 'email',
        label: t('contact.email'),
        description: t('command.email.description'),
        icon: <Mail className="w-4 h-4" />,
        action: () => {
          window.location.href = CONTACT_EMAIL_HREF; // ارسال ایمیل
          close();
        },
        category: 'social',
      },
      {
        id: 'theme-toggle',
        label: theme === 'dark' ? t('command.lightTheme') : t('command.darkTheme'),
        description: theme === 'dark' ? t('command.lightTheme.description') : t('command.darkTheme.description'),
        icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        action: () => {
          toggleTheme?.(); // تغییر تم
          close();
        },
        category: 'theme',
      },
      {
        id: 'lang-en',
        label: t('command.english'),
        description: t('command.english.description'),
        icon: <Globe className="w-4 h-4" />,
        action: () => {
          setLanguage('en'); // تغییر زبان به انگلیسی
          close();
        },
        category: 'language',
      },
      {
        id: 'lang-fa',
        label: t('command.persian'),
        description: t('command.persian.description'),
        icon: <Globe className="w-4 h-4" />,
        action: () => {
          setLanguage('fa'); // تغییر زبان به فارسی
          close();
        },
        category: 'language',
      },
      {
        id: 'ai-chat',
        label: t('command.ai'),
        description: t('command.ai.description'),
        icon: <MessageCircle className="w-4 h-4" />,
        action: () => {
          (document.querySelector('[data-ai-chat-button]') as HTMLButtonElement | null)?.click(); // باز کردن دستیار AI
          close();
        },
        category: 'action',
      },
    ],
    [language, t, theme] // وابستگی‌ها برای بازسازی لیست دستورات
  );

  // فیلتر کردن دستورات بر اساس متن جستجو
  const filteredCommands = useMemo(
    () =>
      commands.filter(
        (command) =>
          command.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          command.description.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [commands, search] // وابستگی‌ها: commands و search
  );

  // گروه‌بندی دستورات فیلتر شده بر اساس دسته‌بندی
  const groupedCommands = useMemo(
    () =>
      filteredCommands.reduce<Record<CommandCategory, CommandItem[]>>(
        (groups, command) => {
          groups[command.category].push(command);
          return groups;
        },
        { navigation: [], social: [], theme: [], language: [], action: [] } // گروه‌های اولیه
      ),
    [filteredCommands] // وابستگی: filteredCommands
  );

  // برچسب‌های دسته‌بندی برای نمایش در UI
  const categoryLabels: Record<CommandCategory, string> = {
    navigation: t('command.category.navigation'),
    social: t('command.category.social'),
    theme: t('command.category.theme'),
    language: t('command.category.language'),
    action: t('command.category.action'),
  };

  // گروه‌های قابل مشاهده (فقط گروه‌هایی که حداقل یک دستور دارند)
  const visibleGroups = (Object.entries(groupedCommands) as [CommandCategory, CommandItem[]][]).filter(
    ([, commands]) => commands.length > 0
  );

  // useEffect برای مدیریت رویدادهای کیبورد (باز و بسته کردن پالت، ناوبری)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // باز و بسته کردن پالت با Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
        setSearch('');
        setSelectedIndex(0);
        return;
      }

      if (!isOpen) return; // اگر پالت بسته است، کاری نکن

      // بستن پالت با Esc
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowDown') { // ناوبری به پایین
        event.preventDefault();
        setSelectedIndex((index) => (filteredCommands.length ? (index + 1) % filteredCommands.length : 0));
      } else if (event.key === 'ArrowUp') { // ناوبری به بالا
        event.preventDefault();
        setSelectedIndex((index) =>
          filteredCommands.length ? (index - 1 + filteredCommands.length) % filteredCommands.length : 0
        );
      } else if (event.key === 'Enter') { // اجرای دستور انتخاب شده با Enter
        event.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, isOpen, selectedIndex]); // وابستگی‌ها

  return (
    <>
      {/* دکمه باز کردن پالت دستورات */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSearch('');
          setSelectedIndex(0);
        }}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 p-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all duration-300 group`}
        title={t('command.open')}
        aria-label={t('command.open')}
      >
        <CommandIcon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
      </button>

      {/* نمایش پالت دستورات با انیمیشن */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* پس‌زمینه تیره و بلور شده */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            {/* کانتینر اصلی پالت */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4"
              dir={isRTL ? 'rtl' : 'ltr'} // تنظیم جهت‌دهی
            >
              <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden"> {/* استایل کارت پالت */}
                <div className="p-4 border-b border-border"> {/* بخش جستجو */}
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40`} /> {/* آیکون جستجو */}
                    <Input
                      autoFocus // فوکوس خودکار روی فیلد جستجو
                      placeholder={t('command.search')} // متن placeholder
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setSelectedIndex(0); // ریست کردن انتخاب پس از تغییر جستجو
                      }}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10'} // استایل برای جهت‌دهی
                      dir={isRTL ? 'rtl' : 'ltr'} // تنظیم جهت‌دهی
                    />
                  </div>
                </div>

                <div data-lenis-prevent className="max-h-96 overflow-y-auto"> {/* ناحیه اسکرول برای دستورات */}
                  {visibleGroups.length === 0 ? (
                    <div className="p-8 text-center text-foreground/60">{t('command.none')}</div> // پیام عدم یافتن دستور
                  ) : (
                    visibleGroups.map(([category, categoryCommands]) => ( // نمایش دستورات گروه‌بندی شده
                      <div key={category}> {/* دسته‌بندی دستورات */}
                        <div className={`px-4 py-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}> {/* عنوان دسته‌بندی */}
                          {categoryLabels[category]}
                        </div>
                        {categoryCommands.map((command) => {
                          const globalIndex = filteredCommands.findIndex((item) => item.id === command.id); // پیدا کردن ایندکس جهانی دستور
                          return (
                            <motion.button
                              key={command.id}
                              type="button"
                              onClick={command.action}
                              whileHover={{ backgroundColor: 'var(--color-secondary)' }} // انیمیشن هاور
                              className={`w-full px-4 py-3 flex items-center gap-3 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} transition-colors ${
                                globalIndex === selectedIndex ? 'bg-primary/10' : 'hover:bg-secondary'
                              }`} // استایل دستور
                            >
                              <div className="text-foreground/60">{command.icon}</div> {/* آیکون دستور */}
                              <div className="flex-1"> {/* محتوای دستور */}
                                <div className="font-medium text-foreground">{command.label}</div> {/* برچسب دستور */}
                                <div className="text-xs text-foreground/50">{command.description}</div> {/* توضیحات دستور */}
                              </div>
                              <kbd className="hidden md:inline-block px-2 py-1 text-xs font-semibold text-foreground/60 bg-secondary rounded">↵</kbd> {/* کلید Enter */}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* راهنمای کلیدهای میانبر */}
                <div className={`px-4 py-3 border-t border-border text-xs text-foreground/50 flex items-center ${isRTL ? 'justify-end' : 'justify-between'}`}>
                  <div>
                    <kbd className="inline-block px-2 py-1 mx-2 bg-secondary rounded">↑↓</kbd>
                    {t('command.navigate')}
                    <kbd className="inline-block px-2 py-1 mx-2 bg-secondary rounded">↵</kbd>
                    {t('command.select')}
                    <kbd className="inline-block px-2 py-1 mx-2 bg-secondary rounded">Esc</kbd>
                    {t('command.close')}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
