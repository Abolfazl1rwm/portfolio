// دموهای زنده — همگی از ریپوی awesome-scripts (GitHub Pages) و کاملاً سمت‌مرورگر هستند.
// برای افزودن دموی جدید فقط یک آیتم به آرایه اضافه کنید (dir = نام پوشه در awesome-scripts/src).
import type { Localized } from './projects';

export type DemoCategory = 'apps' | 'interactive' | 'tools' | 'web';
export type DemoIconKey = 'wheel' | 'solar' | 'qr' | 'clock' | 'dashboard' | 'game' | 'mobile' | 'channel' | 'planner';

export interface DemoItem {
  id: string;
  dir: string;
  category: DemoCategory;
  icon: DemoIconKey;
  title: Localized;
  desc: Localized;
  tags: string[];
  // kind = 'app': یک اپ کامل و منتشرشده (در تب جدید باز می‌شود، داخل iframe نمی‌آید چون سرور ممکن است جلوی embed را بگیرد)
  kind?: 'embed' | 'app';
  href?: string; // آدرس کامل برای kind = 'app'
  art?: 'planner'; // تصویرسازی کارت برای kind = 'app'
}

export const DEMOS_BASE_URL = 'https://abolfazlrwm.github.io/awesome-scripts/src';
export const demoUrl = (d: DemoItem) => d.href ?? `${DEMOS_BASE_URL}/${d.dir}/`;

export const demoCategories: { id: 'all' | DemoCategory; label: Localized }[] = [
  { id: 'all', label: { en: 'All', fa: 'همه' } },
  { id: 'apps', label: { en: 'Live apps', fa: 'اپ‌های زنده' } },
  { id: 'interactive', label: { en: 'Interactive', fa: 'تعاملی' } },
  { id: 'tools', label: { en: 'Tools', fa: 'ابزارها' } },
  { id: 'web', label: { en: 'Web & templates', fa: 'وب و قالب‌ها' } },
];

export const demos: DemoItem[] = [
  {
    id: 'growthplanner',
    dir: '',
    kind: 'app',
    href: 'https://growthplanner-kappa.vercel.app',
    art: 'planner',
    category: 'apps',
    icon: 'planner',
    title: { en: 'GrowthPlanner', fa: 'GrowthPlanner (رشد شخصی)' },
    desc: {
      en: 'A full, deployed planning app — goals, tasks, habits, a Jalali calendar, a focus timer and an AI companion. Persian RTL and English. Open it and try the demo space.',
      fa: 'یک اپ کامل و منتشرشده برای برنامه‌ریزی — هدف، تسک، عادت، تقویم جلالی، تایمر تمرکز و همراه هوش مصنوعی. فارسی راست‌چین و انگلیسی. بازش کن و فضای دمو را امتحان کن.',
    },
    tags: ['Django', 'HTMX', 'PWA'],
  },
  {
    id: 'solar',
    dir: 'solar-explorer-3d',
    category: 'interactive',
    icon: 'solar',
    title: { en: '3D Solar Explorer', fa: 'کاوشگر سه‌بعدی منظومه شمسی' },
    desc: {
      en: 'An interactive 3D solar system you can explore, rotate and zoom through in the browser.',
      fa: 'یک منظومهٔ شمسی سه‌بعدی تعاملی که می‌توانید در مرورگر بچرخانید، زوم کنید و کاوش کنید.',
    },
    tags: ['3D', 'WebGL'],
  },
  {
    id: 'wheel',
    dir: 'wheel-of-actions',
    category: 'interactive',
    icon: 'wheel',
    title: { en: 'Wheel of Actions', fa: 'چرخ انتخاب' },
    desc: {
      en: 'A spin-the-wheel picker for random actions or decisions — simple, playful and satisfying to spin.',
      fa: 'یک چرخ‌گردون برای انتخاب تصادفی گزینه یا تصمیم — ساده، بامزه و لذت‌بخش.',
    },
    tags: ['Canvas', 'JS'],
  },
  {
    id: 'ox',
    dir: 'tic-tac-toe-game',
    category: 'interactive',
    icon: 'game',
    title: { en: 'OX — Tic-Tac-Toe', fa: 'OX — بازی دوز' },
    desc: {
      en: 'Classic tic-tac-toe you can play against an AI opponent.',
      fa: 'بازی کلاسیک دوز که می‌توانید در برابر هوش مصنوعی انجامش بدهید.',
    },
    tags: ['Game', 'AI'],
  },
  {
    id: 'qr',
    dir: 'qr-code-studio',
    category: 'tools',
    icon: 'qr',
    title: { en: 'QR Code Studio', fa: 'استودیوی QR Code' },
    desc: {
      en: 'Design custom QR codes — colors, gradients, an optional center logo — and export PNG or SVG. Runs fully in your browser.',
      fa: 'QR Code سفارشی بسازید — رنگ، گرادیان و لوگوی وسط — و با فرمت PNG یا SVG خروجی بگیرید. کاملاً داخل مرورگر.',
    },
    tags: ['Tool', 'PNG / SVG'],
  },
  {
    id: 'clock',
    dir: 'world-clock-planner',
    category: 'tools',
    icon: 'clock',
    title: { en: 'World Clock Planner', fa: 'برنامه‌ریز ساعت جهانی' },
    desc: {
      en: 'Add cities, drag a shared time bar and see the local time everywhere — built for scheduling international meetings.',
      fa: 'شهرها را اضافه کنید، نوار زمان مشترک را بکشید و ساعت محلی همه‌جا را ببینید — مناسب زمان‌بندی جلسات بین‌المللی.',
    },
    tags: ['Tool', 'Time zones'],
  },
  {
    id: 'control-room',
    dir: 'control-room-dashboard',
    category: 'web',
    icon: 'dashboard',
    title: { en: 'Control Room Dashboard', fa: 'داشبورد اتاق فرمان' },
    desc: {
      en: 'A live-style dashboard for bots and tools — active users, a price ticker and a deploy log. A front-end demo with simulated data.',
      fa: 'داشبورد زنده‌نما برای ربات‌ها و ابزارها — کاربران فعال، تیکر قیمت و لاگ استقرار. دموی فرانت‌اند با داده‌های شبیه‌سازی‌شده.',
    },
    tags: ['Dashboard', 'RTL'],
  },
  {
    id: 'app-intro',
    dir: 'mobile-app-intro-template',
    category: 'web',
    icon: 'mobile',
    title: { en: 'Mobile App Intro Templates', fa: 'قالب‌های معرفی اپلیکیشن' },
    desc: {
      en: '12 standalone landing-page designs for mobile apps — swap in your text, colors and download link.',
      fa: '۱۲ طرح مستقل لندینگ برای اپلیکیشن موبایل — فقط متن، رنگ و لینک دانلود را عوض کنید.',
    },
    tags: ['Templates', '12 designs'],
  },
  {
    id: 'channel',
    dir: 'telegram-channel-landing-page',
    category: 'web',
    icon: 'channel',
    title: { en: 'Telegram Channel Landing Page', fa: 'لندینگ کانال تلگرام' },
    desc: {
      en: 'A static, RTL marketing landing page for a digital-content channel — team, features and contact sections.',
      fa: 'یک صفحهٔ فرود استاتیک و راست‌چین برای کانال محتوای دیجیتال — با بخش‌های تیم، ویژگی‌ها و تماس.',
    },
    tags: ['Landing', 'RTL'],
  },
];
