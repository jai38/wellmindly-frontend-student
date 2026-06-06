import { motion, AnimatePresence } from "framer-motion";
import { AssessmentWizard } from "../AssessmentWizard";

interface ScreeningModalProps {
  show: boolean;
  onClose: () => void;
  onComplete: (score: number, answers?: Record<number, number>) => void;
}

export function ScreeningModal({ show, onClose, onComplete }: ScreeningModalProps) {
  return (
    <AnimatePresence>
      {show && (
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
            <AssessmentWizard onClose={onClose} onComplete={onComplete} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
