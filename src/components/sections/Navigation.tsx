import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

// کامپوننت Navigation برای نوار ناوبری سایت
export function Navigation() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [isOpen, setIsOpen] = useState(false); // وضعیت باز یا بسته بودن منوی موبایل

  // نوار پیشرفت اسکرول صفحه (با کمی نرمی فنری برای حس طبیعی‌تر)
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // آیتم‌های ناوبری
  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.timeline'), href: '#timeline' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.liveDemos'), href: '#live-demos' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  // تابع برای اسکرول به بخش مورد نظر
  const navigateTo = (href: string) => {
    const targetId = href.slice(1);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false); // بستن منوی موبایل پس از ناوبری
  };

  // هندل کردن ناوبری با کلیک روی لینک‌ها
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    window.history.replaceState(null, '', href);
    navigateTo(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* نوار نازک پیشرفت اسکرول در پایین نوار ناوبری */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
        style={{ scaleX: scrollProgress }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* لوگو یا نام سایت */}
          <div className="min-w-0 shrink">
            <a
              href="#home"
              onClick={(event) => handleNavigation(event, '#home')}
              className="block truncate text-base font-bold text-gradient sm:text-xl lg:text-2xl"
              aria-label={t('nav.home')}
            >
              Abolfazl Ranjbaran
            </a>
          </div>

          {/* آیتم‌های ناوبری برای دسکتاپ */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigation(event, item.href)}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* دکمه تغییر زبان، تم و منوی موبایل */}
          <div className={`flex shrink-0 items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ThemeToggle />
            <LanguageToggle />
            {/* دکمه باز و بسته کردن منوی موبایل */}
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {isOpen && (
          <div id="mobile-navigation" className={`md:hidden pb-4 space-y-2 ${isRTL ? 'text-right' : ''}`}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigation(event, item.href)}
                className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
