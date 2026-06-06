import { motion } from "framer-motion";
import {
  ArrowRight,
  Smile,
  Activity,
  ClipboardList,
  ChevronRight,
  Heart,
} from "lucide-react";
import { WellbeingChart } from "./WellbeingChart";

interface OverviewTabProps {
  greeting: string;
  firstName: string;
  dailyMood: number | null;
  resultsData: any;
  onDailyCheckin: (rating: number) => void;
  onExploreDiscover: () => void;
  onViewAssessments: () => void;
  onStartScreening: () => void;
}

export function OverviewTab({
  greeting,
  firstName,
  dailyMood,
  resultsData,
  onDailyCheckin,
  onExploreDiscover,
  onViewAssessments,
  onStartScreening,
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Vibrant Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-plum via-[#8E74A5] to-[#AD95C4] p-8 sm:p-12 shadow-xl shadow-plum-900/10 text-white"
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
          className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-plum/20 blur-2xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              {greeting},<br /> {firstName}!
            </h1>
            <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium">
              Taking time for your mental well-being is the first step towards academic and personal
              balance. Explore your insights and self-reflection results to track your wellness
              journey.
            </p>
            <button
              onClick={onExploreDiscover}
              className="mt-8 bg-white text-plum px-8 py-4 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg flex items-center gap-2 group cursor-pointer border-none"
            >
              Explore Discover
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Interactive Daily Mood Tracker */}
          <div className="shrink-0 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 w-full lg:w-80 shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-12 w-12 bg-white/25 rounded-2xl flex items-center justify-center">
                <Smile className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">
                  Daily Check-in
                </p>
                <p className="text-base font-bold text-white">How are you feeling?</p>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onDailyCheckin(rating)}
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-300 border-none cursor-pointer ${
                    dailyMood === rating
                      ? "bg-white text-plum scale-110 shadow-lg"
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
                className="mt-4 text-xs font-semibold text-white/90 text-center"
              >
                Thank you for checking in. Your mood has been recorded.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Executive Summaries Row */}
      <div className="w-full">
        {/* Latest Assessment Score */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-plum/10 text-plum rounded-2xl flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {resultsData?.latestResult?.quizTitle || "Latest Assessment"}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {resultsData?.latestResult ? resultsData.latestResult.score : "No score"}
                </span>
                {resultsData?.latestResult && (
                  <span className="text-sm font-bold text-slate-400">
                    / {resultsData.latestResult.quizTitle.includes("PHQ-9") ? 15 : 27}
                  </span>
                )}
              </div>
            </div>
          </div>
          {resultsData?.latestResult ? (
            <span className="mt-4 sm:mt-0 flex items-center gap-1.5 text-xs font-bold text-plum bg-plum/5 border border-plum/10 px-3.5 py-2 rounded-xl relative z-10">
              <Activity className="h-4 w-4" /> Status: {resultsData.latestResult.classification}
            </span>
          ) : (
            <span className="mt-4 sm:mt-0 flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-3.5 py-2 rounded-xl relative z-10">
              No screening taken yet
            </span>
          )}
        </div>
      </div>

      {/* Historical Scores Line Chart */}
      <WellbeingChart timeline={resultsData?.timeline} onViewDetails={onViewAssessments} />

      {/* Features Grid */}
      <div className="w-full">
        {/* Feature 1: Quiz Link */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-6 group cursor-pointer"
          onClick={onStartScreening}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="h-16 w-16 bg-plum/10 text-plum rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ClipboardList className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Take Baseline Screening</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                Complete our clinical-grade PHQ-9 well-being quiz to receive personalized care
                recommendations.
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-plum text-white font-extrabold text-sm px-8 py-4 rounded-full transition-all group-hover:bg-plum/95 flex items-center gap-2">
            Start Quiz{" "}
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            <h4 className="text-lg font-black text-amber-950 mb-1">
              Immediate Support & Resources
            </h4>
            <p className="text-amber-800/80 font-medium max-w-2xl leading-relaxed text-sm">
              WellMindly provides wellness coaching. If you are experiencing a clinical crisis,
              please reach out to emergency resources or campus mental health services immediately.
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
  );
}
