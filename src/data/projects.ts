// پروژه‌های برجستهٔ پورتفولیو — همهٔ توضیحات و اعداد از README و توضیحات واقعی ریپوهای گیت‌هاب گرفته شده‌اند
// (هیچ عدد ساختگی‌ای در این فایل وجود ندارد). برای افزودن پروژهٔ جدید فقط یک آیتم به آرایه اضافه کنید.

export type Localized = { en: string; fa: string };

export type ProjectArtKey =
  | 'sync' | 'honeypot' | 'netscope' | 'agent' | 'dag' | 'scripts' | 'arena' | 'ml' | 'commits' | 'planner';

export interface FeaturedProject {
  id: string;
  repo: string; // نام ریپو در گیت‌هاب (برای لینک و گرفتن ستاره‌ها)
  title: string;
  art: ProjectArtKey;
  status: Localized;
  tagline: Localized;
  highlights: Localized[];
  stack: string[];
  facts?: { value: string; label: Localized }[];
  demoUrl?: string; // لینک داخلی (مثل #live-demos) یا آدرس کامل دمو
  liveUrl?: string; // برنامهٔ زندهٔ منتشرشده (در تب جدید باز می‌شود)
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'securesync',
    repo: 'SecureSync',
    title: 'SecureSync',
    art: 'sync',
    status: { en: 'Open source · MIT', fa: 'متن‌باز · MIT' },
    tagline: {
      en: 'Encrypted peer-to-peer file synchronization engine. Devices find each other, authenticate, and sync only what changed — no central server ever sees your data.',
      fa: 'موتور همگام‌سازی فایل همتا‌به‌همتا با رمزنگاری سرتاسری. دستگاه‌ها همدیگر را پیدا می‌کنند، احراز هویت می‌شوند و فقط بخش تغییرکرده را همگام می‌کنند — بدون هیچ سرور مرکزی.',
    },
    highlights: [
      {
        en: 'mDNS peer discovery, TCP transport with an encrypted binary protocol',
        fa: 'کشف خودکار همتاها با mDNS و انتقال TCP با پروتکل باینری رمزنگاری‌شده',
      },
      {
        en: 'X25519 key exchange, Ed25519 identities, AES-256-GCM / ChaCha20-Poly1305',
        fa: 'تبادل کلید X25519، هویت Ed25519 و رمزنگاری AES-256-GCM / ChaCha20-Poly1305',
      },
      {
        en: 'Delta sync with SHA-256 chunking and version-vector conflict detection',
        fa: 'همگام‌سازی دلتا با تکه‌بندی SHA-256 و تشخیص تعارض با version vector',
      },
      {
        en: 'Clean Architecture: sync core isolated from filesystem, network and DB adapters',
        fa: 'معماری تمیز (Clean Architecture): هستهٔ همگام‌سازی جدا از فایل‌سیستم، شبکه و دیتابیس',
      },
    ],
    stack: ['Python 3.12', 'asyncio', 'cryptography', 'SQLite', 'zeroconf', 'Clean Architecture'],
    facts: [
      { value: '413', label: { en: 'passing tests', fa: 'تست موفق' } },
      { value: '93%', label: { en: 'coverage', fa: 'پوشش تست' } },
      { value: '26', label: { en: 'ADRs', fa: 'سند تصمیم معماری' } },
      { value: '3', label: { en: 'OS in CI', fa: 'سیستم‌عامل در CI' } },
    ],
  },
  {
    id: 'live-attack-map',
    repo: 'live-attack-map',
    title: 'Live Attack Map',
    art: 'honeypot',
    status: { en: 'Open source · MIT', fa: 'متن‌باز · MIT' },
    tagline: {
      en: 'A fake SSH honeypot that logs real brute-force attempts and streams them to a live animated world map.',
      fa: 'یک هانی‌پات SSH جعلی که حملات brute-force واقعی را ثبت می‌کند و زنده روی نقشهٔ جهان نشان می‌دهد.',
    },
    highlights: [
      {
        en: 'Real SSH handshake via paramiko — never grants access',
        fa: 'هندشیک واقعی SSH با paramiko — هرگز دسترسی نمی‌دهد',
      },
      {
        en: 'Flask-SocketIO + Leaflet dashboard with top countries, usernames and attacks/min',
        fa: 'داشبورد Flask-SocketIO و Leaflet با آمار کشورها، نام‌کاربری‌ها و حمله در دقیقه',
      },
      { en: 'One-command deploy with Docker Compose', fa: 'استقرار با یک دستور docker compose' },
    ],
    stack: ['Python', 'Flask', 'WebSocket', 'Leaflet', 'Docker'],
  },
  {
    id: 'growthplanner',
    repo: 'growthplanner',
    title: 'GrowthPlanner',
    art: 'planner',
    status: { en: 'Live app · Django', fa: 'اپ زنده · Django' },
    tagline: {
      en: 'A calm, Persian-first planning space that connects big goals to small daily tasks — goals, habits, calendar, journal and an AI planning companion.',
      fa: 'یک فضای برنامه‌ریزی آرام و فارسی‌محور که هدف‌های بزرگ را به کارهای کوچک روزانه وصل می‌کند — هدف، عادت، تقویم، دفترچه و یک همراه هوش مصنوعی.',
    },
    highlights: [
      {
        en: 'Goals with milestones, tasks with subtasks, a month/week calendar with drag-to-move and a Pomodoro focus timer',
        fa: 'هدف با milestone، تسک با زیرتسک، تقویم ماهانه/هفتگی با جابه‌جایی کشیدنی و تایمر تمرکز پومودورو',
      },
      {
        en: 'Rule-based natural-language task entry (no AI call) — you review it before saving',
        fa: 'ثبت تسک با زبان طبیعی به‌صورت قانون‌محور (بدون فراخوانی AI) — قبل از ذخیره بازبینی می‌کنید',
      },
      {
        en: 'Persian RTL with Jalali dates, English LTR, light/dark themes, installable PWA, token-auth REST API with docs',
        fa: 'فارسی راست‌چین با تاریخ جلالی، انگلیسی چپ‌چین، تم روشن/تیره، PWA قابل‌نصب و REST API با مستندات',
      },
    ],
    stack: ['Python 3.12', 'Django 5.2', 'DRF', 'HTMX', 'PWA', 'Vercel'],
    liveUrl: 'https://growthplanner-kappa.vercel.app',
  },
  {
    id: 'netscope',
    repo: 'netscope',
    title: 'NetScope',
    art: 'netscope',
    status: { en: 'MVP', fa: 'نسخهٔ MVP' },
    tagline: {
      en: 'Network troubleshooting that tells you whether the problem is your Wi-Fi, your ISP or the service — with evidence, not just ping numbers.',
      fa: 'عیب‌یابی شبکه که می‌گوید مشکل از وای‌فای، ISP یا خود سرویس است — با شواهد، نه فقط عدد پینگ.',
    },
    highlights: [
      {
        en: 'ICMP, DNS and HTTP probes feed a personal statistical baseline',
        fa: 'پروب‌های ICMP، DNS و HTTP به یک baseline آماری شخصی داده می‌شوند',
      },
      {
        en: 'Single 0–100 experience score + rule-based evidence chain',
        fa: 'امتیاز تجربهٔ ۰ تا ۱۰۰ و زنجیرهٔ شواهد مبتنی بر قوانین',
      },
      { en: 'Data stays local in SQLite', fa: 'داده‌ها فقط روی سیستم خودتان (SQLite) می‌مانند' },
    ],
    stack: ['Python', 'icmplib', 'dnspython', 'httpx', 'SQLite', 'CLI'],
  },
  {
    id: 'flowforge',
    repo: 'flowforge',
    title: 'FlowForge',
    art: 'dag',
    status: { en: 'Phase 0 of 11 · foundation', fa: 'فاز ۰ از ۱۱ · زیرساخت' },
    tagline: {
      en: 'A Django workflow engine being designed to make distributed execution explicit — leases, fencing tokens, a transactional outbox and at-least-once delivery.',
      fa: 'یک موتور workflow روی Django که در حال طراحی است تا اجرای توزیع‌شده را صریح کند — lease، fencing token، transactional outbox و تحویل at-least-once.',
    },
    highlights: [
      {
        en: 'Design targets: at-least-once delivery with leases and monotonic fencing tokens to stop stale writers',
        fa: 'اهداف طراحی: تحویل at-least-once با lease و fencing tokenهای یکنوا برای جلوگیری از نویسندهٔ کهنه',
      },
      {
        en: 'Planned: transactional outbox to keep PostgreSQL and the broker consistent; explicit DEAD state with manual requeue',
        fa: 'برنامه‌ریزی‌شده: transactional outbox برای هماهنگی PostgreSQL و بروکر؛ وضعیت صریح DEAD با requeue دستی',
      },
      {
        en: 'Done so far: Django 5.2, split settings, health probes, multi-stage Docker image, Compose stack, CI (lint, mypy, tests)',
        fa: 'تا اینجا انجام شده: Django 5.2، تنظیمات جدا، health probe، ایمیج Docker چندمرحله‌ای، Compose و CI (lint، mypy، تست)',
      },
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Celery', 'Docker'],
  },
  {
    id: 'nexusagent',
    repo: 'nexusagent',
    title: 'NexusAgent',
    art: 'agent',
    status: { en: 'In development', fa: 'در حال توسعه' },
    tagline: {
      en: 'Modular runtime for AI agents in Python — agents, providers, tools and a small, readable core.',
      fa: 'runtime ماژولار برای ایجنت‌های هوش مصنوعی با پایتون — ایجنت، پرووایدر، ابزار و یک هستهٔ کوچک و خوانا.',
    },
    highlights: [
      {
        en: 'Vendor-neutral HTTP provider + deterministic fake provider for tests',
        fa: 'پرووایدر HTTP مستقل از وندور و پرووایدر fake قطعی برای تست',
      },
      { en: 'Explicit tool invocation, small public API', fa: 'فراخوانی صریح ابزارها و API عمومی کوچک' },
    ],
    stack: ['Python', 'pytest', 'ruff', 'LLM tools'],
  },
  {
    id: 'football-battle-arena',
    repo: 'football-battle-arena',
    title: 'Football Battle Arena',
    art: 'arena',
    status: { en: 'Phase 1 of 20', fa: 'فاز ۱ از ۲۰' },
    tagline: {
      en: 'A cinematic football website where every club is a battle team with its own captain.',
      fa: 'یک وب‌سایت سینمایی فوتبال که در آن هر باشگاه یک «تیم نبرد» با کاپیتان مخصوص خودش است.',
    },
    highlights: [
      {
        en: 'Pick a team, meet its captain, enter the arena — a visual comparison system instead of an AI judge',
        fa: 'تیم را انتخاب کن، کاپیتانش را بشناس و وارد آرنا شو — با سیستم مقایسهٔ بصری به‌جای داور هوش مصنوعی',
      },
      {
        en: 'Planned as 20 small, reviewable development phases',
        fa: 'برنامه‌ریزی‌شده در ۲۰ فاز کوچک و قابل‌بازبینی',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'awesome-scripts',
    repo: 'awesome-scripts',
    title: 'Awesome Scripts',
    art: 'scripts',
    status: { en: 'Open source', fa: 'متن‌باز' },
    tagline: {
      en: 'Ready-to-use Telegram bots, web tools and automation scripts — 38 projects, eight of them playable right here as live demos.',
      fa: 'ربات‌های آمادهٔ تلگرام، ابزارهای وب و اسکریپت‌های اتوماسیون — ۳۸ پروژه که هشت‌تایشان همین‌جا به‌صورت دموی زنده قابل‌اجرا هستند.',
    },
    highlights: [
      { en: 'Python, Node.js, PHP, Java, C# and C++ implementations', fa: 'پیاده‌سازی با Python، Node.js، PHP، Java، C# و C++' },
    ],
    stack: ['Python', 'Node.js', 'PHP', 'Java', 'C#', 'C++'],
    demoUrl: '#live-demos',
  },
  {
    id: 'machine-learning',
    repo: 'Machine-Learning',
    title: 'Machine Learning',
    art: 'ml',
    status: { en: 'Open source', fa: 'متن‌باز' },
    tagline: {
      en: 'Machine learning projects including SMS spam detection and stock movement prediction.',
      fa: 'پروژه‌های یادگیری ماشین شامل تشخیص پیامک اسپم و پیش‌بینی جهت حرکت سهام.',
    },
    highlights: [
      { en: 'Two end-to-end projects: SMS spam classifier and stock-movement model', fa: 'دو پروژهٔ کامل: دسته‌بند پیامک اسپم و مدل پیش‌بینی حرکت سهام' },
    ],
    stack: ['Python', 'Machine Learning'],
  },
  {
    id: 'mygit',
    repo: 'My-Git',
    title: 'MyGit',
    art: 'commits',
    status: { en: 'v1.0 · C++', fa: 'نسخهٔ ۱.۰ · C++' },
    tagline: {
      en: 'A terminal version-control system written from scratch in modern C++ — no external libraries.',
      fa: 'یک سیستم کنترل نسخهٔ ترمینالی که از صفر با C++ مدرن نوشته شده — بدون هیچ کتابخانهٔ خارجی.',
    },
    highlights: [
      { en: 'Content-addressable storage, staging area, commits, log and checkout', fa: 'ذخیره‌سازی مبتنی بر محتوا، staging، کامیت، لاگ و checkout' },
      { en: 'Three layers: CLI, logic and storage — SOLID, clean architecture', fa: 'سه لایه: CLI، منطق و ذخیره‌سازی — با اصول SOLID' },
    ],
    stack: ['C++', 'CLI', 'File I/O', 'SOLID'],
  },
];

// ردیف‌های نوار فناوری‌ها (marquee) زیر Hero
export const techMarquee = [
  'Python', 'TypeScript', 'React', 'Next.js', 'Django', 'Flask', 'asyncio', 'PostgreSQL', 'SQLite', 'Redis',
  'RabbitMQ', 'Celery', 'Docker', 'CI/CD', 'Linux', 'Git', 'Telegram Bot API', 'Qt', 'C++', 'Tailwind CSS',
];
