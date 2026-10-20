import { createFileRoute } from "@tanstack/react-router";

import { PortfolioApp } from "@/components/PortfolioApp";
import { GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL } from "@/config/contact";

// داده‌های ساختاریافتهٔ Person برای موتورهای جستجو (Schema.org)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abolfazl Ranjbaran",
  alternateName: "ابوالفضل رنجبران",
  jobTitle: "Full-Stack Developer",
  description:
    "Computer engineering student and full-stack developer building open-source Python systems, Telegram bots and web apps.",
  sameAs: [GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL],
  knowsAbout: ["Python", "TypeScript", "React", "Django", "Telegram Bots", "Distributed Systems", "Cybersecurity"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abolfazl Ranjbaran — Full-Stack Developer & Product Designer" },
      {
        name: "description",
        content:
          "Portfolio of Abolfazl Ranjbaran: full-stack web apps, Qt desktop software, Telegram bots, and UI/UX design crafted with precision.",
      },
      { name: "keywords", content: "Abolfazl Ranjbaran, full-stack developer, Python, Telegram bots, React, Django, portfolio" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Abolfazl Ranjbaran — Full-Stack Developer & Product Designer" },
      {
        property: "og:description",
        content:
          "Full-stack web apps, Qt desktop software, Telegram bots and UI/UX design — selected work, case studies and contact.",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(personJsonLd) }],
  }),
  component: Index,
});

function Index() {
  return <PortfolioApp />;
}
