import type { ProjectArtKey } from '@/data/projects';

// تصویرسازی‌های SVG کوچک و اختصاصی برای هر پروژه — با currentColor رنگ تم را می‌گیرند و انیمیشن‌هایشان
// با prefers-reduced-motion خودکار خاموش می‌شود (قانون سراسری در styles.css)

const base = 'h-full w-full';

function Sync() {
  const nodes = [
    [60, 80], [200, 40], [340, 90], [150, 150], [290, 160],
  ];
  const links = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 3], [1, 4]];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      {links.map(([a, b], i) => (
        <g key={i}>
          <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="currentColor" strokeOpacity="0.25" />
          <circle r="3" fill="currentColor">
            <animateMotion dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" path={`M${nodes[a][0]},${nodes[a][1]} L${nodes[b][0]},${nodes[b][1]}`} />
          </circle>
        </g>
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="currentColor" fillOpacity="0.12" stroke="currentColor" />
          <rect x={x - 5} y={y - 3} width="10" height="8" rx="1.5" fill="currentColor" />
          <path d={`M${x - 3},${y - 3} v-3 a3,3 0 0 1 6,0 v3`} stroke="currentColor" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

function Honeypot() {
  const pings = [[70, 70], [140, 110], [220, 60], [300, 120], [250, 150], [100, 150]];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      {Array.from({ length: 11 }).map((_, r) =>
        Array.from({ length: 22 }).map((__, c) => (
          <circle key={`${r}-${c}`} cx={20 + c * 17} cy={14 + r * 16} r="1.4" fill="currentColor" fillOpacity="0.2" />
        )),
      )}
      {pings.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="200" y2="100" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 4" />
          <circle cx={x} cy={y} r="3" fill="currentColor" />
          <circle cx={x} cy={y} r="3" stroke="currentColor">
            <animate attributeName="r" from="3" to="18" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <circle cx="200" cy="100" r="7" fill="currentColor" />
    </svg>
  );
}

function NetScope() {
  const steps = ['Device', 'Wi-Fi', 'ISP', 'DNS', 'Service'];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      <path d="M40 120 H360" stroke="currentColor" strokeOpacity="0.3" />
      {steps.map((s, i) => (
        <g key={s}>
          <circle cx={40 + i * 80} cy="120" r="9" fill="currentColor" fillOpacity={i === 2 ? 0.9 : 0.2} stroke="currentColor" />
          <text x={40 + i * 80} y="150" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.7" fontFamily="monospace">
            {s}
          </text>
        </g>
      ))}
      <polyline points="30,70 70,60 110,75 150,50 190,70 230,40 270,65 310,45 350,60" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="0 700;700 0" dur="3s" repeatCount="indefinite" />
      </polyline>
      <text x="360" y="30" textAnchor="end" fontSize="13" fill="currentColor" fontFamily="monospace">
        score 87 / 100
      </text>
    </svg>
  );
}

function Agent() {
  const boxes = [['Provider', 40], ['Agent', 150], ['Tool', 260]] as const;
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      {boxes.map(([label, x]) => (
        <g key={label}>
          <rect x={x} y="70" width="100" height="56" rx="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" />
          <text x={x + 50} y="103" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <path d="M140 98 H150 M250 98 H260" stroke="currentColor" strokeWidth="2" />
      <rect x="110" y="150" width="180" height="26" rx="13" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="4 4" />
      <text x="200" y="167" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.8" fontFamily="monospace">
        Runtime
      </text>
      <circle r="3.5" fill="currentColor">
        <animateMotion dur="3s" repeatCount="indefinite" path="M90,98 H310" />
      </circle>
    </svg>
  );
}

function Dag() {
  const n = { a: [50, 100], b: [150, 55], c: [150, 145], d: [260, 100], e: [350, 100] } as Record<string, number[]>;
  const e = [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'], ['d', 'e']];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      {e.map(([from, to], i) => (
        <line key={i} x1={n[from][0]} y1={n[from][1]} x2={n[to][0]} y2={n[to][1]} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      ))}
      {Object.entries(n).map(([k, [x, y]], i) => (
        <g key={k}>
          <rect x={x - 18} y={y - 14} width="36" height="28" rx="7" fill="currentColor" fillOpacity="0.12" stroke="currentColor" />
          <circle cx={x} cy={y} r="4" fill="currentColor">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

function Scripts() {
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <rect key={`${r}-${c}`} x={28 + c * 44} y={24 + r * 40} width="32" height="28" rx="7" fill="currentColor" fillOpacity={(r + c) % 3 === 0 ? 0.35 : 0.1} stroke="currentColor" strokeOpacity="0.5">
            <animate attributeName="fill-opacity" values="0.08;0.4;0.08" dur="4s" begin={`${((r * 8 + c) % 7) * 0.4}s`} repeatCount="indefinite" />
          </rect>
        )),
      )}
    </svg>
  );
}

function Arena() {
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      <rect x="30" y="25" width="340" height="150" rx="10" stroke="currentColor" strokeOpacity="0.5" />
      <line x1="200" y1="25" x2="200" y2="175" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="200" cy="100" r="26" stroke="currentColor" strokeOpacity="0.5" />
      <rect x="30" y="68" width="42" height="64" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="328" y="68" width="42" height="64" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="110" cy="100" r="9" fill="currentColor" fillOpacity="0.9" />
      <circle cx="290" cy="100" r="9" fill="currentColor" fillOpacity="0.9" />
      <text x="110" y="82" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="monospace">VS</text>
      <circle r="5" fill="currentColor">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M110,100 Q200,30 290,100 Q200,170 110,100" />
      </circle>
    </svg>
  );
}

function Ml() {
  const pts = [[40, 140], [75, 120], [110, 128], [150, 90], [190, 98], [230, 66], [270, 74], [310, 44], [350, 52]];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      <path d="M30 170 H370 M30 170 V25" stroke="currentColor" strokeOpacity="0.35" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="currentColor" fillOpacity="0.7">
          <animate attributeName="r" values="3;5.5;3" dur="3s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M40 145 L350 45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function Commits() {
  const nodes = [[60, 100], [140, 100], [220, 100], [300, 100], [350, 100]];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      <path d="M60 100 H350" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M140 100 C170 40 200 40 220 60" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M220 60 C250 70 270 90 300 100" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="currentColor" fillOpacity={i === nodes.length - 1 ? 0.95 : 0.2} stroke="currentColor">
          <animate attributeName="fill-opacity" values="0.2;0.9;0.2" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="220" cy="60" r="7" fill="currentColor" fillOpacity="0.5" stroke="currentColor" />
      <text x="60" y="140" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.8" fontFamily="monospace">init</text>
      <text x="350" y="140" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.8" fontFamily="monospace">HEAD</text>
      <text x="200" y="175" textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity="0.7" fontFamily="monospace">sha-1 → objects/</text>
    </svg>
  );
}

function Planner() {
  // نمای شماتیک GrowthPlanner: هدف بزرگ → milestone → تسک‌های روزانه با تیک‌های متحرک
  const rows = [70, 108, 146];
  return (
    <svg viewBox="0 0 400 200" className={base} fill="none" aria-hidden="true">
      <rect x="40" y="26" width="320" height="14" rx="7" fill="currentColor" fillOpacity="0.15" />
      <rect x="40" y="26" width="0" height="14" rx="7" fill="currentColor">
        <animate attributeName="width" values="0;210;210" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite" />
      </rect>
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="40" y={y - 14} width="320" height="28" rx="8" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" />
          <rect x="54" y={y - 7} width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d={`M57 ${y} l3.5 3.5 l6 -7`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="16" strokeDashoffset="16">
            <animate attributeName="stroke-dashoffset" values="16;0;0;16" keyTimes="0;0.2;0.8;1" dur="4s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
          </path>
          <rect x="82" y={y - 4} width={150 - i * 28} height="8" rx="4" fill="currentColor" fillOpacity="0.55" />
          <rect x="300" y={y - 4} width="44" height="8" rx="4" fill="currentColor" fillOpacity="0.25" />
        </g>
      ))}
      <circle cx="330" cy="178" r="10" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M330 178 V172 M330 178 L335 181" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 330 178" to="360 330 178" dur="6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

const arts: Record<ProjectArtKey, () => React.JSX.Element> = {
  sync: Sync,
  honeypot: Honeypot,
  netscope: NetScope,
  agent: Agent,
  dag: Dag,
  scripts: Scripts,
  arena: Arena,
  ml: Ml,
  commits: Commits,
  planner: Planner,
};

export function ProjectArt({ name }: { name: ProjectArtKey }) {
  const Art = arts[name];
  return <Art />;
}
