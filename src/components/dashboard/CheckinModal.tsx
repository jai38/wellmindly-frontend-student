import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CheckinModalProps {
  show: boolean;
  onClose: () => void;
  emoji: string;
  title: string;
  message: string;
  mood: number | null;
}

export function CheckinModal({ show, onClose, emoji, title, message, mood }: CheckinModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl relative text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border-none cursor-pointer outline-none"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Animated Large Emoji Header */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="h-20 w-20 mx-auto bg-plum/10 rounded-[2rem] flex items-center justify-center text-4xl mb-6 select-none"
            >
              {emoji}
            </motion.div>

            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{title}</h3>

            <div className="inline-flex items-center gap-1.5 bg-plum/10 text-plum px-3.5 py-1.5 rounded-full text-xs font-bold mb-6">
              You rated: <span className="text-sm font-black">{mood}</span> / 5
            </div>

            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-8">{message}</p>

            <button
              onClick={onClose}
              className="w-full bg-plum hover:bg-plum/90 text-white rounded-2xl py-4 font-bold text-sm transition-all duration-300 shadow-lg shadow-plum/20 cursor-pointer border-none outline-none"
            >
              Got it, thanks!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
