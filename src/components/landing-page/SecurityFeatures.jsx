import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  KeyRound, 
  Globe, 
  Fingerprint,
  Cpu,
  Shield,
  EyeOff,
  Activity
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, tag, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="group relative h-full bg-[#0d0d0d] border border-white/5 p-8 rounded-2xl hover:border-[#ff1e1e]/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,30,30,0.1)] overflow-hidden"
  >
    {/* Background Decorative Element */}
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
      <Icon size={140} />
    </div>

    {/* Header Status HUD */}
    <div className="flex justify-between items-center mb-8">
      <div className="w-12 h-12 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-center justify-center group-hover:bg-[#ff1e1e]/10 group-hover:border-[#ff1e1e]/30 transition-all duration-500">
        <Icon className="text-[#ff1e1e] w-6 h-6" />
      </div>
      <div className="flex items-center gap-1.5 bg-[#ff1e1e]/5 px-2.5 py-1 rounded-md border border-[#ff1e1e]/10">
        <div className="w-1 h-1 rounded-full bg-[#ff1e1e] animate-pulse" />
        <span className="text-[9px] font-bold text-[#ff1e1e] tracking-[0.1em] uppercase">{tag}</span>
      </div>
    </div>

    {/* Content */}
    <div className="relative z-10">
      <h4 className="text-xl font-bold mb-4 text-white group-hover:text-[#ff1e1e] transition-colors duration-300">
        {title}
      </h4>
      <p className="text-white/40 text-sm leading-relaxed mb-8">
        {description}
      </p>
    </div>

    {/* Technical Metadata Footer */}
    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
       <div className="flex items-center gap-2">
          <Activity size={10} className="text-[#ff1e1e]" />
          <span className="text-[10px] font-mono tracking-tighter uppercase text-white/60">Active Protocol</span>
       </div>
       <div className="text-[10px] font-mono text-[#ff1e1e]/60">0x{index}A_SEC</div>
    </div>

    {/* Bottom Glow Line */}
    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff1e1e] group-hover:w-full transition-all duration-700 ease-out" />
  </motion.div>
);

const SecurityFeatures = () => {
  const features = [
    {
      icon: ShieldCheck,
      tag: "Military-Grade",
      title: "End-to-End Encryption",
      description: "Proprietary implementation of E2EE ensuring that only the local device holds the private keys required for decryption."
    },
    {
      icon: RotateCcw,
      tag: "Session Reset",
      title: "Forward Secrecy",
      description: "Continuous key rotation at sub-minute intervals. Compromising one session key reveals zero data about future sessions."
    },
    {
      icon: Zap,
      tag: "Low Latency",
      title: "Real-Time Security",
      description: "Hardware-accelerated cryptographic throughput optimized for multi-recipient broadcast without delay."
    },
    {
      icon: KeyRound,
      tag: "Opaque PRF",
      title: "Encrypted Exchange",
      description: "Post-quantum ready key exchange protocols designed to withstand the next generation of cryptographic challenges."
    },
    {
      icon: Globe,
      tag: "Cluster Nodes",
      title: "Secure WebSockets",
      description: "Geographically distributed backbone with mutual TLS 1.3 authentication required for all node-to-node traffic."
    },
    {
      icon: Fingerprint,
      tag: "SHA-512/256",
      title: "Integrity Verification",
      description: "Zero-tolerance message hashing ensures that any bit-flip or alteration results in immediate session termination."
    }
  ];

  return (
    <section className="px-6 relative overflow-hidden" id="features">
      {/* Background Section Glows */}
      <div className="absolute top-1/4 left-0 w-1/3 h-1/2 bg-[#ff1e1e]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/2 bg-[#ff1e1e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <Shield className="text-[#ff1e1e] w-4 h-4" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.4em] uppercase text-[10px]">
              Security Layer Details
            </span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white max-w-2xl leading-[0.9]"
            >
              UNCOMPROMISING <br />
              <span className="text-gradient-red">SECURITY STACK.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/40 max-w-sm text-sm leading-relaxed lg:mb-2 border-l border-[#ff1e1e]/20 pl-6"
            >
              ShieldX architecture integrates six layers of cryptographic protection into a single, seamless communication pipeline.
            </motion.p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
        
        {/* Footer Technical Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20"
        >
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5"><Cpu size={12} className="text-[#ff1e1e]/40" /> Hardware Secp256k1</span>
             <span className="flex items-center gap-1.5"><EyeOff size={12} className="text-[#ff1e1e]/40" /> Zero Visibility Architecture</span>
          </div>
          <p>Verified Secure — Sovereign Build v4.12.0</p>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityFeatures;
