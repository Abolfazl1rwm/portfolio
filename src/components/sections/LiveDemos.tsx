import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  Disc3,
  ExternalLink,
  Grid3x3,
  LayoutDashboard,
  Play,
  QrCode,
  Rocket,
  Send,
  Smartphone,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProjectArt } from './ProjectArt';
import { Simulations } from './Simulations';
import { demoCategories, demos, demoUrl, type DemoCategory, type DemoIconKey, type DemoItem } from '@/data/demos';

const icons: Record<DemoIconKey, LucideIcon> = {
  wheel: Disc3,
  solar: Rocket,
  qr: QrCode,
  clock: Clock,
  dashboard: LayoutDashboard,
  game: Grid3x3,
  mobile: Smartphone,
  channel: Send,
  planner: CalendarCheck,
};

// کارت یک دموی زنده — تا کاربر کلیک نکند، iframe سنگین لود/اجرا نمی‌شود (برای حفظ سرعت سایت)
function DemoCard({ demo, index }: { demo: DemoItem; index: number }) {
  const { t, language, isRTL } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const Icon = icons[demo.icon];
  const title = demo.title[language];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card interactive-card flex flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {demo.kind === 'app' ? (
          <a
            href={demoUrl(demo)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-6 text-primary"
            aria-label={`${t('liveDemos.openApp')} — ${title}`}
          >
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
              <ProjectArt name={demo.art ?? 'planner'} />
            </div>
            <span className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5">
              <ExternalLink size={13} />
              {t('liveDemos.openApp')}
            </span>
          </a>
        ) : loaded ? (
          <>
            <iframe
              src={demoUrl(demo)}
              title={title}
              className="h-full w-full border-0 bg-white"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads allow-forms allow-popups"
            />
            <button
              type="button"
              onClick={() => setLoaded(false)}
              aria-label={t('liveDemos.close')}
              className="absolute end-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-transparent text-foreground"
            aria-label={`${t('liveDemos.play')} — ${title}`}
          >
            {/* آیکن بزرگ و کم‌رنگ پس‌زمینه */}
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -end-6 h-40 w-40 text-primary opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
              strokeWidth={1.25}
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
              <Play size={24} className="ms-0.5" fill="currentColor" />
            </span>
            <span className="relative text-sm font-medium text-foreground/80">{t('liveDemos.play')}</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-2 flex items-center gap-2">
          <Icon size={18} className="shrink-0 text-primary" />
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-foreground/70">{demo.desc[language]}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            {demo.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={demoUrl(demo)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5"
          >
            {demo.kind === 'app' ? t('liveDemos.openApp') : t('liveDemos.openFull')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// بخش «دموهای زنده» — دموها با فیلتر دسته‌بندی نمایش داده می‌شوند
const simCopy = {
  en: {
    title: 'Interactive simulations',
    subtitle: 'The core idea of two of my projects, running right here. These are simulations of the logic — not real measurements or real sync.',
    tabs: { netscope: 'NetScope · diagnosis', securesync: 'SecureSync · conflicts' },
  },
  fa: {
    title: 'شبیه‌سازهای تعاملی',
    subtitle: 'ایدهٔ اصلی دو پروژهٔ من، همین‌جا در حال اجرا. این‌ها شبیه‌سازی منطق هستند — نه اندازه‌گیری یا همگام‌سازی واقعی.',
    tabs: { netscope: 'NetScope · تشخیص', securesync: 'SecureSync · تعارض' },
  },
} as const;

export function LiveDemos() {
  const { t, language, isRTL } = useLanguage();
  const sc = simCopy[language];
  const [simTab, setSimTab] = useState<'netscope' | 'securesync'>('netscope');
  const [category, setCategory] = useState<'all' | DemoCategory>('all');
  const visible = useMemo(() => demos.filter((d) => category === 'all' || d.category === category), [category]);

  return (
    <section id="live-demos" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-4xl font-bold text-gradient sm:text-5xl">{t('liveDemos.title')}</h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">{t('liveDemos.subtitle')}</p>
        </motion.div>

        {/* فیلتر دسته‌بندی */}
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label={t('liveDemos.title')}>
          {demoCategories.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-background/40 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {c.label[language]}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((demo, i) => (
              <DemoCard key={demo.id} demo={demo} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* شبیه‌سازهای تعاملی NetScope و SecureSync */}
        <div id="simulations" className="mt-20" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="mb-8 text-center">
            <h3 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">{sc.title}</h3>
            <p className="mx-auto max-w-2xl text-foreground/70">{sc.subtitle}</p>
          </div>
          <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label={sc.title}>
            {(['netscope', 'securesync'] as const).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={simTab === id}
                onClick={() => setSimTab(id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  simTab === id
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-background/40 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {sc.tabs[id]}
              </button>
            ))}
          </div>
          <Simulations tab={simTab} />
        </div>
      </div>
    </section>
  );
}
