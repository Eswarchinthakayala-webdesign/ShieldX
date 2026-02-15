import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Shield, Lock, Globe, Cpu, Zap, ChevronRight, Bookmark, Share2, Printer,AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { toast } from 'sonner';

const ChapterLink = ({ number, title, active }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer group ${active ? 'bg-[#ff1e1e]/10 border border-[#ff1e1e]/20' : 'hover:bg-white/5 border border-transparent'}`}>
    <span className={`font-mono text-[10px] ${active ? 'text-[#ff1e1e]' : 'text-white/20'}`}>{number}</span>
    <span className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>{title}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-[#ff1e1e] animate-pulse" />}
  </div>
);

const WhitepaperPage = () => {
  const handleDownload = () => {
    toast.success("SECURE_GEN_INITIATED", {
      description: "Mathematical proofs are being compiled into PDF format. Please wait...",
      duration: 4000
    });
    // In a real app, this would be a link to a static asset or generated via a worker
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative bg-[#0a0a0a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff1e1e]/20 to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none print:hidden" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 print:mb-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8 print:hidden"
            >
              <FileText size={16} className="text-[#ff1e1e]" />
              <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Technical Documentation v4.2</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-8"
            >
              SHIELDX <br /> <span className="text-gradient-red">WHITEPAPER.</span>
            </motion.h1>
            
            <p className="text-white/40 text-lg md:text-xl leading-relaxed font-medium print:text-black print:text-sm">
              A comprehensive analysis of hybrid encryption mesh architecture and post-quantum cryptographic persistence.
            </p>
          </div>

          <div className="flex gap-4 print:hidden">
             <button 
               onClick={handleDownload}
               className="flex items-center gap-3 px-8 py-4 bg-[#ff1e1e] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all red-glow"
             >
                <Download size={16} />
                Download PDF
             </button>
             <button 
                onClick={handlePrint}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
             >
                <Printer size={16} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-8 hidden lg:block">
            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 sticky top-32">
               <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 px-4">Contents</h4>
               <nav className="space-y-2">
                  <ChapterLink number="01" title="Abstract" active />
                  <ChapterLink number="02" title="The Problem" />
                  <ChapterLink number="03" title="Encryption Mesh" />
                  <ChapterLink number="04" title="PQA Protocols" />
                  <ChapterLink number="05" title="Node Sovereignty" />
                  <ChapterLink number="06" title="Audit Trails" />
                  <ChapterLink number="07" title="Conclusion" />
               </nav>
            </div>
          </aside>

          {/* Document Content */}
          <main className="lg:col-span-9 space-y-20 pb-40">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:text-white/50 prose-p:leading-relaxed prose-p:text-lg"
            >
               <section id="abstract" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">01. Abstract</h2>
                  <p>
                    Encryption as it exists today is facing a systemic collapse. The advent of quantum computing threatens the mathematical foundations of nearly every commercial communication tool. ShieldX addresses this by decoupling the transmission mesh from central authorities and implementing a hybrid encryption stack that is both post-quantum ready and geographically sovereign.
                  </p>
                  <p>
                    This paper introduces the architecture of the ShieldX Data Mesh, a decentralized network of cryptographic nodes that ensures absolute data persistence and Zero-Knowledge integrity without the oversight of centralized entities.
                  </p>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="problem" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">02. The Problem</h2>
                  <p>
                    Existing end-to-end encryption frameworks rely heavily on centralized key management and directory services. These "Secure" platforms create a singular point of failure: the metadata layer. Even when payloads are encrypted, the "who, when, and where" of communication remains visible to the orchestrator.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                     <div className="p-8 rounded-3xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10">
                        <AlertTriangle className="text-[#ff1e1e] mb-4" />
                        <h4 className="text-white mb-2 uppercase font-black">Centralization Risk</h4>
                        <p className="text-sm">Centralized servers are vulnerable to legal subpoenas and massive hardware failures.</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                        <Cpu className="text-white/40 mb-4" />
                        <h4 className="text-white mb-2 uppercase font-black">Quantum Decay</h4>
                        <p className="text-sm">RSA and ECC algorithms will eventually become transparent to Shor's algorithm.</p>
                     </div>
                  </div>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="architecture" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">03. The Hybrid Mesh</h2>
                  <p>
                    ShieldX replaces the centralized relay model with a distributed mesh. Every node in our network serves as a "Blind Transcoder." They do not possess the keys to decrypt the stream; they only possess the mathematical proofs required to verify the integrity of the transit.
                  </p>
                  <div className="relative p-12 rounded-[3rem] bg-black border border-white/5 overflow-hidden group">
                     <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <Lock size={400} className="text-[#ff1e1e] group-hover:scale-110 transition-transform duration-1000" />
                     </div>
                     <div className="relative z-10 text-center">
                        <h4 className="text-2xl font-black text-white mb-4 uppercase">Zero-Visibility Routing</h4>
                        <p className="text-white/40 max-w-md mx-auto italic text-base">"The network knows nothing about the data it carries, ensuring total sovereignty for the end user."</p>
                     </div>
                  </div>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="pqa" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">04. PQA Protocols</h2>
                  <p>
                    ShieldX integrates Post-Quantum Algorithms (PQA) at the very first handshake. By utilizing a hybrid of Kyber-768 and classic ECDH, we ensure that even if a future quantum adversary captures today's traffic, the computational complexity of decryption remains beyond physical limits.
                  </p>
                  <div className="flex flex-col md:flex-row gap-12 items-start bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5">
                     <div className="flex-grow">
                        <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">The Quantum Shield</h4>
                        <ul className="space-y-3 text-sm">
                           <li className="flex items-center gap-3 text-white/60"><div className="w-1 h-1 bg-[#ff1e1e] rounded-full" /> Lattice-based Cryptography integration.</li>
                           <li className="flex items-center gap-3 text-white/60"><div className="w-1 h-1 bg-[#ff1e1e] rounded-full" /> Sub-10ms PQA handshake verification.</li>
                           <li className="flex items-center gap-3 text-white/60"><div className="w-1 h-1 bg-[#ff1e1e] rounded-full" /> Forward Secrecy across all mesh hops.</li>
                        </ul>
                     </div>
                     <div className="w-full md:w-32 h-32 flex items-center justify-center bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 rounded-2xl">
                        <Zap size={40} className="text-[#ff1e1e] animate-pulse" />
                     </div>
                  </div>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="sovereignty" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">05. Node Sovereignty</h2>
                  <p>
                    The "Sovereign Node" is the unit of power in ShieldX. Unlike centralized data centers, our nodes are jurisdictionally distributed. If a node in one region is compromised or legally coerced, the rest of the mesh immediately path-shuffles, rendering the localized breach irrelevant.
                  </p>
                  <p>
                    Every node operates in a Trusted Execution Environment (TEE), shielding its cryptographic memory even from the host machine's administrator.
                  </p>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="audits" className="space-y-8">
                  <h2 className="text-4xl md:text-6xl text-white">06. Audit Trails</h2>
                  <p>
                    Total privacy does not mean a lack of accountability. ShieldX implements Zero-Knowledge Audit Trails. We can mathematically prove that the system is operating according to its protocol without ever seeing the contents of the communication itself.
                  </p>
                  <blockquote className="border-l-4 border-[#ff1e1e] pl-8 py-4 bg-white/[0.01] text-xl font-medium italic text-white/40">
                    "Accountability is built into the hash, not the identity."
                  </blockquote>
               </section>

               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent my-20" />

               <section id="conclusion" className="space-y-8 mb-40">
                  <h2 className="text-4xl md:text-6xl text-white">07. Conclusion</h2>
                  <p>
                    ShieldX represents the final evolution of communication privacy. By combining decentralized mesh routing, post-quantum cryptography, and jurisdictional sovereignty, we have created a platform that is truly immune to the oversight of centralized entities.
                  </p>
                  <p>
                    The era of digital surveillance is over. The era of mathematical persistence has begun.
                  </p>
               </section>
            </motion.div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default WhitepaperPage;
