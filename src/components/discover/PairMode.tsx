import { motion } from "framer-motion";

interface PairOption {
  label: string;
  v: string;
}

interface PairModeProps {
  pair: PairOption[];
  onPick: (v: string) => void;
}

export function PairMode({ pair, onPick }: PairModeProps) {
  return (
    <div>
      <p className="text-ink-soft text-sm mb-4">Which pulls you more?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pair.map((opt, i) => (
          <motion.button 
            key={i} 
            onClick={() => onPick(opt.v)}
            className="border-[1.5px] border-line rounded-[18px] p-7 text-center font-serif text-lg font-bold bg-white transition-colors hover:border-plum min-h-[120px] flex items-center justify-center cursor-pointer text-ink"
            whileHover={{ y: -4, rotateY: 3 }} 
            whileTap={{ scale: 0.97 }}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
