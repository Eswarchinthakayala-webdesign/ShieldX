import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, ArrowRight, Terminal, Activity } from 'lucide-react';
import Logo from './Logo';

const CTA = () => {
  return (
    <section className="px-6 relative overflow-hidden" id="get-started">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1400px] max-h-[1000px] pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient from-[#ff1e1e]/10 via-transparent to-transparent opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 md:p-24 overflow-hidden group shadow-2xl"
        >
          {/* Internal HUD Accents */}
          <div className="absolute top-8 left-8 flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
             <Terminal size={14} className="text-[#ff1e1e]" />
             <span className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.3em]">Deployment Terminal_v4</span>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff1e1e]/5 to-transparent pointer-events-none" />
          
          {/* Animated Scanning Line */}
          <motion.div 
            animate={{ left: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="absolute top-0 w-[1px] h-full bg-[#ff1e1e]/20 blur-[2px] z-10 hidden md:block"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-[#ff1e1e]/10 rounded-3xl border border-[#ff1e1e]/20 flex items-center justify-center mb-10 red-glow"
            >
              <Logo className="w-12 h-12" />
            </motion.div>

            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase max-w-4xl">
              SECURE YOUR FUTURE. <br />
              <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">ENFORCE PRIVACY.</span>
            </h2>
            
            <p className="text-white/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Take the leap into <span className="text-white/80 font-bold">Zero-Knowledge communication</span>. ShieldX is ready for deployment across your entire personal and professional infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center">
              <button className="w-full sm:w-auto relative group px-12 py-6 bg-[#ff1e1e] text-white rounded-full font-black overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 red-glow tracking-widest text-xs">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Zap size={16} />
                  ACTIVATE SHIELDX
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              
              <button className="w-full sm:w-auto px-12 py-6 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-black hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 tracking-widest text-xs group">
                DOCUMENTATION
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Verification Footer */}
            <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40">
               <div className="flex items-center gap-2">
                  <Lock size={12} className="text-[#ff1e1e]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Verified</span>
               </div>
               <div className="flex items-center gap-2">
                  <Activity className="text-[#ff1e1e] w-3 h-3 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Global Node Capacity: 99.9%</span>
               </div>
            </div>
          </div>

          {/* Corner Elements */}
          <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
             <Logo className="w-64 h-64 grayscale brightness-200" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ff1e1e]/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
