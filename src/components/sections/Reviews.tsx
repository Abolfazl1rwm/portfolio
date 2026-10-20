import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sendToTelegram, formatReviewMessage } from '@/lib/telegram';
import { ContactMethodField } from './ContactMethodField';

// نظر منتشرشده
interface PublishedReview {
  id: string;
  clientName: string;
  projectName: string;
  rating: number;
  reviewText: string;
}

// تعریف رابط برای داده‌های فرم بازخورد
interface ReviewFormData {
  clientName: string;
  contactMethod: string; // روش ارتباطی انتخاب‌شده (اختیاری): email | telegram
  contactValue: string;
  projectName: string;
  rating: number;
  reviewText: string;
}

// مقادیر اولیه برای فرم بازخورد
const initialFormData: ReviewFormData = {
  clientName: '',
  contactMethod: 'email',
  contactValue: '',
  projectName: '',
  rating: 0,
  reviewText: '',
};

// کامپوننت Reviews برای نمایش نظرات و فرم ارسال بازخورد
export function Reviews() {
  const { t, isRTL } = useLanguage(); // استفاده از هوک زبان برای ترجمه و جهت‌دهی
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData); // وضعیت داده‌های فرم بازخورد
  // نظرات این سایت فقط از طریق همین فرم ثبت می‌شوند؛ نظر نمونه/ساختگی وجود ندارد
  const [reviews, setReviews] = useState<PublishedReview[]>([]); // فهرست نظرات منتشرشده
  const [isPending, setIsPending] = useState(false); // وضعیت ارسال بازخورد

  // گزینه‌های راه ارتباطی برای فرم نظرات (فقط ایمیل و تلگرام)
  const contactMethods = [
    { value: 'email', label: t('reviews.contactMethod.email') },
    { value: 'telegram', label: t('reviews.contactMethod.telegram') },
  ];

  // هندل کردن تغییرات ورودی‌های فرم
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // هندل کردن ارسال فرم
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // اعتبارسنجی فیلدهای ضروری (نام و راه ارتباطی اختیاری هستند)
    if (!formData.projectName.trim() || !formData.reviewText.trim() || formData.rating < 1) {
      toast.error(t('reviews.validation')); // نمایش پیام خطای اعتبارسنجی
      return;
    }

    // افزودن بازخورد به فهرست محلی
    setIsPending(true);
    window.setTimeout(() => {
      setReviews((current) => [
        {
          id: `local-${Date.now()}`,
          clientName: formData.clientName.trim() || t('reviews.name'),
          projectName: formData.projectName.trim(),
          rating: formData.rating,
          reviewText: formData.reviewText.trim(),
        },
        ...current,
      ]);
      // تلاش برای ارسال بازخورد به تلگرام (اگر پیکربندی شده باشد)
      void sendToTelegram(
        formatReviewMessage({
          clientName: formData.clientName.trim(),
          contactMethodLabel: formData.contactValue.trim()
            ? contactMethods.find((m) => m.value === formData.contactMethod)?.label ?? formData.contactMethod
            : '',
          contactValue: formData.contactValue.trim(),
          projectName: formData.projectName.trim(),
          rating: formData.rating,
          reviewText: formData.reviewText.trim(),
        })
      );
      setFormData(initialFormData);
      setIsPending(false);
      toast.success(t('reviews.success'));
    }, 500);
  };

  // واریانت‌های انیمیشن برای کانتینر اصلی
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
  };

  // تعیین جهت‌دهی متن بر اساس RTL/LTR
  const textAlignment = isRTL ? 'text-right' : '';

  return (
    <section id="reviews" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-6xl mx-auto">
        {/* هدر بخش نظرات */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t('reviews.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
          {/* فرم ارسال بازخورد */}
          <motion.form
            onSubmit={handleSubmit}
            className="xl:col-span-2 glass-card relative z-10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <h3 className={`text-xl font-bold text-foreground ${textAlignment}`}>{t('reviews.form.title')}</h3>
            <p className={`mt-2 text-sm leading-6 text-foreground/65 ${textAlignment}`}>{t('reviews.form.description')}</p>

            <div className="mt-6 space-y-4">
              {/* فیلد نام مشتری (اختیاری) */}
              <div>
                <label htmlFor="review-name" className={`block mb-2 text-sm font-medium ${textAlignment}`}>
                  {t('reviews.name')}
                </label>
                <Input
                  id="review-name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder={t('reviews.placeholder.name')}
                  className={textAlignment}
                />
              </div>

              {/* فیلد راه ارتباطی (اختیاری): ایمیل یا تلگرام */}
              <ContactMethodField
                id="review-contact"
                label={t('reviews.contactMethod')}
                methods={contactMethods}
                methodValue={formData.contactMethod}
                onMethodChange={(value) => setFormData((current) => ({ ...current, contactMethod: value }))}
                inputValue={formData.contactValue}
                onInputChange={(value) => setFormData((current) => ({ ...current, contactValue: value }))}
                placeholder={t('reviews.contactMethod.placeholder')}
              />

              {/* فیلد نام پروژه */}
              <div>
                <label htmlFor="review-project" className={`block mb-2 text-sm font-medium ${textAlignment}`}>
                  {t('reviews.project')} *
                </label>
                <Input
                  id="review-project"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder={t('reviews.placeholder.project')}
                  required
                  className={textAlignment}
                />
              </div>

              {/* فیلد امتیازدهی (Rating) */}
              <fieldset>
                <legend className={`block mb-2 text-sm font-medium ${textAlignment}`}>{t('reviews.rating')} *</legend>
                <div
                  className={`flex gap-1 ${isRTL ? 'justify-end' : ''}`}
                  role="radiogroup"
                  aria-label={t('reviews.ratingLabel')}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={formData.rating === rating}
                      aria-label={t('reviews.ratingOption').replace('{rating}', String(rating))}
                      onClick={() => setFormData((current) => ({ ...current, rating }))}
                      className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <Star
                        size={24}
                        className={rating <= formData.rating ? 'fill-accent text-accent' : 'text-foreground/30'}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* فیلد متن بازخورد */}
              <div>
                <label htmlFor="review-comment" className={`block mb-2 text-sm font-medium ${textAlignment}`}>
                  {t('reviews.comment')} *
                </label>
                <Textarea
                  id="review-comment"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  placeholder={t('reviews.placeholder.comment')}
                  required
                  className={`min-h-32 ${textAlignment}`}
                />
              </div>

              {/* دکمه ارسال بازخورد */}
              <Button type="submit" className="w-full rounded-full" disabled={isPending}>
                {isPending ? t('reviews.sending') : t('reviews.submit')}
              </Button>
            </div>
          </motion.form>

          {/* نمایش لیست نظرات */}
          <div className="xl:col-span-3">
            {reviews.length === 0 ? (
              // نمایش پیام در صورت عدم وجود نظر
              <div className="text-center py-12 glass-card rounded-2xl">
                <p className="text-foreground/70 text-lg">{t('reviews.empty')}</p>
              </div>
            ) : (
              // نمایش نظرات تایید شده
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {reviews.map((review: PublishedReview) => (
                  <motion.article
                    key={review.id}
                    className="group relative z-10 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
                    variants={itemVariants}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {/* امتیاز ستاره‌ای */}
                    <div
                      className={`flex gap-1 mb-4 ${isRTL ? 'justify-end' : ''}`}
                      aria-label={t('reviews.ratingOption').replace('{rating}', String(review.rating))}
                    >
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={index < review.rating ? 'fill-accent text-accent' : 'text-foreground/20'}
                        />
                      ))}
                    </div>
                    {/* متن بازخورد */}
                    <p className={`text-foreground/80 mb-6 ${textAlignment}`}>{review.reviewText}</p>
                    {/* اطلاعات مشتری */}
                    <div className={`flex items-center gap-3 pt-4 border-t border-border/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <User size={20} className="text-primary-foreground" />
                      </div>
                      <div className={textAlignment}>
                        <p className="font-semibold text-foreground">{review.clientName}</p>
                        <p className="text-sm text-foreground/60">{review.projectName}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
