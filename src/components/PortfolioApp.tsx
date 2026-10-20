import { useEffect, useState } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { Navigation } from '@/components/sections/Navigation';
import { Hero } from '@/components/sections/Hero';
import { TechMarquee } from '@/components/sections/TechMarquee';
import { About } from '@/components/sections/About';
import { Timeline } from '@/components/sections/Timeline';
import { Terminal } from '@/components/sections/Terminal';
import { Services } from '@/components/sections/Services';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Portfolio } from '@/components/sections/Portfolio';
import { LiveDemos } from '@/components/sections/LiveDemos';
import { Contact } from '@/components/sections/Contact';
import { StartWorking } from '@/components/sections/StartWorking';
import { Reviews } from '@/components/sections/Reviews';
import { Footer } from '@/components/sections/Footer';
import { CustomCursor } from '@/components/sections/CustomCursor';
import { CommandPalette } from '@/components/sections/CommandPalette';
import { AIChatWidget } from '@/components/sections/AIChatWidget';
import { Preloader } from '@/components/Preloader';
import { EasterEgg } from '@/components/EasterEgg';

// تنظیم زبان و جهت سند
function LanguageSetup({ children }: { children: React.ReactNode }) {
    const { isRTL } = useLanguage();

    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = isRTL ? 'fa' : 'en';
    }, [isRTL]);

    return <>{children}</>;
}

function AppContent() {
    useLenisScroll();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Preloader />
            <EasterEgg />
            {mounted ? <CustomCursor /> : null}
            {mounted ? <CommandPalette /> : null}
            {mounted ? <AIChatWidget /> : null}
            <Navigation />
            <main className="relative">
                <Hero />
                <TechMarquee />
                <About />
                <Timeline />
                <Terminal />
                <Services />
                <FeaturedProjects />
                <Portfolio />
                <LiveDemos />
                <StartWorking />
                <Reviews />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

export function PortfolioApp() {
    return (
        <ThemeProvider defaultTheme="dark" switchable>
            <LanguageProvider>
                <LanguageSetup>
                    <TooltipProvider>
                        <Toaster position="top-center" offset={84} mobileOffset={76} closeButton />
                        <AppContent />
                    </TooltipProvider>
                </LanguageSetup>
            </LanguageProvider>
        </ThemeProvider>
    );
}
