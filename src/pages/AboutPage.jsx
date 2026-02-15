import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Target, Rocket, Activity, Network, Shield, MessageSquare, Mail, Terminal, ChevronRight, Cpu, Zap, Fingerprint, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MissionPillar = ({ title, subtitle, items, index, icon: Icon }) => (
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
          <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-1">Pillar_0{index + 1}</div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">MISSION_CTRL_v4.2</div>
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

const AboutPage = () => {
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
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">The Core Initiative</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
              >
                PRIVACY IS A <br /> <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">PUBLIC RIGHT.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/40 max-w-2xl text-lg md:text-2xl leading-relaxed font-medium"
              >
                Founded by cryptographers and engineers dedicated to ending digital surveillance through <span className="text-white/80 font-bold underline decoration-[#ff1e1e] underline-offset-8">mathematical certainty</span>.
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
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network_Stability</span>
               </div>
               <div className="space-y-3">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: ['40%', '95%', '90%'] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="h-full bg-[#ff1e1e]" 
                      />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-white/30">
                     <span>LOGIC_INTEGRITY</span>
                     <span className="text-white/60">100% SECURE</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </header>


        {/* Mission Directives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-40">
          <MissionPillar 
            index={0}
            icon={Target}
            title="Independence"
            subtitle="ShieldX is self-sustaining and sovereign by design, answerable only to its cryptographic code."
            items={[
              { name: "No VC Funding", desc: "100% community and founder funded for absolute neutrality." },
              { name: "Zero Board Oversight", desc: "No corporate interests can override user privacy protocols." }
            ]}
          />
          <MissionPillar 
            index={1}
            icon={Fingerprint}
            title="Open Logic"
            subtitle="Our core protocols are fully verifiable, proving that no backdoors exist within our mesh."
            items={[
               { name: "Ope-Source Core", desc: "Every cryptographic handshake is public and auditable." },
               { name: "Verifiable Proofs", desc: "Mathematical integrity checks for every node delivery." }
            ]}
          />
          <MissionPillar 
            index={2}
            icon={Zap}
            title="Quantum Defensive"
            subtitle="Built for the next decade. Our infrastructure is already hardened against future threats."
            items={[
               { name: "Hybrid PQA", desc: "Lattice-based encryption combined with classic ECC." },
               { name: "Future Proof", desc: "Hardware upgrades scheduled for 2030 standards today." }
            ]}
          />
          <MissionPillar 
            index={3}
            icon={ShieldCheck}
            title="Zero Accountability"
            subtitle="Accountability to the user, not the state. We don't store what we cannot see."
            items={[
               { name: "No Retention", desc: "Ephemeral memory cycles wipe all metadata upon delivery." },
               { name: "Blind Routing", desc: "Relays have zero knowledge of source or destination." }
            ]}
          />
        </div>

        {/* High-Impact Contact Callout */}
        <div className="relative glass-card border-white/5 p-10 md:p-24 rounded-[3rem] overflow-hidden mb-40 flex flex-col items-center text-center">
           <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-[#ff1e1e]/5 to-transparent flex items-center justify-center pointer-events-none">
              <MessageSquare size={600} className="text-white/[0.01] animate-pulse-slow" />
           </div>
           
           <div className="relative z-10 max-w-3xl">
              <div className="w-20 h-20 rounded-3xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center mx-auto mb-10 red-glow">
                 <MessageSquare className="text-[#ff1e1e] w-10 h-10" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Communicate <br /><span className="text-[#ff1e1e]">Without Traces.</span></h2>
              <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                 Join the encrypted revolution. Whether you're a developer or a sovereignty seeker, our infrastructure is your sanctuary. Take the final step into total privacy.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <button className="w-full sm:w-auto px-10 py-5 bg-[#ff1e1e] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all red-glow">
                    Initialize Mesh
                 </button>
                 <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    Contact Core Ingress
                    <ArrowRight size={14} />
                 </button>
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

export default AboutPage;
