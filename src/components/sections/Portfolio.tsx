import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Search, AlertCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// تعریف رابط برای ساختار داده‌ای هر مخزن (Repository)
interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  homepage: string | null;
  fork: boolean;
}

// کامپوننت Portfolio برای نمایش نمونه کارها از GitHub
export function Portfolio() {
  const { t, isRTL } = useLanguage(); // هوک زبان برای ترجمه و تشخیص جهت‌دهی
  const { repos, loading, error, retry } = useGithubRepos(); // مخازن از هوک مشترک و کش‌شده (محدودیت نرخ GitHub مصرف نمی‌شود)
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]); // لیست مخازن فیلتر شده
  const [searchTerm, setSearchTerm] = useState(''); // عبارت جستجو
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی برای صفحه‌بندی
  const itemsPerPage = 6; // تعداد آیتم در هر صفحه

  // useEffect برای فیلتر کردن مخازن بر اساس جستجو و مرتب‌سازی بر اساس تعداد ستاره (نزولی)
  useEffect(() => {
    let filtered = repos;

    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // مرتب‌سازی نزولی بر اساس تعداد ستاره‌های گیت‌هاب (بدون فیلتر دسته‌بندی)
    filtered = [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count);

    setFilteredRepos(filtered); // تنظیم لیست مخازن فیلتر شده
    setCurrentPage(1); // بازگشت به صفحه اول پس از فیلتر
  }, [searchTerm, repos]); // این useEffect هنگام تغییر searchTerm یا repos دوباره اجرا می‌شود

  // منطق صفحه‌بندی
  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage); // محاسبه تعداد کل صفحات
  const startIndex = (currentPage - 1) * itemsPerPage; // محاسبه ایندکس شروع آیتم‌ها
  const paginatedRepos = filteredRepos.slice(
    startIndex,
    startIndex + itemsPerPage
  ); // برش لیست برای صفحه فعلی

  // واریانت‌های انیمیشن برای کانتینر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // واریانت‌های انیمیشن برای هر آیتم
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // تابع برای فرمت‌بندی تاریخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="portfolio" className="py-20 px-4 md:px-8 bg-background"> {/* بخش نمونه کارها */}
      <div className="max-w-6xl mx-auto"> {/* کانتینر اصلی با حداکثر عرض */}
        {/* هدر بخش */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient"> {/* عنوان بخش */}
            {t('portfolio.title')}
          </h2>
          <p className="text-foreground/60 text-lg"> {/* زیرعنوان بخش */}
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        {/* وضعیت خطا */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{t('portfolio.error')}</p>
              <Button
                onClick={retry} // دکمه تلاش مجدد
                variant="outline"
                size="sm"
                className="mt-2 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t('portfolio.retry')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* جستجو و فیلتر */}
        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative"> {/* فیلد جستجو */}
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40`} />
              <Input
                placeholder={t('portfolio.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </motion.div>
        )}

        {/* وضعیت بارگذاری */}
        {loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Skeleton className="h-64 rounded-lg" /> {/* اسکلتون برای هر کارت */}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* وضعیت خالی */}
        {!loading && !error && filteredRepos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Github className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
            <p className="text-foreground/60">
              {searchTerm
                ? t('portfolio.noResults')
                : t('portfolio.empty')}
            </p>
          </motion.div>
        )}

        {/* گرید مخازن */}
        {!loading && !error && paginatedRepos.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {paginatedRepos.map((repo) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.015 }} // انیمیشن هاور (بلندشدن + کمی بزرگ‌شدن)
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-[border-color,box-shadow] duration-300 cursor-pointer"
              >
                {/* گرادیان پس‌زمینه هنگام هاور */}
                <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10"> {/* محتوای کارت */}
                  {/* هدر کارت */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors"> {/* نام مخزن */}
                        {repo.name}
                      </h3>
                      {repo.language && (
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"> {/* زبان برنامه‌نویسی */}
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" /> {/* آیکون لینک خارجی */}
                  </div>

                  {/* توضیحات */}
                  {repo.description && (
                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2"> {/* توضیحات مخزن */}
                      {repo.description}
                    </p>
                  )}

                  {/* تاپیک‌ها */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 rounded text-xs bg-secondary text-foreground/70" // تگ تاپیک
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* آمار */}
                  <div className="flex items-center gap-4 text-sm text-foreground/60 pt-4 border-t border-border"> {/* آمار ستاره‌ها، فورک‌ها و تاریخ */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                    <div className="ml-auto text-xs"> {/* تاریخ آخرین به‌روزرسانی */}
                      {formatDate(repo.updated_at)}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* صفحه‌بندی */}
        {!loading && !error && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-2 flex-wrap"
          >
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} // دکمه صفحه قبلی
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              {t('portfolio.previous')}
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)} // دکمه شماره صفحه
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
              >
                {i + 1}
              </Button>
            ))}

            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} // دکمه صفحه بعدی
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              {t('portfolio.next')}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
