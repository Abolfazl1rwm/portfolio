import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, LINKEDIN_URL, TELEGRAM_URL, GITHUB_URL } from '@/config/contact';

// URL ربات تلگرام برای ارسال پروژه یا تماس مستقیم
const telegramProjectUrl = TELEGRAM_URL;

// کامپوننت Contact برای بخش تماس با ما
export function Contact() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // وضعیت کپی شدن اطلاعات تماس

  // لینک‌های تماس و شبکه‌های اجتماعی
  // توجه: مقدار خام (value) دیگر به‌صورت متن روی کارت نمایش داده نمی‌شود؛
  // فقط برای دکمهٔ «کپی» و لینک واقعی (href) استفاده می‌شود.
  const contactLinks = [
    {
      icon: Github,
      label: 'GitHub',
      value: GITHUB_URL,
      href: GITHUB_URL,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: LINKEDIN_URL,
      href: LINKEDIN_URL,
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: CONTACT_EMAIL,
      href: CONTACT_EMAIL_HREF,
    },
    {
      icon: MessageCircle,
      label: t('contact.telegram'),
      value: telegramProjectUrl,
      href: telegramProjectUrl,
    },
  ];

  // هندل کردن کپی اطلاعات تماس در کلیپ‌بورد
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2000); // پاک کردن وضعیت کپی پس از 2 ثانیه
    } catch (error) {
      console.error('Could not copy contact information:', error);
    }
  };

  // واریانت‌های انیمیشن برای کانتینر اصلی
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  // واریانت‌های انیمیشن برای هر آیتم تماس
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
  };

  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background/50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* هدر بخش تماس با ما */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{t('contact.title')}</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </motion.div>

        {/* لیست لینک‌های تماس — فقط آیکون و برچسب نمایش داده می‌شود؛ با کلیک وارد می‌شوید و با دکمه کپی، لینک کپی می‌شود */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contactLinks.map((contact, index) => {
            const Icon = contact.icon;
            const isExternal = contact.href.startsWith('http');
            return (
              <motion.div
                key={contact.href}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="group glass-card p-6 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 flex items-center gap-4"
              >
                <a
                  href={contact.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`flex flex-1 min-w-0 items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  aria-label={contact.label}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon size={24} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{contact.label}</h3>
                  </div>
                </a>
                {/* دکمه کپی */}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(contact.value, index)}
                  className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                  aria-label={copiedIndex === index ? t('contact.copied') : `${t('contact.copy')} ${contact.label}`}
                >
                  {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* بخش موقعیت مکانی */}
        <motion.div
          className="glass-card p-8 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={24} className="text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{t('contact.location')}</h3>
          </div>
          <p className="text-foreground/70 mb-6">{t('contact.locationDescription')}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              type="button"
              onClick={() => window.open('https://maps.google.com/?q=Mashhad,Iran', '_blank', 'noopener,noreferrer')}
              className="rounded-full"
            >
              {t('contact.viewMap')}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleCopy(t('contact.location'), 4)} className="rounded-full">
              {copiedIndex === 4 ? t('contact.copied') : t('contact.copyLocation')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
