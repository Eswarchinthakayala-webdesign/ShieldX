import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Bug, FileText, Search, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Key, Lock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecurityMetric = ({ icon: Icon, label, value }) => (
  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-3 mb-3">
      <Icon size={16} className="text-[#ff1e1e] opacity-60" />
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
  </div>
);

const SecurityPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative bg-[#0a0a0a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff1e1e]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff1e1e]/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-28 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center lg:justify-start gap-3 mb-8"
          >
            <ShieldAlert size={16} className="text-[#ff1e1e]" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Defense Verification</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
          >
            VERIFIED <br /> <span className="text-gradient-red drop-shadow-[0_0_30px_rgba(255,30,30,0.3)]">IMMUNITY.</span>
          </motion.h1>
          
          <p className="text-white/40 max-w-2xl text-lg md:text-2xl leading-relaxed font-medium mx-auto lg:mx-0">
            Trust but verify. Our security posture is validated by continuous audits, open bounty programs, and mathematical proofs.
          </p>
        </header>

   

        {/* Audit Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-start">
           <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                 THIRD-PARTY <br /> <span className="text-[#ff1e1e]">AUDITS.</span>
              </h2>
              <p className="text-white/30 text-lg leading-relaxed mb-10 font-medium italic">
                "ShieldX maintains a zero-vulnerability baseline across its core transmission protocols." — Lead Auditor, Cyber-Safe Group
              </p>
              
              <div className="space-y-6">
                 {[
                   { date: "Q4 2025", firm: "Quant-Resec", scope: "Post-Quantum Handshakes", status: "CLEAN" },
                   { date: "Q3 2025", firm: "Net-Fortify", scope: "Memory Sandboxing SDK", status: "VERIFIED" },
                   { date: "Q1 2025", firm: "Sovereign Audit", scope: "Global Node Integrity", status: "SECURE" }
                 ].map((audit, i) => (
                   <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#ff1e1e]/20 transition-all">
                      <div>
                         <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-widest mb-1">{audit.date}</div>
                         <h4 className="font-bold text-white">{audit.firm}</h4>
                         <span className="text-[10px] text-white/30 uppercase tracking-tighter">{audit.scope}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-mono text-green-500 bg-green-500/5 px-2 py-1 rounded border border-green-500/10 font-black">{audit.status}</span>
                         <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative glass-card border-white/5 p-12 md:p-16 rounded-[3rem] bg-black/40 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Bug size={160} />
              </div>
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-[#ff1e1e]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#ff1e1e]/20">
                    <Bug className="text-[#ff1e1e] w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Bug Bounty Program</h3>
                 <p className="text-white/40 text-sm leading-relaxed mb-10">
                    We incentivize independent security researchers to find and report vulnerabilities in our infrastructure. Rewards are scaled based on criticality.
                 </p>
                 
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/30">Severity: Critical</span>
                       <span className="text-white">Up to $50,000</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-full bg-[#ff1e1e] red-glow" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/30">Severity: Major</span>
                       <span className="text-white">Up to $15,000</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-[#ff1e1e]/60" />
                    </div>
                 </div>

                 <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all text-white">
                    Submit Report // SECURE_PORTAL
                 </button>
              </div>
           </div>
        </div>

        {/* Vulnerability Disclosure Section */}
        <div className="mb-40 relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#ff1e1e]/5 to-transparent blur-3xl rounded-[4rem] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative glass-card border-white/5 p-12 lg:p-24 rounded-[4rem] bg-black/40 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-grow max-w-2xl">
                    <div className="flex items-center gap-3 mb-8">
                       <ShieldAlert size={18} className="text-[#ff1e1e]" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Submission Channel</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                       VULNERABILITY <br /> <span className="text-[#ff1e1e]">DISCLOSURE.</span>
                    </h2>
                    <p className="text-white/40 text-lg leading-relaxed font-medium mb-10">
                       We maintain a transparent and responsive disclosure process. If you believe you've identified a security flaw, our team is ready to coordinate a responsible fix.
                    </p>
                    
                    <ul className="space-y-4">
                       {[
                         "PGP Encrypted Communication only",
                         "Initial response within 12 business hours",
                         "90-day coordinated disclosure policy",
                         "Safe harbor for ethical researchers"
                       ].map((item, idx) => (
                         <li key={idx} className="flex items-center gap-4 text-xs font-bold text-white/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 
                 <div className="lg:w-80 flex flex-col gap-4">
                    <button className="w-full py-6 bg-[#ff1e1e] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 red-glow">
                       Obtain PGP Key
                    </button>
                    <button className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                       Submit via Portal
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Security Standards Callout */}
        <div className="mb-40">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">PQA <span className="text-[#ff1e1e]">STANDARDS.</span></h2>
              <p className="text-white/30 font-medium">Certified compliance with post-quantum holographic encryption standards.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "NIST-Ready", desc: "Aligned with NIST's post-quantum cryptographic standards for long-term data persistence.", icon: CheckCircle2 },
                { title: "SOC2 Type II", desc: "Rigorous internal controls audited for security, availability, and processing integrity.", icon: Lock },
                { title: "HIPAA Compliant", desc: "Technical safeguards implemented to ensure PHI data remains encrypted and sovereign.", icon: ShieldCheck }
              ].map((std, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center group hover:bg-[#ff1e1e]/5 hover:border-[#ff1e1e]/20 transition-all">
                   <std.icon className="mx-auto text-[#ff1e1e] w-8 h-8 mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                   <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{std.title}</h4>
                   <p className="text-[11px] text-white/30 leading-relaxed font-semibold">{std.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Global Return */}
        <div className="text-center">
           <Link 
             to="/"
             className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all group"
           >
              DISCONNECT_VERIFIER // <span className="text-[#ff1e1e]/40 group-hover:text-[#ff1e1e] transition-colors">BACK_TO_HQ</span>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
