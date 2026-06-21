import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import api from "../../services/api";

interface FeedbackFormProps {
  resultId: string;
  onComplete: () => void;
}

export function FeedbackForm({ resultId, onComplete }: FeedbackFormProps) {
  const [firstFeeling, setFirstFeeling] = useState("");
  const [feltSeen, setFeltSeen] = useState("");
  const [wouldUse, setWouldUse] = useState<string | null>(null);
  const [reachFirst, setReachFirst] = useState<string | null>(null);
  const [feltOff, setFeltOff] = useState("");
  const [wouldChange, setWouldChange] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wouldUse) {
      setError("Please select if you would actually use something like this.");
      return;
    }
    if (!reachFirst) {
      setError("Please select which option you would reach for first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Map Question 3 wouldUse to a 1-5 rating:
    // Yes, definitely -> 5
    // Maybe -> 3
    // Probably not -> 1
    let ratingVal = 3;
    if (wouldUse === "Yes, definitely") ratingVal = 5;
    else if (wouldUse === "Probably not") ratingVal = 1;

    // Serialize all answers into the comments field
    const formattedComments = [
      `In the first few seconds, what did you feel?\n${firstFeeling || "(No answer)"}`,
      `Did anything here feel like it was describing you?\n${feltSeen || "(No answer)"}`,
      `Would you actually use something like this?\n${wouldUse}`,
      `Which would you reach for first?\n${reachFirst}`,
      `What felt off, fake, or like "just an app"?\n${feltOff || "(No answer)"}`,
      `Anything you'd change or wish it did?\n${wouldChange || "(No answer)"}`,
    ].join("\n\n");

    try {
      await api.post(`/quizzes/${resultId}/feedback`, {
        rating: ratingVal,
        comments: formattedComments,
      });
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2500);
    } catch (err) {
      console.error("Failed to submit quiz feedback:", err);
      setError("Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50/80 border border-emerald-200/50 rounded-3xl p-6 text-center space-y-3 select-none backdrop-blur-sm shadow-sm"
      >
        <span className="text-3xl">🎉</span>
        <h4 className="text-base font-black text-emerald-950 font-serif">Thank you for being honest!</h4>
        <p className="text-xs text-emerald-800/80 font-semibold leading-relaxed">
          That actually helps more than you know. Thank you for your feedback.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 border border-white/20 rounded-[2rem] p-6 sm:p-8 shadow-sm backdrop-blur-md space-y-6 select-none font-sans"
    >
      <div className="space-y-1">
        <h4 className="text-base font-black text-slate-900 font-serif leading-tight">
          Before you go, tell us the truth.
        </h4>
        <p className="text-slate-500 font-medium text-xs">
          There are no wrong answers, only honest ones.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Q1 */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            In the first few seconds, what did you feel?
          </label>
          <textarea
            value={firstFeeling}
            onChange={(e) => setFirstFeeling(e.target.value)}
            placeholder="Tell us what initially came to mind..."
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 p-3.5 resize-none transition-all leading-relaxed"
          />
        </div>

        {/* Q2 */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            Did anything here feel like it was describing you?
          </label>
          <textarea
            value={feltSeen}
            onChange={(e) => setFeltSeen(e.target.value)}
            placeholder="Did the report or check-ins feel accurate?"
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 p-3.5 resize-none transition-all leading-relaxed"
          />
        </div>

        {/* Q3 */}
        <div className="space-y-2.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            Would you actually use something like this?
          </label>
          <div className="flex flex-wrap gap-2.5">
            {["Yes, definitely", "Maybe", "Probably not"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setWouldUse(opt);
                  setError(null);
                }}
                className={`flex-1 min-w-[100px] text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer outline-none ${
                  wouldUse === opt
                    ? "border-plum bg-plum/5 ring-2 ring-plum/10 text-plum shadow-sm"
                    : "border-slate-100 text-slate-500 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q4 */}
        <div className="space-y-2.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            Which would you reach for first?
          </label>
          <div className="flex flex-wrap gap-2.5">
            {["Write on my own", "Talk with others", "Not sure"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setReachFirst(opt);
                  setError(null);
                }}
                className={`flex-1 min-w-[120px] text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer outline-none ${
                  reachFirst === opt
                    ? "border-plum bg-plum/5 ring-2 ring-plum/10 text-plum shadow-sm"
                    : "border-slate-100 text-slate-500 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q5 */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            What felt off, fake, or like "just an app"?
          </label>
          <textarea
            value={feltOff}
            onChange={(e) => setFeltOff(e.target.value)}
            placeholder="Be brutal: what was cringy or artificial?"
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 p-3.5 resize-none transition-all leading-relaxed"
          />
        </div>

        {/* Q6 */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 font-serif block">
            Anything you'd change or wish it did?
          </label>
          <textarea
            value={wouldChange}
            onChange={(e) => setWouldChange(e.target.value)}
            placeholder="Tell us what you wish was different..."
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 p-3.5 resize-none transition-all leading-relaxed"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-semibold text-center leading-relaxed">
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !wouldUse || !reachFirst}
          className="w-full bg-plum hover:bg-plum/90 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 outline-none cursor-pointer border-none"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Submitting feedback…
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
