import React from "react";
import { motion } from "framer-motion";
import { rankDims, shade, toneWord, VALUE_DESC } from "./types";
import type { TestDef, PictureOption } from "./types";

interface ResultViewProps {
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
  goTo: (v: 'hub' | 'test' | 'result' | 'results') => void;
}

export function ResultView({
  cur,
  data,
  accent,
  cardRef,
  onSaveCard,
  onRetake,
  goTo,
}: ResultViewProps) {
  const ranked = data.scores ? rankDims(data.scores) : [];

  // 1. Picture results layout
  if (data.kind === 'picture' && data.pictureOption) {
    const opt = data.pictureOption;
    return (
      <div className="bg-white border border-line rounded-3xl shadow-lg p-8 text-center select-none">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 shadow-md" style={{ background: `linear-gradient(140deg, ${opt.c1}, ${opt.c2})` }} />
        <h2 className="font-serif font-extrabold text-3xl mb-3 text-ink">{opt.label}.</h2>
        <p className="font-serif text-lg text-ink-soft leading-relaxed font-medium">
          Noted — today felt <b className="text-plum font-extrabold">{opt.label.toLowerCase()}</b>. That's a tile on your moodboard now. The pattern across days tells the real story.
        </p>
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // 2. Values results layout
  if (data.kind === 'values' && data.top) {
    return (
      <div className="space-y-6 select-none">
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight text-ink">
          You lead with <em className="italic font-serif text-plum">{data.top[0]}</em>.
        </h2>
        <p className="font-serif text-lg leading-relaxed text-ink-soft font-medium mt-1 mb-5">{VALUE_DESC[data.top[0]] || ''}</p>
        
        {data.top[1] && (
          <div className="border-l-[3px] border-plum bg-[#fffdf8]/60 backdrop-blur-sm rounded-r-[14px] p-5 text-[14.5px] shadow-sm font-semibold text-ink-soft">
            <h4 className="text-xs tracking-wider uppercase text-ink-soft font-extrabold mb-1">Your second value</h4>
            <b className="text-ink font-bold">{data.top[1]}</b> — {VALUE_DESC[data.top[1]] || ''}
          </div>
        )}
        
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-extrabold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">What matters most</h3>
          <div className="flex flex-col gap-2.5">
            {data.top.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-base font-bold">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-black flex-shrink-0">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <p className="mt-5 text-[10px] opacity-75 tracking-wider uppercase font-bold">WellMindly · Discover</p>
        </ShareCard>
        
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // 3. Signature strengths layout
  if (data.kind === 'strengths' && data.top && data.scores) {
    return (
      <div className="space-y-6 select-none">
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight text-ink">
          Your top <em className="italic font-serif text-plum">strengths.</em>
        </h2>
        <p className="font-serif text-lg leading-relaxed text-ink-soft font-medium mt-1 mb-5">
          These are the qualities you lead with. Leaning into your signature strengths — on purpose, this week — is one of the most reliable ways to feel more like yourself.
        </p>
        
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-extrabold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">My signature strengths</h3>
          <div className="flex flex-col gap-2.5">
            {data.top.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-base font-bold">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-black flex-shrink-0">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <p className="mt-5 text-[10px] opacity-75 tracking-wider uppercase font-bold">WellMindly · Discover</p>
        </ShareCard>
        
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        
        <div className="bg-white border border-line rounded-3xl p-6 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-ink-soft font-extrabold mb-4 border-b border-line/45 pb-2">Full ranking</p>
          {ranked.map(([label, val], i) => (
            <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.08} />
          ))}
        </div>
        
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // 4. Character archetype / Type layout
  if (data.kind === 'type' && data.top && data.scores) {
    const topType = data.top[0];
    const typeInfo = cur.types?.[topType];
    return (
      <div className="space-y-6 select-none">
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight text-ink">
          {cur.reveal || 'You’re'} <em className="italic font-serif text-plum">{topType}</em>.
        </h2>
        {typeInfo && <p className="font-serif text-lg leading-relaxed text-ink-soft font-medium mt-1 mb-5">{typeInfo.desc}</p>}
        
        {cur.card && (
          <>
            <ShareCard accent={accent} cardRef={cardRef}>
              <h3 className="font-serif font-extrabold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">{cur.cardLabel || 'My result'}</h3>
              <p className="font-serif text-4xl font-extrabold leading-tight mb-3">{topType}</p>
              <p className="text-[10px] opacity-75 tracking-wider uppercase font-bold">{typeInfo?.tag || cur.title} · WellMindly</p>
            </ShareCard>
            <CardButtons onSave={onSaveCard} onRetake={onRetake} />
          </>
        )}
        
        {typeInfo?.a && <InsightBlock borderColor="#3D6E66" label={typeInfo.a.label} text={typeInfo.a.text} />}
        {typeInfo?.b && <InsightBlock borderColor="#B3583E" label={typeInfo.b.label} text={typeInfo.b.text} />}
        {typeInfo?.tip && <InsightBlock borderColor={accent} label="Try this" text={typeInfo.tip} />}
        
        <div className="bg-white border border-line rounded-3xl p-6 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-ink-soft font-extrabold mb-4 border-b border-line/45 pb-2">How it broke down</p>
          {ranked.map(([label, val], i) => (
            <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.08} />
          ))}
        </div>
        
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // 5. Big Five personality layout
  if (data.kind === 'bigfive' && data.archetype && data.scores) {
    const arch = data.archetype;
    return (
      <div className="space-y-6 select-none">
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight text-ink">
          You're <em className="italic font-serif text-plum">{arch.name}</em>.
        </h2>
        <p className="font-serif text-lg leading-relaxed text-ink-soft font-medium mt-1 mb-5">{arch.desc}</p>
        
        <ShareCard accent={accent} cardRef={cardRef}>
          <h3 className="font-serif font-extrabold text-[13px] tracking-[.16em] uppercase opacity-80 mb-3">My personality archetype</h3>
          <p className="font-serif text-4xl font-extrabold leading-tight mb-3">{arch.name}</p>
          <p className="text-[10px] opacity-75 tracking-wider uppercase font-bold">WellMindly · Discover</p>
        </ShareCard>
        
        <CardButtons onSave={onSaveCard} onRetake={onRetake} />
        
        <div className="bg-white border border-line rounded-3xl p-6 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-ink-soft font-extrabold mb-4 border-b border-line/45 pb-2">Your five traits</p>
          {ranked.map(([label, val], i) => (
            <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.08} />
          ))}
        </div>
        
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  // 6. Wellness Check-in report layout
  if (data.kind === 'checkin' && data.scores) {
    const avg = Object.values(data.scores).reduce((a, b) => a + b, 0) / Object.values(data.scores).length;
    const tone = avg >= 70 ? "You're doing well." : avg >= 45 ? "Finding your footing." : "A heavier stretch.";
    return (
      <div className="space-y-6 select-none">
        <h2 className="font-serif font-medium text-[clamp(24px,4.4vw,36px)] leading-tight text-ink">{tone}</h2>
        <p className="font-serif text-lg leading-relaxed text-ink-soft font-medium mt-1 mb-5">
          This is a snapshot, not a score. Use it to notice how your weeks shift. The patterns over time tell a richer story than any single check-in.
        </p>
        
        <div className="bg-white border border-line rounded-3xl p-6 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-ink-soft font-extrabold mb-4 border-b border-line/45 pb-2">Your dimensions</p>
          {ranked.map(([label, val], i) => (
            <DimBar key={label} label={label} value={val} accent={accent} delay={i * 0.08} />
          ))}
        </div>
        
        <BackButtons goTo={goTo} />
      </div>
    );
  }

  return null;
}

// ─── Layout Helper: Svg Icons Share Card ──────────────────────────
function ShareCard({ accent, children, cardRef }: { accent: string; children: React.ReactNode; cardRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div 
      ref={cardRef} 
      className="rounded-[22px] p-8 text-white relative overflow-hidden shadow-xl"
      style={{ background: `linear-gradient(135deg, ${accent}, ${shade(accent)})` }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23fff' opacity='.08'/%3E%3C/svg%3E")` }} 
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

// ─── Layout Helper: Animated Bar ──────────────────────────────────
function DimBar({ label, value, accent, delay }: { label: string; value: number; accent: string; delay: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <b className="font-bold text-ink">{label}</b>
        <span className="text-ink-soft text-[13px] font-semibold">{toneWord(value)}</span>
      </div>
      <div className="h-3 bg-paper-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full" 
          style={{ background: accent }}
          initial={{ width: 0 }} 
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, delay, ease: [0.3, 0, 0.2, 1] }} 
        />
      </div>
    </div>
  );
}

// ─── Layout Helper: Insight Block ──────────────────────────────────
function InsightBlock({ borderColor, label, text }: { borderColor: string; label: string; text: string }) {
  return (
    <div className="border-l-[3px] bg-white rounded-r-[14px] p-5 my-3 text-[14.5px] border-y border-r border-line shadow-sm text-ink-soft font-medium" style={{ borderColor }}>
      <h4 className="text-xs tracking-wider uppercase text-ink font-extrabold mb-1" style={{ color: borderColor }}>{label}</h4>
      {text}
    </div>
  );
}

// ─── Layout Helper: Card Action Buttons ────────────────────────────
function CardButtons({ onSave, onRetake }: { onSave: () => void; onRetake: () => void }) {
  return (
    <div className="flex gap-3.5 flex-wrap mt-6 mb-3">
      <button 
        onClick={onSave} 
        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-plum hover:bg-plum/90 text-white font-extrabold text-[14.5px] shadow-lg shadow-plum/20 transition hover:-translate-y-0.5 active:scale-[.97] border-none"
      >
        Save my card
      </button>
      <button 
        onClick={onRetake} 
        className="cursor-pointer px-6 py-2.5 rounded-full border-[1.5px] border-line text-ink-soft font-extrabold text-[14.5px] hover:bg-white hover:border-ink transition active:scale-[.97] bg-transparent"
      >
        Take again
      </button>
    </div>
  );
}

// ─── Layout Helper: Back Buttons ───────────────────────────────────
function BackButtons({ goTo }: { goTo: (v: 'hub' | 'test' | 'result' | 'results') => void }) {
  return (
    <div className="flex gap-3.5 flex-wrap mt-8 justify-center border-t border-line/40 pt-5">
      <button 
        onClick={() => goTo('hub')} 
        className="cursor-pointer px-6 py-3 rounded-full bg-plum hover:bg-plum/90 text-white font-extrabold text-[14.5px] shadow-lg shadow-plum/20 transition hover:-translate-y-0.5 active:scale-[.97] border-none"
      >
        More tests
      </button>
      <button 
        onClick={() => goTo('results')} 
        className="cursor-pointer px-6 py-2.5 rounded-full border-[1.5px] border-line text-ink-soft font-extrabold text-[14.5px] hover:bg-white transition active:scale-[.97] bg-transparent"
      >
        My collection
      </button>
    </div>
  );
}
