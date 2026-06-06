import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import logoPng from "../../assets/logo.png";

interface LandingHeaderProps {
  onCrisisClick: () => void;
}

export function LandingHeader({ onCrisisClick }: LandingHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      {/* Global Crisis Support Banner */}
      <div className="w-full bg-paper-2 border-b border-line py-2.5 px-6 text-center text-xs font-semibold text-ember relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          Need help right now?
          <button 
            onClick={onCrisisClick} 
            className="underline hover:text-coral transition-colors ml-1 font-bold cursor-pointer border-none bg-transparent p-0 text-[inherit]"
          >
            Get help immediately &rarr;
          </button>
        </span>
      </div>

      {/* Header Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 w-full border-b border-line bg-paper/85 backdrop-blur-md transition-all duration-300"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 select-none transition-opacity"
            id="header-logo-container"
          >
            <img src={logoPng} alt="WellMindly Logo" className="h-8 w-auto block select-none" />
          </div>

          <nav className="flex items-center gap-6">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-full bg-plum text-white px-5 py-2 text-xs font-bold hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow-sm shadow-plum/20 border-none"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-navy text-white px-5 py-2 text-xs font-bold hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow-sm border-none"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </motion.header>
    </>
  );
}
