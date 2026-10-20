import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_EMAIL_HREF, LINKEDIN_URL, TELEGRAM_URL, GITHUB_URL } from '@/config/contact';

// URL ربات تلگرام برای ارسال پروژه یا تماس مستقیم
const telegramProjectUrl = TELEGRAM_URL;

// کامپوننت Footer برای بخش پایینی سایت
export function Footer() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const currentYear = new Date().getFullYear(); // سال جاری برای کپی‌رایت

  // لینک‌های شبکه‌های اجتماعی
  const socialLinks = [
    { icon: Github, href: GITHUB_URL, label: 'GitHub' },
    { icon: Linkedin, href: LINKEDIN_URL, label: 'LinkedIn' },
    { icon: Mail, href: CONTACT_EMAIL_HREF, label: t('contact.email') },
    { icon: MessageCircle, href: telegramProjectUrl, label: t('contact.telegram') },
  ];

  // لینک‌های سریع ناوبری
  const quickLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-md" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* بخش اصلی فوتر با گرید سه ستونه */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* ستون معرفی برند */}
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-2">Abolfazl Ranjbaran</h3>
            <p className="text-foreground/60">{t('footer.description')}</p>
          </div>

          {/* ستون لینک‌های سریع */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-foreground/60">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون ارتباط با ما و شبکه‌های اجتماعی */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.connect')}</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                const isExternal = link.href.startsWith('http');
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* خط جداکننده */}
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-8" />

        {/* بخش کپی‌رایت و لینک‌های حقوقی */}
        <motion.div
          className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60 ${
            isRTL ? 'md:flex-row-reverse' : ''
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>&copy; {currentYear} Abolfazl Ranjbaran. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
