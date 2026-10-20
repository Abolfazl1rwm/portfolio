import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { Code2, Globe, Bot, Brain, Cloud } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  { key: 'step1', icon: Code2 },
  { key: 'step2', icon: Globe },
  { key: 'step3', icon: Bot },
  { key: 'step4', icon: Brain },
  { key: 'step5', icon: Cloud },
];

// یک مرحله از خط زمانی، همراه با انیمیشن ورود هنگام رسیدن به دید
// نقطهٔ روی خط تا رسیدن خط رنگی به آن سفید می‌ماند و فقط وقتی خط بهش رسید، رنگ اصلی می‌گیرد
function TimelineStep({
  icon: Icon,
  stepKey,
  index,
  isRTL,
  isActive,
  t,
}: {
  icon: typeof Code2;
  stepKey: string;
  index: number;
  isRTL: boolean;
  isActive: boolean;
  t: (key: string) => string;
}) {
  const isEven = index % 2 === 0;
  // در دسکتاپ: چیدمان زیگزاگ (راست/چپ)؛ در موبایل: همیشه یک ستون
  const alignDesktop = isEven ? 'lg:flex-row' : 'lg:flex-row-reverse';

  return (
    <motion.div
      className={`relative flex flex-col items-start gap-4 lg:items-center lg:gap-8 ${alignDesktop}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* نقطهٔ روی خط زمانی: سفید تا قبل از رسیدن خط، سپس رنگ اصلی */}
      <div
        className={`absolute top-1 left-4 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background shadow-lg transition-colors duration-500 lg:left-1/2 ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-white text-primary/60'
        }`}
      >
        <Icon size={16} />
      </div>

      {/* محتوای مرحله */}
      <div className={`ms-14 w-full lg:ms-0 lg:w-[calc(50%-3rem)] ${isEven ? 'lg:text-right' : 'lg:text-left'} ${isRTL ? (isEven ? 'lg:text-left' : 'lg:text-right') : ''}`}>
        <div className="glass-card interactive-card rounded-2xl p-5" dir={isRTL ? 'rtl' : 'ltr'}>
          <h3 className="mb-1.5 text-lg font-bold text-foreground">{t(`timeline.${stepKey}.title`)}</h3>
          <p className="text-sm leading-relaxed text-foreground/70">{t(`timeline.${stepKey}.desc`)}</p>
        </div>
      </div>

      {/* فاصلهٔ خالی سمت مقابل در دسکتاپ برای حفظ تقارن زیگزاگ */}
      <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
    </motion.div>
  );
}

// کامپوننت Timeline: مسیر یادگیری و رشد به‌صورت خط زمانی انیمیشنی متصل به اسکرول
export function Timeline() {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(0); // چند نقطهٔ اول تا الان رنگی شده‌اند

  // پیشرفت اسکرول محدود به محدودهٔ همین بخش، برای پر شدن خط عمودی هم‌زمان با اسکرول کاربر
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const lineHeight = useTransform(lineProgress, [0, 1], ['0%', '100%']);

  // هر بار که پیشرفت خط تغییر می‌کند، بررسی می‌شود کدام نقطه‌ها را خط رد کرده (تقریبی، بر اساس فاصلهٔ یکنواخت نقاط)
  useMotionValueEvent(lineProgress, 'change', (latest) => {
    let count = 0;
    for (let i = 0; i < steps.length; i += 1) {
      const threshold = i / (steps.length - 1);
      if (latest >= threshold) count += 1;
    }
    setActiveCount(count);
  });

  return (
    <section id="timeline" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{t('timeline.title')}</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('timeline.subtitle')}</p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* خط عمودی پس‌زمینه (خاکستری کم‌رنگ) */}
          <div className="absolute top-0 left-4 h-full w-0.5 bg-border lg:left-1/2 lg:-translate-x-1/2" />
          {/* خط عمودی رنگی که با اسکرول پر می‌شود */}
          <motion.div
            className="absolute top-0 left-4 w-0.5 origin-top bg-primary lg:left-1/2 lg:-translate-x-1/2"
            style={{ height: lineHeight }}
          />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.key}
                icon={step.icon}
                stepKey={step.key}
                index={index}
                isRTL={isRTL}
                isActive={index < activeCount}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
