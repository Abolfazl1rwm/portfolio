import { useMemo, useState } from 'react';
import { Check, Globe, Laptop, Lock, RotateCcw, Router, Server, Smartphone, Wifi, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// دو شبیه‌ساز تعاملی که ایدهٔ اصلی دو پروژهٔ واقعی (NetScope و SecureSync) را داخل خود سایت نشان می‌دهند.
// این‌ها اندازه‌گیری یا همگام‌سازی واقعی نیستند؛ شبیه‌سازی منطق تشخیص / تعارض هستند (و در UI هم همین نوشته شده).

/* ───────────────────────── NetScope: شبیه‌ساز تشخیص ───────────────────────── */

type Fault = 'none' | 'wifi' | 'isp' | 'dns' | 'service';

const netCopy = {
  en: {
    title: 'NetScope diagnosis simulator',
    note: 'A simulation of the reasoning NetScope uses — pick a fault and watch the evidence chain narrow it down. Not real measurements.',
    faults: { none: 'Everything fine', wifi: 'Weak Wi-Fi', isp: 'ISP outage', dns: 'DNS failure', service: 'Service down' },
    probes: { gw: 'Ping router', net: 'Ping 1.1.1.1', dns: 'DNS lookup', http: 'HTTPS request' },
    ok: 'OK', slow: 'Slow', fail: 'Failed',
    score: 'Experience score',
    diagnosis: 'Diagnosis',
    verdict: {
      none: 'No problem found — everything is healthy.',
      wifi: 'The problem is your local Wi-Fi. The router itself responds badly, so nothing beyond it can be trusted.',
      isp: 'The problem is your ISP. Your router is fine but packets do not get out to the internet.',
      dns: 'The problem is DNS. The internet is reachable, but names cannot be resolved.',
      service: 'The problem is the destination service. Your Wi-Fi, ISP and DNS are all fine.',
    },
    evidence: 'Evidence chain',
  },
  fa: {
    title: 'شبیه‌ساز تشخیص NetScope',
    note: 'شبیه‌سازی منطق استدلال NetScope — یک خرابی انتخاب کنید و ببینید زنجیرهٔ شواهد چطور مشکل را مشخص می‌کند. این‌ها اندازه‌گیری واقعی نیستند.',
    faults: { none: 'همه‌چیز سالم', wifi: 'وای‌فای ضعیف', isp: 'قطعی ISP', dns: 'خرابی DNS', service: 'خرابی سرویس' },
    probes: { gw: 'پینگ روتر', net: 'پینگ 1.1.1.1', dns: 'تحلیل DNS', http: 'درخواست HTTPS' },
    ok: 'سالم', slow: 'کند', fail: 'ناموفق',
    score: 'امتیاز تجربه',
    diagnosis: 'تشخیص',
    verdict: {
      none: 'مشکلی پیدا نشد — همه‌چیز سالم است.',
      wifi: 'مشکل از وای‌فای محلی شماست. خود روتر پاسخ بدی می‌دهد، پس بقیهٔ مسیر قابل اتکا نیست.',
      isp: 'مشکل از ISP است. روتر سالم است اما بسته‌ها به اینترنت نمی‌رسند.',
      dns: 'مشکل از DNS است. اینترنت در دسترس است ولی نام‌ها تحلیل نمی‌شوند.',
      service: 'مشکل از خود سرویس مقصد است. وای‌فای، ISP و DNS همه سالم‌اند.',
    },
    evidence: 'زنجیرهٔ شواهد',
  },
} as const;

type ProbeState = 'ok' | 'slow' | 'fail';

function probesFor(fault: Fault): Record<'gw' | 'net' | 'dns' | 'http', { s: ProbeState; ms: number | null }> {
  switch (fault) {
    case 'wifi': return { gw: { s: 'slow', ms: 380 }, net: { s: 'slow', ms: 450 }, dns: { s: 'slow', ms: 520 }, http: { s: 'slow', ms: 1900 } };
    case 'isp': return { gw: { s: 'ok', ms: 3 }, net: { s: 'fail', ms: null }, dns: { s: 'fail', ms: null }, http: { s: 'fail', ms: null } };
    case 'dns': return { gw: { s: 'ok', ms: 3 }, net: { s: 'ok', ms: 21 }, dns: { s: 'fail', ms: null }, http: { s: 'fail', ms: null } };
    case 'service': return { gw: { s: 'ok', ms: 3 }, net: { s: 'ok', ms: 21 }, dns: { s: 'ok', ms: 18 }, http: { s: 'fail', ms: null } };
    default: return { gw: { s: 'ok', ms: 3 }, net: { s: 'ok', ms: 21 }, dns: { s: 'ok', ms: 18 }, http: { s: 'ok', ms: 140 } };
  }
}

const faultScore: Record<Fault, number> = { none: 96, wifi: 41, isp: 8, dns: 22, service: 57 };

function NetScopeSim() {
  const { language, isRTL } = useLanguage();
  const c = netCopy[language];
  const [fault, setFault] = useState<Fault>('none');
  const probes = useMemo(() => probesFor(fault), [fault]);
  const label = { ok: c.ok, slow: c.slow, fail: c.fail };
  const tone = { ok: 'text-green-500', slow: 'text-amber-500', fail: 'text-red-500' };

  // زنجیرهٔ شواهد به‌ترتیب همان منطق قاعده‌محور: روتر ← اینترنت ← DNS ← سرویس
  const evidence: string[] = [];
  evidence.push(`${c.probes.gw}: ${label[probes.gw.s]}`);
  if (probes.gw.s === 'ok') evidence.push(`${c.probes.net}: ${label[probes.net.s]}`);
  if (probes.gw.s === 'ok' && probes.net.s === 'ok') evidence.push(`${c.probes.dns}: ${label[probes.dns.s]}`);
  if (probes.gw.s === 'ok' && probes.net.s === 'ok' && probes.dns.s === 'ok') evidence.push(`${c.probes.http}: ${label[probes.http.s]}`);

  const nodes = [
    { icon: Laptop, key: 'you' },
    { icon: Wifi, key: 'wifi', bad: fault === 'wifi' },
    { icon: Router, key: 'isp', bad: fault === 'isp' },
    { icon: Globe, key: 'dns', bad: fault === 'dns' },
    { icon: Server, key: 'service', bad: fault === 'service' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="mb-2 text-xl font-bold text-foreground">{c.title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-foreground/60">{c.note}</p>

      <div className="mb-6 flex flex-wrap gap-2" role="group">
        {(Object.keys(c.faults) as Fault[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFault(f)}
            aria-pressed={fault === f}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              fault === f
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background/40 text-foreground/70 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {c.faults[f]}
          </button>
        ))}
      </div>

      {/* مسیر شبکه */}
      <div className="mb-8 flex items-center justify-between gap-1 overflow-x-auto py-2" dir="ltr">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={n.key} className="flex flex-1 items-center">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  n.bad ? 'border-red-500 bg-red-500/15 text-red-500' : 'border-primary/40 bg-primary/10 text-primary'
                }`}
              >
                <Icon size={20} />
              </div>
              {i < nodes.length - 1 && (
                <div className={`mx-1 h-0.5 min-w-4 flex-1 transition-colors duration-300 ${nodes[i + 1].bad ? 'bg-red-500/60' : 'bg-primary/40'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">{c.evidence}</h4>
          <ul className="space-y-2">
            {(['gw', 'net', 'dns', 'http'] as const).map((k) => {
              const p = probes[k];
              return (
                <li key={k} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm">
                  <span className="text-foreground/80">{c.probes[k]}</span>
                  <span className={`flex items-center gap-1.5 font-mono ${tone[p.s]}`} dir="ltr">
                    {p.s === 'fail' ? <X size={14} /> : <Check size={14} />}
                    {p.ms !== null ? `${p.ms} ms` : label[p.s]}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex items-baseline justify-between">
            <h4 className="text-sm font-semibold text-foreground">{c.score}</h4>
            <span className="font-mono text-2xl font-bold text-primary" dir="ltr">{faultScore[fault]}/100</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted" dir="ltr">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${faultScore[fault]}%` }}
            />
          </div>
          <div className="mt-auto rounded-xl border border-primary/30 bg-primary/10 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{c.diagnosis}</div>
            <p className="text-sm leading-relaxed text-foreground">{c.verdict[fault]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── SecureSync: شبیه‌ساز همگام‌سازی ───────────────────────── */

type PeerId = 'laptop' | 'phone' | 'server';
interface Chunk { hash: string; vv: Record<PeerId, number>; ts: number }
type PeerState = { online: boolean; chunks: Chunk[] };
type World = Record<PeerId, PeerState>;

const PEERS: PeerId[] = ['laptop', 'phone', 'server'];
const CHUNKS = 8;
const CHUNK_BYTES = 256; // KB — فقط برای نمایش «حجم منتقل‌شده»

const randHash = () => Math.random().toString(16).slice(2, 6);
const zeroVV = (): Record<PeerId, number> => ({ laptop: 0, phone: 0, server: 0 });

function initialWorld(): World {
  const base: Chunk[] = Array.from({ length: CHUNKS }, (_, i) => ({ hash: `0${i}ab`, vv: zeroVV(), ts: 0 }));
  const clone = () => base.map((c) => ({ ...c, vv: { ...c.vv } }));
  return { laptop: { online: true, chunks: clone() }, phone: { online: true, chunks: clone() }, server: { online: true, chunks: clone() } };
}

// مقایسهٔ version vector: 'a' بر 'b' غلبه دارد / برعکس / هم‌زمان (تعارض) / برابر
function compareVV(a: Record<PeerId, number>, b: Record<PeerId, number>): 'a' | 'b' | 'conflict' | 'equal' {
  let aBigger = false;
  let bBigger = false;
  for (const p of PEERS) {
    if (a[p] > b[p]) aBigger = true;
    if (b[p] > a[p]) bBigger = true;
  }
  if (aBigger && bBigger) return 'conflict';
  if (aBigger) return 'a';
  if (bBigger) return 'b';
  return 'equal';
}

const syncCopy = {
  en: {
    title: 'SecureSync delta-sync simulator',
    note: 'A simulation of how SecureSync reasons about changes: only changed chunks travel, concurrent edits are detected with version vectors. Nothing here is real network traffic.',
    peers: { laptop: 'Laptop', phone: 'Phone', server: 'Home server' },
    edit: 'Edit a chunk',
    sync: 'Sync all online peers',
    offline: 'Go offline',
    online: 'Go online',
    reset: 'Reset',
    log: 'Event log',
    sent: 'Transferred',
    of: 'of a full copy',
    empty: 'Edit a chunk on any device, then press Sync.',
    synced: (n: number, kb: number, total: number) => `Synced ${n} changed chunk${n === 1 ? '' : 's'} — ${kb} KB sent instead of ${total} KB (encrypted).`,
    conflict: (i: number, winner: string) => `Conflict on chunk #${i + 1} detected (concurrent edits). Resolved last-writer-wins → ${winner}.`,
    nothing: 'Already in sync — nothing to send.',
    edited: (p: string, i: number) => `${p} edited chunk #${i + 1}.`,
    wentOffline: (p: string) => `${p} went offline.`,
    wentOnline: (p: string) => `${p} is back online.`,
  },
  fa: {
    title: 'شبیه‌ساز دلتا-سینک SecureSync',
    note: 'شبیه‌سازی نحوهٔ استدلال SecureSync دربارهٔ تغییرات: فقط تکه‌های تغییرکرده منتقل می‌شوند و ویرایش‌های هم‌زمان با version vector تشخیص داده می‌شوند. هیچ‌کدام ترافیک واقعی شبکه نیست.',
    peers: { laptop: 'لپ‌تاپ', phone: 'گوشی', server: 'سرور خانگی' },
    edit: 'ویرایش یک تکه',
    sync: 'همگام‌سازی دستگاه‌های آنلاین',
    offline: 'آفلاین شو',
    online: 'آنلاین شو',
    reset: 'بازنشانی',
    log: 'گزارش رویدادها',
    sent: 'حجم منتقل‌شده',
    of: 'از کپی کامل',
    empty: 'روی یکی از دستگاه‌ها یک تکه را ویرایش کنید، بعد همگام‌سازی را بزنید.',
    synced: (n: number, kb: number, total: number) => `${n} تکهٔ تغییرکرده همگام شد — ${kb} کیلوبایت به‌جای ${total} کیلوبایت منتقل شد (رمزنگاری‌شده).`,
    conflict: (i: number, winner: string) => `تعارض روی تکهٔ ${i + 1} تشخیص داده شد (ویرایش هم‌زمان). با «آخرین نویسنده» حل شد ← ${winner}.`,
    nothing: 'همه‌چیز همگام است — چیزی برای ارسال نیست.',
    edited: (p: string, i: number) => `${p} تکهٔ ${i + 1} را ویرایش کرد.`,
    wentOffline: (p: string) => `${p} آفلاین شد.`,
    wentOnline: (p: string) => `${p} دوباره آنلاین شد.`,
  },
} as const;

const peerIcon = { laptop: Laptop, phone: Smartphone, server: Server } as const;

function SecureSyncSim() {
  const { language, isRTL } = useLanguage();
  const c = syncCopy[language];
  const [world, setWorld] = useState<World>(initialWorld);
  const [log, setLog] = useState<string[]>([]);
  const [sentKb, setSentKb] = useState(0);
  const [flash, setFlash] = useState<Set<string>>(new Set());

  const push = (line: string) => setLog((l) => [line, ...l].slice(0, 6));

  const edit = (peer: PeerId) => {
    const idx = Math.floor(Math.random() * CHUNKS);
    setWorld((w) => {
      const chunks = w[peer].chunks.map((ch, i) =>
        i === idx ? { hash: randHash(), vv: { ...ch.vv, [peer]: ch.vv[peer] + 1 }, ts: Date.now() } : ch,
      );
      return { ...w, [peer]: { ...w[peer], chunks } };
    });
    push(c.edited(c.peers[peer], idx));
  };

  const toggle = (peer: PeerId) => {
    setWorld((w) => ({ ...w, [peer]: { ...w[peer], online: !w[peer].online } }));
    push(world[peer].online ? c.wentOffline(c.peers[peer]) : c.wentOnline(c.peers[peer]));
  };

  const sync = () => {
    const next: World = JSON.parse(JSON.stringify(world));
    const online = PEERS.filter((p) => next[p].online);
    let transferred = 0;
    const touched = new Set<string>();
    const conflicts: { i: number; winner: PeerId }[] = [];

    // چند دور هم‌گرایی دوبه‌دو تا وقتی دیگر تغییری نباشد
    for (let round = 0; round < 3; round++) {
      for (const a of online) {
        for (const b of online) {
          if (a >= b) continue;
          for (let i = 0; i < CHUNKS; i++) {
            const ca = next[a].chunks[i];
            const cb = next[b].chunks[i];
            const cmp = compareVV(ca.vv, cb.vv);
            if (cmp === 'equal' && ca.hash === cb.hash) continue;
            let winner: PeerId | null = null;
            if (cmp === 'a') winner = a;
            else if (cmp === 'b') winner = b;
            else if (cmp === 'conflict' || ca.hash !== cb.hash) {
              winner = ca.ts >= cb.ts ? a : b;
              if (cmp === 'conflict') conflicts.push({ i, winner });
            }
            if (!winner) continue;
            const loser = winner === a ? b : a;
            const src = next[winner].chunks[i];
            // بردار نسخه ادغام می‌شود تا تعارض تکرار نشود
            const merged = zeroVV();
            for (const p of PEERS) merged[p] = Math.max(ca.vv[p], cb.vv[p]);
            next[loser].chunks[i] = { hash: src.hash, vv: merged, ts: src.ts };
            next[winner].chunks[i] = { ...src, vv: merged };
            transferred += 1;
            touched.add(`${loser}-${i}`);
          }
        }
      }
    }

    if (transferred === 0) {
      push(c.nothing);
      return;
    }
    const uniqueConflicts = new Map(conflicts.map((x) => [x.i, x]));
    uniqueConflicts.forEach(({ i, winner }) => push(c.conflict(i, c.peers[winner])));
    const kb = transferred * CHUNK_BYTES;
    push(c.synced(transferred, kb, CHUNKS * CHUNK_BYTES * online.length));
    setSentKb((s) => s + kb);
    setWorld(next);
    setFlash(touched);
    window.setTimeout(() => setFlash(new Set()), 1100);
  };

  const reset = () => {
    setWorld(initialWorld());
    setLog([]);
    setSentKb(0);
    setFlash(new Set());
  };

  // نشانگر «رنگ» هر تکه از روی هش — تکه‌های یکسان در دستگاه‌های مختلف همرنگ‌اند
  const hue = (hash: string) => (parseInt(hash, 16) * 47) % 360;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Lock size={18} className="text-primary" />
          {c.title}
        </h3>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary">
          <RotateCcw size={14} />
          {c.reset}
        </button>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-foreground/60">{c.note}</p>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {PEERS.map((p) => {
          const Icon = peerIcon[p];
          const st = world[p];
          return (
            <div key={p} className={`rounded-xl border p-4 transition-opacity duration-300 ${st.online ? 'border-border bg-background/40' : 'border-dashed border-border bg-background/20 opacity-60'}`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon size={16} className="text-primary" />
                  {c.peers[p]}
                </span>
                <span className={`h-2 w-2 rounded-full ${st.online ? 'bg-green-500' : 'bg-foreground/30'}`} />
              </div>
              <div className="mb-3 grid grid-cols-8 gap-1" dir="ltr">
                {st.chunks.map((ch, i) => (
                  <div
                    key={i}
                    title={`#${i + 1} · ${ch.hash}`}
                    className={`aspect-square rounded-[4px] border border-black/10 transition-transform duration-300 ${flash.has(`${p}-${i}`) ? 'scale-125 ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: `hsl(${hue(ch.hash)} 65% 55%)` }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => edit(p)}
                  className="flex-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  {c.edit}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(p)}
                  className="rounded-lg border border-border px-2 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {st.online ? c.offline : c.online}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={sync}
          className="button-sheen rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {c.sync}
        </button>
        <span className="text-sm text-foreground/60">
          {c.sent}: <span className="font-mono font-semibold text-primary" dir="ltr">{sentKb} KB</span>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background/50 p-4 font-mono text-xs leading-relaxed text-foreground/75" aria-live="polite">
        <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wider text-foreground/50">{c.log}</div>
        {log.length === 0 ? <div className="font-sans">{c.empty}</div> : log.map((l, i) => <div key={i} className={i === 0 ? 'text-foreground' : ''}>› {l}</div>)}
      </div>
    </div>
  );
}

export function Simulations({ tab }: { tab: 'netscope' | 'securesync' }) {
  return tab === 'netscope' ? <NetScopeSim /> : <SecureSyncSim />;
}
