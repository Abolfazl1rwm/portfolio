// این فایل تنظیمات دستیار هوش مصنوعی شناور (چت‌بات) سایت را نگه می‌دارد.
//
// نحوهٔ فعال‌سازی:
// ۱. یک فایل .env در ریشهٔ پروژه بسازید (از روی .env.example کپی کنید).
// ۲. مقادیر زیر را پر کنید:
//      VITE_AI_API_ENDPOINT=آدرس API هوش مصنوعی شما
//      VITE_AI_API_KEY=کلید API شما
// ۳. نیازی به تغییر هیچ کد دیگری نیست — ویجت چت به‌صورت خودکار فعال می‌شود.
//
// ⚠️ نکتهٔ امنیتی: چون این کد در مرورگر کاربر اجرا می‌شود، هر مقداری که اینجا
// بگذارید (از جمله VITE_AI_API_KEY) در نهایت در کد سمت کاربر قابل مشاهده است.
// برای استفادهٔ امن در تولید (production)، توصیه می‌شود درخواست را از طریق
// یک تابع سرورلس/بک‌اند کوچک پروکسی کنید و کلید API را فقط در سرور نگه دارید.
// ساختار فعلی برای شروع سریع و تست مناسب است.

const AI_API_ENDPOINT = import.meta.env['VITE_AI_API_ENDPOINT'] as string | undefined;
const AI_API_KEY = import.meta.env['VITE_AI_API_KEY'] as string | undefined;

/** آیا دستیار هوش مصنوعی پیکربندی شده است؟ */
export function isAIAssistantConfigured(): boolean {
  return Boolean(AI_API_ENDPOINT);
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * ارسال پیام‌های گفت‌وگو به API خارجی هوش مصنوعی و دریافت پاسخ.
 * ساختار درخواست عمومی نگه داشته شده تا با اکثر سرویس‌های AI سازگار باشد؛
 * در صورت نیاز می‌توانید body/headers را متناسب با API خودتان تغییر دهید.
 */
export async function sendAIMessage(messages: AIChatMessage[]): Promise<string> {
  if (!AI_API_ENDPOINT) {
    throw new Error('AI_NOT_CONFIGURED');
  }

  const response = await fetch(AI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AI_API_KEY ? { Authorization: `Bearer ${AI_API_KEY}` } : {}),
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`AI_REQUEST_FAILED_${response.status}`);
  }

  const data = await response.json();
  // انتظار می‌رود پاسخ شامل یکی از این فیلدها باشد؛ در صورت تفاوت ساختار API خود، این خط را ویرایش کنید
  return data.reply ?? data.message ?? data.content ?? '';
}
