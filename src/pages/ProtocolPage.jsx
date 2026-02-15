import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, ShieldCheck, Zap, Fingerprint, Activity, Shield, Cpu, Binary, Globe, Terminal, Box, ChevronRight, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DetailCard = ({ icon: Icon, title, description, technical, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-[#0d0d0d] border border-white/5 p-8 rounded-3xl hover:border-[#ff1e1e]/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,30,30,0.1)] overflow-hidden"
  >
    {/* Animated Scanning Line */}
    <motion.div 
      animate={{ top: ['-10%', '110%'] }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      className="absolute left-0 w-full h-[1px] bg-[#ff1e1e]/20 blur-[1px] z-10"
    />

    <div className="flex justify-between items-start mb-8 relative z-20">
      <div className="w-14 h-14 bg-[#ff1e1e]/5 rounded-2xl flex items-center justify-center border border-[#ff1e1e]/10 group-hover:bg-[#ff1e1e]/10 group-hover:border-[#ff1e1e]/30 transition-all duration-500">
        <Icon className="text-[#ff1e1e] w-7 h-7 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex items-center gap-1.5 bg-[#ff1e1e]/5 px-2.5 py-1 rounded-md border border-[#ff1e1e]/10">
        <div className="w-1 h-1 rounded-full bg-[#ff1e1e] animate-pulse" />
        <span className="text-[9px] font-bold text-[#ff1e1e] tracking-[0.1em] uppercase">Phase_0{index + 1}</span>
      </div>
    </div>

    <div className="relative z-20">
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#ff1e1e] transition-colors duration-300 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-white/40 text-sm leading-relaxed mb-8">
        {description}
      </p>
    </div>

    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity relative z-20">
       <div className="flex items-center gap-2">
          <Cpu size={12} className="text-[#ff1e1e]" />
          <span className="text-[10px] font-mono tracking-tighter uppercase text-white/60">{technical}</span>
       </div>
       <div className="text-[10px] font-mono text-[#ff1e1e]/60">0x{index}F_PROT</div>
    </div>
  </motion.div>
);

const ProtocolStackItem = ({ title, desc, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff1e1e]/20 transition-all group"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-center justify-center group-hover:bg-[#ff1e1e]/10 transition-colors">
      <Icon className="text-[#ff1e1e] w-6 h-6" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{title}</h4>
      <p className="text-sm text-white/30 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const ProtocolPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-[#ff1e1e]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-28 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-[#ff1e1e]" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Security Engine Core</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
              >
                THE SHIELDX <br /> <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">PROTOCOL.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/40 max-w-2xl text-lg md:text-2xl leading-relaxed font-medium"
              >
                Unbreakable by design. ShieldX leverages <span className="text-white/80 font-bold">Hybrid Cryptography</span> to enforce absolute privacy in a post-quantum world.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden lg:flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md"
            >
              <Binary size={48} className="text-[#ff1e1e] animate-pulse" />
              <div className="text-center">
                <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-widest mb-1">Current Cipher</div>
                <div className="text-sm font-mono text-white">AES-256V4_PQA</div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-40">
          <DetailCard 
            icon={Lock}
            title="Asymmetric Origin"
            description="Initialization handshake using RSA-4096 and ECDH for secure session establishment."
            technical="PQA_READY_CRYPTO"
            index={0}
          />
          <DetailCard 
            icon={Key}
            title="GCM Stream"
            description="High-throughput AES-256-GCM encryption for all message payloads and file streams."
            technical="HARDWARE_ACCEL_CORE"
            index={1}
          />
          <DetailCard 
            icon={ShieldCheck}
            title="Mesh Integrity"
            description="Zero-Knowledge node verification ensuring stream integrity without data exposure."
            technical="ZK_RELAY_v4.2"
            index={2}
          />
          <DetailCard 
            icon={Fingerprint}
            title="Key Rotation"
            description="Perfect Forward Secrecy with sub-minute key rotation Intervals for maximum security."
            technical="PFS_ROTATION_ON"
            index={3}
          />
        </div>

        {/* System Stack & Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-40">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <Activity className="text-[#ff1e1e] w-4 h-4" />
              <span className="text-[#ff1e1e] font-bold tracking-[0.4em] uppercase text-[10px]">Protocol Logic Stack</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-12">
              LAYERED <br /> <span className="text-[#ff1e1e]">DEFENSE.</span>
            </h2>

            <div className="space-y-4">
              <ProtocolStackItem 
                icon={Share2}
                title="mTLS 1.3 Handshake"
                desc="Mandatory mutual TLS authentication for every node-to-node connection in the transmission mesh."
                delay={0.1}
              />
              <ProtocolStackItem 
                icon={Box}
                title="Onion Routing v2"
                desc="Multi-layered routing ensures that no single node knows the full path of the data stream."
                delay={0.2}
              />
              <ProtocolStackItem 
                icon={Cpu}
                title="TEE Execution"
                desc="Cryptographic operations are performed within Trusted Execution Environments (TEE/Enclave)."
                delay={0.3}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#ff1e1e]/5 blur-3xl rounded-full opacity-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative glass-card border-white/5 p-8 md:p-12 overflow-hidden h-full flex flex-col bg-black/40"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-[#ff1e1e]" />
                  <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Verification_Shell</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/5" />
                  <div className="w-2 h-2 rounded-full bg-white/5" />
                  <div className="w-2 h-2 rounded-full bg-white/5" />
                </div>
              </div>

              <div className="flex-grow font-mono text-[11px] md:text-sm text-[#ff1e1e]/60 space-y-4">
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">01</span>
                    <span className="text-white/80 font-bold">// INITIATING_PQA_HANDSHAKE...</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">02</span>
                    <span>ALICE {'>'} AD_PUBLIC_KEY: [0x4A_F2_E1...]</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">03</span>
                    <span>BOB {'>'} AD_PUBLIC_KEY: [0xF1_99_A2...]</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">04</span>
                    <span className="text-green-500 font-bold">[SUCCESS] SHARED_SECRET_GENERATED</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">05</span>
                    <span>SESSION_KDF: HMAC-SHA512(SECRET, SALT)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">06</span>
                    <span className="text-cyan-400 font-bold">[TUNNEL_OPEN] AES_256_GCM_READY</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/20 select-none">07</span>
                    <span className="animate-pulse">_</span>
                  </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20 text-[#ff1e1e] font-black text-xs tracking-tighter">4K</div>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">RSA DEPTH</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20 text-[#ff1e1e] font-black text-xs tracking-tighter">512</div>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">SHA SIGN</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#ff1e1e] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all red-glow group"
          >
             Return to Headquarters
             <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 30px rgba(255, 30, 30, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ProtocolPage;
