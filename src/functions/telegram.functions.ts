// توابع سمت سرور برای ارسال پیام/فایل به تلگرام.
// توکن ربات فقط در سرور (process.env) خوانده می‌شود و هرگز داخل کد مرورگر نمی‌رود.
import { createServerFn } from '@tanstack/react-start';

const MAX_TEXT = 3800; // سقف طول پیام تلگرام ۴۰۹۶ کاراکتر است
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function getConfig() {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];
  return token && chatId ? { token, chatId } : null;
}

/** آیا ارسال مستقیم به تلگرام روی سرور پیکربندی شده است؟ */
export const telegramStatus = createServerFn({ method: 'GET' }).handler(async () => ({
  configured: getConfig() !== null,
}));

/** ارسال پیام متنی (HTML) به تلگرام */
export const sendTelegramMessage = createServerFn({ method: 'POST' })
  .validator((data: { text: string }) => {
    if (typeof data?.text !== 'string' || !data.text.trim()) throw new Error('Invalid message');
    return { text: data.text.slice(0, MAX_TEXT) };
  })
  .handler(async ({ data }) => {
    const cfg = getConfig();
    if (!cfg) return { ok: false as const, reason: 'not-configured' as const };
    try {
      const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: cfg.chatId, text: data.text, parse_mode: 'HTML' }),
      });
      return res.ok ? { ok: true as const } : { ok: false as const, reason: 'telegram-error' as const };
    } catch {
      return { ok: false as const, reason: 'network' as const };
    }
  });

/** ارسال فایل پیوست (حداکثر ۵ مگابایت) به تلگرام */
export const sendTelegramFile = createServerFn({ method: 'POST' })
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error('Invalid payload');
    const file = data.get('file');
    if (!(file instanceof File)) throw new Error('Missing file');
    if (file.size > MAX_FILE_BYTES) throw new Error('File too large');
    return data;
  })
  .handler(async ({ data }) => {
    const cfg = getConfig();
    if (!cfg) return { ok: false as const, reason: 'not-configured' as const };
    const file = data.get('file') as File;
    const caption = String(data.get('caption') ?? '').slice(0, 1000);
    try {
      const body = new FormData();
      body.append('chat_id', cfg.chatId);
      body.append('document', file, file.name);
      body.append('caption', caption);
      const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendDocument`, { method: 'POST', body });
      return res.ok ? { ok: true as const } : { ok: false as const, reason: 'telegram-error' as const };
    } catch {
      return { ok: false as const, reason: 'network' as const };
    }
  });
