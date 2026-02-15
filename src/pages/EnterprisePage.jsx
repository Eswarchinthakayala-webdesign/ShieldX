import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Users, Globe, Briefcase, Activity, CheckCircle2, ChevronRight, Zap, Target, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlanCard = ({ title, price, features, recommended, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`relative p-10 rounded-[3rem] border transition-all duration-500 group overflow-hidden ${
      recommended 
        ? 'bg-[#111] border-[#ff1e1e]/40 shadow-[0_0_60px_rgba(255,30,30,0.1)]' 
        : 'bg-[#0d0d0d] border-white/5 hover:border-[#ff1e1e]/20'
    }`}
  >
    {recommended && (
      <div className="absolute top-0 right-0 px-6 py-2 bg-[#ff1e1e] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
        Recommended_System
      </div>
    )}

    <div className="mb-8">
      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter group-hover:text-[#ff1e1e] transition-colors">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-white">{price}</span>
        {price !== "Custom" && <span className="text-white/20 text-[10px] font-bold font-mono tracking-widest uppercase">/ Node / MO</span>}
      </div>
    </div>

    <ul className="space-y-4 mb-12">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/40 group-hover:text-white/80 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" />
          {f}
        </li>
      ))}
    </ul>

    <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
      recommended 
        ? 'bg-[#ff1e1e] text-white hover:scale-[1.03] red-glow' 
        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
    }`}>
       Deploy_Infrastructure
    </button>
  </motion.div>
);

const EnterprisePage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative bg-[#0a0a0a] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff1e1e]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-32 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center lg:justify-start gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-[#ff1e1e]" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Enterprise Scaling</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
          >
            SOVEREIGN <br /> <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">CONTROL.</span>
          </motion.h1>
          
          <p className="text-white/40 max-w-2xl text-lg md:text-2xl leading-relaxed font-medium mx-auto lg:mx-0">
            Secure your organization's entire digital fabric with <span className="text-white/80 font-bold">Audited Hybrid Encryption</span> and real-time infrastructure visibility.
          </p>
        </header>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          <PlanCard 
            index={0}
            title="Standard"
            price="$29"
            features={[
              "Client-Side Enclave Support",
              "12-Jurisdiction Routing",
              "Standard Audit Reporting",
              "Priority Support (24h SLA)"
            ]}
          />
          <PlanCard 
            index={1}
            recommended={true}
            title="Enterprise"
            price="$69"
            features={[
              "Dedicated Mesh Relays",
              "Post-Quantum Handshakes",
              "Real-time Forensics HUD",
              "Multi-Region Persistence",
              "Red-Team Support Integration"
            ]}
          />
          <PlanCard 
            index={2}
            title="Sovereign"
            price="Custom"
            features={[
              "On-Premise Node Clusters",
              "Custom Cipher Implementation",
              "Full Protocol Ownership",
              "Air-Gapped Compliance",
              "Direct Engineering Access"
            ]}
          />
        </div>

        {/* Professional Feature Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-center">
           <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                  THE ENTERPRISE <br /> <span className="text-[#ff1e1e]">ADVANTAGE.</span>
                </h2>
                <p className="text-white/40 text-lg leading-relaxed font-medium">
                   Engineered for organizations that refuse to compromise. ShieldX provides a military-grade backbone for the modern corporate entity.
                </p>
              </div>
              
              <div className="space-y-8">
                 {[
                   { title: "Sovereign Key Control", desc: "Enterprise admins maintain full control over lifecycle policies without ever seeing cleartext data.", icon: Lock },
                   { title: "Audited Compliance", desc: "Automated logging and cryptographic proofs ensure SOC2, HIPAA, and GDPR compliance.", icon: ShieldCheck },
                   { title: "Massive Persistence", desc: "Maintain connectivity in even the most hostile or restricted network environments globally.", icon: Target }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ff1e1e]/40 transition-colors">
                         <item.icon size={20} className="text-[#ff1e1e]" />
                      </div>
                      <div>
                         <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{item.title}</h4>
                         <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative glass-card border-white/5 p-12 md:p-20 rounded-[3rem] overflow-hidden flex flex-col items-center text-center bg-black/40 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Building2 size={240} className="text-white" />
              </div>
              
              <div className="relative z-10 w-full">
                 <div className="w-20 h-20 bg-[#ff1e1e]/10 rounded-3xl border border-[#ff1e1e]/20 flex items-center justify-center mx-auto mb-10 red-glow">
                    <Briefcase className="text-[#ff1e1e]" size={36} />
                 </div>
                 <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Ready for Deployment?</h3>
                 <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto font-medium">Contact our specialized engineering team to discuss your organization's custom infrastructure requirements.</p>
                 <button className="w-full py-5 bg-white/[0.03] border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Connect with Security Specialist</button>
              </div>
           </div>
        </div>

        {/* Global Return */}
        <div className="text-center">
           <Link 
             to="/"
             className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all group"
           >
              EXIT_PORTAL // <span className="text-[#ff1e1e]/40 group-hover:text-[#ff1e1e] transition-colors">RETURN_TO_HQ</span>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePage;
