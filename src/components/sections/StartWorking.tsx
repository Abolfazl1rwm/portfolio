import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Mail, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sendToTelegram, sendFileToTelegram, formatProjectMessage, stripHtml } from '@/lib/telegram';
import { CONTACT_EMAIL, TELEGRAM_URL } from '@/config/contact';
import { ContactMethodField } from './ContactMethodField';

// حداکثر حجم مجاز برای فایل ارسالی (5 مگابایت)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// تعریف رابط برای داده‌های فرم پروژه
interface ProjectFormData {
  contactMethod: string; // روش ارتباطی انتخاب‌شده: email | phone | telegram | other
  contactValue: string; // مقدار وارد شده برای روش ارتباطی
  projectTitle: string;
  projectDescription: string;
  file: File | null;
}

// مقادیر اولیه برای فرم پروژه
const initialFormData: ProjectFormData = {
  contactMethod: 'email',
  contactValue: '',
  projectTitle: '',
  projectDescription: '',
  file: null,
};

// متن‌های پنل «ارسال دستی» — وقتی ارسال مستقیم به تلگرام ممکن نیست
const fallbackCopy = {
  en: {
    title: 'Almost done — pick how to send it',
    hint: 'Direct sending is not available right now, so your request was copied. Send it with one tap:',
    telegram: 'Open Telegram',
    email: 'Send by email',
    copy: 'Copy again',
    copied: 'Copied',
    badEmail: 'Please enter a valid email address.',
    close: 'Dismiss',
  },
  fa: {
    title: 'تقریباً تمام شد — روش ارسال را انتخاب کنید',
    hint: 'ارسال مستقیم فعلاً در دسترس نیست، برای همین متن درخواست شما کپی شد. با یک کلیک بفرستید:',
    telegram: 'باز کردن تلگرام',
    email: 'ارسال با ایمیل',
    copy: 'کپی دوباره',
    copied: 'کپی شد',
    badEmail: 'لطفاً یک ایمیل معتبر وارد کنید.',
    close: 'بستن',
  },
} as const;

// کامپوننت StartWorking برای فرم همکاری
export function StartWorking() {
  const { t, isRTL, language } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const fc = fallbackCopy[language];
  const [fallbackText, setFallbackText] = useState<string | null>(null); // متن آمادهٔ ارسال دستی (وقتی ارسال مستقیم ممکن نیست)
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // وقتی پنل ارسال دستی ظاهر شد، به آن اسکرول می‌کنیم تا کاربر حتماً ببیندش
  useEffect(() => {
    if (fallbackText) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [fallbackText]);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData); // وضعیت داده‌های فرم
  const [fileError, setFileError] = useState(''); // وضعیت خطای فایل

  const [isLoading, setIsLoading] = useState(false); // وضعیت ارسال فرم

  // گزینه‌های راه ارتباطی
  const contactMethods = [
    { value: 'email', label: t('form.contactMethod.email') },
    { value: 'phone', label: t('form.contactMethod.phone') },
    { value: 'telegram', label: t('form.contactMethod.telegram') },
    { value: 'other', label: t('form.contactMethod.other') },
  ];

  // هندل کردن تغییرات ورودی‌های فرم
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // هندل کردن تغییر فایل ارسالی
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFileError('');

    // بررسی حجم فایل
    if (file && file.size > MAX_FILE_SIZE) {
      setFormData((current) => ({ ...current, file: null }));
      setFileError(t('form.file.tooLarge'));
      event.target.value = '';
      return;
    }

    setFormData((current) => ({ ...current, file }));
  };

  // هندل کردن ارسال فرم
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // اعتبارسنجی فیلدهای ضروری
    if (
      !formData.contactValue.trim() ||
      !formData.projectTitle.trim() ||
      !formData.projectDescription.trim()
    ) {
      toast.error(t('form.validation'));
      return;
    }

    if (formData.contactMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactValue.trim())) {
      toast.error(fc.badEmail);
      return;
    }

    const message = formatProjectMessage({
      contactMethodLabel: contactMethods.find((m) => m.value === formData.contactMethod)?.label ?? formData.contactMethod,
      contactValue: formData.contactValue.trim(),
      projectTitle: formData.projectTitle.trim(),
      projectDescription: formData.projectDescription.trim(),
      fileName: formData.file?.name,
    });

    // حالت جایگزین: اگر ارسال مستقیم ممکن نباشد، متن درخواست کپی می‌شود و یک پنل واضح با دکمه‌های «تلگرام / ایمیل / کپی» نمایش داده می‌شود.
    // (قبلاً اینجا بعد از انتظار شبکه یک پنجرهٔ جدید باز می‌شد که مرورگرها بلاک می‌کردند و فقط یک toast کم‌رنگ دیده می‌شد.)
    const sendManually = () => {
      const plain = stripHtml(message);
      void navigator.clipboard?.writeText(plain).catch(() => undefined);
      setFallbackText(plain);
      setCopied(false);
    };

    try {
      setIsLoading(true);
      const result = await sendToTelegram(message);
      if (result === 'not-configured') {
        sendManually();
        return;
      }
      if (result === 'failed') {
        toast.error(t('form.error'), {
          action: { label: t('form.sendManually'), onClick: sendManually },
          duration: 12000,
        });
        return;
      }
      // اگر فایلی پیوست شده، همراه با درخواست ارسال می‌شود
      if (formData.file) {
        const fileSent = await sendFileToTelegram(formData.file, formData.projectTitle.trim());
        if (!fileSent) toast.warning(t('form.file.notSent'));
      }
      toast.success(t('form.success'));
      setFallbackText(null);
      setFormData(initialFormData);
      setFileError('');
    } catch {
      toast.error(t('form.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // واریانت‌های انیمیشن برای کانتینر فرم
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم فرم
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
  };

  // کلاس برای جهت‌دهی متن فیلدها
  const fieldClass = isRTL ? 'text-right' : '';

  return (
    <section id="start-working" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-4xl mx-auto">
        {/* هدر بخش همکاری */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">{t('form.title')}</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('form.subtitle')}</p>
        </motion.div>

        {/* فرم اصلی */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass-card p-8 rounded-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* فیلد راه ارتباطی (جایگزین نام/ایمیل/تلگرام/تلفن جداگانه) */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <ContactMethodField
                id="project-contact"
                label={`${t('form.contactMethod')} *`}
                methods={contactMethods}
                methodValue={formData.contactMethod}
                onMethodChange={(value) => setFormData((current) => ({ ...current, contactMethod: value }))}
                inputValue={formData.contactValue}
                onInputChange={(value) => setFormData((current) => ({ ...current, contactValue: value }))}
                placeholder={t('form.contactMethod.placeholder')}
              />
            </motion.div>

            {/* فیلد عنوان پروژه */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label htmlFor="project-title" className={`block text-sm font-medium text-foreground mb-2 ${fieldClass}`}>
                {t('form.projectTitle')} *
              </label>
              <Input
                id="project-title"
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                placeholder={t('form.placeholder.projectTitle')}
                required
                className={`rounded-lg ${fieldClass}`}
              />
            </motion.div>
          </div>

          {/* فیلد توضیحات پروژه */}
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="project-description" className={`block text-sm font-medium text-foreground mb-2 ${fieldClass}`}>
              {t('form.description')} *
            </label>
            <Textarea
              id="project-description"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              placeholder={t('form.placeholder.description')}
              required
              className={`rounded-lg min-h-32 ${fieldClass}`}
            />
          </motion.div>

          {/* فیلد آپلود فایل */}
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="project-file" className={`block text-sm font-medium text-foreground mb-2 ${fieldClass}`}>
              {t('form.file')}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input id="project-file" type="file" onChange={handleFileChange} className="sr-only" />
              <label htmlFor="project-file" className="cursor-pointer block">
                {formData.file ? (
                  <>
                    <p className="text-primary font-medium">{t('form.file.selected')}: {formData.file.name}</p>
                    <p className="text-sm text-foreground/50 mt-1">{Math.ceil(formData.file.size / 1024)} KB</p>
                  </>
                ) : (
                  <p className="text-foreground/60">{t('form.file.empty')}</p>
                )}
              </label>
            </div>
            {fileError && <p className={`mt-2 text-sm text-destructive ${fieldClass}`}>{fileError}</p>}
          </motion.div>

          {/* دکمه ارسال */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 font-semibold"
            >
              {isLoading ? t('form.sending') : t('form.submit')}
            </Button>
          </motion.div>

          {/* پنل ارسال دستی */}
          <AnimatePresence>
            {fallbackText && (
              <motion.div
                ref={panelRef}
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-5"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-foreground">{fc.title}</h3>
                  <button type="button" onClick={() => setFallbackText(null)} className="text-xs text-foreground/50 transition-colors hover:text-foreground">
                    {fc.close}
                  </button>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-foreground/70">{fc.hint}</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Send size={15} />
                    {fc.telegram}
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.projectTitle || 'Project request')}&body=${encodeURIComponent(fallbackText)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Mail size={15} />
                    {fc.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(fallbackText).then(() => setCopied(true)).catch(() => undefined);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? fc.copied : fc.copy}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}
