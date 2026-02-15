import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ShieldAlert, Cpu, Lock, Globe } from 'lucide-react';
import Logo from './Logo';

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center md:items-start gap-1 px-6 border-r border-white/5 last:border-none">
    <div className="flex items-center gap-2 text-[#ff1e1e]/60">
      <Icon size={14} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-mono text-white/80">{value}</span>
  </div>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[800px] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#ff1e1e]/5 via-transparent to-[#ff1e1e]/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#ff1e1e]/10 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#ff1e1e]/5 rounded-full animate-pulse-slower" />
      </div>

      {/* Security Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-20 mb-12"
      >
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 backdrop-blur-md">
          <div className="w-2 h-2 mt-2 rounded-full bg-[#ff1e1e] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff1e1e]">System Status: Fortified</span>
        </div>
      </motion.div>


      {/* Heading Text */}
      <div className="relative z-10 text-center max-w-5xl px-4 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.75rem] sm:text-7xl  font-black tracking-tighter mb-8 leading-[1] sm:leading-[0.9] uppercase"
        >
          SECURE <br className="sm:hidden" /> 
          <span className="text-white">CONVERSATIONS.</span> <br />
          <span className="text-gradient-red whitespace-nowrap lg:whitespace-normal" style={{ filter: 'drop-shadow(0 0 30px rgba(255, 30, 30, 0.4))' }}>
            ZERO COMPROMISE.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base md:text-xl lg:text-2xl text-white/50 mb-10 max-w-xs sm:max-w-2xl lg:max-w-3xl leading-relaxed font-medium"
        >
          ShieldX leverages <span className="text-white/80">hybrid cryptography</span> and symmetric AES encryption to deliver uncompromising privacy.
        </motion.p>

        {/* CTA Area */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8, duration: 1 }}
           className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 px-4 w-full sm:w-auto"
        >
          <button className="w-full cursor-pointer sm:w-auto relative group px-10 py-3 bg-[#ff1e1e] text-white rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 red-glow text-sm sm:text-base">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Lock size={18} />
              GET STARTED SECURELY
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          
          <button className="w-full cursor-pointer sm:w-auto px-10 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base">
            VIEW ARCHITECTURE
            <ChevronDown size={18} className="transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>

        {/* Technical Specs / Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="hidden md:flex justify-center flex-wrap gap-y-8"
        >
          <StatItem icon={Cpu} label="ALGORITHM" value="AES-256-GCM" />
          <StatItem icon={ShieldAlert} label="PROTOCOL" value="RSA-4096 / ECDH" />
          <StatItem icon={Globe} label="NETWORK" value="DISTRIBUTED NODES" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#ff1e1e] to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Initiate Scroll</span>
      </motion.div>

      <style>{`
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.05); }
        }
        .text-shadow-glow {
          text-shadow: 0 0 40px rgba(255, 30, 30, 0.4);
        }
      `}</style>
    </section>
  );
};

export default Hero;
