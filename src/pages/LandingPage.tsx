import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";

function AnimatedNumber({ value, suffix = "", className = "" }: { value: number, suffix?: string, className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = Math.round(v).toLocaleString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value, suffix]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
import { 
  Heart, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Users, 
  Award,
  BookOpen,
  Compass,
  Clock,
  ChevronDown,
  Smile,
  Zap,
  HelpCircle,
  MessageSquare
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  // State for interactive features
  const [selectedFocus, setSelectedFocus] = useState<string>("academic");
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true, // first open by default
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const focusAreas = [
    {
      id: "academic",
      label: "Academic Burnout & Stress",
      title: "Master Your Academic Workload",
      description: "Get personalized consultation on dealing with high exam stress, managing thesis loads, and overcoming performance anxiety with structured time-boxing and cognitive framing.",
      icon: BookOpen,
      metric: "45% reduction in study anxiety"
    },
    {
      id: "social",
      label: "Relationships & Social Anxiety",
      title: "Build Authentic Connections",
      description: "Address roommate friction, navigate social transitions, and consult on building strong peer networks on campus with actionable dialogue and boundary-setting strategies.",
      icon: Users,
      metric: "92% reported improved relationships"
    },
    {
      id: "direction",
      label: "Life & Career Compass",
      title: "Clarity on What Lies Ahead",
      description: "Struggling with post-graduation uncertainty? Our wellness consultants provide structured goal-setting, value mapping, and emotional anchors for final-year students.",
      icon: Compass,
      metric: "88% felt more confident in their goals"
    },
    {
      id: "habits",
      label: "Mindful Focus & Sleep Habits",
      title: "Reclaim Your Energy",
      description: "Receive practical consultations on fixing irregular college sleep cycles, overcoming digital distractions, and focus optimization for deep-work student sessions.",
      icon: Zap,
      metric: "Average sleep quality score rose by 30%"
    }
  ];

  const currentFocusData = focusAreas.find(f => f.id === selectedFocus) || focusAreas[0];

  const faqs = [
    {
      q: "Is WellMindly a therapy or clinical treatment service?",
      a: "No. WellMindly provides private well-being consultations, academic stress advising, and mindfulness coaching tailored for students. We do not provide clinical therapy or medical psychiatric treatments. For students requiring clinical mental health support or crisis intervention, we provide immediate, seamless referrals to authorized university health services or external professionals."
    },
    {
      q: "Is my personal data shared with my university or professors?",
      a: "Absolutely not. Privacy is our highest priority. All consultations, assessment scores, and messages are completely confidential and protected. Your university, professors, and family will never have access to your data or profile."
    },
    {
      q: "How does the matching process work for students?",
      a: "You start by taking a private 10-minute well-being framework assessment. Based on your stress factors and coping styles, we match you with a certified Well-being Advisor who specializes in student psychology and campus life adjustment."
    },
    {
      q: "Are the consultations free for students?",
      a: "Yes! WellMindly partners with major universities. If your university is a partner, all consultations, assessments, and peer wellness resources are 100% covered. You just sign in with your school account to verify coverage."
    },
    {
      q: "What methods of consultation can I use?",
      a: "You can consult on your terms: write unlimited secure text messages, schedule live audio/video calls with your advisor, or interact with our self-guided mindfulness worksheets anytime."
    }
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 60, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#6EE7B7]/30 selection:text-slate-900 overflow-x-hidden">
      
      {/* Global CSS for smooth scrolling and base layout */}
      <style dangerouslySetInnerHTML={{__html: `
        html {
          scroll-behavior: smooth;
        }
      `}} />

      {/* Persistent Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-xl transition-all duration-300"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-[#6EE7B7] text-white shadow-md shadow-blue-500/10"
            >
              <Heart className="h-5 w-5 fill-current" />
            </motion.div>
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-tight text-blue-900 transition-colors hover:text-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
            >
              WellMindly
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
              {['How It Works', 'Focus Areas', 'Campus Comparison', 'FAQs'].map((item, idx) => (
                <a 
                  key={idx}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1"
                >
                  {item}
                </a>
              ))}
            </nav>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Sign in to your student account"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:py-28" aria-labelledby="hero-heading">
          {/* Animated Background Blobs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-1/12 -z-10 h-96 w-96 rounded-full bg-[#6EE7B7] blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-1/12 -z-10 h-[500px] w-[500px] rounded-full bg-blue-300 blur-3xl" 
          />

          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 md:grid-cols-2">
            
            {/* Left Column: Text Content */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="flex flex-col items-start text-left"
            >
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold tracking-wide text-blue-800 border border-blue-100/50">
                <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
                <span>Empowering Students Aged 18 to 23</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                id="hero-heading"
                className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
              >
                You deserve to feel balanced. <br />
                <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  Private Well-being
                </span> <br />
                Consultations for Students.
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
                Address academic burnout, transition stress, and anxiety on your own terms. Get matched with professional wellness coaches trained in high-pressure university systems. Confidential, flexible, and evidence-backed.
              </motion.p>

              {/* Interactive CTA Button */}
              <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative">
                {/* Glow effect behind button */}
                <motion.div 
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-[#6EE7B7] blur-xl"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="group relative flex items-center justify-center gap-2 rounded-2xl bg-[#6EE7B7] px-8 py-4 text-base font-bold text-slate-950 shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#6EE7B7]/50"
                  aria-label="Find an advisor and start assessment"
                >
                  Take Free Assessment Now
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </motion.button>
              </motion.div>

              {/* Compliance & Security Badge */}
              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-8 w-full">
                <div className="flex items-center gap-2.5">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">100% Confidential Support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Matched in under 24 hours</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Framer Motion SVG Art & Widgets */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-lg aspect-square">
                {/* Glassmorphic Background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-300/10 to-teal-300/10 blur-xl" />

                <svg
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-2xl"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="gradientB" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A8A" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient id="gradientT" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6EE7B7" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="gradientG" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  {/* Backdrop */}
                  <circle cx="250" cy="250" r="180" fill="white" fillOpacity="0.45" stroke="#E2E8F0" strokeWidth="2" />
                  
                  {/* Floating abstract rings */}
                  <motion.g 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "250px", originY: "250px" }}
                  >
                    <circle cx="250" cy="250" r="140" stroke="url(#gradientT)" strokeWidth="2" strokeDasharray="12 18" opacity="0.4" />
                    <circle cx="250" cy="250" r="200" stroke="url(#gradientB)" strokeWidth="1.5" strokeDasharray="5 10" opacity="0.35" />
                  </motion.g>

                  {/* Layered Zen Stones with individual Framer Motion loops */}
                  <g>
                    {/* Bottom Stone */}
                    <ellipse cx="250" cy="370" rx="90" ry="28" fill="url(#gradientB)" opacity="0.8" />
                    
                    {/* Middle Stone */}
                    <motion.ellipse 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      cx="252" cy="315" rx="72" ry="24" fill="url(#gradientT)" opacity="0.85" 
                    />
                    
                    {/* Top Stone */}
                    <motion.ellipse 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      cx="248" cy="268" rx="55" ry="18" fill="url(#gradientB)" 
                    />
                    
                    {/* Peak Wellness Sphere */}
                    <motion.circle 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      cx="250" cy="225" r="16" fill="url(#gradientG)" 
                    />
                  </g>

                  {/* Sprouting leaves */}
                  <motion.g 
                    animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    style={{ originX: "250px", originY: "210px" }}
                  >
                    <path d="M250 210 C240 170 210 160 195 175 C210 190 235 195 250 210 Z" fill="#6EE7B7" />
                    <path d="M250 210 C260 170 290 160 305 175 C290 190 265 195 250 210 Z" fill="#10B981" />
                  </motion.g>

                  {/* Sparkling gold clarity stars */}
                  <motion.g 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M140 190 L142 195 L147 197 L142 199 L140 204 L138 199 L133 197 L138 195 Z" fill="#F59E0B" />
                    <path d="M360 220 L362 225 L367 227 L362 229 L360 234 L358 229 L353 227 L358 225 Z" fill="#F59E0B" opacity="0.75" />
                    <path d="M290 120 L292 125 L297 127 L292 129 L290 134 L288 129 L283 127 L288 125 Z" fill="#F59E0B" />
                  </motion.g>

                  {/* Wave lines */}
                  <motion.path 
                    animate={{ d: ["M70 330 C170 210 330 420 430 240", "M70 330 C170 230 330 400 430 240", "M70 330 C170 210 330 420 430 240"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    stroke="url(#gradientT)" strokeWidth="6" strokeLinecap="round" opacity="0.55" fill="none"
                  />
                  <motion.path 
                    animate={{ d: ["M80 335 C175 220 325 410 420 245", "M80 335 C175 240 325 390 420 245", "M80 335 C175 220 325 410 420 245"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    stroke="url(#gradientB)" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none"
                  />
                </svg>

                {/* Floating Widgets with Framer Motion hover */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                  className="absolute -bottom-4 -left-4 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Interactive Consultation</div>
                    <div className="text-sm font-bold text-slate-800">24/7 Advisor Chat</div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                  className="absolute -top-4 -right-4 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-lg flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                    <Smile className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Verified Reviews</div>
                    <div className="text-sm font-bold text-slate-800">98% Positive Feedback</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Counters Section - Scroll Reveal */}
        <section id="numbers" className="bg-slate-900 py-16 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(35rem_35rem_at_top,theme(colors.blue.800),theme(colors.slate.900))] opacity-50" />
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-7xl px-6 sm:px-8 relative z-10"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                The world's largest student well-being framework.
              </h2>
              <p className="mt-4 text-base text-slate-400 font-medium">
                We focus on preventative health and dynamic coaching support, accessible from anywhere at any time.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center border-t border-slate-800 pt-12">
              {[
                { value: 125000, suffix: "+", text: "Consultations Done" },
                { value: 450, suffix: "+", text: "Vetted Wellness Coaches" },
                { value: 98, suffix: "%", text: "Student Success Rate" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  variants={scaleIn}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center cursor-default"
                >
                  <AnimatedNumber 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    className="text-4xl font-extrabold text-[#6EE7B7] sm:text-5xl" 
                  />
                  <span className="mt-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
                    {stat.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section - Scroll Reveal */}
        <section id="how-it-works" className="py-24 bg-white" aria-labelledby="steps-heading">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 id="steps-heading" className="text-base font-bold leading-7 text-blue-600 uppercase tracking-wide">
                Simple Setup
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How WellMindly works for you
              </p>
              <p className="mt-4 text-lg text-slate-600">
                You get to consult when, where, and how you want. No friction, no judgment.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mx-auto mt-16 max-w-none lg:max-w-7xl"
            >
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Take a 10-Minute Assessment",
                    desc: "Analyze your cognitive load, anxiety indicators, and lifestyle framework. Secure and 100% private.",
                    icon: Shield,
                    color: "border-teal-500/20 bg-teal-50/40 text-teal-600"
                  },
                  {
                    step: "02",
                    title: "Match with a Student Coach",
                    desc: "We assign a coach specializing in academic stress, goal-setting, sleep, and emotional patterns.",
                    icon: Users,
                    color: "border-blue-500/20 bg-blue-50/40 text-blue-600"
                  },
                  {
                    step: "03",
                    title: "Consult on Your Own Terms",
                    desc: "Text privately in a secure room, schedule dynamic audio/video sessions, and view actionable tips.",
                    icon: MessageSquare,
                    color: "border-purple-500/20 bg-purple-50/40 text-purple-600"
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.1)" }}
                    className="relative flex flex-col items-start p-8 rounded-3xl border border-slate-100 bg-slate-50/50 transition-colors hover:border-slate-300"
                  >
                    <span className="absolute top-6 right-8 text-5xl font-extrabold text-slate-200/80 leading-none select-none">
                      {item.step}
                    </span>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.color} mb-6`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Focus Areas Interactive Section */}
        <section id="interactive-focus" className="py-24 bg-slate-50 overflow-hidden relative">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-base font-bold leading-7 text-blue-600 uppercase tracking-wide">
                Targeted Wellness
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                What support do you need today?
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Explore how specialized well-being consultations address core stressors unique to college life.
              </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Tab Selector Links */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="lg:col-span-5 flex flex-col gap-3"
              >
                {focusAreas.map((focus) => {
                  const IconComp = focus.icon;
                  const isSelected = focus.id === selectedFocus;
                  return (
                    <motion.button
                      variants={fadeInUp}
                      key={focus.id}
                      onClick={() => setSelectedFocus(focus.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-colors duration-300 outline-none ${
                        isSelected 
                          ? "bg-white shadow-md border-transparent" 
                          : "bg-slate-100/50 border-transparent hover:bg-slate-200/50"
                      }`}
                      style={{ position: "relative" }}
                    >
                      {/* Active State Background Outline utilizing framer-motion layoutId for magic move */}
                      {isSelected && (
                        <motion.div 
                          layoutId="activeTabOutline"
                          className="absolute inset-0 border-2 border-blue-500 rounded-2xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <motion.div 
                        animate={{
                          backgroundColor: isSelected ? "#2563EB" : "#E2E8F0",
                          color: isSelected ? "#FFFFFF" : "#334155"
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl relative z-10"
                      >
                        <IconComp className="h-5 w-5" />
                      </motion.div>
                      <span className={`text-base font-bold relative z-10 transition-colors duration-300 ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                        {focus.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Tab Visual Panel with Framer Motion AnimatePresence */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-lg relative min-h-[300px] flex flex-col justify-between overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedFocus} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100 mb-6">
                      <Check className="h-3.5 w-3.5" />
                      <span>{currentFocusData.metric}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {currentFocusData.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {currentFocusData.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-700">Preventative coaching strategy</span>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300 group"
                  >
                    Select this area
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Chart Section */}
        <section id="comparison" className="py-24 bg-white" aria-labelledby="comparison-heading">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 id="comparison-heading" className="text-base font-bold leading-7 text-blue-600 uppercase tracking-wide">
                Why WellMindly
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Consultation vs. Campus counseling
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Traditional services struggle to handle student schedules. We provide scalable wellness options configured for student success.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-16 overflow-hidden rounded-3xl border border-slate-200 shadow-md"
            >
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-5 font-bold text-sm sm:text-base">Support Channels</th>
                    <th className="p-5 font-bold text-sm sm:text-base bg-gradient-to-r from-blue-900 to-teal-900 border-l border-white/10">WellMindly Support</th>
                    <th className="p-5 font-bold text-sm sm:text-base border-l border-white/10">Campus Therapy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm sm:text-base text-slate-700">
                  {[
                    {
                      feat: "Matching timeline",
                      wm: "Immediate (Under 24 Hours)",
                      cm: "2 to 6 weeks waitlist"
                    },
                    {
                      feat: "Session medium",
                      wm: "Chat, Audio, Video, unlimited secure messages",
                      cm: "Only rigid in-person scheduled hours"
                    },
                    {
                      feat: "Confidentiality protection",
                      wm: "100% Private (never shared with school)",
                      cm: "Can bleed into official institutional logs"
                    },
                    {
                      feat: "Pricing & Coverage",
                      wm: "Free or covered via partner university",
                      cm: "High fees once initial sessions cap"
                    },
                    {
                      feat: "Legal Focus & Framework",
                      wm: "Direct student consultation & habit coaching",
                      cm: "Clinical diagnostics (high operational friction)"
                    }
                  ].map((row, idx) => (
                    <motion.tr 
                      key={idx} 
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                      className="transition-colors duration-200"
                    >
                      <td className="p-5 font-bold text-slate-900">{row.feat}</td>
                      <td className="p-5 text-emerald-700 bg-emerald-50/10 font-bold border-l border-slate-100">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{row.wm}</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 border-l border-slate-100">{row.cm}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Real Student Testimonials - Scroll Reveal Staggered */}
        <section className="py-24 bg-slate-50" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 id="testimonials-heading" className="text-base font-bold leading-7 text-blue-600 uppercase tracking-wide">
                Student Voices
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Real student outcomes
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Read how students aged 18 to 23 moved from academic overload to proactive clarity.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {[
                {
                  quote: "Between exams, roommate issues, and choosing a major, my stress was hitting a wall. My WellMindly advisor helped me create a solid sleeping framework and boundaries. It literally changed my second semester.",
                  author: "Siddharth, 20",
                  role: "Computer Science Sophomore",
                  tag: "Academic Burnout"
                },
                {
                  quote: "I was super skeptical about text-based support, but it actually rules. I can message my coach during stress spikes before class and get structured wellness tips in minutes. Fully confidential, too.",
                  author: "Emily, 19",
                  role: "Biochemistry Freshman",
                  tag: "Social Anxiety"
                },
                {
                  quote: "The Life Compass consultations really grounded me. Graduation felt like a giant looming cloud. My advisor set up goal frameworks that broke it down into daily routines. Couldn't recommend it enough.",
                  author: "Marcus, 22",
                  role: "Finance Senior",
                  tag: "Career Stress"
                }
              ].map((t, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
                >
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-6">
                      {t.tag}
                    </span>
                    <p className="text-slate-600 leading-relaxed italic text-sm sm:text-base">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t.author}</div>
                      <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQs Section with Framer Motion Accordion Heights */}
        <section id="faqs" className="py-24 bg-white" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 id="faq-heading" className="text-base font-bold leading-7 text-blue-600 uppercase tracking-wide">
                Answering Queries
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Here are critical details regarding WellMindly's preventative student framework.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mx-auto mt-16 max-w-3xl divide-y divide-slate-200"
            >
              {faqs.map((faq, idx) => {
                const isOpen = !!faqOpen[idx];
                return (
                  <motion.div key={idx} variants={fadeInUp} className="py-6">
                    <dt>
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="flex w-full items-start justify-between text-left text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md py-1"
                        aria-controls={`faq-answer-${idx}`}
                        aria-expanded={isOpen}
                      >
                        <span className="text-base sm:text-lg font-bold flex items-center gap-2.5 transition-colors duration-300 hover:text-blue-900">
                          <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                          {faq.q}
                        </span>
                        <motion.span 
                          animate={{ rotate: isOpen ? -180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`ml-6 flex h-7 items-center text-slate-400 ${isOpen ? "text-blue-500" : ""}`}
                        >
                          <ChevronDown className="h-6 w-6" />
                        </motion.span>
                      </button>
                    </dt>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.dd 
                          id={`faq-answer-${idx}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 pr-12 text-sm sm:text-base leading-relaxed text-slate-600">
                            {faq.a}
                          </p>
                        </motion.dd>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative isolate overflow-hidden bg-slate-950 py-24 sm:py-32" aria-labelledby="footer-cta-heading">
          {/* Backdrop radial gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.950),theme(colors.slate.950))] opacity-100" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 blur-3xl" 
          />

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center px-6 sm:px-8"
          >
            <motion.h2 variants={fadeInUp} id="footer-cta-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to take charge of your wellness framework?
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Start your secure 10-minute assessment now. Connect with a verified well-being consultant tailored to student schedules.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="group relative z-10 rounded-2xl bg-[#6EE7B7] px-8 py-4 text-base font-bold text-slate-950 shadow-md transition-colors hover:bg-[#5cd4a4] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#6EE7B7]/50 w-full sm:w-auto"
                aria-label="Start your student well-being assessment"
              >
                Get Started Free
              </motion.button>
              {/* Pulsing button glow */}
              <motion.div 
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 rounded-3xl bg-[#6EE7B7] blur-2xl z-0 sm:hidden"
              />
              <a 
                href="#faqs" 
                className="text-sm font-semibold text-white hover:text-slate-300 transition-colors duration-300 px-4 py-2 z-10"
              >
                Learn more details &rarr;
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.div>
            <span className="text-base font-bold tracking-tight text-white">WellMindly</span>
          </div>
          <p className="text-xs max-w-md text-center md:text-left leading-normal">
            &copy; {new Date().getFullYear()} WellMindly Inc. WellMindly provides wellness consultation and coach advising. We do not provide clinical therapy, crisis intervention, medical advice, or psychiatric treatment.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
