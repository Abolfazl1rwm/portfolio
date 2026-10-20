// واکشی مشترک و کش‌شدهٔ GitHub API برای کل سایت.
// چرا؟ API عمومی گیت‌هاب برای هر IP فقط ۶۰ درخواست در ساعت می‌دهد. قبلاً هر بخش (Hero، پروژه‌ها، نمونه‌کارها)
// جداگانه درخواست می‌زد؛ در شبکه‌های مشترک خیلی زود ۴۰۳ می‌گرفت و بخش‌ها خالی می‌ماندند.
// اینجا: ۱) درخواست‌های هم‌زمان یکی می‌شوند ۲) نتیجه ۳۰ دقیقه در localStorage می‌ماند ۳) اگر خطا شد، آخرین داده (حتی کهنه) برمی‌گردد.

const TTL_MS = 30 * 60 * 1000;
const inflight = new Map<string, Promise<unknown>>();

function readCache<T>(key: string): { at: number; data: T } | null {
  try {
    const raw = window.localStorage.getItem(`gh:${key}`);
    return raw ? (JSON.parse(raw) as { at: number; data: T }) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown) {
  try {
    window.localStorage.setItem(`gh:${key}`, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* localStorage پر یا غیرفعال است */
  }
}

export function githubFetch<T>(url: string): Promise<T> {
  const cached = typeof window !== 'undefined' ? readCache<T>(url) : null;
  if (cached && Date.now() - cached.at < TTL_MS) return Promise.resolve(cached.data);

  const existing = inflight.get(url);
  if (existing) return existing as Promise<T>;

  const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  const token = import.meta.env['VITE_GITHUB_TOKEN'];
  if (token) headers['Authorization'] = `token ${token}`;

  const request = fetch(url, { headers })
    .then(async (res) => {
      if (!res.ok) throw new Error(`GitHub API request failed (${res.status})`);
      const data = (await res.json()) as T;
      writeCache(url, data);
      return data;
    })
    .catch((error) => {
      if (cached) return cached.data; // آخرین داده‌ٔ موجود بهتر از بخش خالی است
      throw error;
    })
    .finally(() => inflight.delete(url));

  inflight.set(url, request);
  return request;
}
