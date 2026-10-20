import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// تعریف لیست مطالعات موردی با کلید و فناوری‌ها
// نکته: اتوماسیون متاتریدر عمداً ردیف اول قرار گرفته
const caseStudies = [
  {
    key: 'metatrader',
    tech: ['Python', 'MetaTrader API', 'Kavenegar SMS'],
  },
  {
    key: 'one',
    tech: ['Python', 'Telegram Bot API', 'PostgreSQL'],
  },
  {
    key: 'two',
    tech: ['C++', 'Cross-Platform', 'SQLite'],
  },
  {
    key: 'three',
    tech: ['Python', 'Machine Learning', 'AI'],
  },
  {
    key: 'four',
    tech: ['Django', 'Next.js', 'SQL'],
  },
  {
    key: 'devops',
    tech: ['Docker', 'CI/CD', 'Linux'],
  },
];

// حداکثر ارتفاع کارت‌ها در حالت جمع‌شده (تقریباً یک ردیف کامل + نیمی از ردیف دوم)
const COLLAPSED_HEIGHT = 760;

// کامپوننت CaseStudies برای نمایش مطالعات موردی
export function CaseStudies() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [expanded, setExpanded] = useState(false); // آیا همهٔ مطالعات موردی نمایش داده می‌شوند؟
  const contentRef = useRef<HTMLDivElement>(null); // رفرنس به گرید کامل برای اندازه‌گیری ارتفاع واقعی
  const [fullHeight, setFullHeight] = useState<number>(COLLAPSED_HEIGHT); // ارتفاع کامل محتوا (اندازه‌گیری‌شده)

  // اندازه‌گیری ارتفاع واقعی محتوا هنگام mount و تغییر اندازهٔ صفحه
  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setFullHeight(contentRef.current.scrollHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // واریانت‌های انیمیشن برای کانتینر اصلی
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم مطالعه موردی
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  return (
    <section id="case-studies" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-6xl mx-auto">
        {/* هدر بخش مطالعات موردی */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{t('caseStudies.title')}</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('caseStudies.subtitle')}</p>
        </motion.div>

        {/* بستهٔ محدودکنندهٔ ارتفاع: در حالت بسته فقط بخشی از ردیف دوم دیده می‌شود */}
        <motion.div
          className="relative overflow-hidden"
          animate={{ height: expanded ? fullHeight : Math.min(COLLAPSED_HEIGHT, fullHeight) }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* گرید مطالعات موردی: چیدمان ۲ ستون */}
          <motion.div
            ref={contentRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {caseStudies.map((study) => {
              const prefix = `caseStudies.${study.key}`; // پیشوند برای کلیدهای ترجمه

              return (
                <motion.div key={study.key} variants={itemVariants} className="group relative">
                  <div className="glass-card interactive-card flex h-full flex-col overflow-hidden rounded-2xl">
                    {/* بخش بصری کوچک بالای کارت */}
                    <div className="relative h-36 shrink-0 overflow-hidden bg-primary">
                      <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%,rgba(68,68,68,.2))] bg-[length:60px_60px]" />
                      </div>
                      <div className="relative z-10 flex h-full items-center justify-center">
                        <div className="text-center text-primary-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                          <Zap size={32} className="mx-auto mb-2 opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                          <p className="text-base font-semibold opacity-90">{t(`${prefix}.title`)}</p>
                        </div>
                      </div>
                    </div>

                    {/* بخش توضیحات مطالعه موردی */}
                    <div className="relative z-10 flex flex-1 flex-col p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                      <div className="mb-4 space-y-3">
                        {/* بخش چالش (Problem) */}
                        <div className="flex gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
                            <AlertCircle size={16} className="text-red-500" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="mb-0.5 text-sm font-semibold text-foreground">{t('caseStudies.problem')}</h4>
                            <p className="text-sm text-foreground/70">{t(`${prefix}.problem`)}</p>
                          </div>
                        </div>

                        {/* بخش راهکار (Solution) */}
                        <div className="flex gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20">
                            <Lightbulb size={16} className="text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="mb-0.5 text-sm font-semibold text-foreground">{t('caseStudies.solution')}</h4>
                            <p className="text-sm text-foreground/70">{t(`${prefix}.solution`)}</p>
                          </div>
                        </div>

                        {/* بخش نتیجه (Result) */}
                        <div className="flex gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
                            <CheckCircle2 size={16} className="text-green-500" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="mb-0.5 text-sm font-semibold text-foreground">{t('caseStudies.result')}</h4>
                            <p className="text-sm text-foreground/70">{t(`${prefix}.result`)}</p>
                          </div>
                        </div>
                      </div>

                      {/* بخش فناوری‌ها */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {study.tech.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* بخش تأثیر تجاری (Business Impact) */}
                      <div className="mt-auto flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/10 p-3 transition-colors duration-200 group-hover:bg-accent/15">
                        <TrendingUp size={20} className="shrink-0 text-accent" />
                        <div className="min-w-0">
                          <p className="text-xs text-foreground/60">{t('caseStudies.impact')}</p>
                          <p className="truncate text-sm font-semibold text-accent">{t(`${prefix}.impact`)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* محو تدریجی پایین کارت‌ها هنگام بسته بودن، برای نشان دادن که ادامه دارد */}
          {!expanded && fullHeight > COLLAPSED_HEIGHT && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
          )}
        </motion.div>

        {/* دکمهٔ نمایش بیشتر / کمتر */}
        {fullHeight > COLLAPSED_HEIGHT && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="glass-card flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:text-accent"
            >
              {expanded ? t('caseStudies.viewLess') : t('caseStudies.viewMore')}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
