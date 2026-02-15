import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, ShieldCheck, ArrowRight, Fingerprint, Activity } from 'lucide-react';

const Card = ({ icon: Icon, title, description, step, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Step Number Background */}
      <div className="absolute -top-10 -left-4 text-9xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-[#ff1e1e]/[0.05] transition-colors duration-700">
        {step}
      </div>

      <div className="relative glass-card p-8 md:p-10 h-full flex flex-col transition-all duration-500 border-white/5 hover:border-[#ff1e1e]/30 hover:shadow-[0_0_40px_rgba(255,30,30,0.15)] group">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-[#ff1e1e]/5 rounded-2xl flex items-center justify-center border border-[#ff1e1e]/10 group-hover:border-[#ff1e1e]/40 transition-all duration-500 overflow-hidden">
               {/* Scanning Line Animation on Icon */}
              <motion.div 
                animate={{ top: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-[#ff1e1e]/40 blur-[2px] z-10"
              />
              <Icon className="text-[#ff1e1e] w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
            </div>
            {/* Soft Glow behind icon */}
            <div className="absolute inset-0 bg-[#ff1e1e] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="text-[#ff1e1e] w-3 h-3 animate-pulse" />
            <span className="text-[10px] font-mono text-[#ff1e1e]/60 tracking-tighter">SECURED_V2.0</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-3 mb-4">
             <span className="text-xs font-mono text-[#ff1e1e] font-bold">0{step}</span>
             <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          
          <p className="text-white/50 text-base leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 group-hover:text-[#ff1e1e]/40 transition-colors duration-500 uppercase tracking-[0.2em]">
            <Fingerprint size={12} />
            Integrity Verified
          </div>
        </div>

        {/* Dynamic Border Corner */}
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
           <div className="absolute top-0 right-0 w-[1px] h-4 bg-[#ff1e1e]/0 group-hover:bg-[#ff1e1e]/60 transition-all" />
           <div className="absolute top-0 right-0 h-[1px] w-4 bg-[#ff1e1e]/0 group-hover:bg-[#ff1e1e]/60 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: Lock,
      step: "01",
      title: "Asymmetric Key Exchange",
      description: "Secure initialization using RSA-4096 and Elliptic Curve Diffie-Hellman (ECDH) for unbreakable session keys.",
      delay: 0.1
    },
    {
      icon: Key,
      step: "02",
      title: "AES Message Encryption",
      description: "Every single byte is encrypted with AES-256-GCM, ensuring high-speed security and message integrity.",
      delay: 0.2
    },
    {
      icon: ShieldCheck,
      step: "03",
      title: "Zero-Knowledge Server",
      description: "Our servers never see your keys, your messages, or your identity. Privacy is baked into the infrastructure.",
      delay: 0.3
    }
  ];

  return (
    <section className="pt-32 px-6 relative overflow-hidden" id="protocol">
      {/* Decorative side text */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 vertical-text">
         <span className="text-[10px] font-mono text-white/5 tracking-[1em] uppercase">Security Protocol Stack — 2026</span>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-[1px] w-12 bg-[#ff1e1e]" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.3em] uppercase text-xs">
              System Operations
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            THE SHIELDX <span className="text-[#ff1e1e]">PROTOCOL.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line (Mobile hidden) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none" />
          
          {steps.map((step, index) => (
            <Card key={index} {...step} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
