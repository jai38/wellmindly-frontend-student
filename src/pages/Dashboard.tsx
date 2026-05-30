import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  Calendar,
  Menu,
  X,
  LogOut,
  Heart,
  ChevronRight,
  Smile,
  Clock,
  Sparkles,
  ClipboardList,
  Video,
  Star,
  Activity,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { AssessmentWizard } from "../components/AssessmentWizard";


export function Dashboard() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [greeting, setGreeting] = useState("Welcome back");
  const [dailyMood, setDailyMood] = useState<number | null>(null);
  const [showScreening, setShowScreening] = useState(false);

  // Get user details
  const firstName = user?.firstName || "Student";
  const lastName = user?.lastName || "";
  const email = user?.email || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "S";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const menuItems = [
    { id: "overview", label: "Dashboard Home", icon: LayoutDashboard },
    { id: "assessments", label: "My Quiz Results", icon: ClipboardList },
    { id: "counseling", label: "Consultation Sessions", icon: Calendar },
    { id: "ai", label: "AI Wellness Companion", icon: MessageSquare },
  ];

  return (
    <div className="h-screen w-screen flex bg-[#F0F5F3] text-slate-800 font-sans overflow-hidden">
      
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/50 h-full shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Logo Header */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-100 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#34D399] text-white shadow-lg shadow-teal-500/20">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 select-none">
            WellMindly
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-left text-sm font-bold transition-all duration-300 relative group outline-none ${
                  isActive ? "text-teal-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {/* Sage-green active state background utilizing Framer Motion layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarBg"
                    className="absolute inset-0 bg-[#E8F0EC] rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                
                <IconComp className={`h-5 w-5 shrink-0 z-10 transition-colors duration-300 ${
                  isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"
                }`} />
                <span className="z-10 tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Card in Desktop Sidebar Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center font-black text-teal-800 text-base shadow-inner">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{firstName} {lastName}</p>
              <p className="text-xs font-medium text-slate-500 truncate">{email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Off-Canvas Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col h-full lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#34D399] text-white">
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    WellMindly
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-left text-sm font-bold transition-all duration-200 relative group"
                    >
                      {isActive && <div className="absolute inset-0 bg-[#E8F0EC] rounded-2xl z-0" />}
                      <IconComp className={`h-5 w-5 shrink-0 z-10 ${isActive ? "text-teal-700" : "text-slate-400"}`} />
                      <span className={`z-10 ${isActive ? "text-teal-900" : "text-slate-600"}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center font-black text-teal-800 text-base">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{firstName} {lastName}</p>
                    <p className="text-xs font-medium text-slate-500 truncate">{email}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Primary Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-20 border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 -ml-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-black text-slate-900 text-xl tracking-tight">WellMindly</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Student Wellness Portal
            </span>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button
              onClick={logout}
              className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <LogOut className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>
        </header>

        {/* Main Scrolling Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 relative">
          
          <div className="max-w-6xl mx-auto">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* ---------- DASHBOARD HOME VIEW ---------- */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    
                    {/* Vibrant Hero Welcome Banner */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#34D399] p-8 sm:p-12 shadow-xl shadow-teal-900/10 text-white"
                    >
                      {/* Floating background elements */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
                      />
                      <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl pointer-events-none"
                      />

                      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="max-w-xl">
                          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                            {greeting},<br/> {firstName}!
                          </h1>
                          <p className="text-teal-50 text-base sm:text-lg leading-relaxed font-medium">
                            Taking time for your mental well-being is the first step towards academic and personal balance. Explore your insights and connect with a verified peer coach today.
                          </p>
                          <button 
                            onClick={() => setActiveTab("counseling")}
                            className="mt-8 bg-white text-teal-900 px-8 py-4 rounded-full font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg flex items-center gap-2 group"
                          >
                            Find a Consultant
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {/* Interactive Daily Mood Tracker */}
                        <div className="shrink-0 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 w-full lg:w-80 shadow-2xl">
                          <div className="flex items-center gap-4 mb-5">
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                              <Smile className="h-6 w-6 text-yellow-300" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-1">Daily Check-in</p>
                              <p className="text-base font-bold text-white">How are you feeling?</p>
                            </div>
                          </div>
                          <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button 
                                key={rating}
                                onClick={() => setDailyMood(rating)}
                                className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-300 ${
                                  dailyMood === rating 
                                    ? "bg-white text-teal-700 scale-110 shadow-lg" 
                                    : "bg-white/10 text-white hover:bg-white/30"
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                          {dailyMood !== null && (
                            <motion.p 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 text-xs font-semibold text-teal-50 text-center"
                            >
                              Thank you for checking in. Your mood has been recorded.
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Executive Summaries Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1. Latest Assessment Score */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center relative z-10">
                            <Activity className="h-5 w-5" />
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg relative z-10">
                            <TrendingUp className="h-3 w-3" /> +5 pts
                          </span>
                        </div>
                        <div className="relative z-10 mt-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Latest Assessment</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">72</span>
                            <span className="text-sm font-bold text-slate-400">/ 100</span>
                          </div>
                        </div>
                        {/* Decorative background graph */}
                        <svg className="absolute bottom-0 right-0 w-32 h-20 text-indigo-50" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path d="M0 50 L 20 40 L 40 45 L 60 20 L 80 30 L 100 10 L 100 50 Z" fill="currentColor" />
                        </svg>
                      </div>

                      {/* 2. Next Appointed Session */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Upcoming</span>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Session</p>
                          <p className="text-lg font-black text-slate-900 leading-tight truncate">Tomorrow, 2:00 PM</p>
                          <div className="flex items-center gap-2 mt-2">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f1f5f9&color=64748b" alt="Coach" className="h-5 w-5 rounded-full" />
                            <span className="text-xs font-bold text-slate-600 truncate">Sarah Jenkins</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. AI Copilot Engagement Status */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Active
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Copilot</p>
                          <p className="text-lg font-black text-slate-900 leading-tight">Last chat: 2h ago</p>
                          <p className="text-xs font-medium text-slate-500 mt-2">3 insights generated this week</p>
                        </div>
                      </div>
                    </div>

                    {/* Historical Scores Line Chart Placeholder */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">Well-being Trajectory</h3>
                          <p className="text-slate-500 font-medium text-sm mt-1">Historical scores over the last 6 months</p>
                        </div>
                        <button className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors">
                          View Details
                        </button>
                      </div>
                      
                      <div className="w-full h-64 relative flex items-end justify-between pl-8 pb-6 pr-4">
                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs font-bold text-slate-400">
                          <span>100</span>
                          <span>75</span>
                          <span>50</span>
                          <span>25</span>
                          <span>0</span>
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute left-8 right-4 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
                          <div className="w-full h-px bg-slate-100" />
                          <div className="w-full h-px bg-slate-100" />
                          <div className="w-full h-px bg-slate-100" />
                          <div className="w-full h-px bg-slate-100" />
                          <div className="w-full h-px bg-slate-300" /> {/* Baseline */}
                        </div>

                        {/* Chart SVG */}
                        <div className="absolute inset-0 left-8 bottom-6 right-4 overflow-hidden">
                          <svg className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0F766E" />
                                <stop offset="100%" stopColor="#34D399" />
                              </linearGradient>
                              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M 0 200 C 100 200, 200 150, 300 180 C 400 210, 500 120, 600 100 C 700 80, 800 140, 900 110 L 1000 60 L 1000 256 L 0 256 Z" 
                              fill="url(#area-gradient)" 
                            />
                            <path 
                              d="M 0 200 C 100 200, 200 150, 300 180 C 400 210, 500 120, 600 100 C 700 80, 800 140, 900 110 L 1000 60" 
                              fill="none" 
                              stroke="url(#chart-gradient)" 
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            {/* Data points */}
                            <circle cx="0" cy="200" r="4" fill="#0F766E" className="drop-shadow-sm"/>
                            <circle cx="300" cy="180" r="4" fill="#0D9488" className="drop-shadow-sm"/>
                            <circle cx="600" cy="100" r="4" fill="#10B981" className="drop-shadow-sm"/>
                            <circle cx="900" cy="110" r="4" fill="#10B981" className="drop-shadow-sm"/>
                            <circle cx="1000" cy="60" r="6" fill="#fff" stroke="#34D399" strokeWidth="3" className="drop-shadow-md"/>
                          </svg>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs font-bold text-slate-400">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Feature 1: Quiz Link */}
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between group cursor-pointer"
                        onClick={() => {
                          setActiveTab("assessments");
                          setShowScreening(true);
                        }}
                      >
                        <div>
                          <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ClipboardList className="h-7 w-7" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">Take Screening</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Complete our clinical-grade PHQ-9 well-being quiz to receive personalized care recommendations.
                          </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold text-sm">
                          Start Quiz <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>

                      {/* Feature 2: Counseling */}
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between group cursor-pointer"
                        onClick={() => setActiveTab("counseling")}
                      >
                        <div>
                          <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Video className="h-7 w-7" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">Live Sessions</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Connect securely with verified student wellness coaches via chat, audio, or video.
                          </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          Schedule Now <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>

                      {/* Feature 3: AI Companion */}
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between group cursor-pointer"
                        onClick={() => setActiveTab("ai")}
                      >
                        <div>
                          <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageSquare className="h-7 w-7" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">AI Companion</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Chat anonymously with our AI wellness assistant for instant coping strategies.
                          </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm">
                          Start Chatting <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Resources & Safety Banner */}
                    <div className="bg-amber-50 border border-amber-200/60 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                          <Heart className="h-7 w-7 fill-current" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-amber-950 mb-1">Immediate Support & Resources</h4>
                          <p className="text-amber-800/80 font-medium max-w-2xl leading-relaxed text-sm">
                            WellMindly provides wellness coaching. If you are experiencing a clinical crisis, please reach out to emergency resources or campus mental health services immediately.
                          </p>
                        </div>
                      </div>
                      <a 
                        href="https://www.betterhelp.com/gethelpnow/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                      >
                        View Hotlines
                      </a>
                    </div>
                  </div>
                )}

                {/* ---------- QUIZ RESULTS VIEW ---------- */}
                {activeTab === "assessments" && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center">
                          <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900">My Quiz Results</h2>
                          <p className="text-slate-500 font-medium mt-1">Review your recent well-being assessments</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowScreening(true)}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-2xl px-6 py-3.5 font-bold text-sm transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 outline-none cursor-pointer"
                      >
                        <Activity className="h-4 w-4" />
                        Start New Assessment
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Report Card */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/60 relative overflow-hidden">
                          {/* Decorative background element */}
                          <div className="absolute top-0 right-0 p-8 opacity-5">
                            <BrainCircuit className="w-64 h-64" />
                          </div>

                          <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
                              <div>
                                <h3 className="text-2xl font-black text-slate-900">Student Baseline Assessment</h3>
                                <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                                  <Clock className="h-4 w-4" /> Completed on {new Date().toLocaleDateString()}
                                </p>
                              </div>
                              <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100">
                                Evaluated
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-center">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Overall Score</h4>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-6xl font-black text-slate-900 tracking-tighter">72</span>
                                  <span className="text-xl font-bold text-slate-400">/ 100</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium mt-4">
                                  Your cognitive resilience is strong, but stress triggers are active.
                                </p>
                              </div>

                              <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100 flex flex-col justify-center">
                                <h4 className="text-xs font-black text-teal-600/70 uppercase tracking-widest mb-3">Classification</h4>
                                <span className="text-3xl font-black text-teal-900 leading-tight">Moderate Academic Stress</span>
                                <div className="mt-6 w-full bg-teal-200/50 h-3 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "72%" }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="bg-teal-600 h-full rounded-full" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown Insights */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                          <h3 className="text-xl font-black text-slate-900 mb-6">Detailed Insights</h3>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between font-bold mb-2">
                                <span className="text-slate-700">Sleep Quality</span>
                                <span className="text-amber-600">Needs Focus</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[40%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between font-bold mb-2">
                                <span className="text-slate-700">Social Connections</span>
                                <span className="text-emerald-600">Healthy</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[85%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between font-bold mb-2">
                                <span className="text-slate-700">Study Focus</span>
                                <span className="text-blue-600">Moderate</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[65%]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Actions Sidebar */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-400 fill-current" /> Next Steps
                          </h3>
                          <ul className="space-y-4">
                            <li className="bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-teal-300 transition-colors cursor-pointer" onClick={() => setActiveTab("counseling")}>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                  <Calendar className="h-4 w-4" />
                                </div>
                                <h4 className="font-bold text-slate-900">Book a Session</h4>
                              </div>
                              <p className="text-sm text-slate-500 font-medium">Discuss time-boxing strategies with a coach.</p>
                            </li>
                            <li className="bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-teal-300 transition-colors cursor-pointer" onClick={() => setActiveTab("ai")}>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                  <MessageSquare className="h-4 w-4" />
                                </div>
                                <h4 className="font-bold text-slate-900">Chat with AI</h4>
                              </div>
                              <p className="text-sm text-slate-500 font-medium">Get instant tips for better sleep hygiene.</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------- COUNSELING VIEW ---------- */}
                {activeTab === "counseling" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900">Schedule Counseling</h2>
                        <p className="text-slate-500 font-medium mt-1">Connect with verified student wellness coaches</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Coach Card 1 */}
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-xl overflow-hidden">
                              <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f1f5f9&color=64748b" alt="Sarah Jenkins" />
                            </div>
                            <div>
                              <h3 className="font-black text-lg text-slate-900">Sarah Jenkins</h3>
                              <p className="text-emerald-600 font-bold text-sm">Academic Stress Advisor</p>
                            </div>
                          </div>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Specializes in helping freshmen and sophomores manage heavy workloads, exam anxiety, and time-boxing frameworks.
                          </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 font-bold transition-colors">
                            View Availability
                          </button>
                        </div>
                      </div>

                      {/* Coach Card 2 */}
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-xl overflow-hidden">
                              <img src="https://ui-avatars.com/api/?name=Dr+Aris+Vane&background=f1f5f9&color=64748b" alt="Dr Aris Vane" />
                            </div>
                            <div>
                              <h3 className="font-black text-lg text-slate-900">Dr. Aris Vane</h3>
                              <p className="text-emerald-600 font-bold text-sm">Life & Career Coach</p>
                            </div>
                          </div>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Helps seniors and graduates navigate post-college anxiety, career direction, and building sustainable daily routines.
                          </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 font-bold transition-colors">
                            View Availability
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------- AI COMPANION VIEW ---------- */}
                {activeTab === "ai" && (
                  <div className="max-w-4xl mx-auto flex flex-col h-[70vh] bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 shrink-0">
                      <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900">AI Wellness Companion</h2>
                        <p className="text-slate-500 font-medium text-sm">Confidential, judgment-free zone</p>
                      </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-6">
                      <div className="flex gap-4 max-w-[85%]">
                        <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-slate-700 font-medium leading-relaxed">
                            Hello {firstName}! I'm here to listen. You can talk to me about anything—exam stress, roommate conflicts, or just feeling overwhelmed. What's on your mind today?
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse">
                        <div className="h-10 w-10 shrink-0 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                          {initials}
                        </div>
                        <div className="bg-teal-600 p-5 rounded-2xl rounded-tr-none shadow-sm text-white">
                          <p className="font-medium leading-relaxed">
                            I just got my quiz results back and my stress is really high. I have midterms next week and can't focus.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 max-w-[85%]">
                        <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-slate-700 font-medium leading-relaxed">
                            That is incredibly stressful, but completely valid. Midterms put a massive cognitive load on you. Let's try to break this down. Have you tried the "5-4-3-2-1" grounding technique to reset your focus right now? 
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-white border-t border-slate-100 shrink-0">
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Type your message securely..." 
                          className="flex-1 bg-slate-100 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-2xl px-6 py-4 text-slate-700 font-medium transition-colors outline-none"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl font-bold transition-colors shadow-sm">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Distraction-Free Screening Modal */}
      <AnimatePresence>
        {showScreening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <AssessmentWizard 
                onClose={() => setShowScreening(false)} 
                onComplete={(score) => {
                  console.log("Completed screening with score:", score);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
