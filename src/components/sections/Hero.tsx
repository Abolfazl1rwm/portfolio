import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, FileText, Github, Linkedin, Mail, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CONTACT_EMAIL_HREF, LINKEDIN_URL, TELEGRAM_URL, GITHUB_URL } from '@/config/contact';
import { useCountUp } from '@/hooks/useCountUp';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import { useGithubStats } from '@/hooks/useGithubStats';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// لینک تلگرام برای ارسال پروژه (اگر ربات اختصاصی تنظیم شده باشد از آن، وگرنه آیدی شخصی)
const telegramProjectUrl = import.meta.env['VITE_TELEGRAM_PROJECT_BOT_URL'] || TELEGRAM_URL;
// URL تلگرام برای تماس مستقیم
const telegramContactUrl = TELEGRAM_URL;

// کارت آماری که عدد آن هنگام ورود به دید، از صفر تا مقدار هدف بالا می‌شمارد
function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="glass-card stat-card p-4 rounded-lg">
      <div className="text-2xl font-bold text-primary" dir="ltr">
        {value}
        {suffix}
      </div>
      <div className="text-xs text-foreground/60">{label}</div>
    </div>
  );
}

// کامپوننت Hero برای بخش اصلی صفحه
export function Hero() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [displayedText, setDisplayedText] = useState(''); // متن در حال نمایش با افکت تایپ
  const [fullText, setFullText] = useState(''); // متن کامل عنوان
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false); // وضعیت باز بودن دیالوگ انتخاب روش ارسال پروژه
  const sectionRef = useRef<HTMLElement>(null); // رفرنس بخش برای محاسبه پارالاکس هنگام اسکرول

  // پارالاکس: محو تدریجی محتوا هنگام اسکرول به پایین (بدون هیچ بلوب رنگی پس‌زمینه‌ای)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const magneticRef = useMagneticButton({ strength: 0.25, maxDistance: 80 }); // اثر مغناطیسی روی دکمهٔ اصلی CTA
  const { publicRepos, followers, loading: githubLoading } = useGithubStats(); // آمار زندهٔ گیت‌هاب

  // تنظیم متن کامل عنوان بر اساس زبان
  useEffect(() => {
    setFullText(t('hero.headline'));
  }, [t]);

  // افکت تایپ برای عنوان اصلی
  useEffect(() => {
    if (!fullText) return;

    setDisplayedText('');
    let index = 0;
    const interval = window.setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index += 1;
      } else {
        window.clearInterval(interval);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [fullText]);

  // اسکرول به بخش مورد نظر
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // انتخاب روش ارسال پروژه از طریق وب‌سایت
  const chooseWebsiteSubmission = () => {
    setIsProjectDialogOpen(false);
    window.setTimeout(() => scrollTo('start-working'), 150);
  };

  // انتخاب روش ارسال پروژه از طریق تلگرام
  const chooseTelegramSubmission = () => {
    window.open(telegramProjectUrl, '_blank', 'noopener,noreferrer');
    setIsProjectDialogOpen(false);
  };

  // واریانت‌های انیمیشن برای کانتینر اصلی
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* پس‌زمینه: بدون هیچ گرادیانت یا بلوب رنگی — فقط بافت گرین ظریف روی رنگ تخت */}
      <div className="absolute inset-0 -z-10">
        <div className="noise-bg" />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: contentOpacity }}
      >
        {/* بنر وضعیت در دسترس بودن */}
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.025]"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-primary">{t('hero.badge')}</span>
        </motion.div>

        {/* عنوان اصلی با افکت تایپ */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gradient min-h-[1.2em]"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </motion.h1>

        {/* زیرعنوان */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* کارت‌های آمار — دو مورد اول از API گیت‌هاب به‌صورت زنده واکشی می‌شوند */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12 max-w-md mx-auto [&>*]:w-28">
          {/* اگر API گیت‌هاب در دسترس نباشد، عدد ساختگی نشان داده نمی‌شود */}
          {(githubLoading || publicRepos != null) && (
            <StatCounter target={githubLoading ? 0 : publicRepos ?? 0} suffix="+" label={t('hero.stats.projects')} />
          )}
          {(githubLoading || followers != null) && (
            <StatCounter target={githubLoading ? 0 : followers ?? 0} suffix="" label={t('hero.stats.followers')} />
          )}
          <StatCounter target={5} suffix="+" label={t('hero.stats.experience')} />
        </motion.div>

        {/* دکمه‌های فراخوان عمل (CTA) */}
        <motion.div
          variants={itemVariants}
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
        >
          <Button
            ref={magneticRef}
            size="lg"
            className="button-sheen bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 glow-ring transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            onClick={() => setIsProjectDialogOpen(true)}
          >
            {t('hero.cta1')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="button-sheen rounded-full px-8 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            onClick={() => scrollTo('portfolio')}
          >
            {t('hero.cta2')}
          </Button>
        </motion.div>

        {/* لینک‌های شبکه‌های اجتماعی */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-center mb-12">
          {[
            { icon: Github, href: GITHUB_URL, label: 'GitHub' },
            { icon: Linkedin, href: LINKEDIN_URL, label: 'LinkedIn' },
            { icon: Mail, href: CONTACT_EMAIL_HREF, label: 'Email' },
            { icon: MessageCircle, href: telegramContactUrl, label: 'Telegram' },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="social-orb p-3 rounded-full bg-primary/10 hover:bg-primary/20"
                aria-label={social.label}
              >
                <Icon size={20} className="text-primary" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* دکمه اسکرول به پایین */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2">
          <p className="text-sm text-foreground/50">{t('hero.scroll')}</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={24} className="text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* دیالوگ انتخاب روش ارسال پروژه */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle>{t('projectChoice.title')}</DialogTitle>
            <DialogDescription>{t('projectChoice.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* دکمه ارسال از طریق وب‌سایت */}
            <button
              type="button"
              onClick={chooseWebsiteSubmission}
              className={`group choice-card rounded-xl border border-border bg-card p-5 text-left hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary ${isRTL ? 'text-right' : ''}`}
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                <FileText size={24} />
              </span>
              <span className="block text-lg font-semibold text-foreground">{t('projectChoice.website.title')}</span>
              <span className="mt-2 block text-sm leading-6 text-foreground/65">{t('projectChoice.website.description')}</span>
              <span className="mt-4 inline-flex text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">{t('projectChoice.website.button')}</span>
            </button>
            {/* دکمه ارسال از طریق تلگرام */}
            <button
              type="button"
              onClick={chooseTelegramSubmission}
              className={`group choice-card rounded-xl border border-border bg-card p-5 text-left hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary ${isRTL ? 'text-right' : ''}`}
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                <Send size={24} />
              </span>
              <span className="block text-lg font-semibold text-foreground">{t('projectChoice.telegram.title')}</span>
              <span className="mt-2 block text-sm leading-6 text-foreground/65">{t('projectChoice.telegram.description')}</span>
              <span className="mt-4 inline-flex text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">{t('projectChoice.telegram.button')}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
