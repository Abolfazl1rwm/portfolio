import { motion, type Variants } from 'framer-motion';
import { Code2, Globe, Smartphone, Brain, Cloud, Bot, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTilt } from '@/hooks/useTilt';
import profileUrl from '@/assets/profile.webp';

// مهارت‌ها
const skills = [
    { icon: Code2, key: 'programming' },
    { icon: Globe, key: 'web' },
    { icon: Smartphone, key: 'mobile' },
    { icon: Brain, key: 'ai' },
    { icon: Cloud, key: 'cloud' },
    { icon: Bot, key: 'automation' },
];

// کارت یک مهارت، با افکت کج‌شدن سه‌بعدی ملایم بر اساس موقعیت واقعی ماوس
function SkillCard({
    icon: Icon,
    skillKey,
    index,
    itemVariants,
    t,
}: {
    icon: LucideIcon;
    skillKey: string;
    index: number;
    itemVariants: Variants;
    t: (key: string) => string;
}) {
    const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt(6);

    return (
        <motion.div
            variants={itemVariants}
            className={`group relative z-10 ${index % 3 === 1 ? 'lg:-translate-y-4' : ''}`}
            style={{ perspective: 800 }}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="glass-card interactive-card h-full rounded-2xl p-6"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{t(`skills.${skillKey}`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`skills.${skillKey}.desc`)}
                </p>
                <div className="mt-4 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
        </motion.div>
    );
}

// کامپوننت About: پروفایل + مهارت‌ها
export function About() {
    const { t, isRTL } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    };

    return (
        <section id="about" className="relative overflow-visible px-4 py-24 sm:px-6 lg:px-8">
            {/* هاله‌های نور پس‌زمینه */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 right-[-10%] -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-[-8%] -z-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    {/* تصویر پروفایل */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="relative mx-auto w-full max-w-sm"
                    >
                        <div className="profile-frame group relative mx-auto aspect-square w-56 sm:w-72 lg:w-full lg:max-w-[22rem]">
                            <div className="relative h-full w-full overflow-hidden rounded-full border border-background/60 bg-navy-deep">
                                <img
                                    src={profileUrl}
                                    alt={t('about.title')}
                                    loading="lazy"
                                    className="h-full w-full object-cover object-top"
                                />
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-t from-background/70 via-transparent to-transparent"
                                />
                            </div>
                        </div>

                        {/* کارت شناور نامتقارن */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className={`glass-card absolute bottom-2 z-20 rounded-2xl px-4 py-3 ${isRTL ? 'right-0 sm:right-2' : 'left-0 sm:left-2'
                                }`}
                        >
                            <p className="font-display text-sm font-semibold text-foreground">Abolfazl Ranjbaran</p>
                            <p className="text-xs text-accent">{t('about.tag')}</p>
                        </motion.div>
                    </motion.div>

                    {/* متن معرفی */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <span className="section-label">{t('about.title')}</span>
                        <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
                            <span className="text-gradient">{t('about.title')}</span>
                        </h2>
                        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            {t('about.description')}
                        </p>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70">
                            {t('about.openToIdeas')}
                        </p>
                    </motion.div>
                </div>

                {/* گرید مهارت‌ها */}
                <motion.div
                    className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={skill.key}
                            icon={skill.icon}
                            skillKey={skill.key}
                            index={index}
                            itemVariants={itemVariants}
                            t={t}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
