import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Code2, Smartphone, Brain, Cloud, Bot, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// یک گروه فناوری (مثلاً «Frontend» درون دستهٔ توسعه وب)
interface TechGroup {
  label?: string; // برچسب اختیاری گروه (مثل Frontend / Backend)
  items: string[]; // فناوری‌های این گروه
}

// تعریف لیست سرویس‌ها به همراه فناوری‌های هر کدام (قابل باز و بسته شدن)
const services: { icon: typeof Code2; key: string; groups: TechGroup[] }[] = [
  {
    icon: Code2,
    key: 'programming',
    groups: [{ items: ['Python', 'C / C++', 'JavaScript', 'OOP', 'Design Patterns'] }],
  },
  {
    icon: Globe,
    key: 'web',
    groups: [
      { label: 'Frontend', items: ['HTML / CSS', 'JavaScript / TypeScript'] },
      { label: 'Backend', items: ['Django', 'Flask'] },
    ],
  },
  {
    icon: Smartphone,
    key: 'mobile',
    groups: [{ items: ['Qt', 'Flutter'] }],
  },
  {
    icon: Brain,
    key: 'ai',
    groups: [{ items: ['Python', 'TensorFlow / PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'] }],
  },
  {
    icon: Cloud,
    key: 'cloud',
    groups: [{ items: ['Docker', 'CI/CD', 'Linux Server', 'Git & GitHub Actions', 'Nginx'] }],
  },
  {
    icon: Bot,
    key: 'automation',
    groups: [{ items: ['Telegram Bots (Python)', 'Selenium / Playwright', 'Kavenegar SMS API', 'Workflow Automation'] }],
  },
];

// کامپوننت Services برای نمایش لیست خدمات به‌صورت آکاردئون (باز/بسته شدن فناوری‌ها)
export function Services() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [openKey, setOpenKey] = useState<string | null>(null); // کدام سرویس در حال حاضر باز است

  // واریانت‌های انیمیشن برای کانتینر اصلی
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم سرویس
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  return (
    <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* هدر بخش خدمات */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{t('services.title')}</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </motion.div>

        {/* لیست سرویس‌های آکاردئونی */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            const titleKey = `services.${service.key}`;
            const descKey = `services.${service.key}.desc`;
            const isOpen = openKey === service.key;

            return (
              <motion.div key={service.key} variants={itemVariants} className="group">
                <div className="glass-card interactive-card overflow-hidden rounded-2xl">
                  {/* سربرگ سرویس — قابل کلیک برای باز/بسته کردن فناوری‌ها */}
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : service.key)}
                    className={`flex w-full items-center gap-4 p-6 text-start transition-colors duration-200 hover:bg-primary/5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    aria-expanded={isOpen}
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-105"
                    >
                      <Icon size={26} className="text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-accent">
                        {t(titleKey)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70" dir={isRTL ? 'rtl' : 'ltr'}>
                        {t(descKey)}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className="shrink-0 text-foreground/50"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  {/* بدنهٔ باز شونده: فهرست فناوری‌ها */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className={`space-y-4 px-6 pb-6 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          {service.groups.map((group, groupIndex) => (
                            <div key={group.label ?? groupIndex}>
                              {group.label && (
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
                                  {group.label}
                                </p>
                              )}
                              <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                                {group.items.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/20"
                                    dir="ltr"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
