import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  MessageSquare, 
  RotateCcw, 
  Activity, 
  Info,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizEngine } from "../hooks/useQuizEngine";

export interface Question {
  id: number;
  text: string;
}

export interface Option {
  label: string;
  points: number;
}

const PHQ9_QUESTIONS: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things?" },
  { id: 2, text: "Feeling down, depressed, or hopeless?" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?" },
  { id: 4, text: "Feeling tired or having little energy?" },
  { id: 5, text: "Poor appetite or overeating?" }
];

const OPTIONS: Option[] = [
  { label: "Not at all", points: 0 },
  { label: "Several days", points: 1 },
  { label: "More than half the days", points: 2 },
  { label: "Nearly every day", points: 3 }
];

interface AssessmentWizardProps {
  onClose?: () => void;
  onComplete?: (score: number) => void;
}

export function AssessmentWizard({ onClose, onComplete }: AssessmentWizardProps) {
  const {
    currentStep,
    totalScore,
    isAnswered,
    isSubmitted,
    isSubmitting,
    error,
    activeQuestion,
    selectedPoints,
    progressPercentage,
    handleSelectOption,
    handleNext,
    handlePrevious,
    handleReset,
  } = useQuizEngine({
    questions: PHQ9_QUESTIONS,
    onSubmit: async (score) => {
      if (onComplete) {
        onComplete(score);
      }
    }
  });

  const totalQuestions = PHQ9_QUESTIONS.length;

  // Scoring range mapping for 5 PHQ-9 questions (Max score: 15)
  // 0-4: Minimal/None, 5-9: Mild, 10-14: Moderate, 15: Severe
  const getSeverity = (score: number) => {
    if (score <= 4) return { 
      label: "Minimal Stress", 
      color: "text-emerald-700 bg-emerald-50 border-emerald-100", 
      barColor: "bg-emerald-500",
      desc: "Your screening suggests normal functioning. You are doing well! Keep prioritizing your sleep, physical movement, and wellness routine." 
    };
    if (score <= 8) return { 
      label: "Mild Stress", 
      color: "text-amber-700 bg-amber-50 border-amber-100", 
      barColor: "bg-amber-500",
      desc: "You are experiencing mild depressive or anxious symptoms. Consider speaking to a peer counselor or utilizing our AI Wellness Companion to build coping mechanisms." 
    };
    if (score <= 12) return { 
      label: "Moderate Stress", 
      color: "text-orange-700 bg-orange-50 border-orange-100", 
      barColor: "bg-orange-500",
      desc: "You are experiencing moderate emotional load. We strongly recommend scheduling a one-on-one video session with one of our licensed student mentors or campus staff." 
    };
    return { 
      label: "Escalated Anxiety / Stress", 
      color: "text-rose-700 bg-rose-50 border-rose-100", 
      barColor: "bg-rose-500",
      desc: "Your score indicates severe wellness disruption. Please connect with our emergency peer counselors or standard campus hotlines immediately for direct guidance." 
    };
  };

  const severity = getSeverity(totalScore);

  return (
    <div className="min-h-[500px] w-full flex items-center justify-center bg-gray-50 py-10 px-4 md:px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden relative flex flex-col">
        
        {/* Dynamic Smooth Progress Tracker at absolute top */}
        <div className="w-full bg-gray-100 h-1.5 relative overflow-hidden">
          <div 
            className="h-full bg-[#6EE7B7] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Generous Padding Container to allow layout to breathe */}
        <div className="p-8 md:p-10 flex-1 flex flex-col">
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {/* Header context label */}
                <div className="flex items-center gap-2 mb-6 text-slate-400">
                  <Activity className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Wellness Assessment • Question {currentStep + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Question Block */}
                <h3 className="text-2xl text-gray-800 font-medium tracking-tight mb-8 leading-snug">
                  {activeQuestion.text}
                </h3>

                {/* Answer Inputs Stack - Organic Likert Container */}
                <div className="flex-1 mt-2">
                  <div className="border border-slate-200/80 rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col">
                    {OPTIONS.map((option, index) => {
                      const isSelected = selectedPoints === option.points;
                      const isLast = index === OPTIONS.length - 1;
                      return (
                        <button
                          key={option.label}
                          onClick={() => handleSelectOption(option.points)}
                          className={`w-full flex items-center justify-between text-left px-6 py-5 font-medium text-base transition-all duration-300 group outline-none cursor-pointer relative ${
                            !isLast ? "border-b border-slate-100/80" : ""
                          } ${
                            isSelected 
                              ? "bg-teal-50/60 text-teal-900" 
                              : "bg-white text-slate-700 hover:bg-slate-50/50"
                          }`}
                        >
                          {/* Active Indicator Line */}
                          {isSelected && (
                            <motion.div
                              layoutId={`activeIndicator-${activeQuestion.id}`}
                              className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-r-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <span className="tracking-wide relative z-10 pl-2">{option.label}</span>
                          
                          {isSelected ? (
                            <div className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm relative z-10 scale-110 transition-transform">
                              <Check className="h-4 w-4 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-slate-200 group-hover:border-slate-300 bg-white relative z-10 transition-colors" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error Alert Safeguard */}
                {error && (
                  <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-pulse">
                    <Info className="h-4.5 w-4.5 text-rose-600 stroke-[2.5]" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Navigation Footer */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100/60">
                  {currentStep > 0 ? (
                    <button
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className={`group flex items-center gap-2.5 px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-transparent rounded-xl outline-none ${
                        isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!isAnswered || isSubmitting}
                    className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 outline-none ${
                      isAnswered && !isSubmitting
                        ? "bg-teal-700 hover:bg-teal-800 text-white cursor-pointer hover:shadow"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        {currentStep === totalQuestions - 1 ? "Submit Assessment" : "Next Question"}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              // Reassuring Results View - Specialized Summary
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-2 flex flex-col h-full"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex h-14 w-14 bg-teal-50 text-teal-600 rounded-3xl items-center justify-center mb-4 border border-teal-100 shadow-sm">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Assessment Results</h3>
                  <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
                    Your responses have been analyzed. Here is a clinical summary of your current wellness baseline.
                  </p>
                </div>

                {/* Assessment Gauge and Narrative block */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-6 shadow-sm">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                        Current Status
                      </span>
                      <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1.5 rounded-xl border ${severity.color}`}>
                        {severity.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalScore}</span>
                        <span className="text-sm font-bold text-slate-400">/ 15</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-segment Severe vs Stable Gauge */}
                  <div className="relative mb-8">
                    <div className="flex h-3 w-full rounded-full overflow-hidden gap-1 bg-slate-100">
                      <div className="h-full bg-emerald-400" style={{ width: '25%' }}></div>
                      <div className="h-full bg-amber-400" style={{ width: '25%' }}></div>
                      <div className="h-full bg-orange-400" style={{ width: '25%' }}></div>
                      <div className="h-full bg-rose-500" style={{ width: '25%' }}></div>
                    </div>
                    {/* Indicator Marker */}
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-white border-2 border-slate-800 rounded shadow-md"
                      style={{ left: `calc(${(totalScore / 15) * 100}% - 8px)` }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-3 px-1">
                      <span>Stable</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  {/* Summarized Narrative Insight */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                      <Info className="h-4 w-4 text-teal-600" />
                      Feedback Narrative
                    </h4>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {severity.desc}
                    </p>
                  </div>
                </div>

                {/* Dual Call-to-Action Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                  <button 
                    onClick={() => {
                      if (onClose) onClose();
                      // Next steps would normally route to AI view
                    }}
                    className="group relative overflow-hidden bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 text-left transition-all hover:shadow-md outline-none cursor-pointer"
                  >
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MessageSquare className="w-24 h-24 text-blue-600" />
                    </div>
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 relative z-10">Chat Immediately with AI Support</h4>
                    <p className="text-xs font-medium text-slate-500 relative z-10">Get instant, confidential coping strategies and a listening ear right now.</p>
                  </button>

                  <button 
                    onClick={() => {
                      if (onClose) onClose();
                      // Next steps would normally route to Counseling view
                    }}
                    className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 border border-transparent rounded-2xl p-5 text-left transition-all shadow-md outline-none cursor-pointer"
                  >
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Calendar className="w-24 h-24 text-white" />
                    </div>
                    <div className="h-10 w-10 bg-white/10 text-white rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 relative z-10">Book a Virtual Consultation</h4>
                    <p className="text-xs font-medium text-slate-300 relative z-10">Schedule a 1-on-1 video session with a verified student wellness coach.</p>
                  </button>
                </div>
                
                {/* Reset Link */}
                <div className="mt-6 text-center">
                  <button 
                    onClick={handleReset} 
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest flex items-center gap-1.5 mx-auto outline-none cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Discard & Retake Assessment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
