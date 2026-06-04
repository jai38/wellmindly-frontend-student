import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  Check, 
  Users, 
  Compass,
  X,
  Star,
  Share2,
  AlertCircle,
  Volume2,
  Play,
  Smile
} from "lucide-react";



// Types for Quiz Engine
interface QuizItem {
  q: string;
  d: string; // dimension key
}

interface QuizTypeDetail {
  desc: string;
  tag: string;
  tip?: string;
  a?: { label: string; text: string };
  b?: { label: string; text: string };
}

interface TestConfig {
  title: string;
  accent: string;
  icon: string;
  blurb: string;
  kind: "profile" | "rank" | "type" | "pairs" | "picture";
  intro?: string;
  overall?: boolean;
  topN?: number;
  archetype?: boolean;
  card?: boolean;
  cardLabel?: string;
  reveal?: string;
  items?: QuizItem[];
  pairs?: { label: string; v: string }[][];
  options?: { label: string; ic: string; tone: number; c1: string; c2: string }[];
  types?: Record<string, QuizTypeDetail>;
}

// 6 Approved Launch Tests Data
const TESTS: Record<string, TestConfig> = {
  checkin: {
    title: "Emotional check-in",
    accent: "#0e7c6e",
    icon: "heart",
    blurb: "A two-minute wellbeing snapshot. See how you're really doing — and watch it shift over the weeks.",
    kind: "profile",
    overall: true,
    intro: "Over the last two weeks...",
    items: [
      { q: "I have felt cheerful and in good spirits.", d: "Good spirits" },
      { q: "I have felt calm and relaxed.", d: "Calm" },
      { q: "I have felt active and energetic.", d: "Energy" },
      { q: "I woke up feeling fresh and rested.", d: "Rested" },
      { q: "My daily life has been filled with things that interest me.", d: "Engaged" },
      { q: "I have felt connected to people around me.", d: "Connection" }
    ]
  },
  mood: {
    title: "Mood snapshot",
    accent: "#c2607e",
    icon: "cloud",
    blurb: "A one-tap picture check. Fast and honest — and it adds a tile to your moodboard.",
    kind: "picture",
    options: [
      { label: "Bright", ic: "spark", tone: 88, c1: "#e3b04b", c2: "#7c9473" },
      { label: "Steady", ic: "compass", tone: 64, c1: "#7c9473", c2: "#0e7c6e" },
      { label: "Tangled", ic: "bloom", tone: 40, c1: "#d4a24a", c2: "#c97b3f" },
      { label: "Heavy", ic: "cloud", tone: 20, c1: "#8a93b0", c2: "#6f7aa0" },
      { label: "Tender", ic: "heart", tone: 48, c1: "#b06a78", c2: "#8a5a86" },
      { label: "Wired", ic: "star", tone: 55, c1: "#d97706", c2: "#b06a78" }
    ]
  },
  strengths: {
    title: "Signature strengths",
    accent: "#c8973a",
    icon: "star",
    blurb: "Discover your top character strengths — and get a card worth sharing.",
    kind: "rank",
    topN: 5,
    intro: "How much is this like you?",
    items: [
      { q: "I love exploring new ideas just to see where they lead.", d: "Curiosity" },
      { q: "I often come up with original or inventive ways to do things.", d: "Creativity" },
      { q: "I keep going even when something gets hard or boring.", d: "Perseverance" },
      { q: "I go out of my way to help people, even in small ways.", d: "Kindness" },
      { q: "People tend to look to me to organise or take the lead.", d: "Leadership" },
      { q: "I treat everyone fairly, even people I don’t know well.", d: "Fairness" },
      { q: "I like making people laugh and lightening the mood.", d: "Humour" },
      { q: "I’ll speak up or act even when it feels a bit scary.", d: "Bravery" },
      { q: "I genuinely enjoy learning new things for their own sake.", d: "Love of learning" },
      { q: "I notice and appreciate the good things in my life.", d: "Gratitude" },
      { q: "I work well with others and like being part of a team.", d: "Teamwork" },
      { q: "I stay hopeful that things will work out in the end.", d: "Hope" }
    ]
  },
  bigfive: {
    title: "Personality profile",
    accent: "#2f6fb0",
    icon: "compass",
    blurb: "Five core traits that add up to an archetype that's unmistakably you.",
    kind: "profile",
    archetype: true,
    intro: "How well does this describe you?",
    items: [
      { q: "I love trying new experiences and ideas.", d: "Openness" },
      { q: "I have a vivid imagination and enjoy abstract thinking.", d: "Openness" },
      { q: "I get things done and like to be organised.", d: "Conscientiousness" },
      { q: "I follow through on what I plan to do.", d: "Conscientiousness" },
      { q: "I feel energised around other people.", d: "Extraversion" },
      { q: "I start conversations and enjoy being social.", d: "Extraversion" },
      { q: "I’m considerate and care about others’ feelings.", d: "Warmth" },
      { q: "I trust people and assume the best in them.", d: "Warmth" },
      { q: "I stay calm and steady under pressure.", d: "Steadiness" },
      { q: "I rarely let small setbacks rattle me.", d: "Steadiness" }
    ]
  },
  values: {
    title: "What matters most",
    accent: "#6d28d9",
    icon: "scale",
    blurb: "A quick this-or-that that reveals the values you quietly lead with.",
    kind: "pairs",
    pairs: [
      [
        { label: "A surprising adventure", v: "Adventure" },
        { label: "A safe, settled plan", v: "Security" }
      ],
      [
        { label: "Deep time with one friend", v: "Connection" },
        { label: "Winning at something hard", v: "Achievement" }
      ],
      [
        { label: "Total freedom to choose", v: "Freedom" },
        { label: "Learning and growing", v: "Growth" }
      ],
      [
        { label: "Trying something risky", v: "Adventure" },
        { label: "Helping someone you love", v: "Connection" }
      ],
      [
        { label: "Being recognised for your work", v: "Achievement" },
        { label: "A calm, secure week", v: "Security" }
      ],
      [
        { label: "Mastering a new skill", v: "Growth" },
        { label: "Doing it your own way", v: "Freedom" }
      ],
      [
        { label: "A loyal close circle", v: "Connection" },
        { label: "An open road, no plan", v: "Adventure" }
      ],
      [
        { label: "Becoming wiser", v: "Growth" },
        { label: "Achieving a big goal", v: "Achievement" }
      ]
    ]
  },
  strengthshadow: {
    title: "Strength & shadow",
    accent: "#6d28d9",
    icon: "star",
    blurb: "Your greatest strength and its flip side — usually the same trait, turned up or down.",
    kind: "type",
    card: true,
    cardLabel: "My core strength",
    reveal: "You’re",
    intro: "How much is this like you?",
    items: [
      { q: "I deeply feel what the people around me are feeling.", d: "The Empath" },
      { q: "I notice straight away when someone’s a bit off.", d: "The Empath" },
      { q: "I push hard to reach the goals I set.", d: "The Achiever" },
      { q: "I’m driven to accomplish and make progress.", d: "The Achiever" },
      { q: "I like doing things my own way, on my own terms.", d: "The Free Spirit" },
      { q: "I resist being boxed in by rules or routine.", d: "The Free Spirit" },
      { q: "I work hard to keep everyone around me happy.", d: "The Peacemaker" },
      { q: "I’ll smooth things over to avoid conflict.", d: "The Peacemaker" }
    ],
    types: {
      "The Empath": {
        desc: "You feel the room and make people feel understood. That same depth is also your edge.",
        tag: "Feels everything",
        a: { label: "Your strength", text: "Deep empathy — people feel genuinely seen and safe with you." },
        b: { label: "Your shadow", text: "You absorb other people’s stress and can lose track of your own needs." },
        tip: "You can care deeply without carrying it all. Protect your own energy on purpose."
      },
      "The Achiever": {
        desc: "You make things happen. The drive that powers you can also run you into the ground.",
        tag: "Driven to do",
        a: { label: "Your strength", text: "Real drive and follow-through — you turn intentions into results." },
        b: { label: "Your shadow", text: "You can tie your worth to output, and rest can start to feel like failure." },
        tip: "You’re enough on the days you achieve nothing. Schedule rest like it’s a deadline."
      },
      "The Free Spirit": {
        desc: "You’re authentic and independent. The independence that frees you can also isolate you.",
        tag: "Does it their way",
        a: { label: "Your strength", text: "Independence and authenticity — you think for yourself and live on your terms." },
        b: { label: "Your shadow", text: "You can resist structure and help that would actually make life easier." },
        tip: "Some structure is freedom, not a cage. Let a few people in."
      },
      "The Peacemaker": {
        desc: "You create calm and harmony. The same instinct can quietly cost you your own voice.",
        tag: "Keeps the peace",
        a: { label: "Your strength", text: "You bring harmony and steadiness — people feel calmer around you." },
        b: { label: "Your shadow", text: "You can bury your own needs and opinions to keep things smooth." },
        tip: "Your needs count too. Sometimes honest is kinder than comfortable."
      }
    }
  }
};

const VALUE_DESC: Record<string, string> = {
  Adventure: "You’re drawn to the new — you grow by leaping.",
  Security: "You value stability and a sure footing.",
  Connection: "People come first; relationships are your anchor.",
  Achievement: "You’re driven to accomplish and rise to challenges.",
  Freedom: "Autonomy matters — you do it your way.",
  Growth: "You’re here to learn and become more."
};

const ARCHETYPE = [
  { when: ["Openness", "Extraversion"], name: "The Explorer", desc: "Curious and outgoing — you chase new experiences and bring people along." },
  { when: ["Conscientiousness", "Steadiness"], name: "The Anchor", desc: "Reliable and calm — the steady one others lean on." },
  { when: ["Warmth", "Extraversion"], name: "The Connector", desc: "Warm and social — you build bridges and bring energy to a room." },
  { when: ["Openness", "Conscientiousness"], name: "The Architect", desc: "Imaginative and disciplined — you turn big ideas into real things." },
  { when: ["Warmth", "Steadiness"], name: "The Harmoniser", desc: "Caring and even-keeled — you keep things calm and kind." },
  { when: ["Openness"], name: "The Seeker", desc: "Endlessly curious — ideas are your playground." }
];

const L5: [string, number][] = [
  ["Strongly agree", 5],
  ["Agree", 4],
  ["Neither", 3],
  ["Disagree", 2],
  ["Strongly disagree", 1]
];

function shadeColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 30);
  const g = Math.max(0, ((n >> 8) & 255) - 26);
  const b = Math.max(0, (n & 255) - 22);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// moodboardMockData and realityQuotes arrays removed as focus-section was deleted

const talkPreviews: Record<string, string[]> = {
  "Exam Season": [
    "Anonymous: Anyone else just staring at their notes feeling blank?",
    "Anonymous: Yes, literally 3 hours straight. No intake.",
    "Anonymous: You're not alone. Take a walk, it helps break the lock."
  ],
  "The 3am Club": [
    "Anonymous: Can't sleep. My head is spinning about next semester.",
    "Anonymous: Same, the job hunt is just keeping me wired.",
    "Anonymous: Breathe. We'll figure it out. One day at a time."
  ]
};

const getTestIconSvg = (ic: string) => {
  switch (ic) {
    case "spark":
      return <Sparkles className="w-5 h-5" />;
    case "compass":
      return <Compass className="w-5 h-5" />;
    case "bloom":
      return <Smile className="w-5 h-5" />;
    case "heart":
      return <Heart className="w-5 h-5" />;
    case "star":
      return <Star className="w-5 h-5" />;
    default:
      return <span className="text-xl">☁️</span>;
  }
};

export function LandingPage() {
  const navigate = useNavigate();

  // Core States
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; thoughtId: number; x: number; y: number }[]>([]);

  const [breathDuration, setBreathDuration] = useState(60);
  const [synthPitch, setSynthPitch] = useState<number>(110);
  const [synthVolume, setSynthVolume] = useState<number>(0.1);
  // realityCardIndex and flipDestigma states removed
  const [fullscreenWrite, setFullscreenWrite] = useState(false);
  const [typingSound, setTypingSound] = useState(true);
  const [selectedTalkRoom, setSelectedTalkRoom] = useState<string | null>(null);

  const playTypeSound = () => {
    if (!typingSound) return;
    try {
      const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new CtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120 + Math.random() * 80, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };
  
  // Hero headline rotator state
  const heroHeadlines = [
    "Some days are heavy, and you can't explain why.",
    "You don't have to have the words yet.",
    "Fine on the outside. Somewhere else on the inside.",
    "Nobody teaches us what to do when life feels heavy."
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex(prev => (prev + 1) % heroHeadlines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Quick Emotional Entry Interactive States
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [showPayoff, setShowPayoff] = useState(false);
  const [showBreathOverlay, setShowBreathOverlay] = useState(false);

  // Breathing space Web Audio API synth state
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathTime, setBreathTime] = useState(60);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscNode, setOscNode] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  // Breathing loop timer
  useEffect(() => {
    let interval: any;
    if (showBreathOverlay && breathTime > 0) {
      interval = setInterval(() => {
        setBreathTime(prev => prev - 1);
        
        // Cycle phase every 4 seconds
        const phaseIdx = Math.floor((breathDuration - breathTime) / 4) % 3;
        const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
        setBreathPhase(phases[phaseIdx]);
      }, 1000);
    } else if (breathTime === 0) {
      handleCloseBreath();
    }
    return () => clearInterval(interval);
  }, [showBreathOverlay, breathTime, breathDuration]);

  // Audio synthesizer swell control based on breath phase
  useEffect(() => {
    if (isSynthPlaying && gainNode && oscNode && audioCtx) {
      const now = audioCtx.currentTime;
      if (breathPhase === "inhale") {
        // Swell oscillator frequency and volume up
        oscNode.frequency.setValueAtTime(synthPitch, now);
        oscNode.frequency.exponentialRampToValueAtTime(synthPitch * 2, now + 3.8);
        gainNode.gain.setValueAtTime(synthVolume * 0.1, now);
        gainNode.gain.linearRampToValueAtTime(synthVolume, now + 3.8);
      } else if (breathPhase === "hold") {
        // Keep steady
        gainNode.gain.setValueAtTime(synthVolume, now);
      } else {
        // Exhale: volume and pitch fade down
        oscNode.frequency.setValueAtTime(synthPitch * 2, now);
        oscNode.frequency.exponentialRampToValueAtTime(synthPitch, now + 3.8);
        gainNode.gain.setValueAtTime(synthVolume, now);
        gainNode.gain.linearRampToValueAtTime(synthVolume * 0.1, now + 3.8);
      }
    }
  }, [breathPhase, isSynthPlaying, gainNode, oscNode, audioCtx, synthPitch, synthVolume]);

  // Real-time slider update handler
  useEffect(() => {
    if (audioCtx && oscNode && gainNode) {
      const now = audioCtx.currentTime;
      oscNode.frequency.setValueAtTime(oscNode.frequency.value, now);
      oscNode.frequency.exponentialRampToValueAtTime(synthPitch, now + 0.2);
      
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(synthVolume, now + 0.2);
    }
  }, [synthPitch, synthVolume, audioCtx, oscNode, gainNode]);

  const handleStartBreath = (durationSeconds: number = 60) => {
    setShowBreathOverlay(true);
    setBreathTime(durationSeconds);
    setBreathDuration(durationSeconds);
    setBreathPhase("inhale");
    // Initialize synth audio context
    try {
      const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new CtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Low pass filter to make it soft and warm
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      osc.type = "sine";
      osc.frequency.setValueAtTime(synthPitch, ctx.currentTime);
      gain.gain.setValueAtTime(synthVolume, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();

      setAudioCtx(ctx);
      setOscNode(osc);
      setGainNode(gain);
      setIsSynthPlaying(true);
    } catch (e) {
      console.warn("Audio Context not supported");
    }
  };

  const handleCloseBreath = () => {
    setShowBreathOverlay(false);
    if (audioCtx) {
      try {
        oscNode?.stop();
        audioCtx.close();
      } catch (e) {}
    }
    setAudioCtx(null);
    setOscNode(null);
    setGainNode(null);
    setIsSynthPlaying(false);
    setToastMessage("Thanks for pausing. Take your time getting back.");
  };

  const handleToggleSound = () => {
    if (audioCtx) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
        setIsSynthPlaying(true);
      } else if (audioCtx.state === "running") {
        audioCtx.suspend();
        setIsSynthPlaying(false);
      }
    }
  };

  // Quick chips content mapping
  const chipsPayoffs: Record<string, string> = {
    Overwhelmed: "When everything feels urgent, nothing gets to feel small. You're not weak for struggling to keep up — you're carrying a lot at once. Want to put some of it down for a minute?",
    Flat: "Sometimes feeling nothing is just your system trying to catch its breath. You don't have to force yourself to feel 'better' or paint a smile on. It is okay to just sit here flat.",
    "Can't switch off": "Your thoughts are racing to solve things that aren't ready to be solved. Let's see if we can slow the carousel down for a minute. Even just 10 seconds of static is a start.",
    Numb: "When things get too loud, your system pulls the plug to protect you. That's not a flaw — it's a boundary. Let yourself just stand still without needing to explain it.",
    "Just tired": "Not the kind of tired that sleep fixes. The kind that comes from holding everything together. No push. No metrics. Just rest, without needing to earn it.",
    "Honestly, not sure": "Even 'I don't know' is a fine place to start. You don't need to name the weight to feel it. Let's start with just acknowledging that things are heavy."
  };

  const handleChipClick = (chip: string) => {
    setSelectedChip(chip);
    setShowPayoff(true);
    // Log color tile on hero list
    setHeroTiles(prev => ["linear-gradient(140deg, #cf7794, #b06a78)", ...prev.slice(0, 17)]);
  };

  // Live thoughts wall states
  const [anonymousThoughts, setAnonymousThoughts] = useState<Array<{ id: number; text: string; hugs: number; bg: string }>>([
    { id: 1, text: "I didn't realize how much I was holding until I wrote it down.", hugs: 12, bg: "#fffdf8" },
    { id: 2, text: "Turns out half my course feels exactly the same. I just never asked.", hugs: 24, bg: "#f3f8f5" },
    { id: 3, text: "I didn't want advice. I wanted someone to get it. That was enough.", hugs: 18, bg: "#faf5ff" },
    { id: 4, text: "Saying 'I'm fine' is so exhausting. Today I admitted I wasn't to a blank page.", hugs: 31, bg: "#f5f9fc" }
  ]);
  const [newThought, setNewThought] = useState("");
  const [checkedInCount, setCheckedInCount] = useState(4892);

  const handleSubmitThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (newThought.trim()) {
      const nextId = anonymousThoughts.length > 0 ? Math.max(...anonymousThoughts.map(t => t.id)) + 1 : 1;
      const bgs = ["#fffdf8", "#f3f8f5", "#faf5ff", "#f5f9fc"];
      const bg = bgs[nextId % bgs.length];
      setAnonymousThoughts(prev => [{ id: nextId, text: newThought.trim(), hugs: 0, bg }, ...prev]);
      setNewThought("");
      setCheckedInCount(prev => prev + 1);
      setToastMessage("Thought shared anonymously to the wall.");
    }
  };

  const handleHugThought = (id: number) => {
    setAnonymousThoughts(prev => 
      prev.map(t => t.id === id ? { ...t, hugs: t.hugs + 1 } : t)
    );
    setToastMessage("Sent support! ❤️");
  };

  // WriteMindly typing preview state
  const [writeText, setWriteText] = useState("");
  const [listenMode, setListenMode] = useState<"listen" | "validate">("listen");

  // No coaches or slots arrays needed here

  // Custom interactive variables for Hero widget
  const [heroSelectedFace, setHeroSelectedFace] = useState<number>(0);
  const [heroTiles, setHeroTiles] = useState<string[]>([
    "linear-gradient(140deg, #e3b04b, #7c9473)",
    "linear-gradient(140deg, #7c9473, #0e7c6e)",
    "linear-gradient(140deg, #d4a24a, #c97b3f)",
    "linear-gradient(140deg, #9aa2bd, #6f7aa0)",
    "linear-gradient(140deg, #cf7794, #b06a78)",
    "linear-gradient(140deg, #e0863f, #d8472f)"
  ]);

  const FACES = [
    { n: "Bright", c1: "#e9bd55", c2: "#7c9473", mouth: "M16 29 Q24 38 32 29", eye: "happy", tone: "Finding your footing", gradient: "linear-gradient(140deg, #e9bd55, #7c9473)" },
    { n: "Good", c1: "#8aab78", c2: "#0e7c6e", mouth: "M17 30 Q24 35 31 30", eye: "dot", tone: "Feeling steady", gradient: "linear-gradient(140deg, #8aab78, #0e7c6e)" },
    { n: "Okay", c1: "#e0b25a", c2: "#d4a24a", mouth: "M17 31 L31 31", eye: "dot", tone: "Pacing yourself", gradient: "linear-gradient(140deg, #e0b25a, #d4a24a)" },
    { n: "Tense", c1: "#e0935a", c2: "#d8472f", mouth: "M17 33 Q24 29 31 33", eye: "dot", tone: "A bit stretched", gradient: "linear-gradient(140deg, #e0935a, #d8472f)" },
    { n: "Heavy", c1: "#9aa2bd", c2: "#6f7aa0", mouth: "M17 34 Q24 28 31 34", eye: "sad", tone: "Feeling flat / flat week", gradient: "linear-gradient(140deg, #9aa2bd, #6f7aa0)" }
  ];

  const handleHeroFaceClick = (idx: number) => {
    setHeroSelectedFace(idx);
    const color = FACES[idx].gradient;
    setHeroTiles(prev => [color, ...prev.slice(0, 17)]);
    setToastMessage(`Mood checked: ${FACES[idx].n}! Tile added to dashboard preview.`);
  };

  // Focus areas and dashboard references simplified

  // Quiz Overlay States
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const handleSelectOption = (val: any) => {
    const config = TESTS[activeQuizId!];
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = val;
    setQuizAnswers(newAnswers);

    const totalSteps = config.kind === "pairs" ? (config.pairs?.length ?? 0) : config.kind === "picture" ? 1 : (config.items?.length ?? 0);
    
    setTimeout(() => {
      if (quizStep < totalSteps - 1) {
        setQuizStep(prev => prev + 1);
      } else {
        const results = runScoring(newAnswers, config);
        setQuizResult(results);
      }
    }, 200);
  };

  const runScoring = (answers: any[], config: TestConfig) => {
    if (config.kind === "pairs") {
      const tally: Record<string, number> = {};
      answers.forEach(v => {
        tally[v] = (tally[v] || 0) + 1;
      });
      const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
      const top = sorted.map(x => x[0]).slice(0, 2);
      return { top, tally };
    }

    if (config.kind === "picture") {
      return { selected: answers[0] };
    }

    const scores: Record<string, number> = {};
    const counts: Record<string, number> = {};
    config.items?.forEach((item, index) => {
      const val = answers[index] ?? 3;
      scores[item.d] = (scores[item.d] || 0) + val;
      counts[item.d] = (counts[item.d] || 0) + 1;
    });

    const parsedScores: Record<string, number> = {};
    Object.keys(scores).forEach(d => {
      parsedScores[d] = Math.round(((scores[d] / counts[d]) - 1) / 4 * 100);
    });

    const ranked = Object.entries(parsedScores).sort((a, b) => b[1] - a[1]);
    const top = ranked.map(x => x[0]);

    return { scores: parsedScores, ranked, top };
  };

  const exportResultCard = async () => {
    setIsExporting(true);
    try {
      const loadHtml2Canvas = () => {
        return new Promise<any>((resolve, reject) => {
          if ((window as any).html2canvas) {
            resolve((window as any).html2canvas);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          script.async = true;
          script.onload = () => resolve((window as any).html2canvas);
          script.onerror = () => reject(new Error("Failed to load html2canvas"));
          document.body.appendChild(script);
        });
      };

      const html2canvas = await loadHtml2Canvas();
      const node = document.getElementById("share-card-container");
      if (node) {
        const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
        const a = document.createElement("a");
        a.download = `my-wellmindly-${activeQuizId}-card.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
        setToastMessage("Card downloaded! Share it with friends.");
      }
    } catch (e) {
      setToastMessage("Could not export. Feel free to screenshot this card to share!");
    } finally {
      setIsExporting(false);
    }
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const renderFaceSvg = (face: typeof FACES[0], uniqueId: string, isPicked: boolean) => {
    const eyes = face.eye === "happy" 
      ? '<path d="M16 21 Q18.5 18 21 21" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M27 21 Q29.5 18 32 21" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>' 
      : face.eye === "sad" 
      ? '<circle cx="18.5" cy="21" r="2" fill="#fff"/><circle cx="29.5" cy="21" r="2" fill="#fff"/>' 
      : '<circle cx="18.5" cy="21" r="2.2" fill="#fff"/><circle cx="29.5" cy="21" r="2.2" fill="#fff"/>';

    return (
      <svg 
        className={`w-10 h-10 cursor-pointer transition-all duration-300 ${isPicked ? "scale-115 drop-shadow-[0_8px_14px_rgba(0,0,0,0.18)]" : "opacity-45 hover:opacity-80"}`} 
        viewBox="0 0 48 48"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={face.c1} />
            <stop offset="1" stopColor={face.c2} />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill={`url(#${uniqueId})`} />
        <span dangerouslySetInnerHTML={{ __html: eyes }} />
        <path d={face.mouth} stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-rose/20 selection:text-ink relative overflow-x-hidden pb-12">
      
      {/* Floating Calm Breathing Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartBreath()}
          className="bg-gradient-to-r from-coral to-ember text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 text-xs font-bold shrink-0"
        >
          <span>Take a breath 🌸</span>
        </motion.button>
      </div>

      {/* Global Crisis Support Banner */}
      <div className="w-full bg-[#FAF8F5] border-b border-line py-2.5 px-6 text-center text-xs font-semibold text-ember relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          Need help right now?
          <button 
            onClick={() => setShowCrisisModal(true)} 
            className="underline hover:text-coral transition-colors ml-1 font-bold"
          >
            Get help immediately &rarr;
          </button>
        </span>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 w-full border-b border-line bg-paper/85 backdrop-blur-md transition-all duration-300"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-coral to-ember shadow-[0_0_0_4px_rgba(224,97,58,0.15)]" />
            <span className="text-xl font-bold tracking-tight text-ink font-serif">
              WellMindly
            </span>
          </div>

          <nav className="flex items-center gap-5">
            <a href="#quick-entry" className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors">
              Check in
            </a>
            <a href="#community-wall" className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors">
              Community
            </a>
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-navy text-white px-4.5 py-1.5 text-xs font-bold hover:bg-[#1d2843] transition-colors"
            >
              Sign In
            </button>
          </nav>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-6 relative z-10">

        {/* 1. Hero Section */}
        <section className="py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start animate-fade">
            
            {/* Alt Headline Rotator */}
            <div className="h-8 mb-6 relative overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={headlineIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.9 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute text-xs font-bold uppercase tracking-wider text-ember bg-ember/5 border border-ember/15 px-4 py-1.5 rounded-full font-sans"
                >
                  {heroHeadlines[headlineIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-ink leading-[1.05] tracking-tight font-medium">
              Some days are heavy.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed max-w-[48ch] font-serif italic">
              You don't need to have the words yet. Understanding them is the first step — privately and anonymously.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              <a
                href="#quick-entry"
                className="rounded-full bg-[#121a30] text-white px-8 py-4 text-sm font-bold shadow-md hover:bg-[#1d2843] transition-all hover:-translate-y-0.5 text-center"
              >
                See how you're feeling
              </a>
            </div>
            
            <span className="text-xs text-ink-soft/70 font-semibold tracking-wide mt-2 ml-4">
              No sign-up. No questions. Just start.
            </span>



            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-ink-soft">
              <span className="flex items-center gap-2 font-medium">
                <Shield className="w-4 h-4 text-teal" />
                Never shared with school
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-teal" />
                Anonymous option
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-teal" />
                Delete anytime
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive Mock Phone Screen */}
          <div className="flex justify-center relative w-full max-w-[340px] mx-auto md:max-w-none">
            
            {/* Floating thought bubbles */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onClick={() => handleHeroFaceClick(4)}
              className="absolute top-[8%] -left-12 z-20 bg-white/95 backdrop-blur-sm border border-line px-4 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer hover:border-gold hover:scale-105 transition-all whitespace-nowrap text-ink select-none"
            >
              who even am I rn
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              onClick={() => handleHeroFaceClick(0)}
              className="absolute top-[32%] -right-16 z-20 bg-white/95 backdrop-blur-sm border border-line px-4 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer hover:border-gold hover:scale-105 transition-all whitespace-nowrap text-ink select-none"
            >
              what am I actually <span className="text-gold font-extrabold">good</span> at?
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              onClick={() => handleHeroFaceClick(3)}
              className="absolute bottom-[30%] -left-16 z-20 bg-white/95 backdrop-blur-sm border border-line px-4 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer hover:border-gold hover:scale-105 transition-all whitespace-nowrap text-ink select-none"
            >
              is it just me or...
            </motion.div>

            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              onClick={() => handleHeroFaceClick(2)}
              className="absolute bottom-[12%] -right-12 z-20 bg-white/95 backdrop-blur-sm border border-line px-4 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer hover:border-gold hover:scale-105 transition-all whitespace-nowrap text-ink select-none"
            >
              this week hit different
            </motion.div>

            <div className="w-[260px] h-[520px] rounded-[42px] bg-slate-950 p-3 shadow-2xl relative rotate-[-2deg]">
              
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-b-xl z-30" />
              
              {/* Internal Screen */}
              <div className="w-full h-full rounded-[30px] bg-gradient-to-b from-[#fbf6ec] to-[#f2e8d4] overflow-hidden p-5 flex flex-col justify-between relative">
                
                {/* Brand */}
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-ink-soft uppercase mt-3 select-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-coral to-ember" />
                  WellMindly
                </div>

                {/* Prompt */}
                <div className="mt-4">
                  <h3 className="font-serif text-2xl font-medium leading-tight">
                    How are you,<br />really?
                  </h3>
                  <p className="text-xs text-ink-soft mt-1.5 font-medium select-none">Tap a face to check in:</p>
                </div>

                {/* Faces row with spring animations */}
                <div className="flex justify-between items-center gap-1.5 mt-2.5">
                  {FACES.map((face, index) => {
                    const isPicked = heroSelectedFace === index;
                    return (
                      <motion.button 
                        key={index} 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleHeroFaceClick(index)}
                        className="focus:outline-none relative"
                      >
                        {renderFaceSvg(face, `hero-face-${index}`, isPicked)}
                        {isPicked && (
                          <motion.span 
                            layoutId="activeFaceRing"
                            className="absolute -inset-1 rounded-full border border-teal/45 pointer-events-none"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Current tone result card */}
                <div className="bg-white border border-line rounded-2xl p-4 shadow-sm mt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-ink-soft uppercase select-none">Today's tone</span>
                    <h4 className="font-serif text-lg font-medium mt-1">
                      {FACES[heroSelectedFace].tone}
                    </h4>
                  </div>
                  
                  {/* Grid layout preview in phone with animated entry */}
                  <div className="grid grid-cols-6 gap-1 mt-3">
                    <AnimatePresence>
                      {heroTiles.map((tile, i) => (
                        <motion.div 
                          layout
                          key={i} 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          style={{ background: tile }}
                          className="aspect-square rounded-[4px] border border-black/5"
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 2. Quick Emotional Entry (Check in Section) */}
        <section id="quick-entry" className="py-20 border-t border-line scroll-mt-20">
          <div className="max-w-xl mx-auto text-center mb-10">
            <span className="text-xs font-bold tracking-wider text-ember uppercase">First check-in</span>
            <h2 className="text-3xl font-serif mt-1.5 font-medium leading-tight">How have you actually been lately?</h2>
            <p className="text-ink-soft text-sm mt-3">No sign-up. Select a feeling chip below to start.</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
            {Object.keys(chipsPayoffs).map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`border text-sm font-bold py-3 px-5 rounded-full transition-all hover:border-gold shadow-sm ${
                  selectedChip === chip 
                    ? "bg-[#121a30] border-[#121a30] text-white" 
                    : "bg-card border-line text-ink"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showPayoff && selectedChip && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-10 max-w-md mx-auto bg-card border border-line rounded-[32px] p-8 shadow-md text-center"
              >
                <div className="text-xs font-bold text-teal bg-teal/5 border border-teal/15 px-4 py-1.5 rounded-full inline-block mb-4">
                  Thanks for being honest. That's harder than it sounds.
                </div>

                <p className="text-ink text-base leading-relaxed mb-8 font-serif italic">
                  We hear you. When things feel heavy, a small pause is a good place to start.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPayoff(false);
                      handleStartBreath(60);
                    }}
                    className="bg-[#121a30] hover:bg-[#1d2843] text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Start 60s Breathing Space
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayoff(false)}
                    className="border border-line text-ink hover:bg-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

          {/* 4. Live Anonymous Thoughts Wall */}
          <section id="community-wall" className="py-20 border-t border-line scroll-mt-20">
            
            {/* Thoughts Wall */}
            <div className="bg-card border border-line rounded-[36px] p-6 sm:p-10 shadow-sm">
              <div className="max-w-xl mx-auto text-center mb-10 pt-4">
                <span className="text-xs font-bold tracking-wider text-ember uppercase">Me too</span>
                <h3 className="text-3xl font-serif mt-1.5 font-medium leading-tight text-ink">Shared anonymous thoughts</h3>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-teal bg-teal/5 border border-teal/15 px-4 py-1.5 rounded-full mt-3 animate-pulse shadow-sm">
                  <Users className="w-3.5 h-3.5" />
                  <span>{checkedInCount} students checked in this week</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AnimatePresence>
                  {anonymousThoughts.map((thought) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, rotate: (thought.id % 2 === 0 ? 0.5 : -0.5) }}
                      key={thought.id}
                      style={{ backgroundColor: thought.bg }}
                      className="border border-line rounded-2xl p-6 shadow-sm relative flex flex-col justify-between min-h-[165px] hover:shadow-md transition-all duration-300 overflow-visible"
                    >
                      <p className="text-base sm:text-lg leading-relaxed text-ink font-serif">
                        "{thought.text}"
                      </p>
                      <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-line/45 overflow-visible">
                        <span className="text-[10px] text-ink-soft uppercase font-bold tracking-wider select-none">Anonymous student</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            // Spawn floating heart at click location
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const heartId = Date.now() + Math.random();
                            setFloatingHearts(prev => [...prev, { id: heartId, thoughtId: thought.id, x, y }]);
                            
                            handleHugThought(thought.id);
                            
                            setTimeout(() => {
                              setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
                            }, 1000);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-ember bg-paper/60 border border-line/35 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm relative overflow-visible"
                        >
                          <span>❤️</span>
                          <span>{thought.hugs} hugs</span>
                          
                          {/* Floating Hearts */}
                          <span className="absolute inset-0 pointer-events-none overflow-visible">
                            {floatingHearts.filter(h => h.thoughtId === thought.id).map(h => (
                              <motion.span
                                key={h.id}
                                initial={{ y: h.y - 10, x: h.x - 8, opacity: 1, scale: 1 }}
                                animate={{ y: h.y - 80, opacity: 0, scale: 1.4 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute text-sm text-ember select-none"
                              >
                                ❤️
                              </motion.span>
                            ))}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input Submission */}
              <form onSubmit={handleSubmitThought} className="mt-10 pt-8 border-t border-line flex flex-col gap-4">
                <label htmlFor="thought-input" className="text-xs font-bold text-ink-soft uppercase tracking-wider">Share a quiet thought anonymously</label>
                <div className="flex gap-3">
                  <input
                    id="thought-input"
                    type="text"
                    placeholder="Type what's quietly on your mind..."
                    value={newThought}
                    onChange={(e) => {
                      setNewThought(e.target.value);
                    }}
                    className="flex-grow border border-line bg-paper/45 rounded-xl px-5 py-4 text-sm font-medium text-ink focus:outline-none focus:border-gold transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-navy hover:bg-[#1d2843] text-white font-bold text-sm px-6 py-4 rounded-xl transition-colors shrink-0 shadow-md"
                  >
                    Share
                  </button>
                </div>
              </form>
            </div>

          </section>



        {/* 6. The Two Ways In (WriteMindly and TalkMindly Tools) */}
        <section className="py-20 border-t border-line">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold tracking-wider text-ember uppercase">Core tools</span>
            <h2 className="text-4xl font-serif mt-2 font-medium leading-tight">Two ways to feel less alone.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* WriteMindly Card */}
            <div className="bg-card border border-line rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#0e7c6e] uppercase">WriteMindly</span>
                <h3 className="text-2xl font-serif font-medium text-ink mt-2.5">
                  Say it to something that won't judge you.
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed mt-3.5">
                  Type whatever's on your mind — messy, half-formed, 2am, all of it. WriteMindly helps you slow down long enough to hear your own thoughts. Sometimes that's all you need. No advice unless you want it.
                </p>
                
                {/* Typing interactive block */}
                <div className="mt-6 bg-[#FAF8F5] border border-line rounded-2xl p-5 flex flex-col gap-3.5 shadow-inner">
                  <div className="flex justify-between items-center text-[10px] font-bold text-ink-soft uppercase tracking-wide">
                    <span>Interactive Workspace</span>
                    <button 
                      type="button"
                      onClick={() => setListenMode(prev => prev === "listen" ? "validate" : "listen")}
                      className="underline text-navy lowercase font-bold"
                    >
                      mode: {listenMode === "listen" ? "listen only" : "warm response"}
                    </button>
                  </div>
                  <textarea
                    placeholder="Blank page, no pressure. Start typing whatever is loudest in your head..."
                    value={writeText}
                    onChange={(e) => {
                      setWriteText(e.target.value);
                      playTypeSound();
                    }}
                    className="w-full bg-transparent text-sm font-medium text-ink h-24 resize-none focus:outline-none placeholder:text-ink-soft/40 leading-relaxed"
                  />
                  {writeText.trim().length > 0 && (
                    <div className="text-[10px] text-[#0e7c6e] font-bold leading-normal pt-2.5 border-t border-line/50 animate-fade font-sans">
                      {listenMode === "listen" 
                        ? "We are listening. Your words are private and safe." 
                        : "Thanks for expressing that. Putting it down for a moment helps."}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-line flex justify-between items-center text-xs font-bold text-ink-soft">
                <span>Private. Instant. Always awake.</span>
                <button
                  type="button"
                  onClick={() => setFullscreenWrite(true)}
                  className="bg-navy hover:bg-[#1d2843] text-white px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  Focus Writing Space ✍️
                </button>
              </div>
            </div>

            {/* TalkMindly Card */}
            <div className="bg-card border border-line rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#d8472f] uppercase">TalkMindly</span>
                <h3 className="text-2xl font-serif font-medium text-ink mt-2.5">
                  Say it to people who actually get it.
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed mt-3.5">
                  Anonymous spaces where students talk about the things they usually keep to themselves. The pressure. The loneliness. The self-doubt. The feeling that everyone else has life figured out. Sometimes hearing "I've felt that too" changes everything. No names. No judgment. Just people who understand.
                </p>

                {/* Active rooms preview */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <div className="text-[10px] font-bold text-ink-soft uppercase mb-1 tracking-wider">Active Rooms &middot; Click to preview</div>
                  <div 
                    onClick={() => setSelectedTalkRoom(selectedTalkRoom === "Exam Season" ? null : "Exam Season")}
                    className={`border border-line rounded-xl p-3.5 flex flex-col gap-2 text-sm cursor-pointer hover:border-gold transition-all shadow-sm ${selectedTalkRoom === "Exam Season" ? "bg-white" : "bg-[#FAF8F5]"}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-ink">Exam Season</span>
                      <span className="bg-ember/5 text-ember font-bold px-2 py-0.5 rounded-full text-[10px]">31 here</span>
                    </div>
                    {selectedTalkRoom === "Exam Season" && (
                      <div className="mt-2.5 pt-2.5 border-t border-line/45 text-xs text-ink-soft font-serif space-y-1 bg-paper/10 p-2 rounded-lg italic">
                        {talkPreviews["Exam Season"].map((msg, i) => <div key={i}>{msg}</div>)}
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={() => setSelectedTalkRoom(selectedTalkRoom === "The 3am Club" ? null : "The 3am Club")}
                    className={`border border-line rounded-xl p-3.5 flex flex-col gap-2 text-sm cursor-pointer hover:border-gold transition-all shadow-sm ${selectedTalkRoom === "The 3am Club" ? "bg-white" : "bg-[#FAF8F5]"}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-ink">The 3am Club</span>
                      <span className="bg-ember/5 text-ember font-bold px-2 py-0.5 rounded-full text-[10px]">18 here</span>
                    </div>
                    {selectedTalkRoom === "The 3am Club" && (
                      <div className="mt-2.5 pt-2.5 border-t border-line/45 text-xs text-ink-soft font-serif space-y-1 bg-paper/10 p-2 rounded-lg italic">
                        {talkPreviews["The 3am Club"].map((msg, i) => <div key={i}>{msg}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-line flex justify-between items-center text-xs font-bold text-ink-soft">
                <span>Anonymous. Moderated. Real people.</span>
                <button
                  type="button"
                  onClick={() => setToastMessage("Sign in required to browse live moderated TalkMindly rooms.")}
                  className="text-navy hover:underline"
                >
                  Find your space &rarr;
                </button>
              </div>
            </div>

          </div>
          
          <div className="text-center text-sm text-ink-soft font-bold mt-10">
            One when you want to be heard alone. One when you don't want to be alone at all.
          </div>
        </section>

        {/* 7. TalkMindly Trust Strip */}
        <section className="py-16 border-t border-line bg-[#FAF8F5] rounded-[36px] px-6 my-8 shadow-inner">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold tracking-wider text-ember uppercase select-none">TalkMindly Safety</span>
            <h2 className="text-3xl font-serif mt-2 mb-3 font-medium text-ink">Safe enough to be honest.</h2>
            <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-[45ch] mx-auto select-none">
              Opening up is hard. We built TalkMindly to ensure your privacy and safety are guaranteed by default.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mt-10">
              <div className="bg-white border border-line/60 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-teal/5 flex items-center justify-center text-teal mb-4 select-none">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-ink">Complete Anonymity</h4>
                <p className="text-xs text-ink-soft mt-2.5 leading-relaxed">
                  No real names or profiles. When you join a room, you get a temporary random name. Once you leave, the association is permanently erased.
                </p>
              </div>

              <div className="bg-white border border-line/60 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-rose/5 flex items-center justify-center text-rose mb-4 select-none">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-ink">24/7 Moderation</h4>
                <p className="text-xs text-ink-soft mt-2.5 leading-relaxed">
                  Real, trained moderators monitor all rooms around the clock. Hostile or inappropriate messages are filtered instantly to keep spaces safe.
                </p>
              </div>

              <div className="bg-white border border-line/60 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy mb-4 select-none">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-ink">No Private DMs</h4>
                <p className="text-xs text-ink-soft mt-2.5 leading-relaxed">
                  All conversations occur in public, moderated channels. Other users cannot message you privately or follow you across rooms.
                </p>
              </div>

              <div className="bg-white border border-line/60 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center text-gold mb-4 select-none">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-ink">Total Autonomy</h4>
                <p className="text-xs text-ink-soft mt-2.5 leading-relaxed">
                  Read without writing, speak only when you're ready, and leave in one tap. Delete your anonymous postings at any time.
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-ink-soft font-bold mt-8 select-none">
              Anonymous doesn't mean alone. It means safe.
            </div>
          </div>
        </section>

        {/* 8. Final CTA Section */}
        <section className="py-24 border-t border-line">
          <motion.div 
            initial={{ scale: 0.98 }}
            whileInView={{ scale: 1 }}
            className="w-full bg-gradient-to-br from-[#fcf9f2] via-card to-[#f4eee2] border border-line rounded-[42px] p-12 text-center shadow-lg relative overflow-hidden flex flex-col items-center"
          >
            {/* Pulsing glow background decoration */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-coral/5 rounded-full filter blur-2xl animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal/5 rounded-full filter blur-2xl animate-pulse" />

            <span className="text-xs font-bold tracking-wider text-ember uppercase relative z-10 select-none">Start today</span>
            
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-ink mt-3 relative z-10 max-w-[20ch] leading-tight">
              Start with what's true right now.
            </h2>
            
            <p className="text-ink-soft text-sm sm:text-base max-w-[42ch] mx-auto mt-5 font-serif italic relative z-10 leading-relaxed select-none">
              You don't need a map or a plan. Just name the weight you're carrying today. That's the whole first step.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3.5 relative z-10">
              <a
                href="#quick-entry"
                className="rounded-full bg-[#121a30] hover:bg-[#1d2843] text-white px-9 py-4.5 text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md text-center inline-block"
              >
                See how you're feeling
              </a>
              <span className="text-xs text-ink-soft/75 font-semibold tracking-wide select-none">
                Takes a minute. Costs nothing. Fully anonymous.
              </span>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-paper-2/15 py-12 mt-16 text-xs text-ink-soft">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-coral to-ember" />
            <span className="font-serif font-bold text-ink text-sm">WellMindly</span>
          </div>

          <p className="text-center sm:text-left max-w-[50ch] leading-relaxed">
            &copy; {new Date().getFullYear()} WellMindly. All wellbeing tools, assessments, and coaching resources are completely confidential. If you're going through something heavy, please reach out to our emergency pathway.
            <button 
              onClick={() => setShowCrisisModal(true)} 
              className="text-ember font-bold underline ml-1 hover:text-coral transition-colors"
            >
              Need help right now? →
            </button>
          </p>

          <div className="flex gap-4">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Global CSS Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-4.5 rounded-2xl text-xs font-bold shadow-2xl z-50 flex items-center gap-2.5 max-w-[340px]"
          >
            <Sparkles className="w-4 h-4 text-gold shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Pathway Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-paper border border-line rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCrisisModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper-2/40 hover:bg-paper-2/80 transition-colors flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-medium mb-3 text-ember flex items-center gap-2">
                <AlertCircle className="w-6 h-6 shrink-0" />
                In crisis right now?
              </h3>

              <p className="text-ink-soft text-sm leading-relaxed mb-6">
                If things feel like too much this second, you don't have to handle it here or alone. These are real people, available now. Reaching out is the brave part.
              </p>

              <div className="flex flex-col gap-3">
                <div className="bg-white border border-line rounded-2xl p-4.5">
                  <div className="text-xs text-ink-soft font-bold uppercase select-none">National Crisis Hotline</div>
                  <div className="text-lg font-serif font-bold text-ink mt-0.5">Call or Text 988</div>
                  <div className="text-[11px] text-ink-soft mt-1 leading-normal select-none">
                    Free, confidential, and always available.
                  </div>
                </div>

                <div className="bg-white border border-line rounded-2xl p-4.5">
                  <div className="text-xs text-ink-soft font-bold uppercase select-none">Crisis Text Line</div>
                  <div className="text-lg font-serif font-bold text-ink mt-0.5">Text HOME to 741741</div>
                  <div className="text-[11px] text-ink-soft mt-1 leading-normal select-none">
                    Connect to a crisis counselor via text immediately.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => setShowCrisisModal(false)}
                  className="w-full bg-[#121a30] text-white font-bold text-xs py-3.5 rounded-xl hover:bg-[#1d2843] transition-colors"
                >
                  Close panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vetted Coach Session Booking Modal removed as Coaches section is deleted */}

      {/* 60-Second Breathing Space Modal */}
      <AnimatePresence>
        {showBreathOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-paper border border-line rounded-[36px] max-w-sm w-full p-8 shadow-2xl relative text-center flex flex-col items-center justify-between min-h-[420px]"
            >
              <button 
                onClick={handleCloseBreath}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper-2/40 hover:bg-paper-2/80 transition-colors flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#0e7c6e] uppercase">Breathing space</span>
                <div className="text-xs text-ink-soft mt-1 font-semibold">Take a 60-second breath</div>
              </div>

              {/* Breathing Interactive visual */}
              <div className="w-40 h-40 flex items-center justify-center relative my-6">
                <motion.div
                  animate={{
                    scale: breathPhase === "inhale" ? 1.45 : breathPhase === "hold" ? 1.45 : 0.85
                  }}
                  transition={{
                    duration: 3.8,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-[#0e7c6e]/10 border border-[#0e7c6e]/30"
                />
                <motion.div
                  animate={{
                    scale: breathPhase === "inhale" ? 1.25 : breathPhase === "hold" ? 1.25 : 0.95
                  }}
                  transition={{
                    duration: 3.8,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0e7c6e] to-[#7c9473] flex items-center justify-center shadow-lg relative z-10"
                >
                  <span className="text-white text-xs font-bold capitalize select-none">{breathPhase}</span>
                </motion.div>
              </div>

              {/* Sound Controls */}
              <div className="flex items-center gap-2 mb-4 bg-white/40 border border-line/60 rounded-full px-4.5 py-2">
                <Volume2 className="w-4 h-4 text-ink-soft shrink-0" />
                <span className="text-[10px] font-bold text-ink-soft uppercase">Ambient sound</span>
                <button
                  onClick={handleToggleSound}
                  className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center hover:bg-[#1d2843] transition-colors ml-1.5"
                >
                  {isSynthPlaying ? <X className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Pitch and Volume Sliders */}
              <div className="w-full bg-white/40 border border-line/50 rounded-2xl p-4.5 mb-4 text-left flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-ink-soft uppercase tracking-wide">
                    <span>Frequency (Hz)</span>
                    <span>{synthPitch}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="300"
                    value={synthPitch}
                    onChange={(e) => setSynthPitch(parseInt(e.target.value))}
                    className="w-full h-1 bg-paper-2 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-ink-soft uppercase tracking-wide">
                    <span>Gain / Volume</span>
                    <span>{Math.round(synthVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={synthVolume}
                    onChange={(e) => setSynthVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-paper-2 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <div className="text-xs text-ink-soft font-bold">
                  {breathTime} seconds remaining
                </div>
                
                <button
                  onClick={handleCloseBreath}
                  className="w-full bg-[#121a30] text-white font-bold text-xs py-3.5 rounded-xl hover:bg-[#1d2843] transition-colors mt-2"
                >
                  I'm done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Engine Overlay */}
      <AnimatePresence>
        {activeQuizId !== null && (
          <div className="fixed inset-0 z-50 bg-paper/98 overflow-y-auto px-6 py-8 flex flex-col items-center">
            <div className="max-w-xl w-full flex-grow flex flex-col justify-between">
              
              {/* Top header */}
              <div className="flex items-center justify-between pb-4 border-b border-line mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-navy" />
                  <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                    {TESTS[activeQuizId].title}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveQuizId(null);
                    setQuizResult(null);
                  }}
                  className="w-8 h-8 rounded-full bg-paper-2/40 hover:bg-paper-2/80 transition-colors flex items-center justify-center text-ink-soft hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quiz Body */}
              <div className="flex-grow flex flex-col justify-center">
                {quizResult === null ? (
                  // Quiz questions step
                  <div>
                    {/* Progress details */}
                    <div className="flex justify-between items-center text-[10.5px] font-bold text-ink-soft mb-2">
                      <span>Question {quizStep + 1} of {
                        TESTS[activeQuizId].kind === "pairs" 
                          ? (TESTS[activeQuizId].pairs?.length ?? 0) 
                          : TESTS[activeQuizId].kind === "picture"
                          ? 1
                          : (TESTS[activeQuizId].items?.length ?? 0)
                      }</span>
                      <span>{TESTS[activeQuizId].title}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-paper-2/50 rounded-full overflow-hidden mb-8">
                      <div 
                        style={{ 
                          width: `${((quizStep + 1) / (
                            TESTS[activeQuizId].kind === "pairs" 
                              ? (TESTS[activeQuizId].pairs?.length ?? 0)
                              : TESTS[activeQuizId].kind === "picture"
                              ? 1
                              : (TESTS[activeQuizId].items?.length ?? 0)
                          )) * 100}%`,
                          background: TESTS[activeQuizId].accent 
                        }}
                        className="h-full rounded-full transition-all duration-300"
                      />
                    </div>

                    {/* Question text & choices */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={quizStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        {TESTS[activeQuizId].kind === "pairs" ? (
                          // Value pairs Choice
                          <div>
                            <div className="text-ink-soft text-sm font-semibold mb-3">Which pulls you more?</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {TESTS[activeQuizId].pairs![quizStep].map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSelectOption(opt.v)}
                                  className="border border-line rounded-2xl p-6 text-center font-serif text-lg font-medium bg-card hover:border-gold hover:bg-white shadow-sm transition-all hover:-translate-y-0.5 min-h-[120px] flex items-center justify-center"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : TESTS[activeQuizId].kind === "picture" ? (
                          // Mood snapshot face grid
                          <div>
                            <div className="text-ink-soft text-sm font-semibold mb-5">Which feels most like right now?</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {TESTS[activeQuizId].options?.map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSelectOption(opt)}
                                  style={{ background: `linear-gradient(140deg, ${opt.c1}, ${opt.c2})` }}
                                  className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 text-white font-bold text-xs shadow-sm hover:-translate-y-1 transition-all border-none"
                                >
                                  {getTestIconSvg(opt.ic)}
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Standard Likert scale question
                          <div>
                            <div className="text-ink-soft text-sm font-semibold mb-3">
                              {TESTS[activeQuizId].intro}
                            </div>
                            <h2 className="font-serif text-2xl font-medium leading-snug mb-8">
                              {TESTS[activeQuizId].items![quizStep].q}
                            </h2>

                            <div className="flex flex-col gap-3">
                              {L5.map(([label, val]) => (
                                <button
                                  key={val}
                                  onClick={() => handleSelectOption(val)}
                                  className={`w-full flex items-center gap-4 text-left border rounded-2xl p-4.5 text-sm font-bold transition-all ${
                                    quizAnswers[quizStep] === val 
                                      ? "bg-white border-gold shadow-sm" 
                                      : "bg-card border-line hover:border-gold"
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                    quizAnswers[quizStep] === val 
                                      ? "border-navy bg-navy" 
                                      : "border-line"
                                  }`}>
                                    {quizAnswers[quizStep] === val && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </span>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Back button */}
                    <div className="flex justify-between items-center mt-10 pt-4 border-t border-line">
                      <button
                        onClick={() => {
                          if (quizStep > 0) {
                            setQuizStep(prev => prev - 1);
                          }
                        }}
                        className={`text-xs font-bold text-ink-soft hover:text-ink transition-colors flex items-center gap-1 ${
                          quizStep === 0 ? "visibility-hidden opacity-0 pointer-events-none" : ""
                        }`}
                      >
                        &larr; Back
                      </button>
                    </div>
                  </div>
                ) : (
                  // Quiz results display
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pb-12"
                  >
                    {activeQuizId === "mood" ? (
                      // Mood snapshot payoff
                      <div className="text-center">
                        <h2 className="font-serif text-3xl font-medium mb-3">
                          {quizResult.selected.label}.
                        </h2>
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 shadow-md" style={{ background: `linear-gradient(140deg, ${quizResult.selected.c1}, ${quizResult.selected.c2})` }} />
                        <p className="text-ink-soft text-base leading-relaxed max-w-[40ch] mx-auto mb-8">
                          Noted — today felt <b>{quizResult.selected.label.toLowerCase()}</b>. That's a tile on your moodboard now. The pattern over days tells the real story.
                        </p>
                      </div>
                    ) : activeQuizId === "values" ? (
                      // Values payoff
                      <div>
                        <h2 className="font-serif text-3xl font-medium text-center mb-1">
                          What you <em className="text-coral italic font-normal font-serif">value</em> most.
                        </h2>
                        <p className="text-ink-soft text-sm text-center mb-8">
                          {VALUE_DESC[quizResult.top[0]]}
                        </p>

                        {/* Share Card */}
                        <div className="flex justify-center mb-8">
                          <div 
                            id="share-card-container"
                            style={{ background: `linear-gradient(135deg, ${TESTS.values.accent}, ${shadeColor(TESTS.values.accent)})` }}
                            className="w-[280px] rounded-3xl p-6.5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[1.58/1]"
                          >
                            <div>
                              <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">I lead with</span>
                              <h4 className="text-2xl font-serif font-bold leading-tight mt-1">
                                {quizResult.top.join(" & ")}
                              </h4>
                            </div>
                            <span className="text-[10px] opacity-80 tracking-wide font-medium mt-6 self-start">
                              WellMindly self-reflection
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center gap-3.5 mb-8">
                          <button
                            onClick={exportResultCard}
                            disabled={isExporting}
                            className="rounded-full bg-navy text-white px-6 py-3 text-xs font-bold flex items-center gap-1.5 hover:bg-[#1d2843] transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            {isExporting ? "Saving..." : "Save my card"}
                          </button>
                          <button
                            onClick={() => handleSelectQuiz(activeQuizId)}
                            className="rounded-full border border-line bg-card px-6 py-3 text-xs font-bold text-ink hover:bg-white transition-colors"
                          >
                            Take again
                          </button>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white border border-line rounded-2xl p-6 shadow-sm">
                          <div className="text-xs font-bold text-ink-soft uppercase mb-4">Values breakdowns</div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(quizResult.tally).map(([v, count]) => (
                              <span key={v} className="bg-paper-2/40 text-ink-soft font-semibold text-xs px-3.5 py-1.5 rounded-full">
                                {v} &middot; {count as number}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : activeQuizId === "strengthshadow" ? (
                      // Strength & Shadow payoff
                      <div>
                        {(() => {
                          const config = TESTS.strengthshadow;
                          const topType = quizResult.top[0];
                          const detail = config.types![topType];
                          return (
                            <div>
                              <h2 className="font-serif text-3xl font-medium text-center mb-1">
                                You're <em className="text-coral italic font-normal font-serif">{topType}</em>.
                              </h2>
                              <p className="text-ink-soft text-sm text-center mb-8">
                                {detail.desc}
                              </p>

                              {/* Share Card */}
                              <div className="flex justify-center mb-8">
                                <div 
                                  id="share-card-container"
                                  style={{ background: `linear-gradient(135deg, ${config.accent}, ${shadeColor(config.accent)})` }}
                                  className="w-[280px] rounded-3xl p-6.5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[1.58/1]"
                                >
                                  <div>
                                    <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">My core strength</span>
                                    <h4 className="text-2xl font-serif font-bold leading-tight mt-1">
                                      {topType}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] opacity-80 tracking-wide font-medium mt-6 self-start">
                                    {detail.tag} &middot; WellMindly
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-center gap-3.5 mb-8">
                                <button
                                  onClick={exportResultCard}
                                  disabled={isExporting}
                                  className="rounded-full bg-navy text-white px-6 py-3 text-xs font-bold flex items-center gap-1.5 hover:bg-[#1d2843] transition-colors"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                  {isExporting ? "Saving..." : "Save my card"}
                                </button>
                                <button
                                  onClick={() => handleSelectQuiz(activeQuizId)}
                                  className="rounded-full border border-line bg-card px-6 py-3 text-xs font-bold text-ink hover:bg-white transition-colors"
                                >
                                  Take again
                                </button>
                              </div>

                              {/* Insights details */}
                              <div className="flex flex-col gap-3">
                                {detail.a && (
                                  <div className="border-l-4 border-teal bg-white rounded-r-2xl p-4 shadow-sm">
                                    <div className="text-[10px] text-ink-soft font-bold uppercase">{detail.a.label}</div>
                                    <p className="text-xs text-ink mt-1 font-medium leading-normal">{detail.a.text}</p>
                                  </div>
                                )}
                                {detail.b && (
                                  <div className="border-l-4 border-[#d97706] bg-white rounded-r-2xl p-4 shadow-sm">
                                    <div className="text-[10px] text-ink-soft font-bold uppercase">{detail.b.label}</div>
                                    <p className="text-xs text-ink mt-1 font-medium leading-normal">{detail.b.text}</p>
                                  </div>
                                )}
                                {detail.tip && (
                                  <div className="border-l-4 border-navy bg-white rounded-r-2xl p-4 shadow-sm">
                                    <div className="text-[10px] text-ink-soft font-bold uppercase">Try this</div>
                                    <p className="text-xs text-ink mt-1 font-medium leading-normal">{detail.tip}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : activeQuizId === "checkin" ? (
                      // Emotional check-in payoff
                      <div>
                        {(() => {
                          const scoresList = Object.values(quizResult.scores) as number[];
                          const overall = Math.round(scoresList.reduce((a: number, b: number) => a + b, 0) / scoresList.length);
                          const toneWord = overall >= 73 ? "in good spirits" : overall >= 51 ? "finding your footing" : overall >= 29 ? "running a little low" : "in a heavier stretch";
                          const showNote = overall <= 40;
                          
                          return (
                            <div>
                              <h2 className="font-serif text-3xl font-medium text-center mb-1">
                                Today you seem <em className="text-coral italic font-normal font-serif">{toneWord}</em>.
                              </h2>
                              <p className="text-ink-soft text-sm text-center mb-8">
                                A snapshot check-in, not a diagnostic verdict. The real value is watching the patterns shift.
                              </p>

                              {/* Progress breakdown bars */}
                              <div className="bg-white border border-line rounded-3xl p-6 shadow-sm mb-6 flex flex-col gap-4">
                                <div className="text-xs font-bold text-ink-soft uppercase mb-1">Your snapshot indicators</div>
                                {Object.entries(quizResult.scores).map(([d, val]: any) => (
                                  <div key={d} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                      <span className="text-ink">{d}</span>
                                      <span className="text-ink-soft">{val >= 75 ? "solid" : val >= 50 ? "developing" : "room to grow"}</span>
                                    </div>
                                    <div className="h-2 w-full bg-paper-2/40 rounded-full overflow-hidden">
                                      <div 
                                        style={{ width: `${val}%`, backgroundColor: TESTS.checkin.accent }}
                                        className="h-full rounded-full transition-all duration-500"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {showNote && (
                                <div className="border-l-4 border-[#b06a78] bg-white rounded-r-2xl p-4.5 shadow-sm mb-6">
                                  <h4 className="text-[10px] text-[#b06a78] font-bold uppercase">A gentle note</h4>
                                  <p className="text-xs text-ink leading-relaxed mt-1 font-medium">
                                    This looks like a heavier stretch. Be kind to yourself today — and if it sticks around, talking to an advisor or someone you trust can help.
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      // Profile/Rank tests (Signature strengths, Personality profile)
                      <div>
                        {activeQuizId === "strengths" ? (
                          // Signature Strengths payoff
                          <div>
                            <h2 className="font-serif text-3xl font-medium text-center mb-1">
                              Your signature <em className="text-coral italic font-normal font-serif">strengths</em>.
                            </h2>
                            <p className="text-ink-soft text-sm text-center mb-8">
                              These are the core qualities you lead with. Leaning into them is one of the most reliable ways to feel clearer.
                            </p>

                            {/* Share card */}
                            <div className="flex justify-center mb-8">
                              <div 
                                id="share-card-container"
                                style={{ background: `linear-gradient(135deg, ${TESTS.strengths.accent}, ${shadeColor(TESTS.strengths.accent)})` }}
                                className="w-[280px] rounded-3xl p-6.5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
                              >
                                <div>
                                  <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase mb-4 block">My signature strengths</span>
                                  <div className="flex flex-col gap-2.5">
                                    {(quizResult.top as string[]).map((st, i) => (
                                      <div key={i} className="flex items-center gap-2 text-sm font-semibold">
                                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                        {st}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <span className="text-[10px] opacity-80 tracking-wide font-medium mt-8 self-start">
                                  WellMindly self-reflection
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-center gap-3.5 mb-8">
                              <button
                                onClick={exportResultCard}
                                disabled={isExporting}
                                className="rounded-full bg-navy text-white px-6 py-3 text-xs font-bold flex items-center gap-1.5 hover:bg-[#1d2843] transition-colors"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                {isExporting ? "Saving..." : "Save my card"}
                              </button>
                              <button
                                onClick={() => handleSelectQuiz(activeQuizId)}
                                className="rounded-full border border-line bg-card px-6 py-3 text-xs font-bold text-ink hover:bg-white transition-colors"
                              >
                                Take again
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Personality profile payoff
                          <div>
                            {(() => {
                              const r = quizResult.ranked;
                              const topTwo = [r[0][0], r[1][0]];
                              const matchedArch = ARCHETYPE.find(a => a.when.every(w => topTwo.includes(w))) || { name: `The ${r[0][0]}`, desc: `You lead with ${r[0][0].toLowerCase()}.` };
                              
                              return (
                                <div>
                                  <h2 className="font-serif text-3xl font-medium text-center mb-1">
                                    You're <em className="text-coral italic font-normal font-serif">{matchedArch.name}</em>.
                                  </h2>
                                  <p className="text-ink-soft text-sm text-center mb-8">
                                    {matchedArch.desc}
                                  </p>

                                  <div className="flex justify-center gap-3.5 mb-8">
                                    <button
                                      onClick={() => handleSelectQuiz(activeQuizId)}
                                      className="rounded-full border border-line bg-card px-6 py-3 text-xs font-bold text-ink hover:bg-white transition-colors"
                                    >
                                      Take again
                                    </button>
                                  </div>

                                  {/* Progress bar break down */}
                                  <div className="bg-white border border-line rounded-3xl p-6 shadow-sm mb-6 flex flex-col gap-4">
                                    <div className="text-xs font-bold text-ink-soft uppercase mb-1">How it broke down</div>
                                    {r.map(([d, val]: any) => (
                                      <div key={d} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-xs font-semibold">
                                          <span className="text-ink">{d}</span>
                                          <span className="text-ink-soft">{val >= 75 ? "solid strength" : val >= 50 ? "steady" : "developing"}</span>
                                        </div>
                                        <div className="h-2 w-full bg-paper-2/40 rounded-full overflow-hidden">
                                          <div 
                                            style={{ width: `${val}%`, backgroundColor: TESTS.bigfive.accent }}
                                            className="h-full rounded-full transition-all duration-500"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Close options */}
                    <div className="flex justify-center gap-3 mt-4 pt-6 border-t border-line">
                      <button
                        onClick={() => {
                          setActiveQuizId(null);
                          setQuizResult(null);
                        }}
                        className="rounded-full bg-navy text-white px-6 py-3 text-xs font-bold hover:bg-[#1d2843] transition-colors"
                      >
                        Back to tests
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen WriteMindly Focus Mode Overlay */}
      <AnimatePresence>
        {fullscreenWrite && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121a30] text-[#f4eee2] flex flex-col justify-between p-6 sm:p-12"
          >
            {/* Background grain effect overlay specifically for dark zen writing */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-repeat bg-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")` }} />

            <div className="flex justify-between items-center w-full max-w-4xl mx-auto z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-serif text-sm tracking-wide font-medium">WriteMindly Focus</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Typing sound toggle */}
                <button 
                  onClick={() => setTypingSound(!typingSound)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full hover:bg-white/15 transition-all"
                >
                  🔊 Keyboard pop: {typingSound ? "ON" : "OFF"}
                </button>
                {/* Close Button */}
                <button 
                  onClick={() => setFullscreenWrite(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center z-10 my-8">
              <textarea
                autoFocus
                placeholder="The page is blank. No guidance. No expectations. Just write whatever is in your head..."
                value={writeText}
                onChange={(e) => {
                  setWriteText(e.target.value);
                  playTypeSound();
                }}
                className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-serif italic text-[#f4eee2] h-96 resize-none focus:outline-none placeholder:text-[#f4eee2]/20 leading-relaxed"
              />
            </div>

            <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-6 z-10 text-xs text-[#f4eee2]/60 font-semibold">
              <span>{writeText.trim().split(/\s+/).filter(Boolean).length} words typed</span>
              <span>Fully private. Your writing is never saved or sent to any server.</span>
              <button 
                onClick={() => {
                  setWriteText("");
                  setToastMessage("Page cleared. Take a fresh start.");
                }}
                className="text-emerald-400 hover:underline"
              >
                Clear page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
