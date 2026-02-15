import React from 'react';
import { motion } from 'framer-motion';
import { Server, Share2, Database, Shield, Globe, Cpu, Activity, LayoutGrid, Network, Layers, Zap, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArchLayer = ({ title, subtitle, items, index, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-[#0d0d0d] border border-white/5 p-8 md:p-10 rounded-[2.5rem] hover:border-[#ff1e1e]/40 transition-all duration-500 overflow-hidden"
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 bg-[#ff1e1e]/5 rounded-2xl flex items-center justify-center border border-[#ff1e1e]/10 group-hover:bg-[#ff1e1e]/10 group-hover:border-[#ff1e1e]/30 transition-all duration-500">
          <Icon className="text-[#ff1e1e] w-8 h-8" />
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-1">Layer_0{index + 1}</div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">INFRA_STCK_v4.2</div>
        </div>
      </div>

      <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-[#ff1e1e] transition-colors">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">{subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" />
               <span className="text-xs font-bold text-white/80 uppercase tracking-tight">{item.name}</span>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed font-medium pl-3.5 italic">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom Glow Line */}
    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff1e1e] group-hover:w-full transition-all duration-700 ease-out" />
  </motion.div>
);

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative bg-[#0a0a0a] overflow-hidden">
      {/* Absolute HUD Decor */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-[#ff1e1e]" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Mesh Infrastructure</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
              >
                THE HYBRID <br /> <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">DATA MESH.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/40 max-w-2xl text-lg md:text-2xl leading-relaxed font-medium"
              >
                A decentralized, geo-sovereign backbone designed for massive throughput and <span className="text-white/80 font-bold underline decoration-[#ff1e1e] underline-offset-8">Zero-Latency delivery</span>.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="lg:w-72 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hidden md:block"
            >
               <div className="flex items-center gap-3 mb-4">
                  <Activity size={14} className="text-[#ff1e1e] animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network_Load</span>
               </div>
               <div className="space-y-3">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: ['20%', '60%', '45%'] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="h-full bg-[#ff1e1e]" 
                      />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-white/30">
                     <span>TRAFFIC_INGRESS</span>
                     <span className="text-white/60">4.2 TB/S</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </header>

        {/* Global Stats HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-40">
           {[
             { label: "Active Edge Nodes", val: "72", icon: Network },
             { label: "Global Uptime", val: "99.99%", icon: Activity },
             { label: "Peer Latency", val: " < 12ms", icon: Zap },
             { label: "Sovereign Jurisdictions", val: "14", icon: Globe }
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.04] transition-all"
             >
                <stat.icon className="text-[#ff1e1e] w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <div>
                   <div className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-1">{stat.val}</div>
                   <div className="text-[9px] md:text-[10px] font-bold text-white/20 uppercase tracking-widest leading-tight">{stat.label}</div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Architecture Layers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-40">
          <ArchLayer 
            index={0}
            icon={Shield}
            title="Local Enclave"
            subtitle="Secure memory sandboxing at the client edge, ensuring no cleartext ever touches disk storage."
            items={[
              { name: "Hardware Isolation", desc: "Native integration with CPU secure enclaves." },
              { name: "Zero-Persistence", desc: "Memory-only execution for ephemeral keys." }
            ]}
          />
          <ArchLayer 
            index={1}
            icon={Share2}
            title="Transmission Mesh"
            subtitle="Blind-routing protocols that randomize packet delivery paths through geographical sovereign nodes."
            items={[
               { name: "Node Anonymity", desc: "Blind relays with no knowledge of origin/dest." },
               { name: "Path Shuffling", desc: "Real-time route randomization during transit." }
            ]}
          />
          <ArchLayer 
            index={2}
            icon={Database}
            title="Distributed Ledger"
            subtitle="Cryptographically signed metadata stored in private, immutable shards across the global cluster."
            items={[
               { name: "Auth Verification", desc: "Immutable proofs for every identity handshake." },
               { name: "Audit Integrity", desc: "Transparent, tamper-proof system logs." }
            ]}
          />
          <ArchLayer 
            index={3}
            icon={Server}
            title="Atomic Delivery"
            subtitle="Multi-party computation for recipient verification, culminating in self-destructing relay states."
            items={[
               { name: "Self-Destruct", desc: "Memory wipes immediately upon delivery confirm." },
               { name: "Atomic Handover", desc: "Synchronous key verification for handover." }
            ]}
          />
        </div>

        {/* Technical Schematic Callout */}
        <div className="relative glass-card border-white/5 p-10 md:p-24 rounded-[3rem] overflow-hidden mb-40 flex flex-col items-center text-center">
           <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-[#ff1e1e]/5 to-transparent flex items-center justify-center pointer-events-none">
              <Layers size={600} className="text-white/[0.01] animate-pulse-slow" />
           </div>
           
           <div className="relative z-10 max-w-3xl">
              <div className="w-20 h-20 rounded-3xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center mx-auto mb-10 red-glow">
                 <ShieldCheck className="text-[#ff1e1e] w-10 h-10" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Engineered for <br /><span className="text-[#ff1e1e]">Absolute Persistence.</span></h2>
              <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                 Our architecture is audited by top-tier security firms to ensure that "Privacy-First" isn't a promise, but a mathematical certainty.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <Link 
                   to="/whitepaper"
                   className="w-full sm:w-auto px-10 py-5 bg-[#ff1e1e] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all red-glow text-center"
                 >
                    Technical Whitepaper
                 </Link>
                 <Link 
                   to="/protocol"
                   className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-center"
                 >
                    Protocol Deep-Dive
                    <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </div>

        {/* Global Return */}
        <div className="text-center">
           <Link 
             to="/"
             className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all group"
           >
              TERMINATE_VIEW // <span className="text-[#ff1e1e]/40 group-hover:text-[#ff1e1e] transition-colors">BACK_TO_HQ</span>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ArchitecturePage;
