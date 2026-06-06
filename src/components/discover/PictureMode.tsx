import { motion } from "framer-motion";
import { SvgIcon } from "./SvgIcon";

interface PictureOption {
  label: string;
  ic: string;
  tone: number;
  c1: string;
  c2: string;
}

interface PictureModeProps {
  options: PictureOption[];
  onPick: (o: PictureOption) => void;
}

export function PictureMode({ options, onPick }: PictureModeProps) {
  return (
    <div>
      <p className="text-ink-soft text-sm mb-4">Which feels most like right now?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {options.map(opt => (
          <motion.button 
            key={opt.label} 
            onClick={() => onPick(opt)}
            className="rounded-[18px] aspect-square flex flex-col items-center justify-center gap-2 text-white font-bold text-[14.5px] relative overflow-hidden cursor-pointer border-none"
            style={{ background: `linear-gradient(140deg, ${opt.c1}, ${opt.c2})` }}
            whileHover={{ y: -5, scale: 1.04 }} 
            whileTap={{ scale: 0.96 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.15),transparent_60%)] pointer-events-none" />
            <SvgIcon name={opt.ic} className="w-9 h-9 stroke-white fill-none opacity-90" />
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
