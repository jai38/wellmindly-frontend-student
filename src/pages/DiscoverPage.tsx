import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

/* ================================================================
   WellMindly · Discover — Premium Self-Reflection Hub
   6 Launch Tests | React + TypeScript + Tailwind + Framer Motion
   ================================================================ */

// ─── Icons ───────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A3.5 3.5 0 0 0 12 6 3.5 3.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  star: '<path d="M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.3 6.8 19l1-5.8L3.6 9.1l5.8-.8Z"/>',
  bloom: '<path d="M12 12c0-3 2-6 2-6s2 3 2 6-2 4-2 4-2-1-2-4Z"/><path d="M12 12c0-3-2-6-2-6s-2 3-2 6 2 4 2 4 2-1 2-4Z"/><path d="M12 16v5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-5 2 2-5Z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
  cloud: '<path d="M7 18a4 4 0 1 1 .8-7.9A5 5 0 0 1 18 11a3.5 3.5 0 0 1-.5 7Z"/>',
  scale: '<path d="M12 4v16M6 8h12M6 8l-3 6a3 3 0 0 0 6 0ZM18 8l-3 6a3 3 0 0 0 6 0Z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6Z"/>',
  check: '<path d="M5 12l4 4L19 7"/>',
};

function SvgIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className || 'w-6 h-6 stroke-white fill-none'}
      style={{ strokeWidth: 1.8 }} dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }} />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────
function shade(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 30);
  const g = Math.max(0, ((n >> 8) & 255) - 26);
  const b = Math.max(0, (n & 255) - 22);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function toneWord(p: number): string {
  return p >= 75 ? 'a real strength' : p >= 55 ? 'solid' : p >= 35 ? 'developing' : 'room to grow';
}

// ─── Types ───────────────────────────────────────────────────────
interface TestItem { q: string; d: string }
interface PairOption { label: string; v: string }
interface PictureOption { label: string; ic: string; tone: number; c1: string; c2: string }
interface TypeInfo {
  desc: string; tag: string; tip?: string;
  a?: { label: string; text: string };
  b?: { label: string; text: string };
}
interface TestDef {
  title: string; accent: string; icon: string; blurb: string; kind: string; tag?: string;
  intro?: string; items?: TestItem[]; topN?: number; card?: boolean; cardLabel?: string;
  reveal?: string; overall?: boolean; archetype?: boolean;
  types?: Record<string, TypeInfo>;
  pairs?: PairOption[][];
  options?: PictureOption[];
}
interface SavedResult { t: number; summary: string; scores?: Record<string, number>; top?: string[]; tone?: number; label?: string }

// ─── Test Data (6 launch tests) ──────────────────────────────────
const TESTS: Record<string, TestDef> = {
  checkin: { title: "Emotional check-in", accent: "#0e7c6e", icon: "heart", blurb: "A two-minute snapshot. See how you\u2019re really doing \u2014 and watch it shift over the weeks.", kind: "profile", overall: true, tag: "Wellbeing \u00b7 2 min", intro: "Over the last two weeks\u2026", items: [{ q: "I have felt cheerful and in good spirits.", d: "Good spirits" }, { q: "I have felt calm and relaxed.", d: "Calm" }, { q: "I have felt active and energetic.", d: "Energy" }, { q: "I woke up feeling fresh and rested.", d: "Rested" }, { q: "My daily life has been filled with things that interest me.", d: "Engaged" }, { q: "I have felt connected to people around me.", d: "Connection" }] },
  mood: { title: "Mood snapshot", accent: "#b06a78", icon: "cloud", blurb: "A one-tap picture check. Fast, honest, and it adds a tile to your moodboard.", kind: "picture", tag: "Quick \u00b7 15 sec", options: [{ label: "Bright", ic: "spark", tone: 88, c1: "#e3b04b", c2: "#7c9473" }, { label: "Steady", ic: "compass", tone: 64, c1: "#7c9473", c2: "#0e7c6e" }, { label: "Tangled", ic: "bloom", tone: 40, c1: "#d4a24a", c2: "#c97b3f" }, { label: "Heavy", ic: "cloud", tone: 20, c1: "#8a93b0", c2: "#6f7aa0" }, { label: "Tender", ic: "heart", tone: 48, c1: "#b06a78", c2: "#8a5a86" }, { label: "Wired", ic: "star", tone: 55, c1: "#d97706", c2: "#b06a78" }] },
  strengths: { title: "Signature strengths", accent: "#c8973a", icon: "star", blurb: "Your top five character strengths \u2014 the qualities you lead with, on a card made to share.", kind: "rank", topN: 5, tag: "Strengths \u00b7 2 min", intro: "How much is this like you?", items: [{ q: "I love exploring new ideas just to see where they lead.", d: "Curiosity" }, { q: "I often come up with original or inventive ways to do things.", d: "Creativity" }, { q: "I keep going even when something gets hard or boring.", d: "Perseverance" }, { q: "I go out of my way to help people, even in small ways.", d: "Kindness" }, { q: "People tend to look to me to organise or take the lead.", d: "Leadership" }, { q: "I treat everyone fairly, even people I don\u2019t know well.", d: "Fairness" }, { q: "I like making people laugh and lightening the mood.", d: "Humour" }, { q: "I\u2019ll speak up or act even when it feels a bit scary.", d: "Bravery" }, { q: "I genuinely enjoy learning new things for their own sake.", d: "Love of learning" }, { q: "I notice and appreciate the good things in my life.", d: "Gratitude" }, { q: "I work well with others and like being part of a team.", d: "Teamwork" }, { q: "I stay hopeful that things will work out in the end.", d: "Hope" }] },
  bigfive: { title: "Personality profile", accent: "#2f6fb0", icon: "compass", blurb: "Five core traits that add up to an archetype that\u2019s unmistakably you.", kind: "profile", archetype: true, tag: "Identity \u00b7 2 min", intro: "How well does this describe you?", items: [{ q: "I love trying new experiences and ideas.", d: "Openness" }, { q: "I have a vivid imagination and enjoy abstract thinking.", d: "Openness" }, { q: "I get things done and like to be organised.", d: "Conscientiousness" }, { q: "I follow through on what I plan to do.", d: "Conscientiousness" }, { q: "I feel energised around other people.", d: "Extraversion" }, { q: "I start conversations and enjoy being social.", d: "Extraversion" }, { q: "I\u2019m considerate and care about others\u2019 feelings.", d: "Warmth" }, { q: "I trust people and assume the best in them.", d: "Warmth" }, { q: "I stay calm and steady under pressure.", d: "Steadiness" }, { q: "I rarely let small setbacks rattle me.", d: "Steadiness" }] },
  values: { title: "What matters most", accent: "#6d28d9", icon: "scale", blurb: "A quick this-or-that that reveals the values you quietly lead with.", kind: "pairs", tag: "Values \u00b7 90 sec", pairs: [[{ label: "A surprising adventure", v: "Adventure" }, { label: "A safe, settled plan", v: "Security" }], [{ label: "Deep time with one friend", v: "Connection" }, { label: "Winning at something hard", v: "Achievement" }], [{ label: "Total freedom to choose", v: "Freedom" }, { label: "Learning and growing", v: "Growth" }], [{ label: "Trying something risky", v: "Adventure" }, { label: "Helping someone you love", v: "Connection" }], [{ label: "Being recognised for your work", v: "Achievement" }, { label: "A calm, secure week", v: "Security" }], [{ label: "Mastering a new skill", v: "Growth" }, { label: "Doing it your own way", v: "Freedom" }], [{ label: "A loyal close circle", v: "Connection" }, { label: "An open road, no plan", v: "Adventure" }], [{ label: "Becoming wiser", v: "Growth" }, { label: "Achieving a big goal", v: "Achievement" }]] },
  strengthshadow: { title: "Strength & shadow", accent: "#6d28d9", icon: "shield", blurb: "Your greatest strength and its flip side \u2014 usually the same trait, turned up.", kind: "type", card: true, cardLabel: "My core strength", reveal: "You\u2019re", tag: "Insight \u00b7 2 min", intro: "How much is this like you?", items: [{ q: "I deeply feel what the people around me are feeling.", d: "The Empath" }, { q: "I notice straight away when someone\u2019s a bit off.", d: "The Empath" }, { q: "I push hard to reach the goals I set.", d: "The Achiever" }, { q: "I\u2019m driven to accomplish and make progress.", d: "The Achiever" }, { q: "I like doing things my own way, on my own terms.", d: "The Free Spirit" }, { q: "I resist being boxed in by rules or routine.", d: "The Free Spirit" }, { q: "I work hard to keep everyone around me happy.", d: "The Peacemaker" }, { q: "I\u2019ll smooth things over to avoid conflict.", d: "The Peacemaker" }], types: { "The Empath": { desc: "You feel the room and make people feel understood. That same depth is also your edge.", tag: "Feels everything", a: { label: "Your strength", text: "Deep empathy \u2014 people feel genuinely seen and safe with you." }, b: { label: "Your shadow", text: "You absorb other people\u2019s stress and can lose track of your own needs." }, tip: "You can care deeply without carrying it all. Protect your own energy on purpose." }, "The Achiever": { desc: "You make things happen. The drive that powers you can also run you into the ground.", tag: "Driven to do", a: { label: "Your strength", text: "Real drive and follow-through \u2014 you turn intentions into results." }, b: { label: "Your shadow", text: "You can tie your worth to output, and rest can start to feel like failure." }, tip: "You\u2019re enough on the days you achieve nothing. Schedule rest like it\u2019s a deadline." }, "The Free Spirit": { desc: "You\u2019re authentic and independent. The independence that frees you can also isolate you.", tag: "Does it their way", a: { label: "Your strength", text: "Independence and authenticity \u2014 you think for yourself and live on your terms." }, b: { label: "Your shadow", text: "You can resist structure and help that would actually make life easier." }, tip: "Some structure is freedom, not a cage. Let a few people in." }, "The Peacemaker": { desc: "You create calm and harmony. The same instinct can quietly cost you your own voice.", tag: "Keeps the peace", a: { label: "Your strength", text: "You bring harmony and steadiness \u2014 people feel calmer around you." }, b: { label: "Your shadow", text: "You can bury your own needs and opinions to keep things smooth." }, tip: "Your needs count too. Sometimes honest is kinder than comfortable." } } },
};

const ARCHETYPE = [
  { when: ["Openness", "Extraversion"], name: "The Explorer", desc: "Curious and outgoing \u2014 you chase new experiences and bring people along." },
  { when: ["Conscientiousness", "Steadiness"], name: "The Anchor", desc: "Reliable and calm \u2014 the steady one others lean on." },
  { when: ["Warmth", "Extraversion"], name: "The Connector", desc: "Warm and social \u2014 you build bridges and bring energy to a room." },
  { when: ["Openness", "Conscientiousness"], name: "The Architect", desc: "Imaginative and disciplined \u2014 you turn big ideas into real things." },
  { when: ["Warmth", "Steadiness"], name: "The Harmoniser", desc: "Caring and even-keeled \u2014 you keep things calm and kind." },
  { when: ["Openness"], name: "The Seeker", desc: "Endlessly curious \u2014 ideas are your playground." },
];

const VALUE_DESC: Record<string, string> = {
  Adventure: "You\u2019re drawn to the new \u2014 you grow by leaping.",
  Security: "You value stability and a sure footing.",
  Connection: "People come first; relationships are your anchor.",
  Achievement: "You\u2019re driven to accomplish and rise to challenges.",
  Freedom: "Autonomy matters \u2014 you do it your way.",
  Growth: "You\u2019re here to learn and become more.",
};

const L5: [string, number][] = [["Strongly agree", 5], ["Agree", 4], ["Neither", 3], ["Disagree", 2], ["Strongly disagree", 1]];
const TEST_ORDER = ["checkin", "mood", "strengths", "bigfive", "values", "strengthshadow"];
const STORAGE_KEY = "wm-discover";

// ─── Storage ─────────────────────────────────────────────────────
function loadAll(): Record<string, SavedResult[]> {
  try { const v = localStorage.getItem(STORAGE_KEY); return v ? JSON.parse(v) : {}; } catch { return {}; }
}
function saveAll(o: Record<string, SavedResult[]>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(o)); } catch { /* noop */ }
}
function saveResult(id: string, res: SavedResult) {
  const a = loadAll(); if (!a[id]) a[id] = []; a[id].push(res); saveAll(a);
}

// ─── Scoring ─────────────────────────────────────────────────────
function scoreProfile(items: TestItem[], resp: number[]): Record<string, number> {
  const s: Record<string, number> = {}, c: Record<string, number> = {};
  items.forEach((it, i) => { const v = resp[i] || 3; s[it.d] = (s[it.d] || 0) + v; c[it.d] = (c[it.d] || 0) + 1; });
  const o: Record<string, number> = {};
  Object.keys(s).forEach(d => { o[d] = Math.round(((s[d] / c[d]) - 1) / 4 * 100); });
  return o;
}
function rankDims(sc: Record<string, number>): [string, number][] {
  return Object.entries(sc).sort((a, b) => b[1] - a[1]);
}
function pickArchetype(sc: Record<string, number>) {
  const r = rankDims(sc), top = [r[0][0], r[1][0]];
  for (const a of ARCHETYPE) { if (a.when.every(w => top.includes(w))) return a; }
  return { name: "The " + r[0][0], desc: "You lead with " + r[0][0].toLowerCase() + "." };
}

// ─── Animated Bar ────────────────────────────────────────────────
function DimBar({ label, value, accent, delay }: { label: string; value: number; accent: string; delay: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1.5">
        <b className="font-semibold">{label}</b>
        <span className="text-[var(--ink-soft)] text-[13px]">{toneWord(value)}</span>
      </div>
      <div className="h-3 bg-[var(--paper-2)] rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: accent }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, delay, ease: [0.3, 0, 0.2, 1] }} />
      </div>
    </div>
  );
}

// ─── Share Card ──────────────────────────────────────────────────
function ShareCard({ accent, children, cardRef }: { accent: string; children: React.ReactNode; cardRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={cardRef} className="rounded-[22px] p-8 text-white relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${accent}, ${shade(accent)})` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23fff' opacity='.08'/%3E%3C/svg%3E")` }} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-[var(--navy)] text-white px-6 py-3.5 rounded-2xl text-[15px] font-semibold z-[120] shadow-2xl"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
type View = 'hub' | 'test' | 'result' | 'results';

export function DiscoverPage() {
  const [view, setView] = useState<View>('hub');
  const [curId, setCurId] = useState<string | null>(null);
  const [qi, setQi] = useState(0);
  const [resp, setResp] = useState<(number | string)[]>([]);
  const [resultData, setResultData] = useState<{
    kind: string; scores?: Record<string, number>; top?: string[];
    archetype?: { name: string; desc: string }; pictureOption?: PictureOption;
  } | null>(null);
  const [toast, setToast] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const cur = curId ? TESTS[curId] : null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3400);
  }, []);

  const goTo = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ─── Start Test ──────────────────────────────────────────────
  const startTest = useCallback((id: string) => {
    setCurId(id);
    setQi(0);
    setResp([]);
    setResultData(null);
    goTo('test');
  }, [goTo]);

  // ─── Answer Likert ───────────────────────────────────────────
  const answerLikert = useCallback((val: number) => {
    if (!cur || !cur.items) return;
    const newResp = [...resp]; newResp[qi] = val; setResp(newResp);
    setTimeout(() => {
      if (qi < cur.items!.length - 1) { setQi(qi + 1); }
      else { finishTest(curId!, cur, newResp); }
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, curId, qi, resp]);

  // ─── Answer Pair ─────────────────────────────────────────────
  const answerPair = useCallback((val: string) => {
    if (!cur || !cur.pairs) return;
    const newResp = [...resp]; newResp[qi] = val; setResp(newResp);
    if (qi < cur.pairs.length - 1) { setQi(qi + 1); }
    else { finishTest(curId!, cur, newResp); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, curId, qi, resp]);

  // ─── Answer Picture ──────────────────────────────────────────
  const answerPicture = useCallback((opt: PictureOption) => {
    if (!curId) return;
    saveResult(curId, { t: Date.now(), summary: opt.label, tone: opt.tone, label: opt.label });
    setResultData({ kind: 'picture', pictureOption: opt });
    goTo('result');
  }, [curId, goTo]);

  // ─── Finish ──────────────────────────────────────────────────
  const finishTest = useCallback((id: string, test: TestDef, responses: (number | string)[]) => {
    if (test.kind === 'pairs') {
      const tally: Record<string, number> = {};
      responses.forEach(v => { tally[v as string] = (tally[v as string] || 0) + 1; });
      const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]);
      const top = ranked.slice(0, 2).map(x => x[0]);
      saveResult(id, { t: Date.now(), summary: top.join(' + '), top });
      setResultData({ kind: 'values', top });
      goTo('result'); return;
    }
    const scores = scoreProfile(test.items!, responses as number[]);
    const ranked = rankDims(scores);
    if (test.kind === 'rank') {
      const top = ranked.slice(0, test.topN).map(x => x[0]);
      saveResult(id, { t: Date.now(), summary: top.join(', '), scores, top });
      setResultData({ kind: 'strengths', scores, top });
      goTo('result'); return;
    }
    if (test.kind === 'type') {
      const top = ranked[0][0];
      saveResult(id, { t: Date.now(), summary: top, scores, top: [top] });
      setResultData({ kind: 'type', scores, top: [top] });
      goTo('result'); return;
    }
    // profile
    saveResult(id, { t: Date.now(), summary: ranked[0][0] + ' strongest', scores });
    if (test.archetype) {
      const arch = pickArchetype(scores);
      setResultData({ kind: 'bigfive', scores, archetype: arch });
    } else {
      setResultData({ kind: 'checkin', scores });
    }
    goTo('result');
  }, [goTo]);

  // ─── Save Card ─────────────────────────────────────────────
  const doSaveCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const a = document.createElement('a');
      a.download = 'my-wellmindly-card.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      showToast('Card saved \u2714');
    } catch { showToast('Couldn\u2019t export \u2014 try a screenshot.'); }
  }, [showToast]);

  // ─── Total questions ────────────────────────────────────────
  const total = cur?.kind === 'pairs' ? (cur.pairs?.length || 0) : cur?.kind === 'picture' ? 1 : (cur?.items?.length || 0);
  const progress = total > 1 ? (qi / (total - 1)) * 100 : 100;

  // ═════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen relative z-[1]">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[340px] h-[340px] rounded-full blur-[60px] opacity-40 -top-20 -right-12 animate-[bfloat_16s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, var(--coral), transparent 70%)' }} />
        <div className="absolute w-[280px] h-[280px] rounded-full blur-[60px] opacity-40 bottom-[20%] -left-20 animate-[bfloat_16s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, var(--teal), transparent 70%)', animationDelay: '-6s' }} />
        <div className="absolute w-[250px] h-[250px] rounded-full blur-[60px] opacity-40 top-[40%] right-[10%] animate-[bfloat_16s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, var(--rose), transparent 70%)', animationDelay: '-11s' }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-60 backdrop-blur-xl bg-[var(--paper)]/80 border-b border-[var(--line)]/70">
        <div className="max-w-[920px] mx-auto flex items-center justify-between px-5 py-3.5">
          <button onClick={() => goTo('hub')} className="flex items-center gap-2 font-extrabold text-[15.5px] tracking-tight">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--ember)] shadow-[0_0_0_4px_rgba(224,97,58,.16)]" />
            WellMindly <span className="text-[var(--ink-soft)] font-semibold text-sm">· Discover</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => goTo('results')} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition hidden sm:block">My collection</button>
            <button onClick={() => goTo('hub')} className="text-white bg-[var(--navy)] px-4 py-2 rounded-full font-semibold text-[13.5px] hover:bg-[#1d2843] transition">All tests</button>
          </div>
        </div>
      </nav>

      <div className="max-w-[920px] mx-auto px-5 pb-20 relative z-[1]">
        <AnimatePresence mode="wait">
          {/* ═══ HUB VIEW ═══ */}
          {view === 'hub' && (
            <motion.div key="hub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <HubView startTest={startTest} goTo={goTo} />
            </motion.div>
          )}

          {/* ═══ TEST VIEW ═══ */}
          {view === 'test' && cur && (
            <motion.div key="test" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <div className="max-w-[640px] mx-auto pt-7">
                <button onClick={() => goTo('hub')} className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-5 transition font-medium">&larr; All tests</button>
                <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl shadow-[0_18px_40px_-22px_rgba(18,26,48,.35)] p-7">
                  <div className="flex justify-between text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold">
                    <span>{qi + 1} / {total}</span>
                    <span>{cur.title}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-[7px] bg-[var(--paper-2)] rounded-full overflow-hidden my-4 relative">
                    <motion.div className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg, ${cur.accent}, ${shade(cur.accent)})` }}
                      animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
                      <span className="absolute right-0 top-[-2px] w-[11px] h-[11px] rounded-full shadow-[0_0_10px_2px]"
                        style={{ background: cur.accent, boxShadow: `0 0 10px 2px ${cur.accent}33` }} />
                    </motion.div>
                  </div>

                  {/* Question body */}
                  <AnimatePresence mode="wait">
                    <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                      {cur.kind === 'picture' && cur.options && (
                        <PictureMode options={cur.options} onPick={answerPicture} />
                      )}
                      {cur.kind === 'pairs' && cur.pairs && (
                        <PairMode pair={cur.pairs[qi]} onPick={answerPair} />
                      )}
                      {(cur.kind !== 'picture' && cur.kind !== 'pairs') && cur.items && (
                        <LikertMode intro={cur.intro || ''} question={cur.items[qi].q} selected={resp[qi] as number | undefined} onPick={answerLikert} accent={cur.accent} />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Nav buttons */}
                  {cur.kind !== 'picture' && cur.kind !== 'pairs' && (
                    <div className="flex justify-between mt-6">
                      <button onClick={() => qi > 0 && setQi(qi - 1)}
                        className={`px-5 py-3 rounded-full border border-[var(--line)] text-[var(--ink-soft)] font-semibold text-[15px] transition hover:bg-white hover:border-[var(--ink)] active:scale-[.97] ${qi === 0 ? 'invisible' : ''}`}>Back</button>
                      <button onClick={() => {
                        if (resp[qi] === undefined) return;
                        if (qi < (cur.items?.length || 0) - 1) setQi(qi + 1);
                        else finishTest(curId!, cur, resp);
                      }} className="px-6 py-3 rounded-full bg-[var(--navy)] text-white font-semibold text-[15px] shadow-[0_14px_30px_-14px_rgba(18,26,48,.7)] transition hover:-translate-y-0.5 active:scale-[.97]">Next</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ RESULT VIEW ═══ */}
          {view === 'result' && cur && resultData && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <div className="max-w-[640px] mx-auto pt-7">
                <button onClick={() => goTo('hub')} className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-5 transition font-medium">&larr; All tests</button>
                <ResultView cur={cur} curId={curId!} data={resultData} accent={cur.accent} cardRef={cardRef}
                  onSaveCard={doSaveCard} onRetake={() => startTest(curId!)} goTo={goTo} />
              </div>
            </motion.div>
          )}

          {/* ═══ COLLECTION VIEW ═══ */}
          {view === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <CollectionView startTest={startTest} goTo={goTo} showToast={showToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-8 text-[var(--ink-soft)] text-[13px] mt-10 relative z-[1]">
        <div className="max-w-[920px] mx-auto px-5 flex justify-between flex-wrap gap-4 items-center">
          <button onClick={() => goTo('hub')} className="flex items-center gap-2 font-extrabold text-[15px]">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--ember)]" />
            WellMindly
          </button>
          <div className="flex gap-5 flex-wrap">
            <button onClick={() => goTo('hub')} className="hover:text-[var(--ink)] transition">Discover</button>
            <button onClick={() => goTo('results')} className="hover:text-[var(--ink)] transition">My collection</button>
            <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="text-[var(--ember)] font-semibold hover:underline">Need help right now? &rarr;</a>
          </div>
        </div>
        <p className="text-[11.5px] text-center mt-5 max-w-[70ch] mx-auto opacity-85">
          WellMindly is a non-clinical self-reflection &amp; self-discovery tool, not a diagnosis. If you&rsquo;re going through something heavy, please reach out to a qualified professional or someone you trust.
        </p>
      </footer>

      <Toast message={toast} show={!!toast} />

      {/* Keyframes */}
      <style>{`
        @keyframes bfloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function HubView({ startTest, goTo }: { startTest: (id: string) => void; goTo: (v: View) => void }) {
  const all = loadAll();
  return (
    <div className="pt-12 sm:pt-14">
      <p className="text-xs font-bold tracking-[.13em] uppercase text-[var(--ember)] mb-3">Start here</p>
      <h1 className="font-serif font-semibold text-[clamp(32px,6vw,52px)] leading-[1.02] tracking-tight">
        Get to know <em className="text-[var(--coral)] font-semibold italic font-serif">yourself.</em>
      </h1>
      <p className="text-[var(--ink-soft)] text-base max-w-[54ch] mt-4 leading-relaxed">
        Six quick ways to meet yourself. Each takes about two minutes and hands back something worth keeping. Start with a check-in, or follow your curiosity — there's no wrong place to begin.
      </p>
      <div className="flex gap-4 flex-wrap mt-5 text-[13px] text-[var(--ink-soft)]">
        {['~2 minutes', 'Private to you', 'Never a diagnosis'].map(t => (
          <b key={t} className="flex items-center gap-1.5 font-medium">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[var(--teal)] fill-none" style={{ strokeWidth: 2.6 }}><path d="M5 12l4 4L19 7" /></svg>
            {t}
          </b>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mt-6 mb-3 flex-wrap">
        <button className="px-4 py-2 rounded-full text-[13.5px] font-semibold bg-[var(--navy)] text-white border border-[var(--navy)]">All tests</button>
        <button onClick={() => goTo('results')} className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[var(--ink-soft)] border-[1.5px] border-[var(--line)] hover:bg-[var(--card)] transition">My collection</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {TEST_ORDER.map((id, i) => {
          const t = TESTS[id]; if (!t) return null;
          const done = all[id]?.length;
          return (
            <motion.button key={id} onClick={() => startTest(id)}
              className="text-left border border-[var(--line)] rounded-3xl bg-[var(--card)] overflow-hidden transition-shadow hover:shadow-[0_28px_50px_-28px_rgba(18,26,48,.4)] group"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ y: -6 }}>
              {done ? (
                <div className="absolute top-3.5 right-3.5 z-[3] flex items-center gap-1.5 bg-[var(--teal)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <SvgIcon name="check" className="w-3 h-3 stroke-white fill-none" /> Done
                </div>
              ) : null}
              {/* Banner */}
              <div className="h-[82px] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.accent}, ${shade(t.accent)})` }}>
                <svg className="absolute inset-0 w-full h-full opacity-[.08]" viewBox="0 0 200 80">
                  <circle cx="160" cy="20" r="40" fill="#fff" /><circle cx="30" cy="60" r="25" fill="#fff" /><circle cx="100" cy="10" r="15" fill="#fff" />
                </svg>
                <div className="absolute bottom-0 left-5 translate-y-[50%] w-[50px] h-[50px] rounded-[14px] flex items-center justify-center border-[3px] border-[var(--card)] z-[2] shadow-[0_8px_20px_-10px_rgba(0,0,0,.35)]"
                  style={{ background: `linear-gradient(135deg, ${t.accent}, ${shade(t.accent)})` }}>
                  <SvgIcon name={t.icon} className="w-6 h-6 stroke-white fill-none" />
                </div>
              </div>
              {/* Body */}
              <div className="pt-8 pb-5 px-5">
                <h3 className="font-serif text-[19px] font-semibold mb-1.5">{t.title}</h3>
                <p className="text-[var(--ink-soft)] text-[13.5px] leading-snug mb-3">{t.blurb}</p>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--paper-2)] text-[var(--ink-soft)]">{t.tag || '~2 min'}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-[12px] text-[var(--ink-soft)] bg-[var(--paper-2)] rounded-2xl p-4 border border-[var(--line)] mt-7 leading-relaxed">
        WellMindly is a non-clinical self-reflection &amp; self-discovery tool, not a medical or psychological assessment. It doesn't diagnose anything. If something feels heavy, talking to a counsellor or someone you trust can help.
      </div>
    </div>
  );
}

function LikertMode({ intro, question, selected, onPick, accent }: { intro: string; question: string; selected?: number; onPick: (v: number) => void; accent: string }) {
  return (
    <div>
      <p className="text-[var(--ink-soft)] text-sm mb-4">{intro}</p>
      <h3 className="font-serif font-medium text-[clamp(20px,4.4vw,28px)] leading-snug mb-5">{question}</h3>
      <div className="flex flex-col gap-2.5">
        {L5.map(([label, val]) => (
          <button key={val} onClick={() => onPick(val)}
            className={`flex items-center gap-3.5 text-left border-[1.5px] rounded-[14px] px-5 py-4 transition-all text-[15px] font-normal
              ${selected === val ? 'border-[color:var(--accent)] bg-[#fffdf8]' : 'border-[var(--line)] bg-[var(--card)] hover:border-[color:var(--accent)] hover:translate-x-1'}`}
            style={{ '--accent': accent } as React.CSSProperties}>
            <span className={`w-[22px] h-[22px] rounded-full border-[2.5px] flex-shrink-0 transition-all
              ${selected === val ? 'border-[var(--navy)] bg-[var(--navy)] shadow-[inset_0_0_0_3.5px_#fff]' : 'border-[var(--line)]'}`} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PairMode({ pair, onPick }: { pair: PairOption[]; onPick: (v: string) => void }) {
  return (
    <div>
      <p className="text-[var(--ink-soft)] text-sm mb-4">Which pulls you more?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pair.map((opt, i) => (
          <motion.button key={i} onClick={() => onPick(opt.v)}
            className="border-[1.5px] border-[var(--line)] rounded-[18px] p-7 text-center font-serif text-lg font-medium bg-[var(--card)] transition-colors hover:border-[var(--plum)] min-h-[120px] flex items-center justify-center"
            whileHover={{ y: -4, rotateY: 3 }} whileTap={{ scale: 0.97 }}>
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PictureMode({ options, onPick }: { options: PictureOption[]; onPick: (o: PictureOption) => void }) {
  return (
    <div>
      <p className="text-[var(--ink-soft)] text-sm mb-4">Which feels most like right now?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {options.map(opt => (
          <motion.button key={opt.label} onClick={() => onPick(opt)}
            className="rounded-[18px] aspect-square flex flex-col items-center justify-center gap-2 text-white font-semibold text-[14.5px] relative overflow-hidden"
            style={{ background: `linear-gradient(140deg, ${opt.c1}, ${opt.c2})` }}
            whileHover={{ y: -5, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.15),transparent_60%)] pointer-events-none" />
            <SvgIcon name={opt.ic} className="w-9 h-9 stroke-white fill-none opacity-90" />
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ResultView({ cur, curId: _curId, data, accent, cardRef, onSaveCard, onRetake, goTo }: {
  cur: TestDef;
  curId: string;
  data: {
    kind: string;
    scores?: Record<string, number>;
    top?: string[];
    archetype?: { name: string; desc: string };
    pictureOption?: PictureOption;
  };
  accent: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSaveCard: () => void;
  onRetake: () => void;
  goTo: (v: View) => void;
}) {
  const ranked = data.scores ? rankDims(data.scores) : [];

  // Picture result
  if (data.kind === 'picture' && data.pictureOption) {
    const opt = data.pictureOption;
    return (
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl shadow-lg p-7 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-5" style={{ background: `linear-gradient(140deg, ${opt.c1}, ${opt.c2})` }} />
        <h2 className="font-serif font-medium text-3xl mb-3">{opt.label}.</h2>
        <p className="font-serif text-lg text-[var(--ink-soft)] leading-relaxed">
          Noted — today felt <b>{opt.label.toLowerCase()}</b>. That's a tile on your moodboard now. The pattern across days tells the real story.
        </p>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // Values result
  if (data.kind === 'values' && data.top) {
    return (
      <div>
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight">You lead with <em className="italic font-serif" style={{ color: accent }}>{data.top[0]}</em>.</h2>
        <p className="font-serif text-lg leading-relaxed text-[var(--ink-soft)] mt-1 mb-5">{VALUE_DESC[data.top[0]] || ''}</p>
        {data.top[1] && (
          <div className="border-l-[3px] border-[var(--plum)] bg-[#fffdf8] rounded-r-[14px] p-4 mb-4 text-[14.5px]">
            <h4 className="text-xs tracking-wider uppercase text-[var(--ink-soft)] font-bold mb-1">Your second value</h4>
            <b>{data.top[1]}</b> — {VALUE_DESC[data.top[1]] || ''}
          </div>
        )}
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-semibold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">What matters most</h3>
          <div className="flex flex-col gap-2.5">{data.top.map((s, i) => (
            <div key={s} className="flex items-center gap-3 text-base font-medium">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-bold flex-shrink-0">{i + 1}</span>{s}
            </div>
          ))}</div>
          <p className="mt-4 text-xs opacity-75 tracking-wide">WellMindly · Discover</p>
        </ShareCard>
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // Strengths result (rank)
  if (data.kind === 'strengths' && data.top && data.scores) {
    return (
      <div>
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight">Your top <em className="italic font-serif" style={{ color: accent }}>strengths.</em></h2>
        <p className="font-serif text-lg leading-relaxed text-[var(--ink-soft)] mt-1 mb-5">
          These are the qualities you lead with. Leaning into your signature strengths — on purpose, this week — is one of the most reliable ways to feel more like yourself.
        </p>
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-semibold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">My signature strengths</h3>
          <div className="flex flex-col gap-2.5">{data.top.map((s, i) => (
            <div key={s} className="flex items-center gap-3 text-base font-medium">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-bold flex-shrink-0">{i + 1}</span>{s}
            </div>
          ))}</div>
          <p className="mt-4 text-xs opacity-75 tracking-wide">WellMindly · Discover</p>
        </ShareCard>
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6 mt-3">
          <p className="text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold mb-3">Full ranking</p>
          {ranked.map(([label, val], i) => <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.1} />)}
        </div>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // Type result (strengthshadow etc)
  if (data.kind === 'type' && data.top && data.scores) {
    const topType = data.top[0];
    const typeInfo = cur.types?.[topType];
    return (
      <div>
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight">
          {cur.reveal || 'You\u2019re'} <em className="italic font-serif" style={{ color: accent }}>{topType}</em>.
        </h2>
        {typeInfo && <p className="font-serif text-lg leading-relaxed text-[var(--ink-soft)] mt-1 mb-5">{typeInfo.desc}</p>}
        {cur.card && (
          <>
            <ShareCard accent={accent} cardRef={cardRef}>
              <h3 className="font-serif font-semibold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">{cur.cardLabel || 'My result'}</h3>
              <p className="font-serif text-4xl font-semibold leading-tight mb-3">{topType}</p>
              <p className="text-xs opacity-75 tracking-wide">{typeInfo?.tag || cur.title} · WellMindly</p>
            </ShareCard>
            <CardButtons onSave={onSaveCard} onRetake={onRetake} />
          </>
        )}
        {typeInfo?.a && <InsightBlock borderColor="#0e7c6e" label={typeInfo.a.label} text={typeInfo.a.text} />}
        {typeInfo?.b && <InsightBlock borderColor="#d97706" label={typeInfo.b.label} text={typeInfo.b.text} />}
        {typeInfo?.tip && <InsightBlock borderColor={accent} label="Try this" text={typeInfo.tip} />}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6 mt-3">
          <p className="text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold mb-3">How it broke down</p>
          {ranked.map(([label, val], i) => <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.1} />)}
        </div>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // BigFive archetype
  if (data.kind === 'bigfive' && data.archetype && data.scores) {
    const arch = data.archetype;
    return (
      <div>
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight">You're <em className="italic font-serif" style={{ color: accent }}>{arch.name}</em>.</h2>
        <p className="font-serif text-lg leading-relaxed text-[var(--ink-soft)] mt-1 mb-5">{arch.desc}</p>
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-semibold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">My personality archetype</h3>
          <p className="font-serif text-4xl font-semibold leading-tight mb-3">{arch.name}</p>
          <p className="text-xs opacity-75 tracking-wide">WellMindly · Discover</p>
        </ShareCard>
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6 mt-3">
          <p className="text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold mb-3">Your five traits</p>
          {ranked.map(([label, val], i) => <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.1} />)}
        </div>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // Checkin (profile, no archetype)
  if (data.kind === 'checkin' && data.scores) {
    const avg = Object.values(data.scores).reduce((a, b) => a + b, 0) / Object.values(data.scores).length;
    const tone = avg >= 70 ? "You're doing well." : avg >= 45 ? "Finding your footing." : "A heavier stretch.";
    return (
      <div>
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight">{tone}</h2>
        <p className="font-serif text-lg leading-relaxed text-[var(--ink-soft)] mt-1 mb-5">
          This is a snapshot, not a score. Use it to notice how your weeks shift. The patterns over time tell a richer story than any single check-in.
        </p>
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6">
          <p className="text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold mb-3">Your dimensions</p>
          {ranked.map(([label, val], i) => <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.1} />)}
        </div>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  return null;
}

function InsightBlock({ borderColor, label, text }: { borderColor: string; label: string; text: string }) {
  return (
    <div className="border-l-[3px] bg-[#fffdf8]/80 backdrop-blur-sm rounded-r-[14px] p-4 my-3 text-[14.5px]" style={{ borderColor }}>
      <h4 className="text-xs tracking-wider uppercase text-[var(--ink-soft)] font-bold mb-1">{label}</h4>
      {text}
    </div>
  );
}

function CardButtons({ onSave, onRetake }: { onSave: () => void; onRetake: () => void }) {
  return (
    <div className="flex gap-3 flex-wrap mt-5 mb-3">
      <button onClick={onSave} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--ember)] text-white font-semibold text-[15px] shadow-[0_14px_30px_-14px_rgba(216,71,47,.55)] transition hover:-translate-y-0.5 active:scale-[.97]">Save my card</button>
      <button onClick={onRetake} className="px-5 py-3 rounded-full border-[1.5px] border-[var(--line)] text-[var(--ink-soft)] font-semibold text-[15px] hover:bg-white hover:border-[var(--ink)] transition active:scale-[.97]">Take again</button>
    </div>
  );
}

function BackButtons({ goTo }: { goTo: (v: View) => void }) {
  return (
    <div className="flex gap-3 flex-wrap mt-5 justify-center">
      <button onClick={() => goTo('hub')} className="px-6 py-3 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--ember)] text-white font-semibold text-[15px] shadow-[0_14px_30px_-14px_rgba(216,71,47,.55)] transition hover:-translate-y-0.5 active:scale-[.97]">More tests</button>
      <button onClick={() => goTo('results')} className="px-5 py-3 rounded-full border-[1.5px] border-[var(--line)] text-[var(--ink-soft)] font-semibold text-[15px] hover:bg-white transition active:scale-[.97]">My collection</button>
    </div>
  );
}

function CollectionView({ startTest, goTo, showToast }: { startTest: (id: string) => void; goTo: (v: View) => void; showToast: (m: string) => void }) {
  const [, forceUpdate] = useState(0);
  const all = loadAll();
  const ids = Object.keys(all).filter(id => all[id]?.length && TESTS[id]);

  useEffect(() => { forceUpdate(n => n + 1); }, []); // ensure fresh read

  const wipeAll = () => {
    if (!confirm('Clear all your saved results? This can\u2019t be undone.')) return;
    saveAll({} as Record<string, SavedResult[]>);
    forceUpdate(n => n + 1);
    showToast('All data cleared.');
  };

  return (
    <div className="pt-7">
      <p className="text-xs font-bold tracking-[.13em] uppercase text-[var(--ember)] mb-3">Your collection</p>
      <h1 className="font-serif font-semibold text-[clamp(32px,6vw,52px)] leading-[1.02] tracking-tight">
        What you've <em className="text-[var(--coral)] font-semibold italic font-serif">discovered.</em>
      </h1>
      <p className="text-[var(--ink-soft)] text-base mt-3 mb-5">Everything from your tests so far. Re-take any test to watch how you shift.</p>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        <button onClick={() => goTo('hub')} className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[var(--ink-soft)] border-[1.5px] border-[var(--line)] hover:bg-[var(--card)] transition">All tests</button>
        <button className="px-4 py-2 rounded-full text-[13.5px] font-semibold bg-[var(--navy)] text-white border border-[var(--navy)]">My collection</button>
      </div>

      {ids.length === 0 ? (
        <div className="text-center text-[var(--ink-soft)] py-16 text-[15px]">Nothing saved yet. Take a test and your results will appear here.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ids.map(id => {
            const t = TESTS[id]; const last = all[id][all[id].length - 1];
            const d = new Date(last.t);
            return (
              <motion.button key={id} onClick={() => startTest(id)}
                className="text-left bg-[var(--card)] border border-[var(--line)] rounded-3xl p-5 transition hover:shadow-lg"
                whileHover={{ y: -3 }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${t.accent}, ${shade(t.accent)})` }}>
                    <SvgIcon name={t.icon} className="w-[18px] h-[18px] stroke-white fill-none" />
                  </div>
                  <span className="font-serif text-base font-semibold">{t.title}</span>
                </div>
                <p className="text-sm text-[var(--ink-soft)] mb-2">{last.summary}</p>
                <p className="text-[11px] text-[var(--ink-soft)] opacity-70">
                  {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.button>
            );
          })}
        </div>
      )}

      {ids.length > 0 && (
        <button onClick={wipeAll} className="mt-6 px-5 py-3 rounded-full border-[1.5px] border-[var(--line)] text-[var(--ink-soft)] font-semibold text-sm hover:bg-white hover:border-[var(--ink)] transition active:scale-[.97]">Reset all data</button>
      )}
    </div>
  );
}
