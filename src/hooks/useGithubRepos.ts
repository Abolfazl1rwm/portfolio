import { useEffect, useState } from 'react';
import { GITHUB_USERNAME } from '@/config/contact';
import { githubFetch } from '@/lib/github';

export interface GithubRepo {
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

function loadRepos(): Promise<GithubRepo[]> {
  return githubFetch<GithubRepo[]>(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`);
}

// هوک useGithubRepos: فهرست ریپوهای اصلی (غیر fork) را برمی‌گرداند؛ در صورت خطا آرایهٔ خالی و error=true
export function useGithubRepos() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    loadRepos()
      .then((data) => {
        if (!cancelled) setRepos(data.filter((r) => !r.fork));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { repos, loading, error, retry: () => setAttempt((n) => n + 1) };
}
