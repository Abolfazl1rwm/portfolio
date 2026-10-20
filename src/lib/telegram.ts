// اتصال فرم‌های سایت به ربات تلگرام.
// ارسال از طریق «سرور» انجام می‌شود (src/functions/telegram.functions.ts) تا توکن ربات هیچ‌وقت در مرورگر کاربر نباشد.
//
// فعال‌سازی: در فایل .env (یا تنظیمات محیطی هاست) این دو مقدار را — بدون پیشوند VITE_ — بگذارید:
//   TELEGRAM_BOT_TOKEN=توکن ربات از @BotFather
//   TELEGRAM_CHAT_ID=آیدی چت مقصد
// تا وقتی تنظیم نشده باشند، فرم «همکاری» به‌صورت خودکار متن را کپی می‌کند و چت تلگرام شخصی را باز می‌کند.

import { sendTelegramFile, sendTelegramMessage } from '@/functions/telegram.functions';

/** نتیجهٔ ارسال: sent = ارسال شد، not-configured = سرور توکن ندارد، failed = خطا */
export type TelegramResult = 'sent' | 'not-configured' | 'failed';

/** جلوگیری از خراب شدن پیام HTML تلگرام وقتی کاربر < یا & تایپ می‌کند */
function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** ارسال یک پیام متنی به تلگرام (از مسیر سرور) */
export async function sendToTelegram(message: string): Promise<TelegramResult> {
  try {
    const res = await sendTelegramMessage({ data: { text: message } });
    if (res.ok) return 'sent';
    return res.reason === 'not-configured' ? 'not-configured' : 'failed';
  } catch (error) {
    console.error('[telegram] ارسال پیام ناموفق بود:', error);
    return 'failed';
  }
}

/** ارسال یک فایل (سند) به تلگرام همراه با کپشن کوتاه */
export async function sendFileToTelegram(file: File, caption: string): Promise<boolean> {
  try {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('caption', caption);
    const res = await sendTelegramFile({ data: body });
    return res.ok;
  } catch (error) {
    console.error('[telegram] ارسال فایل ناموفق بود:', error);
    return false;
  }
}

/** متن ساده (بدون تگ HTML) برای کپی در کلیپ‌بورد یا ارسال دستی */
export function stripHtml(message: string): string {
  return message.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** ساخت پیام قابل خواندن از داده‌های فرم «همکاری» */
export function formatProjectMessage(data: {
  contactMethodLabel: string;
  contactValue: string;
  projectTitle: string;
  projectDescription: string;
  fileName?: string;
}): string {
  const lines = [
    '📩 <b>درخواست همکاری جدید</b>',
    `📮 راه ارتباطی: ${esc(data.contactMethodLabel)} — ${esc(data.contactValue)}`,
    `📌 عنوان پروژه: ${esc(data.projectTitle)}`,
    `📝 توضیحات: ${esc(data.projectDescription)}`,
    data.fileName ? `📎 فایل پیوست: ${esc(data.fileName)}` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

/** ساخت پیام قابل خواندن از داده‌های فرم «نظر یا پیشنهاد» */
export function formatReviewMessage(data: {
  clientName: string;
  contactMethodLabel: string;
  contactValue: string;
  projectName: string;
  rating: number;
  reviewText: string;
}): string {
  const lines = [
    '⭐ <b>نظر یا پیشنهاد جدید</b>',
    data.clientName ? `👤 نام: ${esc(data.clientName)}` : null,
    data.contactValue ? `📮 راه ارتباطی: ${esc(data.contactMethodLabel)} — ${esc(data.contactValue)}` : null,
    `📁 پروژه/موضوع: ${esc(data.projectName)}`,
    `⭐ امتیاز: ${data.rating}/5`,
    `💬 متن: ${esc(data.reviewText)}`,
  ];
  return lines.filter(Boolean).join('\n');
}
