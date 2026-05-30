import { useState } from "react";
import { AlertCircle, X, Heart, Shield, Sparkles } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { motion } from "framer-motion";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const res = await api.post('/auth/google/callback', {
        idToken: response.credential,
      });
      const { token, user } = res.data;
      loginSuccess(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setGlobalError(err.response?.data?.error || "Google Authentication failed.");
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      
      {/* LEFT PANEL: Branding & Visuals (Hidden on small screens, full width on large) */}
      <div className="hidden lg:flex relative w-[45%] flex-col justify-between bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#34D399] p-12 text-white overflow-hidden">
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
        />

        {/* Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-lg">
            <Heart className="h-7 w-7 fill-current" />
          </div>
          <span className="text-3xl font-black tracking-tight select-none">
            WellMindly
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-md mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-6 leading-tight"
          >
            Your Space for Clarity & Focus.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-teal-50 text-lg leading-relaxed font-medium mb-12"
          >
            Connect with verified peer coaches, track your mental well-being, and build cognitive resilience through college and beyond.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-teal-50">100% Confidential & Secure</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-teal-50">Smart AI Wellness Tracking</p>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-sm font-medium text-teal-100/80 mt-20">
          © {new Date().getFullYear()} WellMindly. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#F0F5F3] lg:bg-white relative">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex items-center gap-3 absolute top-8 left-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#34D399] text-white shadow-lg">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 select-none">
            WellMindly
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-xl lg:shadow-none border border-slate-200/60 lg:border-none p-8 lg:p-0 relative"
        >
          {/* Error Alert */}
          {globalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-4 left-0 right-0 lg:static lg:mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-md z-20"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span className="flex-1">{globalError}</span>
              <button
                type="button"
                onClick={() => setGlobalError(null)}
                className="rounded-lg p-1 hover:bg-red-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          <div className="mb-10 text-center lg:text-left mt-8 lg:mt-0">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
              Welcome back
            </h2>
            <p className="text-base text-slate-500 font-medium">
              Sign in with your university account to access your wellness dashboard.
            </p>
          </div>

          {/* Login Actions */}
          <div className="bg-slate-50 lg:bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100">
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setGlobalError("Google login widget failed to load.")}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="320"
              />
            </div>

            <div className="my-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Or
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm font-medium text-slate-500">
              Need access? <a href="#" className="text-teal-700 font-bold hover:underline transition-all">Contact your university admin</a>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
