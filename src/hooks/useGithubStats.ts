import { useEffect, useState } from 'react';
import { githubFetch } from '@/lib/github';

// نام کاربری گیت‌هاب (همان مقداری که در Portfolio.tsx هم استفاده شده)
const GITHUB_USERNAME = 'Abolfazlrwm';

interface GithubStats {
  publicRepos: number | null;
  followers: number | null;
  loading: boolean;
}

// هوک useGithubStats: آمار زندهٔ پروفایل گیت‌هاب (تعداد مخازن عمومی و دنبال‌کننده‌ها) را واکشی می‌کند
// تا در بخش Hero به‌جای اعداد ثابت و حدسی، آمار واقعی و قابل‌تأیید نمایش داده شود
export function useGithubStats(): GithubStats {
  const [stats, setStats] = useState<GithubStats>({ publicRepos: null, followers: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const data = await githubFetch<{ public_repos?: number; followers?: number }>(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
        );
        if (!cancelled) {
          setStats({
            publicRepos: typeof data.public_repos === 'number' ? data.public_repos : null,
            followers: typeof data.followers === 'number' ? data.followers : null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('[github-stats] واکشی آمار گیت‌هاب ناموفق بود:', error);
        if (!cancelled) {
          setStats((current) => ({ ...current, loading: false }));
        }
      }
    };

    void fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
