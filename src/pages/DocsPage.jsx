import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Menu, 
  X, 
  Terminal, 
  Lock, 
  Cpu, 
  Shield, 
  Database, 
  Globe, 
  Activity, 
  Fingerprint,
  Zap,
  Check,
  Copy,
  ExternalLink,
  Network,
  Users,
  Code,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Logo from '../components/landing-page/Logo';


const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              background: 'transparent',
              padding: 0,
              margin: 0,
              fontSize: 'inherit'
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className="text-[#ff1e1e]/80 bg-white/[0.05] px-1.5 py-0.5 rounded-md font-mono" {...props}>
            {children}
          </code>
        );
      },
      pre({ children }) {
        return <div className="p-0 m-0">{children}</div>;
      }
    }}
  >
    {content}
  </ReactMarkdown>
);

const DOCS_CONTENT = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <div className="space-y-10">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">01. Introduction</h1>
        
        <div className="space-y-8 text-lg md:text-xl text-white/50 leading-relaxed font-medium">
          <section className="space-y-4">
            <h3 className="text-white text-2xl font-black uppercase tracking-tight italic">What is ShieldX?</h3>
            <p>
              ShieldX is a next-generation, secure two-user messaging platform meticulously engineered to solve the "Metadata Crisis" in modern communications. While traditional platforms encrypt the payload, they often leave the transport headers and delivery metadata exposed to central authorities. ShieldX leverages a proprietary hybrid cryptographic mesh to ensure that your communication remains an absolute secret—not just the content, but the context itself.
            </p>
            <p>
              Built on a foundation of zero-trust principles, ShieldX operates as a blind relay. It is designed to facilitate end-to-end encrypted (E2EE) communication with zero plaintext exposure to the server environment. This means that even in the event of a total server host compromise, the adversary gains access only to indecipherable fragments of entropy.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white text-2xl font-black uppercase tracking-tight italic">The Mission</h3>
            <p>
              Our mission is to provide an uncompromising sanctuary for digital communication in an era of pervasive surveillance. We believe that privacy is not a luxury or a "premium feature"—it is a fundamental human right that must be enforced through mathematical certainty rather than corporate promises.
            </p>
            <p>
              ShieldX aims to bridge the gap between high-security military protocols and user-friendly interface design. We have stripped away the complexities of manual key management, automating the most rigorous cryptographic handshakes behind a high-fidelity, futuristic dashboard that empowers the user without overwhelming them.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white text-2xl font-black uppercase tracking-tight italic">Security Philosophy</h3>
            <p>
              The ShieldX philosophy is rooted in "Sovereignty of the Endpoint." We assume that the network is always hostile and the server is eventually compromised. By moving all cryptographic intelligence to the client-side (the browser), we ensure that the "keys to the kingdom" never leave your physical device. 
            </p>
            <p>
              We adhere to the Kerckhoffs's Principle: a cryptographic system should be secure even if everything about the system, except the key, is public knowledge. ShieldX is built for auditability, transparency, and resilience against both classical and emerging quantum threats.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white text-2xl font-black uppercase tracking-tight italic">Why Hybrid Cryptography?</h3>
            <p>
              Pure asymmetric encryption (like RSA) is mathematically robust for identity but computationally expensive for large data streams. Symmetric encryption (like AES) is incredibly fast but requires a secure way to share keys. 
            </p>
            <p>
              ShieldX solves this by using a hybrid approach: we use the "Asymmetric Shield" to securely exchange session secrets, and the "Symmetric Sword" to encrypt the actual message data at lightning speed. This dual-layered defense provides the best of both worlds: absolute identity verification and high-performance throughput.
            </p>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
           <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-[#ff1e1e]/30 transition-all duration-500">
              <Shield className="text-[#ff1e1e] mb-6" size={32} />
              <h4 className="text-white font-black uppercase mb-3 tracking-widest text-sm">Military-Grade Persistence</h4>
              <p className="text-xs text-white/30 leading-relaxed font-medium">Engineered for 99.9% uptime in hostile network environments with automated packet recovery and integrity checks.</p>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-[#ff1e1e]/30 transition-all duration-500">
              <Lock className="text-[#ff1e1e] mb-6" size={32} />
              <h4 className="text-white font-black uppercase mb-3 tracking-widest text-sm">Post-Quantum Resilience</h4>
              <p className="text-xs text-white/30 leading-relaxed font-medium">Integrating lattice-based algorithms to ensure your communication today remains secret even against the quantum computers of tomorrow.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    id: 'architecture',
    title: 'Architecture Overview',
    content: (
      <div className="space-y-12">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">02. Architecture</h1>
        
        <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium max-w-4xl">
          The ShieldX architecture is a masterpiece of cryptographic isolation. It is engineered across four distinct technical tiers, each separated by strict sovereign boundaries to ensure that no single point of failure can compromise the integrity of the user's data.
        </p>

        <div className="space-y-16 mt-20">
          {/* Tier 1: Client */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 text-[#ff1e1e] text-[10px] font-bold uppercase tracking-widest rounded-md font-mono">Tier_01</div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">The Sovereign Client</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="text-white/40 text-lg leading-relaxed space-y-4">
                  <p>
                    ShieldX terminates the security boundary at the edge of the user's browser. Unlike traditional apps that process data on the server, ShieldX treats the client as a high-security compute node.
                  </p>
                  <p>
                    Using the **Web Crypto API**, we execute non-extractable key operations. All passphrases are processed through a salted **Argon2** derivation function locally, ensuring that the master key never touches the network stack in a vulnerable state.
                  </p>
               </div>
               <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.4em] mb-4">Boundary_Protocols</div>
                  {[
                    'Local RSA-4096 Identity Anchoring',
                    'Ephemeral AES-256-GCM Sessioning',
                    'Hardware-Bound Non-Extractable Keys',
                    'Strict Content Security Policy (CSP)'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-white/60 uppercase font-black tracking-tighter hover:text-white transition-colors cursor-default">
                       <Check size={14} className="text-[#ff1e1e]" /> {item}
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Tier 2: API Ingress */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-md font-mono">Tier_02</div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Stateless Orchestration</h2>
            </div>
            <div className="text-white/40 text-lg leading-relaxed max-w-4xl space-y-4">
               <p>
                 Our backend is built on a "Blind Routing" philosophy. The Node.js API layer is entirely stateless regarding user content. It manages identity through secure, hard-expiry JWTs and provides a lookup service for public keys.
               </p>
               <p>
                 Because the server cannot decrypt the traffic, its role is simplified to that of a high-speed logistical hub. This decoupling ensures that even if the API server is physically seized, the attacker finds only a mapping of UUIDs to encrypted blobs.
               </p>
            </div>
          </section>

          {/* Diagram Section */}
          <div className="relative p-12 md:p-24 rounded-[4rem] bg-black border border-white/5 overflow-hidden my-12 group">
             <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                <Activity size={500} className="text-[#ff1e1e] group-hover:scale-110 transition-transform duration-1000" />
             </div>
             <div className="relative z-10 flex flex-col items-center gap-12">
                <div className="text-[10px] font-mono text-[#ff1e1e] tracking-[0.7em] uppercase mb-4 font-black">System_Mesh_Topology</div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ff1e1e]/40 transition-all duration-700">
                         <Shield size={32} className="text-[#ff1e1e]" />
                      </div>
                      <div className="text-center">
                         <span className="text-[11px] font-black text-white uppercase tracking-widest block">Client_A</span>
                         <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Keys_Hardware_Bound</span>
                      </div>
                   </div>
                   <div className="h-20 w-[1px] md:w-32 md:h-[1px] bg-gradient-to-r from-[#ff1e1e] to-transparent opacity-40 animate-pulse" />
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-32 h-32 rounded-full bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,30,30,0.15)] group-hover:rotate-180 transition-transform duration-1000">
                         <Terminal size={40} className="text-[#ff1e1e]" />
                      </div>
                      <div className="text-center">
                         <span className="text-[11px] font-black text-white uppercase tracking-widest block">Blind_Mesh</span>
                         <span className="text-[8px] font-bold text-[#ff1e1e]/60 uppercase tracking-[0.3em]">Cipher_Relay_Only</span>
                      </div>
                   </div>
                   <div className="h-20 w-[1px] md:w-32 md:h-[1px] bg-gradient-to-l from-[#ff1e1e] to-transparent opacity-40 animate-pulse" />
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ff1e1e]/40 transition-all duration-700">
                         <ShieldCheck size={32} className="text-[#ff1e1e]" />
                      </div>
                      <div className="text-center">
                         <span className="text-[11px] font-black text-white uppercase tracking-widest block">Client_B</span>
                         <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Dec_Verification_Pass</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Tier 3: Real-Time Sync */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-md font-mono">Tier_03</div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Post-Standard Mesh</h2>
            </div>
            <div className="text-white/40 text-lg leading-relaxed max-w-4xl space-y-6">
               <p>
                 Real-time communication is facilitated by a custom implementation of the **WebSocket Secure (WSS)** protocol. This mesh layer is responsible for the instant distribution of encrypted packets across the global sharded infrastructure.
               </p>
               <p>
                 When User A sends a packet, it is immediately broadcast to the recipient's active socket. If the recipient is offline, the mesh automatically downgrades to Tier 04 persistence, ensuring that no data is ever lost during transit.
               </p>
            </div>
          </section>

          {/* Tier 4: Storage */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-md font-mono">Tier_04</div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Sharded Persistence</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="text-white/40 text-lg leading-relaxed space-y-4">
                  <p>
                    ShieldX uses a highly available **PostgreSQL** cluster for persistent storage. To maximize security, the database is sharded geographically, and strictly enforces a "Cipher-Only" storage policy. 
                  </p>
                  <p>
                    Every row in the `tbl_messages` table is an opaque cryptographic blob. Even the relationships between users are shrouded in sharded identifiers, making traditional data-mining impossible.
                  </p>
               </div>
               <div className="p-12 rounded-[3.5rem] bg-[#0d0d0d] border border-white/5 flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
                  <Database className="absolute bottom-[-20%] right-[-20%] text-[#ff1e1e] opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000" size={300} />
                  <div className="relative z-10 text-center">
                     <div className="text-[10px] font-mono text-[#ff1e1e] font-black uppercase tracking-[0.5em] mb-4">Storage_Cluster_Sync</div>
                     <div className="text-5xl font-black text-white uppercase tracking-tighter italic">VAULTED.</div>
                     <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-6">Redundant // Sharded // Blind</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Zero-Knowledge Summary */}
          <section className="mt-32 p-16 rounded-[4rem] bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Zap size={200} className="text-[#ff1e1e]" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">Zero-Knowledge Trust</h2>
            <p className="text-white/50 text-xl leading-relaxed max-w-3xl font-medium italic relative z-10">
              "The ultimate security is not found in complex locks, but in the total absence of keys within the vulnerability zone. In ShieldX, the server doesn't have the keys because it never earned the right to see the data."
            </p>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'cryptography',
    title: 'Cryptographic Design',
    content: (
      <div className="space-y-12 pb-20">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">03. Cryptography</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            ShieldX is built on the premise that "Trust is a vulnerability." Our cryptographic architecture is a multi-layered fortress designed to withstand not only current classical adversaries but also future quantum-scale threats.
          </p>
        </div>

        <div className="space-y-20">
          <section className="space-y-8">
            <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">3.1 Sovereign Hybrid Architecture</h2>
              <p className="text-lg text-white/50 leading-relaxed max-w-4xl">
                The core of ShieldX is a **Hybrid Cryptosystem** that combines the identity-binding power of asymmetric encryption with the high-velocity throughput of symmetric streams. Every bit of data that leaves your device is transformed into high-entropy noise using industry-standard primitives hardened by custom tactical wrappers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:bg-[#ff1e1e]/5 transition-all space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center">
                  <Lock size={32} className="text-[#ff1e1e]" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-white uppercase">Asymmetric Handshake</h4>
                  <p className="text-sm text-white/40 leading-relaxed uppercase tracking-wide">
                    ShieldX utilizes **RSA-4096** with OAEP padding or **X25519** for initial key exchange. This layer ensures that only the intended recipient, possessing the corresponding private key on their local device, can ever decrypt the session parameters. 
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-mono text-[#ff1e1e] font-black tracking-widest uppercase">
                    <ShieldCheck size={14} /> Identity_Verified
                  </div>
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:bg-[#ff1e1e]/5 transition-all space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center">
                  <Zap size={32} className="text-[#ff1e1e]" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-white uppercase">Symmetric Data Stream</h4>
                  <p className="text-sm text-white/40 leading-relaxed uppercase tracking-wide">
                    Once the handshake is finalized, the session transitions to **AES-256-GCM** (Galois/Counter Mode). GCM provides both high-speed encryption and built-in message authentication (integrity), preventing "Man-in-the-Middle" bit-flipping attacks.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-mono text-[#ff1e1e] font-black tracking-widest uppercase">
                    <Activity size={14} /> throughput_99_9
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-110 transition-transform duration-700">
                <Cpu size={200} className="text-[#ff1e1e]" />
              </div>
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">3.2 The Encryption Life-Cycle</h2>
                  <p className="text-white/40 text-lg leading-relaxed max-w-3xl font-medium">
                    Every message goes through a specialized isolation pipeline. We don't just encrypt the text; we encapsulate the entire data object within a multi-tiered cryptographic envelope.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                    {[
                      { step: 'KDF_DERIVATION', desc: 'Generate 256-bit ephemeral keys using Argon2id with high memory cost.' },
                      { step: 'AEAD_ENCAPSULATION', desc: 'Payload is encrypted with AES-GCM and a unique 96-bit nonce.' },
                      { step: 'MESH_ROUTING_PREP', desc: 'The ciphertext is sharded and tagged with a routing hash.' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <span className="text-2xl font-black text-[#ff1e1e]/40 font-mono">0{i+1}</span>
                        <div className="space-y-1">
                          <h5 className="text-white font-black text-sm uppercase tracking-widest">{step.step}</h5>
                          <p className="text-white/30 text-xs uppercase leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.03]">
                       <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff1e1e]/40" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff1e1e]/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff1e1e]/10" />
                       </div>
                       <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">CORE_ENCRYPTION_ENGINE</span>
                    </div>
                    <div className="p-10 text-xs md:text-sm">
                      <MarkdownRenderer 
                        content={`\`\`\`javascript
// High-Level Encryption Sequence
const ShieldXEngine = async (data, recipient) => {
  // 1. Generate Ephemeral Session Key
  const sessionKey = await crypto.generateKey('AES-GCM', 256);
  
  // 2. Encrypt with Galois/Counter Mode
  const { ciphertext, iv, tag } = await ShieldX.seal(data, sessionKey);
  
  // 3. Wrap Session Key for Recipient
  const wrappedKey = await ShieldX.wrap(sessionKey, recipient.publicKey);
  
  return { payload: ciphertext, meta: wrappedKey, verify: tag };
};
\`\`\``}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">3.3 Post-Quantum Alignment (PQA)</h2>
              <p className="text-white/50 leading-relaxed text-lg font-medium">
                Standard communication protocols face an impending "Quantum Deadline." Future powerful quantum computers will be able to crack current RSA and ECC algorithms. 
              </p>
              <div className="p-8 rounded-3xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 space-y-4">
                <p className="text-sm text-white/40 leading-relaxed uppercase tracking-widest italic font-bold">
                  ShieldX implements experimental **Kyber (Crystals-Kyber)** and **Lattice-based** logic as an extra entropy layer. Even if the RSA layer is broken, the lattice layer remains thermally stable against Shor's algorithm.
                </p>
              </div>
            </div>

            <div className="space-y-8 text-right md:text-left">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">3.4 Perfect Forward Secrecy</h2>
              <p className="text-white/50 leading-relaxed text-lg font-medium">
                We believe that "The past should stay in the past." ShieldX utilizes **Key Ratcheting**. Even if a long-term device key is compromised, an attacker cannot decrypt past messages.
              </p>
              <ul className="space-y-4 text-xs font-black text-[#ff1e1e] uppercase tracking-widest">
                <li className="flex items-center gap-3 justify-end md:justify-start"><ChevronRight size={14} /> Daily Primary Key Rotation</li>
                <li className="flex items-center gap-3 justify-end md:justify-start"><ChevronRight size={14} /> Per-Message Ephemeral Seeds</li>
                <li className="flex items-center gap-3 justify-end md:justify-start"><ChevronRight size={14} /> Auto-Deleting Session Metadata</li>
              </ul>
            </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-6 max-w-2xl mx-auto">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Verified Constraints</h2>
                <p className="text-white/30 text-sm uppercase font-bold tracking-[0.2em]">Our security guarantees are bound by mathematical entropy limitations</p>
                <div className="grid grid-cols-3 gap-8 pt-6">
                   {[
                     { val: '2^256', label: 'keyspace' },
                     { val: 'Argon2id', label: 'kdf_standard' },
                     { val: 'GCM_96', label: 'nonce_size' }
                   ].map((stat, i) => (
                     <div key={i} className="space-y-1">
                        <div className="text-xl font-black text-white font-mono">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-bold tracking-widest">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'key-management',
    title: 'Key Management',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">04. Key Management</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            Identity in the ShieldX mesh is not assigned; it is generated. By removing the central authority, we eliminate the primary point of failure in global communication. Our key management protocol ensures absolute sovereignty through hardware-bound isolation.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">4.1 Sovereign Root of Trust</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    Every user profile begins as an **Identity Lattice**. This is a locally generated 512-bit seed that serves as the root for all subsequent cryptographic operations. 
                  </p>
                </div>
                <div className="space-y-6 text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
                  <p>Unlike centralized OAuth systems, ShieldX private keys are never transmitted, stored, or managed by any cloud infrastructure. They exist only in the **Volatile Memory (RAM)** or the **Secure Browser Storage (IndexedDB)** of the originating device, protected by the Web Crypto API's non-exportable flag.</p>
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-[#ff1e1e]">
                      <span>GEN_TYPE</span>
                      <span>ED25519_HARDENED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ENTROPY_SOURCE</span>
                      <span>CRYPTO_API_SYSTEM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>STORAGE_STATE</span>
                      <span>LOCAL_TEE_ISOLATED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="text-3xl font-black text-white uppercase mb-8 relative z-10">4.2 Passphrase Hardening</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 relative z-10 italic">
                  To protect the local root of trust from physical device compromise, the Identity Lattice is wrapped in a multi-pass **Argon2id** derivation layer. This prevents brute-force extraction even if the device's storage is cloned.
                </p>
                <div className="space-y-4 relative z-10">
                   {[
                     { label: 'ITERATIONS', val: '64_PASSES' },
                     { label: 'MEMORY_COST', val: '1GB_HARDENED' },
                     { label: 'PARALLELISM', val: '4_THREADS' },
                     { label: 'SALT_ENTROPY', val: '256_BIT_GEN' }
                   ].map((spec, i) => (
                     <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{spec.label}</span>
                        <span className="text-xs text-[#ff1e1e] font-mono">{spec.val}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-all duration-1000">
                <Globe size={250} className="text-[#ff1e1e]" />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">4.3 Discovery Mesh Sharding</h2>
                  <p className="text-white/40 text-lg max-w-3xl leading-relaxed">
                    Identity discovery is handled by a decentralized mesh. Instead of a central user directory, ShieldX utilizes **Blind Discovery**. Your identity metadata is sharded and distributed across the mesh nodes, accessible only via a specific derivation of the recipient's public key.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">01. Artifact Export</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-medium uppercase">Public components are signed with a hardware-bound key, ensuring that shards can be verified as authentic without exposing the master seed.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">02. XOR Distribution</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-medium uppercase">Shards are distributed using a Kademlia-inspired XOR metric, placing data bits on nodes geographically and topologically distant from each other.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">03. Tactical Harvest</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-medium uppercase">When initiating contact, the client reconstructs the recipient's public shard through a high-speed parallel harvest across the mesh.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight border-b border-[#ff1e1e]/20 pb-4">4.4 Hardware Isolation (TEE)</h3>
                <p className="text-white/50 leading-relaxed text-lg font-medium">
                  On supported hardware, ShieldX attempts to leverage the **Trusted Execution Environment (TEE)**. This ensures that even if the host Operating System is compromised at the kernel level, the private keys remain behind a hardware fence.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h5 className="text-white font-black text-[10px] uppercase tracking-widest text-[#ff1e1e]/60">Secure Enclave</h5>
                    <p className="text-white/30 text-xs uppercase font-medium">Apple T2 / M-Series and Intel SGX integration protocols.</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-white font-black text-[10px] uppercase tracking-widest text-[#ff1e1e]/60">Non-Exportable</h5>
                    <p className="text-white/30 text-xs uppercase font-medium">Keys generated inside the enclave cannot be read by any external process.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight border-b border-[#ff1e1e]/20 pb-4">4.5 Tactical Seed Export</h3>
                <p className="text-white/50 leading-relaxed text-lg font-medium">
                  Since ShieldX is client-sovereign, there is no "Forgot Password" feature. Users are encouraged to perform a **Tactical Export**—a paper-based or hardware-cloned backup of the 24-word mnemonic seed.
                </p>
                <ul className="space-y-4 text-xs font-black text-white/30 uppercase tracking-widest">
                  <li className="flex items-center gap-3"><ChevronRight size={14} className="text-[#ff1e1e]" /> BIP-39 Compliant Mnemonic Phrases</li>
                  <li className="flex items-center gap-3"><ChevronRight size={14} className="text-[#ff1e1e]" /> Cold-Storage Compatibility</li>
                  <li className="flex items-center gap-3"><ChevronRight size={14} className="text-[#ff1e1e]" /> Shamir's Secret Sharing (Coming Soon)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="p-10 md:p-16 rounded-[4rem] bg-[#080808] border border-white/5 group hover:border-[#ff1e1e]/30 transition-all">
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-1/2 space-y-8">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">4.6 Key Sharding Protocols</h3>
                  <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold font-mono">
                    IMPLEMENTATION_RUNTIME: Web Crypto API Hardened
                  </p>
                  <p className="text-white/50 text-lg leading-relaxed">
                    The following specimen demonstrates the hardened generation flow. We utilize a high-entropy source combined with a derivation shard to ensure that no two identities can ever collide or be predicted through mathematical modeling.
                  </p>
                  <div className="mt-8 flex items-start gap-4 p-8 rounded-2xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10">
                    <AlertTriangle size={24} className="text-[#ff1e1e] shrink-0" />
                    <div className="space-y-2">
                        <h5 className="text-[#ff1e1e] font-black uppercase text-xs tracking-widest leading-none">Access Severance Protocol</h5>
                        <p className="text-[11px] text-white/30 uppercase font-medium leading-relaxed italic">
                          Losing the local master passphrase results in the immediate and permanent severance of access to all historical and future sharding data. ShieldX support cannot "reset" identities.
                        </p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full">
                  <MarkdownRenderer 
                    content={`\`\`\`javascript
// Advanced Tactical Key Generation
// Runtime: Isolated Client Environment
const generateIdentityLattice = async (passphrase) => {
  // 1. Derive Storage Key using Argon2id
  // Memory-hard function prevents ASIC/GPU attacks
  const storageKey = await ShieldX.kdf(passphrase, {
    memory: 1024 * 1024,
    iterations: 64,
    algorithm: 'Argon2id'
  });

  // 2. Generate Master Identity Pair
  // Ed25519 Curve for signature fidelity
  const identity = await ShieldX.generateMasterPair({
    curve: 'Ed25519',
    extractable: false // Fence from memory dump
  });
  
  // 3. Seal Identity with Storage Key
  const sealedLattice = await ShieldX.seal(identity.privateKey, storageKey);
  
  return {
    discovery: identity.publicKey,
    lattice: sealedLattice,
    attestation: await identity.sign('ATTEST_IDENTITY')
  };
};
\`\`\``}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">4.7 Cryptographic Matrix</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {[
                     { val: '2^512', label: 'LATTICE_SEED' },
                     { val: 'Non-Export', label: 'PRIVATE_STATE' },
                     { val: 'BIP-39', label: 'MNEMONIC_STD' },
                     { val: 'TEE-Init', label: 'HARDWARE_ISO' }
                   ].map((stat, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="text-lg font-black text-white font-mono">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-bold tracking-widest">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'authentication',
    title: 'Auth & Security',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">05. Authentication</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            At ShieldX, "Login" is a cryptographic proof, not a credential exchange. We've eliminated the traditional password-over-wire vulnerability by implementing a **Zero-Knowledge Proof (ZKP)** substrate that verifies identity without ever exposing the root of trust.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">5.1 Zero-Knowledge Sessions (ZKS)</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    ShieldX does not "store" your password. Instead, we store a **High-Entropy Proof** derived through 100,000 iterations of SHA-512.
                  </p>
                </div>
                <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
                  During authentication, your client generates a **Temporal Challenge Signature**. The server verifies this mathematical proof against your public identity lattice. At no point is a plaintext password or even a direct password hash transmitted over the network.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">Protocol</div>
                    <div className="text-sm text-white font-mono">SRP_6A_MODIFIED</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">Verification</div>
                    <div className="text-sm text-white font-mono">ELLIPTIC_CURVE_DSA</div>
                  </div>
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-all duration-1000">
                  <ShieldCheck size={250} className="text-[#ff1e1e]" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase mb-8 relative z-10">5.2 Multi-Factor Attestation</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 relative z-10 italic uppercase tracking-wider font-bold">
                  ShieldX implements **Device-Bound MFA** by default. To authorize a new session, your primary device must sign an attestation shard.
                </p>
                <div className="space-y-4 relative z-10">
                   {[
                     { label: 'Primary_MFA', desc: 'Secure Enclave Biometric Signature' },
                     { label: 'Secondary_MFA', desc: 'Offline Mnemonic Proof of Possession' },
                     { label: 'Session_Link', desc: 'Hardware-Bound JWT Binding' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col border-l-2 border-[#ff1e1e]/20 pl-6 space-y-1">
                        <span className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">{item.label}</span>
                        <span className="text-xs text-white/40 uppercase font-bold">{item.desc}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
             <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-white uppercase tracking-tight">5.3 Ephemeral JWT Handshake</h2>
                      <p className="text-white/40 text-lg leading-relaxed">
                         Our session management utilizes **Proof-of-Possession (PoP)** tokens. Unlike standard Bearer tokens, ShieldX JWTs are useless if stolen; they are cryptographically bound to the HTTPS/TLS session key of the originating hardware.
                      </p>
                      <div className="space-y-6">
                         {[
                           { title: 'Short-Lived Expiry', body: 'Maximum 15-minute rotation for primary access shards.' },
                           { title: 'Stateless Mesh', body: 'Auth state is sharded across the mesh, preventing central database leaks.' },
                           { title: 'Signature Integrity', body: 'Ed25519 signatures ensure tokens cannot be modified in transit.' }
                         ].map((fact, i) => (
                           <div key={i} className="space-y-1">
                             <h5 className="text-white font-black text-sm uppercase tracking-tight italic flex items-center gap-2">
                               <ChevronRight size={14} className="text-[#ff1e1e]" /> {fact.title}
                             </h5>
                             <p className="text-xs text-white/30 uppercase pl-6 font-bold">{fact.body}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-8">
                      <MarkdownRenderer 
                        content={`\`\`\`javascript
// Proof-of-Possession (PoP) Authentication Flow
const authenticateNode = async (identity, challenge) => {
  // 1. Generate Temporal Proof
  // Bound to the current server challenge
  const proof = await ShieldX.attest(identity.privateKey, {
    nonce: challenge.nonce,
    timestamp: Date.now(),
    scope: 'SESSION_INITIALIZE'
  });

  // 2. Submit Signed Shard
  // No passwords ever touch the network
  const response = await mesh.post('/auth/prove', {
    latticeId: identity.publicId,
    attestation: proof,
    sessionKey: await ShieldX.exportSessionPublicKey()
  });

  return response.jwt_ephemeral;
};
\`\`\``}
                      />
                   </div>
                </div>
             </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               {
                 title: 'XSS_ISO',
                 desc: 'Strict Content-Security-Policy (CSP) with nonce-based execution fencing.',
                 icon: Shield
               },
               {
                 title: 'CSRF_JAIL',
                 desc: 'Double-Submit cookie patterns combined with ephemeral Proof-of-Origin headers.',
                 icon: Lock
               },
               {
                 title: 'BRUTE_NULL',
                 desc: 'Exponential cost-scaling and IP-sharding for failed authentication attempts.',
                 icon: AlertTriangle
               }
             ].map((feature, i) => (
               <div key={feature.title} className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 hover:bg-[#ff1e1e]/5 transition-all space-y-6 group">
                  <feature.icon className="text-[#ff1e1e] group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="text-xl font-black text-white uppercase">{feature.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wide">{feature.desc}</p>
               </div>
             ))}
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#ff1e1e]/5 p-12 md:p-20 rounded-[4rem] border border-[#ff1e1e]/10">
                <div className="space-y-4 text-center md:text-left">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Threat Model Verified</h3>
                   <p className="text-white/40 text-sm uppercase font-black tracking-widest leading-relaxed max-w-xl">
                      ShieldX has been battle-tested against standard OWASP Top 10 vectors and specialized cryptographic side-channel attacks. Our auth layer is designed to fail closed.
                   </p>
                </div>
                <div className="flex gap-4">
                   <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono">0.0%</span>
                      <span className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">Plaintext_Leaks</span>
                   </div>
                   <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono">1024</span>
                      <span className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">Entropy_Bits</span>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'database-schema',
    title: 'Database Schema',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">06. Database Logic</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            In the ShieldX ecosystem, the database is a "Passive Vault." It is architected to store high-entropy cipher blobs and relational metadata while maintaining total ignorance of the underlying plaintext.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8 text-right lg:text-left order-2 lg:order-1">
                <div className="space-y-4 border-r-4 lg:border-r-0 lg:border-l-4 border-[#ff1e1e] pr-8 lg:pr-0 lg:pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">6.1 Cipher-Only Mandate</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    Our PostgreSQL cluster strictly enforces a **Zero-Plaintext Policy**. Every row in the persistence layer is treated as an opaque object. Even internal database administrators lack the tools to inspect user content.
                  </p>
                </div>
                <p className="text-white/30 text-xs leading-relaxed uppercase tracking-widest font-bold">
                  By utilizing **PostgreSQL Row-Level Security (RLS)**, we ensure that session tokens can only access their specific shard of the lattice. A compromise in one shard does not grant lateral movement to adjacent user data.
                </p>
                <div className="flex flex-wrap gap-4 justify-end lg:justify-start">
                  {['RLS_ENFORCED', 'B-TREE_GCM_INDEX', 'SHARDED_RELATIONS'].map((tag) => (
                    <div key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-[#ff1e1e] font-black tracking-widest uppercase">{tag}</div>
                  ))}
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex items-center justify-center order-1 lg:order-2">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e1e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <Database size={150} className="text-[#ff1e1e] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000" />
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ff1e1e] animate-ping" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">LATTICE_SYNC_OK</span>
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">6.2 Tactical Schema Specs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:border-[#ff1e1e]/30 transition-all space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Users size={80} className="text-[#ff1e1e]" />
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic">
                     <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 flex items-center justify-center"><Users size={16} className="text-[#ff1e1e]" /></div>
                     tbl_identity_lattice
                  </h4>
                  <div className="font-mono text-[11px] space-y-4">
                     {[
                       { key: 'lattice_id', val: 'UUID_V4_PRIMARY' },
                       { key: 'public_key', val: 'ED25519_PEM_SHARD' },
                       { key: 'auth_proof', val: 'ARGON2ID_PROOF' },
                       { key: 'discovery_salt', val: 'VARBINARY_256' },
                       { key: 'provision_date', val: 'TIMESTAMP_TZ' }
                     ].map((row) => (
                       <div key={row.key} className="flex justify-between border-b border-white/5 pb-3">
                          <span className="text-white/20 uppercase tracking-widest">{row.key}</span>
                          <span className="text-[#ff1e1e] font-black">{row.val}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:border-[#ff1e1e]/30 transition-all space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Network size={80} className="text-[#ff1e1e]" />
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic">
                     <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 flex items-center justify-center"><Database size={16} className="text-[#ff1e1e]" /></div>
                     tbl_message_shards
                  </h4>
                  <div className="font-mono text-[11px] space-y-4">
                     {[
                       { key: 'shard_id', val: 'UUID_V4_PRIMARY' },
                       { key: 'sender_hash', val: 'SHA3_512_LINK' },
                       { key: 'payload_blob', val: 'AES_256_GCM_DATA' },
                       { key: 'auth_tag', val: 'BINARY_128' },
                       { key: 'vector_iv', val: 'BINARY_96' }
                     ].map((row) => (
                       <div key={row.key} className="flex justify-between border-b border-white/5 pb-3">
                          <span className="text-white/20 uppercase tracking-widest">{row.key}</span>
                          <span className="text-[#ff1e1e] font-black">{row.val}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">6.3 Geographical Sharding</h2>
                <p className="text-white/40 text-lg leading-relaxed font-medium">
                  ShieldX does not rely on a single data center. We utilize **Multi-Regional Sharding** to ensure that user data is physically stored in the jurisdiction of the originating node when possible, with real-time replication across high-entropy zones.
                </p>
                <div className="space-y-6">
                   {[
                     { step: 'LATENCY_MAP', desc: 'Auto-routing to the closest tactical shard cluster.' },
                     { step: 'REDUNDANCY_V3', desc: 'Sync-Wait replication to at least 3 distinct geographic regions.' },
                     { key: 'DATA_LOCALITY', desc: 'GDPR and tactical sovereignty compliance by default.' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e] mt-2 shadow-[0_0_8px_#ff1e1e]" />
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-white uppercase tracking-widest">{item.step || item.key}</h5>
                          <p className="text-xs text-white/30 uppercase leading-relaxed font-bold">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="p-10 rounded-[4rem] bg-black border border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ff1e1e]/5 to-transparent" />
                <MarkdownRenderer 
                  content={`\`\`\`sql
-- Tactical Shard Enforcement
-- Ensure row-level isolation via RLS
CREATE POLICY "lattice_isolation" 
ON tbl_message_shards 
FOR ALL 
USING (
  sender_hash = current_setting('shieldx.session_id') 
  OR 
  receiver_hash = current_setting('shieldx.session_id')
);

ALTER TABLE tbl_message_shards ENABLE ROW LEVEL SECURITY;
\`\`\``}
                />
              </div>
            </div>
          </section>

          <section className="pt-10 border-t border-white/5">
             <div className="p-12 md:p-20 rounded-[4rem] bg-[#0d0d0d] border border-white/5 flex flex-col items-center gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic z-10">Elastic Performance</h3>
                <p className="text-white/30 text-sm uppercase font-black tracking-[0.3em] z-10 text-center max-w-2xl">
                   Built on the **PG_MESH** backbone, ShieldX databases scale horizontally across 100+ global nodes without increasing encryption latency.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full z-10">
                   {[
                     { val: '< 5ms', label: 'Shard_Discovery' },
                     { val: '99.99%', label: 'Cluster_Health' },
                     { val: 'AES_GCM', label: 'Blob_Standard' },
                     { val: 'LUSTRE', label: 'File_Substrate' }
                   ].map((stat, i) => (
                     <div key={i} className="text-center space-y-1 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-xl font-black text-white font-mono">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-bold tracking-widest">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'real-time',
    title: 'Real-Time Sync',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">07. Socket Mesh</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            Speed is the final layer of security. The ShieldX Socket Mesh is a high-velocity delivery substrate engineered for sub-millisecond packet relay through a global fabric of sharded WebSocket Secure (WSS) nodes.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-10">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">7.1 WSS Handshake Protocol</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    Every socket connection begins with a **Cryptographic Handshake**. We don't just connect; we verify the hardware's attestation shard before allowing ingress.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold font-mono border-b border-white/5 pb-4">
                    Handshake Sequence: SYN_PROVE {'->'} CHALLENGE_VERIFY {'->'} ESTABLISH_ISO_TUNNEL
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed uppercase tracking-wide font-medium">
                    ShieldX leverages **TLS 1.3** combined with a custom application-level challenge. The client must sign a server-provided nonce using its local identity lattice before the WSS tunnel is fully promoted to an active state.
                  </p>
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="relative z-10 flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center">
                       <Network size={32} className="text-[#ff1e1e]" />
                    </div>
                    <div className="space-y-1">
                       <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.4em]">Substrate_Status</div>
                       <div className="text-2xl font-black text-white uppercase tracking-tighter">ACTIVE_RELAY</div>
                    </div>
                 </div>
                 <div className="mt-8 space-y-3 relative z-10">
                    {['LATENCY_TARGET < 12ms', 'PACKET_SIZE_ENFORCED', 'EPHEMERAL_BUFFER_CLEAN'].map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] text-white/20 font-black uppercase tracking-widest border-l border-white/10 pl-4">
                         <div className="w-1 h-1 rounded-full bg-[#ff1e1e]/40" /> {stat}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-45 group-hover:rotate-0 transition-transform duration-1000">
                  <Activity size={250} className="text-[#ff1e1e]" />
               </div>
               <div className="relative z-10 space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                     <div className="space-y-8">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">7.2 Ephemeral Session Binding</h2>
                        <p className="text-white/40 text-lg leading-relaxed font-medium">
                           Sessions are not "owned" by the server; they are "leased" to the hardware. If the physical network or hardware signature changes, the mesh immediately severs the socket to prevent **Session Hijacking**.
                        </p>
                        <ul className="space-y-4">
                           {[
                             { t: 'Multi-Region Routing', d: 'Traffic is proxied through the closest tactical node based on GeoIP/XOR distance.' },
                             { t: 'Heartbeat Attestation', d: 'Clients must re-sign a proof-of-life every 60 seconds to maintain the tunnel.' },
                             { t: 'Blind Ingress', d: 'The relay node never sees the unencrypted routing metadata—shards are routed via Bloom filters.' }
                           ].map((item, i) => (
                             <li key={i} className="flex gap-4">
                                <div className="w-1 h-8 bg-[#ff1e1e]/20 rounded-full" />
                                <div className="space-y-1">
                                   <div className="text-xs font-black text-white uppercase tracking-widest">{item.t}</div>
                                   <div className="text-[10px] text-white/30 uppercase font-bold">{item.desc || item.d}</div>
                                </div>
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="space-y-8">
                        <MarkdownRenderer 
                          content={`\`\`\`javascript
// High-Velocity Socket Initialization
const initSocketMesh = async (identity) => {
  const meshNode = await ShieldX.discoverNode();
  
  // 1. Establish WSS Secure Tunnel
  const socket = new WebSocket(\`wss://\${meshNode}/relay\`);
  
  // 2. Perform Handshake on Open
  socket.onopen = async () => {
    const challenge = await ShieldX.getHandshakeChallenge();
    const proof = await identity.sign(challenge.nonce);
    
    socket.send(JSON.stringify({
      type: 'INIT_VERIFY',
      latticeId: identity.publicId,
      attestation: proof
    }));
  };
  
  return socket;
};
\`\`\``}
                        />
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 flex items-center justify-center"><Zap size={20} className="text-[#ff1e1e]" /></div>
                   Packet Sharding Logic
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium uppercase tracking-wide">
                   Messages are not sent as single blobs. They are sharded into **1024-byte MTU packets** and distributed across parallel WSS channels. This prevents "Traffic Analysis" by masking the true size and signature of the payload.
                </p>
             </div>
             <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 flex items-center justify-center"><Activity size={20} className="text-[#ff1e1e]" /></div>
                   Auto-Ratcheting Retries
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium uppercase tracking-wide">
                   ShieldX implements an **Exponential Backoff** retry logic. If the mesh node becomes unreachable, the client automatically re-enters the "Discovery" phase to identify a new tactical ingress point.
                </p>
             </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Relay Matrix Specs</h2>
                   <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">Global Sub-Node Performance Architecture</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   {[
                     { val: '99.99%', label: 'RELAY_UPTIME' },
                     { val: 'AES_NI', label: 'HW_ACCELERATED' },
                     { val: 'WSS_1.3', label: 'PROTOCOL_STD' },
                     { val: '1M+', label: 'CONCURRENT_TX' }
                   ].map((stat, i) => (
                     <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-[#ff1e1e]/20 transition-all">
                        <div className="text-2xl font-black text-white font-mono group-hover:scale-110 transition-transform">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-black tracking-widest mt-2">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'threat-model',
    title: 'Threat Model',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">08. Threat Model</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            Security is not a state, but a process of continuous adversarial modeling. The ShieldX Threat Model assumes a "Zero-Trust" environment where every relay node, database, and transport layer is considered potentially compromised.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-10">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">8.1 STRIDE Classification</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    We utilize the **STRIDE** framework to categorize and mitigate tactical risks at every layer of the mesh.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     { t: 'Spoofing', d: 'Mitigated by hardware-bound Ed25519 identity attestation.' },
                     { t: 'Tampering', d: 'Neutralized by AES-256-GCM authentication tags on every packet.' },
                     { t: 'Repudiation', d: 'Handled by mandatory cryptographic signing of all state changes.' },
                     { t: 'Information Disclosure', d: 'Eliminated by zero-knowledge architecture and sharded storage.' }
                   ].map((item, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-[#ff1e1e]/20 transition-all">
                        <div className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">{item.t}</div>
                        <p className="text-[11px] text-white/30 uppercase font-bold leading-relaxed">{item.d}</p>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <h3 className="text-3xl font-black text-white uppercase mb-8 relative z-10">8.2 Adversarial Tiers</h3>
                 <p className="text-white/40 text-sm leading-relaxed mb-10 relative z-10 italic">
                    ShieldX is engineered to defend against high-tier adversaries, moving the security boundary to the physical device.
                 </p>
                 <div className="space-y-6 relative z-10">
                    {[
                      { level: 'Tier 01: Global Dragnet', status: 'RESILIENCE_FULL' },
                      { level: 'Tier 02: Targeted Node Breach', status: 'RESILIENCE_TOTAL' },
                      { level: 'Tier 03: Physical Device Access', status: 'HARDENED_KDF' }
                    ].map((tier, i) => (
                      <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-4">
                         <span className="text-xs text-white font-black uppercase tracking-tight">{tier.level}</span>
                         <span className="text-[10px] text-[#ff1e1e] font-mono font-bold tracking-[0.2em]">{tier.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#111] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-6 transition-all duration-1000">
                  <ShieldAlert size={250} className="text-[#ff1e1e]" />
               </div>
               <div className="relative z-10 space-y-12">
                  <div className="max-w-3xl space-y-6">
                    <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.5em]">Specialization: 0x83</h4>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">8.3 Side-Channel Defenses</h2>
                    <p className="text-white/40 text-lg leading-relaxed font-medium">
                       Traditional cryptography often fails at the implementation layer through timing leaks or power analysis. ShieldX implements **Constant-Time** algorithms for all sensitive lattice operations.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <div className="space-y-4">
                        <h5 className="text-white font-black text-sm uppercase tracking-tight italic">Timing Isolation</h5>
                        <p className="text-xs text-white/30 uppercase font-bold leading-relaxed">Operations take a fixed number of CPU cycles regardless of the key value, neutralizing remote timing attacks.</p>
                     </div>
                     <div className="space-y-4">
                        <h5 className="text-white font-black text-sm uppercase tracking-tight italic">Memory Sanitization</h5>
                        <p className="text-xs text-white/30 uppercase font-bold leading-relaxed">Sensitive buffers are zeroed out immediately after use, preventing extraction via hardware-level memory dumps.</p>
                     </div>
                     <div className="space-y-4">
                        <h5 className="text-white font-black text-sm uppercase tracking-tight italic">Lattice Jitter</h5>
                        <p className="text-xs text-white/30 uppercase font-bold leading-relaxed">Synthetic latency is introduced at the mesh ingress points to mask packet frequency and size patterns.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
               <div className="space-y-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">8.4 Trust Substrate Audit</h2>
                  <p className="text-white/40 text-lg leading-relaxed font-medium">
                     Transparency is the ultimate firewall. ShieldX protocol specifications and client implementation code are available for **Public Peer Review**. We don't ask for trust; we provide the mathematical and algorithmic evidence of security.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     {['OPEN_PROTOCOL', 'VERIFIABLE_BUILDS', 'FORMAL_LOGIC'].map((spec) => (
                       <div key={spec} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/40 font-black tracking-widest uppercase">{spec}</div>
                     ))}
                  </div>
               </div>
               <div className="space-y-8">
                  <MarkdownRenderer 
                    content={`\`\`\`javascript
// Critical Security Guard: Memory Sanitization Spec
const processSensitiveKey = async (rawBuffer) => {
  try {
    const result = await ShieldX.transform(rawBuffer);
    return result;
  } finally {
    // 1. Overwrite with High-Entropy Noise
    crypto.getRandomValues(rawBuffer);
    // 2. Clear from heap-reference
    rawBuffer = null;
  }
};
\`\`\``}
                  />
               </div>
            </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Security Boundary Logic</h2>
                   <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">Hardware-Bound Sovereignty vs. Untrusted Mesh</p>
                </div>
                <div className="relative p-12 md:p-24 rounded-[4rem] bg-black border border-white/5 group">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                      <div className="text-center space-y-4">
                         <div className="w-20 h-20 rounded-3xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/40 flex items-center justify-center mx-auto shadow-[0_0_30px_#ff1e1e20]">
                            <Lock size={32} className="text-[#ff1e1e]" />
                         </div>
                         <div className="space-y-1">
                            <span className="text-xl font-black text-white uppercase tracking-tighter">TRUSTED_ZONE</span>
                            <span className="text-xs text-white/20 font-bold uppercase block tracking-widest">Client RAM / Enclave</span>
                         </div>
                      </div>

                      <div className="h-20 w-1 md:h-1 md:w-40 bg-gradient-to-r from-[#ff1e1e] to-transparent opacity-40" />

                      <div className="text-center space-y-4">
                         <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                            <Globe size={32} className="text-white/40" />
                         </div>
                         <div className="space-y-1">
                            <span className="text-xl font-black text-white uppercase tracking-tighter">UNTRUSTED_ZONE</span>
                            <span className="text-xs text-white/20 font-bold uppercase block tracking-widest">Network / Cloud Mesh</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'limitations',
    title: 'Security Limits',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">09. Limitations</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            Absolute transparency is the core of cryptographic integrity. No system is impenetrable; ShieldX is designed to fail closed, but users must understand the architectural trade-offs of sovereign identity.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">9.1 Metadata Visibility</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    While ShieldX payloads are double-blinded, the **Transport-Layer Metadata** remains partially visible to the mesh for routing purposes.
                  </p>
                </div>
                <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
                  Mesh nodes can observe the timing, frequency, and size of packets. While we implement **Lattice Jitter** to mask these patterns, a global passive adversary (GPA) with massive computational resources could theoretically perform traffic analysis to map communication clusters.
                </p>
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 font-mono text-[10px]">
                   <div className="flex justify-between items-center text-[#ff1e1e]">
                      <span>VISIBILITY_STATE</span>
                      <span>MESH_ROUTING_ONLY</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>METADATA_RETENTION</span>
                      <span>0ms_VOLATILE</span>
                   </div>
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <h3 className="text-3xl font-black text-white uppercase mb-8 relative z-10">9.2 Device Sovereignty Risks</h3>
                 <p className="text-white/40 text-sm leading-relaxed mb-8 relative z-10 italic">
                    The security of ShieldX is only as strong as the host device's integrity.
                 </p>
                 <div className="space-y-4 relative z-10">
                    {[
                      { l: 'HOST_COMPROMISE', d: 'Rootkits or keyloggers at the OS level bypass browser sandboxing.' },
                      { l: 'STORAGE_PURGE', d: 'Clearing "Site Data" deletes keys if no tactical backup exists.' },
                      { l: 'ZERO_DAY_SANDBOX', d: 'Exploits in the V8 engine could expose enclave-wrapped secrets.' }
                    ].map((risk, i) => (
                      <div key={i} className="space-y-1 border-b border-white/5 pb-4">
                         <div className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest italic">{risk.l}</div>
                         <p className="text-[11px] text-white/30 uppercase font-bold leading-relaxed">{risk.d}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                  <Activity size={250} className="text-[#ff1e1e]" />
               </div>
               <div className="relative z-10 space-y-10">
                  <div className="max-w-3xl space-y-6">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">9.3 Performance & Quantum Trade-offs</h2>
                    <p className="text-white/40 text-lg leading-relaxed font-medium">
                       Ensuring **Post-Quantum Alignment (PQA)** introduces unavoidable cryptographic overhead. Lattice-based algorithms require significantly larger public keys and signature blobs than classical counterparts.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">Latency_Floor</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wide">PQA handshakes add 50-100ms of additional computational delay during initial session establish.</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">Memory_Footprint</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wide">The Identity Lattice requires 2GB of temporary RAM during derivation passes to ensure ASIC resistance.</p>
                     </div>
                     <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h4 className="text-[#ff1e1e] font-black text-xs uppercase tracking-[0.3em]">Shard_Discovery</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wide">Discovery in a decentralized mesh can take 2-5 seconds during the initial broadcast "Warm-up" phase.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-8">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">9.4 The Sovereignty Paradox</h3>
                   <p className="text-white/40 text-lg leading-relaxed font-medium">
                      By removing the central authority, we also remove the safety net. There is no password reset, no account recovery, and no way for ShieldX to retrieve data for a user who has lost their master secret.
                   </p>
                   <div className="mt-8 flex items-start gap-4 p-8 rounded-2xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10">
                      <AlertTriangle size={24} className="text-[#ff1e1e] shrink-0" />
                      <div className="space-y-2">
                          <h5 className="text-[#ff1e1e] font-black uppercase text-xs tracking-widest leading-none">Access Severance Warning</h5>
                          <p className="text-[11px] text-white/30 uppercase font-medium leading-relaxed italic">
                             90% of all data loss in sovereign systems is due to local mismanagement of mnemonic seeds. ShieldX provides the fortress; the user provides the gatekeeper.
                          </p>
                      </div>
                   </div>
                </div>
                <div className="space-y-8">
                   <MarkdownRenderer 
                     content={`\`\`\`javascript
// Internal Limitation Log Protocol
// Warning: High-Execution Cost Identified
const PQA_ALIGNMENT_COST = {
  keygen_ms: 120,   // Additional lattice-latency
  handshake_kb: 48,  // Sig-size overhead
  ram_mb: 2048,      // Minimum Argon2id footprint
  access: 'CRITICAL_VULN_EXPOSURE'
};
\`\`\``}
                   />
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'deployment',
    title: 'Deployment',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">10. Infrastructure</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            The ShieldX Infrastructure is a "Ghost Fabric"—a stateless, high-entropy logistical hub designed to orchestrate sharded data without ever possessing the keys to unlock it.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-10">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">10.1 Tactical Cloud Fabric</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    Our backend runs on a **Self-Healing Orchestration Layer**. Nodes are treated as ephemeral cattle, capable of being purged and redeployed in seconds if a security anomaly is detected.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     { t: 'Isolation', d: 'Every service runs in a hardened, minimized containerized environment.' },
                     { t: 'Entropy', d: 'Hardware RNG seeds are used for all system-level ID generation.' },
                     { t: 'Redundancy', d: 'N+2 global redundancy across geographically independent zones.' },
                     { t: 'Hardening', d: 'OS-level security patches are applied via automated atomic updates.' }
                   ].map((item, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-[#ff1e1e]/20 transition-all">
                        <div className="text-[10px] text-[#ff1e1e] font-black uppercase tracking-widest">{item.t}</div>
                        <p className="text-[11px] text-white/30 uppercase font-bold leading-relaxed">{item.d}</p>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center text-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <Server size={100} className="text-[#ff1e1e] mx-auto mb-8 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                 <h3 className="text-3xl font-black text-white uppercase z-10">Mesh Orchestrator</h3>
                 <div className="mt-8 space-y-4 z-10">
                    <div className="flex justify-between font-mono text-[10px] text-white/20 border-b border-white/5 pb-2">
                       <span>NODE_ID</span>
                       <span className="text-[#ff1e1e]">SX_K8S_TACTICAL_01</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-white/20 border-b border-white/5 pb-2">
                       <span>HEALTH</span>
                       <span className="text-green-500">OPTIMAL</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-white/20">
                       <span>LOCATION</span>
                       <span>EU_WEST_1</span>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#111] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="relative z-10 space-y-12">
                  <div className="max-w-3xl space-y-6">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">10.2 Ephemeral Ingress & Secret Management</h2>
                    <p className="text-white/40 text-lg leading-relaxed font-medium">
                       ShieldX utilizes **Dynamic Secret Injection**. System-level keys (DB passwords, API secrets) are never stored in the codebase; they are injected at runtime via an air-gapped Vault substrate.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="p-10 rounded-[3rem] bg-black border border-white/5 space-y-8">
                        <div className="flex items-center gap-3">
                           <Terminal size={18} className="text-[#ff1e1e]" />
                           <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.4em]">RUNTIME_ENV_SPEC</span>
                        </div>
                        <MarkdownRenderer 
                          content={`\`\`\`bash
# Tactical Production Environment
NODE_ENV=TACTICAL_PROD
JWT_SIGNING_ALGO=RS512
PG_MESH_URL=sharded://vault_secret_path
WS_HEARTBEAT_SEC=60
LATTICE_SYNC_INTERVAL=30
\`\`\``}
                        />
                     </div>
                     <div className="space-y-8 flex flex-col justify-center">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">Zero-Persistence Mandate</h4>
                        <p className="text-sm text-white/30 uppercase font-black leading-relaxed">
                           Logs are scrubbed of all PII (Personally Identifiable Information) before being committed to high-entropy storage. In ShieldX, what doesn't exist cannot be subpoenaed or stolen.
                        </p>
                        <div className="flex gap-4">
                           {['VAULT_SEALED', 'ATOMIC_LOGGING', 'ENCRYPTED_ENV'].map(tag => (
                             <div key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] text-[#ff1e1e] font-black tracking-widest">{tag}</div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Global Edge Routing</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium uppercase tracking-wide">
                   We utilize a **Global Anycast Network** to ensure that users always hit the nearest tactical ingress point. This minimizes encryption latency and ensures that data sovereignty laws are respected by default.
                </p>
             </div>
             <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                   <ShieldCheck size={24} className="text-[#ff1e1e]" />
                   Sovereign Upgrades
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium uppercase tracking-wide">
                   Infrastructure upgrades are performed via **Blue-Green Deployments** with mandatory cryptographic verification of the build artifact hash. Every byte of code in production is cryptographically traceable to its source.
                </p>
             </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Fleet Performance Matrix</h2>
                   <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">Infrastructure Durability & Scalability Stats</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   {[
                     { val: '100+', label: 'MESH_NODES' },
                     { val: '99.999%', label: 'FABRIC_UPTIME' },
                     { val: 'K8S/PGR', label: 'STACK_ENGINE' },
                     { val: 'AES_NI', label: 'ENCRYPTION_HW' }
                   ].map((stat, i) => (
                     <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-black text-white font-mono">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-black tracking-widest mt-2">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">11. API Protocols</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            The ShieldX API is a "Blind Ingress" substrate. Every endpoint is stateless, requiring cryptographic signatures for every transaction. No data is accepted without local identity attestation.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4 italic border-l-4 border-[#ff1e1e] pl-8">
              11.1 Identity Anchoring
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="px-5 py-2 bg-[#ff1e1e] text-white text-[11px] font-black rounded-xl uppercase tracking-widest">POST</span>
                  <code className="text-white text-3xl font-black uppercase tracking-tighter">/api/v1/register</code>
                </div>
                <p className="text-white/40 text-lg leading-relaxed font-medium">
                  Registers a new public identity lattice within the discovery mesh. This endpoint verifies the initial proof-of-work (PoW) and attaches the provided public key to a unique shard ID.
                </p>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Required_Payload_Signature</h4>
                  <ul className="space-y-3 font-mono text-[11px] text-[#ff1e1e]">
                     <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" /> identity_lattice_id</li>
                     <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" /> public_key_pem (X25519)</li>
                     <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" /> proof_of_possession</li>
                  </ul>
                </div>
              </div>
              <div className="p-8 rounded-[3rem] bg-black border border-white/5">
                <MarkdownRenderer 
                  content={`\`\`\`json
// Request Schema
{
  "latticeId": "sx_938a...",
  "publicKey": "---BEGIN PUBLIC KEY---...",
  "attestation": {
    "sig": "0xbf2a...",
    "algo": "ED25519_PH"
  }
}
\`\`\``}
                />
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4 italic border-l-4 border-white/20 pl-8">
              11.2 Message Sharding Ingress
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="px-5 py-2 bg-white/10 text-white text-[11px] font-black rounded-xl uppercase tracking-widest">POST</span>
                  <code className="text-white text-3xl font-black uppercase tracking-tighter">/api/v1/messages</code>
                </div>
                <p className="text-white/40 text-lg leading-relaxed font-medium">
                  Dispatches high-entropy cipher blobs across the mesh. Ingress nodes perform architectural blind routing, where the final destination is obfuscated from the relay layer.
                </p>
                <div className="p-8 rounded-[3rem] bg-[#0d0d0d] border border-white/5 space-y-6">
                   <h5 className="text-xs font-black text-white uppercase tracking-widest italic">Security Guardrails</h5>
                   <div className="flex flex-wrap gap-4">
                      {['RATE_LIMIT_60_RPM', 'PAYLOAD_MTU_1MB', 'HMAC_VERIFIED'].map(tag => (
                        <div key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-[9px] text-white/30 font-black uppercase">{tag}</div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="p-8 rounded-[3rem] bg-black border border-white/5">
                <MarkdownRenderer 
                  content={`\`\`\`json
// Dispatch Response
{
  "status": "DISPATCHED",
  "shardHash": "sha3_928...",
  "latency": "12.4ms",
  "nodes": ["DE_FRA_01", "US_VA_02"]
}
\`\`\``}
                />
              </div>
            </div>
          </section>

          <section className="space-y-12">
             <div className="p-12 md:p-20 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-45">
                   <Lock size={250} className="text-[#ff1e1e]" />
                </div>
                <div className="relative z-10 space-y-10">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">11.3 Mandatory Security Headers</h2>
                   <p className="text-white/30 text-sm uppercase font-black tracking-[0.3em] max-w-2xl">
                      ShieldX APIs reject all cleartext or unsigned requests. The following headers are enforced at the hardware edge:
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { h: 'X-ShieldX-Signature', d: 'HMAC-SHA512 of the payload binded to the session key.' },
                        { h: 'X-Identity-Lattice', d: 'The unique UUID of the originating identity shard.' },
                        { h: 'X-Handshake-Proof', d: 'Ephemeral SRP-6a derived session token.' },
                        { h: 'X-Tactical-Timestamp', d: 'High-precision micro-timestamp to prevent replay attacks.' }
                      ].map((header, i) => (
                        <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e] mt-2 shadow-[0_0_8px_#ff1e1e]" />
                           <div className="space-y-1">
                             <div className="text-[10px] font-mono font-black text-white">{header.h}</div>
                             <div className="text-[11px] text-white/30 uppercase font-bold">{header.d}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>


        </div>
      </div>
    )
  },
  {
    id: 'developer-guide',
    title: 'Developer Guide',
    content: (
      <div className="space-y-16 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">12. Developer Hub</h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-4xl font-medium leading-relaxed italic">
            ShieldX is a "White-Box" platform. We invite the global developer community to audit, enhance, and scale the mesh substrate using our tactical development kits.
          </p>
        </div>

        <div className="space-y-24">
          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-4 border-l-4 border-[#ff1e1e] pl-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">12.1 Project Topology</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    Understanding the codebase is the first step in maintaining its cryptographic integrity. Our architecture is sharded into specialized modules.
                  </p>
                </div>
                <div className="space-y-6">
                   {[
                     { dir: 'src/core/engine', desc: 'Lattice cryptography and KDF implementations.' },
                     { dir: 'src/core/mesh', desc: 'WebSocket mesh protocols and shard routing logic.' },
                     { dir: 'src/core/vault', desc: 'Secure local storage (IndexedDB) and TEE wrapping.' },
                     { dir: 'src/api/v1', desc: 'Stateless REST bridge and ingress sanitizers.' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-start group">
                        <div className="text-[10px] font-mono text-[#ff1e1e] pt-1">0x0{i+1}</div>
                        <div className="space-y-1">
                           <div className="text-xs font-black text-white uppercase tracking-widest group-hover:text-[#ff1e1e] transition-colors">{item.dir}</div>
                           <p className="text-[10px] text-white/20 uppercase font-black tracking-widest leading-relaxed italic">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-12 md:p-16 rounded-[4rem] bg-[#0d0d0d] border border-white/5 relative group overflow-hidden flex flex-col justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e1e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <Code size={150} className="text-[#ff1e1e] opacity-10 mx-auto mb-10 group-hover:scale-110 transition-transform duration-1000" />
                 <div className="space-y-4 z-10 relative">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight italic text-center">Tactical Stack Specs</h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                       {['REACT_V18', 'FRAMER_MOTION', 'TAILWIND_V4', 'LUCIDE_ICONS', 'SHA3_PRIMITIVES'].map(tag => (
                         <div key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] text-white/30 font-black tracking-widest uppercase italic">{tag}</div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="bg-[#111] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="relative z-10 space-y-12">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">12.2 Local Hardening & Boot</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                     <div className="space-y-8">
                        <p className="text-white/40 text-lg leading-relaxed font-medium capitalize">
                           Every development environment must be verified for cryptographic purity. Use the following sequence to initialize the local mesh node.
                        </p>
                        <div className="space-y-6">
                           {[
                             { step: 'MESH_CLONE', cmd: 'git clone shieldx/mesh_node' },
                             { step: 'INTEGRITY_AUDIT', cmd: 'npm audit fix --force' },
                             { step: 'ENV_ISOLATION', cmd: 'cp .env.dist .env && chmod 600 .env' },
                             { step: 'BOOT_CORE', cmd: 'npm run mesh:dev' }
                           ].map((step, i) => (
                             <div key={i} className="space-y-3">
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{step.step}</div>
                                <div className="p-4 rounded-xl bg-black border border-white/5 hover:border-[#ff1e1e]/30 transition-all font-mono text-[11px] text-[#ff1e1e]">
                                   {step.cmd}
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="p-10 rounded-[3rem] bg-black/40 border border-white/5 space-y-8 flex flex-col justify-center">
                        <MarkdownRenderer 
                          content={`\`\`\`javascript
// Verification Hook: Dev-Build Integrity
const verifyDevIntegrity = async (buildHash) => {
  const sourceHash = await getSourceHash('./src');
  
  if (buildHash !== sourceHash) {
    throw new SecurityError('TAMPERED_BUILD_DETECTED');
  }
  
  console.log('BUILD_VERIFIED_AUTHENTIC');
};
\`\`\``}
                        />
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-8 group hover:border-[#ff1e1e]/20 transition-all">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Audit Protocol</h3>
                   <p className="text-white/40 text-sm leading-relaxed font-bold uppercase tracking-wide">
                      We operate a **Zero-Compromise Patch Policy**. All pull requests undergo a 3-tier security review:
                   </p>
                   <ul className="space-y-4">
                      <li className="flex gap-4 items-center">
                         <div className="w-2 h-2 rounded-full bg-[#ff1e1e]" />
                         <span className="text-[10px] text-white font-black uppercase tracking-widest">Static Analysis (Linter + SAST)</span>
                      </li>
                      <li className="flex gap-4 items-center">
                         <div className="w-2 h-2 rounded-full bg-[#ff1e1e]" />
                         <span className="text-[10px] text-white font-black uppercase tracking-widest">Lattice Simulation (Unit Tests)</span>
                      </li>
                      <li className="flex gap-4 items-center">
                         <div className="w-2 h-2 rounded-full bg-[#ff1e1e]" />
                         <span className="text-[10px] text-white font-black uppercase tracking-widest">Manual Cryptographic Peer Review</span>
                      </li>
                   </ul>
                </div>
                <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-8 group hover:border-[#ff1e1e]/20 transition-all">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Contribution Mesh</h3>
                   <p className="text-white/40 text-sm leading-relaxed font-bold uppercase tracking-wide">
                      Looking for inspiration? The following modules are currently open for optimization and tactical refactoring:
                   </p>
                   <div className="grid grid-cols-2 gap-4">
                      {['WSS_MESH_ASYNC', 'KYBER_ALIGNMENT', 'INDEXED_DB_SHARDING', 'B-TREE_INDEX_OPT'].map(opt => (
                        <div key={opt} className="p-4 rounded-xl bg-white/5 border border-white/10 text-[9px] text-white/30 font-black uppercase text-center tracking-widest italic">{opt}</div>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          <section className="pt-20 border-t border-white/5">
             <div className="text-center space-y-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Dev_Ops Grid Specs</h2>
                   <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">Integrated Development & Testing Environment Targets</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                   {[
                     { val: 'Vitest', label: 'TEST_ENGINE' },
                     { val: 'Docker', label: 'CONTAINER_STD' },
                     { val: 'Husky', label: 'PRE_COMMIT_HOOK' },
                     { val: 'ESLint', label: 'STATIC_AUDIT' }
                   ].map((stat, i) => (
                     <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-[#ff1e1e]/5 transition-all">
                        <div className="text-xl font-black text-white font-mono">{stat.val}</div>
                        <div className="text-[10px] text-[#ff1e1e] uppercase font-black tracking-widest mt-2">{stat.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>
      </div>
    )
  }
];

const SidebarLink = ({ id, title, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 group relative flex items-center gap-3 ${
      active 
        ? 'bg-[#ff1e1e]/10 text-white' 
        : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
    }`}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ff1e1e] rounded-r-full shadow-[0_0_10px_#ff1e1e]" />}
    <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${active ? 'text-[#ff1e1e]' : ''}`}>{title}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-[#ff1e1e] animate-pulse" />}
  </button>
);

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState(DOCS_CONTENT[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contentRefs = useRef({});
  const scrollContainerRef = useRef(null);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = contentRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const containerTop = scrollContainerRef.current.scrollTop;
    let current = activeSection;

    DOCS_CONTENT.forEach((section) => {
      const element = contentRefs.current[section.id];
      if (element) {
        const offsetTop = element.offsetTop - 150;
        if (containerTop >= offsetTop) {
          current = section.id;
        }
      }
    });

    if (current !== activeSection) {
      setActiveSection(current);
    }
  };

  const currentIdx = DOCS_CONTENT.findIndex(s => s.id === activeSection);
  const prevSection = currentIdx > 0 ? DOCS_CONTENT[currentIdx - 1] : null;
  const nextSection = currentIdx < DOCS_CONTENT.length - 1 ? DOCS_CONTENT[currentIdx + 1] : null;

  return (
    <div className="h-screen bg-[#0a0a0a] overflow-hidden flex flex-col selection:bg-[#ff1e1e] selection:text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a] z-50">
        <Link to="/" className="flex items-center gap-2">
           <Logo className="w-5 h-5" />
           <span className="text-white font-black tracking-tighter uppercase text-sm">Shield<span className="text-[#ff1e1e]">X</span></span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white/60 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR (FIXED VIEWPORT HEIGHT) */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-[280px] bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/5 
          transition-transform duration-500 lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-12 pt-10 px-4 hidden lg:block">
                <Link to="/" className="flex items-center gap-3 group">
                   <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 transition-all">
                      <Logo className="w-6 h-6" />
                   </div>
                   <span className="text-2xl font-black text-white tracking-tighter uppercase">Shield<span className="text-[#ff1e1e]">X</span></span>
                </Link>
            </div>

            <div className="space-y-1 mb-20 px-4 relative z-10">
              <span className="text-[10px] font-mono text-[#ff1e1e] font-black uppercase tracking-[0.4em] mb-6 block px-2">Knowledge_Tree</span>
              {DOCS_CONTENT.map((section) => (
                <SidebarLink 
                  key={section.id} 
                  id={section.id} 
                  title={section.title} 
                  active={activeSection === section.id}
                  onClick={scrollToSection}
                />
              ))}
            </div>

            {/* DECORATIVE RULER */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-20 pointer-events-none opacity-20">
               {[...Array(30)].map((_, i) => (
                 <div key={i} className="flex items-center gap-1">
                    <div className="h-[1px] w-2 bg-white/40" />
                    <span className="text-[5px] font-mono text-white/40">{String(i * 10).padStart(3, '0')}</span>
                 </div>
               ))}
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT (SCROLLABLE) */}
        <main 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-[#0a0a0a] relative custom-scrollbar scroll-smooth"
        >
          {/* TACTICAL BACKGROUND SYSTEM */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Primary Technical Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            
            {/* Fine Scanning Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_2px,transparent_2px),linear-gradient(to_bottom,#ffffff01_2px,transparent_2px)] bg-[size:160px_160px]" />

            {/* Tactical Orbs (Animated) */}
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#ff1e1e] rounded-full blur-[200px]"
            />
            <motion.div 
              animate={{ 
                x: [0, -150, 0],
                y: [0, 100, 0],
                opacity: [0.02, 0.05, 0.02]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-30%] right-[-20%] w-[1000px] h-[1000px] bg-[#ff1e1e] rounded-full blur-[250px]"
            />

            {/* Top Ingress Gradient */}
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#ff1e1e]/10 via-transparent to-transparent opacity-60" />

            {/* Scanning Line Effect */}
            <motion.div 
              animate={{ y: ["-100%", "1000%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e1e]/20 to-transparent shadow-[0_0_20px_#ff1e1e30]"
            />

            {/* Perimeter Glow */}
            <div className="absolute inset-0 border-[2px] border-white/[0.02] m-12 rounded-[5rem] pointer-events-none" />
          </div>

          <div className="max-w-4xl mx-auto px-8 md:px-16 pt-32 pb-60">
            {DOCS_CONTENT.map((section) => (
              <div 
                key={section.id}
                id={section.id}
                ref={el => contentRefs.current[section.id] = el}
                className="mb-40 last:mb-0"
              >
                {section.content}
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="mt-60 pt-20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
              {prevSection ? (
                <button 
                  onClick={() => scrollToSection(prevSection.id)}
                  className="w-full sm:w-auto flex flex-col items-start group"
                >
                   <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2 px-1">Previous_Topic</span>
                   <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-[#ff1e1e]/10 group-hover:border-[#ff1e1e]/30 transition-all text-white font-black uppercase text-xs tracking-widest">
                      <ChevronLeft size={16} className="text-[#ff1e1e]" />
                      {prevSection.title}
                   </div>
                </button>
              ) : <div />}

              {nextSection ? (
                <button 
                  onClick={() => scrollToSection(nextSection.id)}
                  className="w-full sm:w-auto flex flex-col items-end group"
                >
                   <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2 px-1 text-right">Next_Topic</span>
                   <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-[#ff1e1e] border border-[#ff1e1e] hover:scale-105 active:scale-95 transition-all text-white font-black uppercase text-xs tracking-widest red-glow">
                      {nextSection.title}
                      <ChevronRight size={16} />
                   </div>
                </button>
              ) : <div />}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR (ON THIS PAGE) */}
        <aside className="w-[260px] border-l border-white/5 hidden xl:block bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="h-full flex flex-col p-8 pt-20 overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 px-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]/40" />
               On_This_Page
            </span>
            <div className="space-y-4 relative z-10">
              {DOCS_CONTENT.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeSection === section.id ? 'text-[#ff1e1e] translate-x-1' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* RIGHT SIDEBAR ACCENTS */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,30,30,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
            
            <div className="mt-auto pt-10 px-2 space-y-4 opacity-20">
               <div className="h-[1px] w-full bg-white/10" />
               <div className="flex justify-between text-[6px] font-mono text-white/40 uppercase tracking-widest">
                  <span>Section_Map</span>
                  <span>v.2.0.1</span>
               </div>
            </div>
          </div>
        </aside>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff1e1e;
          box-shadow: 0 0 10px #ff1e1e;
        }
        .text-gradient-red {
          background: linear-gradient(135deg, #ff1e1e 0%, #ff4d4d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .red-glow {
          box-shadow: 0 0 30px -5px rgba(255, 30, 30, 0.5);
        }
        .glass-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default DocsPage;
