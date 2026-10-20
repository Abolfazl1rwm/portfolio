import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/config/contact';
import { demos, demoUrl } from '@/data/demos';

// یک خط خروجی ترمینال: می‌تواند متن ساده یا JSX (برای لینک‌های قابل کلیک) باشد
interface HistoryEntry {
  id: number;
  command?: string; // دستوری که کاربر وارد کرده (خالی برای پیام‌های خوش‌آمدگویی اولیه)
  output: ReactNode;
}

const SKILL_KEYS = ['programming', 'web', 'mobile', 'ai', 'cloud', 'automation'];
const PROJECT_KEYS = ['metatrader', 'one', 'two', 'three', 'four', 'devops'];
const COMMAND_NAMES = [
  'help', 'whoami', 'about', 'skills', 'projects', 'contact', 'demo', 'theme', 'sudo hire-me', 'patrick', 'clear',
];
// این رشته یک شناسهٔ فنی (مثل hostname در ترمینال واقعی) است و همیشه انگلیسی می‌ماند، حتی در حالت فارسی سایت
const TERMINAL_PROMPT = 'ranjbaran@portfolio: ~';

// کامپوننت Terminal: یک ترمینال شبیه‌سازی‌شدهٔ تعاملی برای معرفی خلاقانه
export function Terminal() {
  const { t, isRTL, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [commandLog, setCommandLog] = useState<string[]>([]); // تاریخچهٔ دستورات برای ناوبری با کلید بالا/پایین
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // پیام خوش‌آمدگویی اولیه
  useEffect(() => {
    pushOutput(
      <div className="space-y-1">
        <p className="text-foreground/70">{t('terminal.welcome')}</p>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // اسکرول خودکار به پایین هنگام افزودن خروجی جدید
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  // افزودن یک خروجی به تاریخچه
  const pushOutput = (output: ReactNode, command?: string) => {
    idRef.current += 1;
    setHistory((current) => [...current, { id: idRef.current, command, output }]);
  };

  // اجرای یک دستور و تولید خروجی متناظر
  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const [cmd, ...args] = trimmed.split(/\s+/);
    const lower = cmd.toLowerCase();
    const fullLower = trimmed.toLowerCase();

    if (fullLower === 'clear') {
      setHistory([]);
      return;
    }

    let output: ReactNode;

    switch (true) {
      case lower === 'help': {
        output = (
          <div>
            <p className="mb-1 text-foreground/70">{t('terminal.help.title')}</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 sm:grid-cols-3">
              {COMMAND_NAMES.map((name) => (
                <li key={name} className="text-accent">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );
        break;
      }
      case lower === 'whoami': {
        output = <p>{t('terminal.whoami')}</p>;
        break;
      }
      case lower === 'about': {
        output = <p className="max-w-xl leading-6">{t('about.description')}</p>;
        break;
      }
      case lower === 'skills': {
        output = (
          <div>
            <p className="mb-1 text-foreground/70">{t('terminal.skills.title')}</p>
            <ul className="list-inside list-disc space-y-0.5">
              {SKILL_KEYS.map((key) => (
                <li key={key}>{t(`skills.${key}`)}</li>
              ))}
            </ul>
          </div>
        );
        break;
      }
      case lower === 'projects': {
        output = (
          <div>
            <p className="mb-1 text-foreground/70">{t('terminal.projects.title')}</p>
            <ul className="list-inside list-disc space-y-0.5">
              {PROJECT_KEYS.map((key) => (
                <li key={key}>{t(`caseStudies.${key}.title`)}</li>
              ))}
            </ul>
          </div>
        );
        break;
      }
      case lower === 'contact': {
        output = (
          <div>
            <p className="mb-1 text-foreground/70">{t('terminal.contact.title')}</p>
            <p>
              email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              linkedin:{' '}
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
                {LINKEDIN_URL}
              </a>
            </p>
          </div>
        );
        break;
      }
      case lower === 'demo': {
        output = (
          <div>
            <p className="mb-1 text-foreground/70">{t('terminal.demo.title')}</p>
            {demos.map((d) => (
              <p key={d.id}>
                <a href={demoUrl(d)} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
                  {d.title[language]}
                </a>
              </p>
            ))}
          </div>
        );
        break;
      }
      case lower === 'theme': {
        const target = args[0]?.toLowerCase();
        const next = target === 'light' || target === 'dark' ? target : theme === 'dark' ? 'light' : 'dark';
        setTheme?.(next);
        output = <p>{t('terminal.theme.switched').replace('{theme}', next)}</p>;
        break;
      }
      case fullLower === 'sudo hire-me': {
        output = (
          <div className="space-y-1">
            <p className="text-green-400">{t('terminal.hireMe1')}</p>
            <p className="text-foreground/60">{t('terminal.hireMe2')}</p>
          </div>
        );
        window.setTimeout(() => {
          document.getElementById('start-working')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 900);
        break;
      }
      case lower === 'patrick': {
        output = <p>{t('terminal.patrick')}</p>;
        break;
      }
      case lower === 'ls' || lower === 'dir': {
        output = <p className="text-foreground/60">about.txt  skills/  projects/  contact.sh  patrick.png</p>;
        break;
      }
      default: {
        output = (
          <p className="text-destructive/80">
            {t('terminal.notFound').replace('{cmd}', trimmed)}
          </p>
        );
      }
    }

    pushOutput(output, trimmed);
    setCommandLog((current) => [...current, trimmed]);
    setHistoryIndex(null);
  };

  // هندل کردن ارسال فرم (فشردن Enter)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    runCommand(input);
    setInput('');
  };

  // ناوبری در تاریخچهٔ دستورات با کلیدهای بالا/پایین (مثل ترمینال واقعی)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandLog.length === 0) return;
      const nextIndex = historyIndex === null ? commandLog.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandLog[nextIndex] ?? '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandLog.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandLog[nextIndex] ?? '');
      }
    }
  };

  return (
    <section id="terminal" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TerminalSquare size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient">{t('terminal.heading')}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/20"
          onClick={() => inputRef.current?.focus()}
        >
          {/* نوار عنوان شبیه پنجرهٔ ترمینال */}
          <div className="flex items-center gap-2 bg-[#211b16] px-4 py-3" dir="ltr">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ms-2 truncate text-xs text-white/40">{TERMINAL_PROMPT}</span>
          </div>

          {/* بدنهٔ ترمینال */}
          <div ref={scrollRef} data-lenis-prevent className="max-h-96 min-h-72 overflow-y-auto bg-[#171310] px-4 py-4 font-mono text-sm" dir="ltr">
            {history.map((entry) => (
              <div key={entry.id} className="mb-3">
                {entry.command !== undefined && (
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="text-accent">➜</span>
                    <span>{entry.command}</span>
                  </div>
                )}
                <div className="mt-1 text-white/80">{entry.output}</div>
              </div>
            ))}

            {/* خط ورودی */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 text-green-400">
              <span className="text-accent">➜</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
                placeholder={t('terminal.placeholder')}
                dir="ltr"
              />
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
