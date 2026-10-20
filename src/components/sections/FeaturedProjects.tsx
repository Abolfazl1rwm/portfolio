import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Play, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { GITHUB_URL } from '@/config/contact';
import { featuredProjects, type FeaturedProject } from '@/data/projects';
import { ProjectArt } from './ProjectArt';

const copy = {
  en: {
    label: 'Featured projects',
    title: 'Things I built — and how they work',
    subtitle: 'Open-source projects with real architecture, real tests and public code you can read.',
    viewRepo: 'View on GitHub',
    demos: 'Live demos',
    liveApp: 'Open live app',
    all: 'All repositories',
  },
  fa: {
    label: 'پروژه‌های برجسته',
    title: 'چیزهایی که ساخته‌ام — و چطور کار می‌کنند',
    subtitle: 'پروژه‌های متن‌باز با معماری واقعی، تست واقعی و کد عمومی که می‌توانید بخوانید.',
    viewRepo: 'مشاهده در گیت‌هاب',
    demos: 'دموهای زنده',
    liveApp: 'باز کردن اپ زنده',
    all: 'همهٔ ریپوها',
  },
} as const;

// چیدمان شبکه: اولی تمام‌عرض، دو تای بعدی نیم‌عرض، بقیه سه‌تایی؛ ردیف آخر ناقص، کل عرض را پر می‌کند (بدون جای خالی)
function spanFor(i: number, total: number): string {
  if (i === 0) return 'md:col-span-6';
  if (i <= 2) return 'md:col-span-3';
  const rest = total - 3;
  const r = i - 3;
  const fullPart = Math.floor(rest / 3) * 3;
  if (r < fullPart) return 'md:col-span-2';
  const leftover = rest - fullPart;
  return leftover === 1 ? 'md:col-span-6' : 'md:col-span-3';
}

function StatusBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {text}
    </span>
  );
}

function ProjectCard({
  project,
  stars,
  featured,
  index,
}: {
  project: FeaturedProject;
  stars?: number;
  featured?: boolean;
  index: number;
}) {
  const { language, isRTL } = useLanguage();
  const c = copy[language];
  const repoUrl = `${GITHUB_URL}/${project.repo}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className={`glass-card interactive-card group flex overflow-hidden rounded-2xl ${
        featured ? 'w-full flex-col lg:flex-row' : 'w-full flex-col'
      }`}
    >
      {/* تصویر شماتیک پروژه */}
      <div
        className={`relative shrink-0 overflow-hidden p-4 ${
          featured
            ? 'h-56 bg-primary text-primary-foreground lg:h-auto lg:w-[42%]'
            : 'h-40 bg-muted text-primary'
        }`}
        dir="ltr"
      >
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProjectArt name={project.art} />
        </div>
        <span className="absolute start-4 top-4 font-mono text-xs opacity-70">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* متن پروژه */}
      <div className="flex flex-1 flex-col p-6 sm:p-7" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className={`font-bold text-foreground ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{project.title}</h3>
          <StatusBadge text={project.status[language]} />
          {typeof stars === 'number' && stars > 0 && (
            <span className="ms-auto inline-flex items-center gap-1 text-sm text-foreground/60" dir="ltr">
              <Star size={14} className="fill-current text-primary" />
              {stars}
            </span>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-foreground/75 sm:text-base">{project.tagline[language]}</p>

        <ul className="mb-5 space-y-2">
          {project.highlights.map((h) => (
            <li key={h.en} className="flex gap-2.5 text-sm leading-relaxed text-foreground/70">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{h[language]}</span>
            </li>
          ))}
        </ul>

        {project.facts && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {project.facts.map((f) => (
              <div key={f.label.en} className="rounded-xl border border-border bg-background/40 p-3 text-center">
                <div className="text-xl font-bold text-primary" dir="ltr">{f.value}</div>
                <div className="text-xs text-foreground/60">{f.label[language]}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-5 flex flex-wrap gap-2" dir="ltr">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/20"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Github size={16} />
              {c.viewRepo}
              <ArrowUpRight size={14} className={isRTL ? '-scale-x-100' : ''} />
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Play size={14} fill="currentColor" />
                {c.liveApp}
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('live-demos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
              >
                <Play size={14} />
                {c.demos}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// بخش «پروژه‌های برجسته» — جایگزین «مطالعات موردی» قبلی که اعداد تأییدنشده داشت
export function FeaturedProjects() {
  const { language } = useLanguage();
  const c = copy[language];
  const { repos } = useGithubRepos();
  const starsByRepo = new Map(repos.map((r) => [r.name.toLowerCase(), r.stargazers_count]));

  return (
    <section id="projects" className="relative bg-background/50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="section-label">{c.label}</span>
          <h2 className="mb-4 mt-3 text-4xl font-bold text-gradient sm:text-5xl">{c.title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">{c.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          {featuredProjects.map((project, i) => {
            const span = spanFor(i, featuredProjects.length);
            return (
              <div key={project.id} className={`flex ${span}`}>
                <ProjectCard
                  project={project}
                  index={i}
                  featured={i === 0}
                  stars={starsByRepo.get(project.repo.toLowerCase())}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <Github size={16} />
            {c.all}
          </a>
        </div>
      </div>
    </section>
  );
}
