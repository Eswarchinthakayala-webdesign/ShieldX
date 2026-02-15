import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, Shield, Lock, Cpu, Activity, Share2, Database, ShieldCheck, Mail, Terminal, TerminalSquare, MessageSquare, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

const PacketLog = () => {
  const [logs, setLogs] = useState([
    "INITIATING_HANDSHAKE",
    "RSA_GEN_4096_SUCCESS",
    "AES_GCM_READY",
    "SOCKET_TUNNEL_OPEN"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `ENC_PACKET_${Math.floor(Math.random() * 9999)}`,
        `NODE_RELAY_${Math.floor(Math.random() * 99)}`,
        "MTLS_VERIFIED",
        "PQA_SIGNATURE_OK",
        "ENCRYPTION_LAYER_3_READY"
      ];
      setLogs(prev => [...prev.slice(-3), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-[#ff1e1e]/20 rounded-lg p-3 w-56 font-mono text-[8px] text-[#ff1e1e]/80 hidden xl:block absolute bottom-8 left-8 shadow-[0_0_20px_rgba(255,30,30,0.1)]">
      <div className="flex items-center gap-2 mb-2 border-b border-[#ff1e1e]/20 pb-1">
        <Terminal size={10} className="animate-pulse" />
        <span className="uppercase tracking-widest font-black">Secure Tunnel Logs</span>
      </div>
      {logs.map((log, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="opacity-30">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
          <span className={i === logs.length - 1 ? 'text-[#ff1e1e] font-bold' : 'opacity-60'}>{log}</span>
        </div>
      ))}
    </div>
  );
};

const Node = ({ icon: Icon, label, sublabel, isActive, type = "client", children }) => (
  <div className="flex flex-col items-center gap-5 relative z-20 group">
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`
        w-20 h-20 md:w-28 md:h-28 rounded-3xl flex items-center justify-center relative transition-all duration-700
        ${type === "server" ? 'bg-[#ff1e1e]/10 border-[#ff1e1e]/40' : 'bg-white/5 border-white/10'}
        border group-hover:border-[#ff1e1e]/70 group-hover:shadow-[0_0_40px_rgba(255,30,30,0.2)]
      `}
    >
      {type === "logo" ? (
        <Logo className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_20px_rgba(255,30,30,0.6)]" />
      ) : (
        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${isActive ? 'text-[#ff1e1e]' : 'text-white/40'} group-hover:text-white transition-colors duration-700`} />
      )}
      
      {/* HUD Corners */}
      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#ff1e1e]/40" />
      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#ff1e1e]/40" />
      
      {isActive && (
        <div className="absolute inset-0 rounded-3xl border border-[#ff1e1e]/20 animate-pulse shadow-[inset_0_0_20px_rgba(255,30,30,0.05)]" />
      )}
    </motion.div>
    
    <div className="text-center">
      <div className={`text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase mb-1 transition-colors ${isActive ? 'text-white' : 'text-white/20'}`}>
        {label}
      </div>
      <div className="flex items-center justify-center gap-1.5">
         <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e] animate-pulse" />
         <div className="text-[8px] font-mono text-[#ff1e1e]/60 tracking-tighter uppercase font-bold">{sublabel}</div>
      </div>
    </div>
    {children}
  </div>
);

const ConnectionLine = ({ horizontal = true, delay = 0, packetType = "lock" }) => {
  const PacketIcon = packetType === "mail" ? Mail : packetType === "check" ? CheckCircle2 : Lock;
  
  return (
    <div className={`relative ${horizontal ? 'flex-grow h-[2px]' : 'h-24 w-[2px]'} bg-white/5`}>
      {/* Background Flow Line */}
      <div className={`absolute inset-0 bg-gradient-to-r ${horizontal ? 'from-transparent via-white/10 to-transparent' : 'from-transparent via-white/10 to-transparent'} opacity-20`} />
      
      <motion.div
        animate={{ 
          [horizontal ? 'left' : 'top']: ['-10%", "200%']
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5, 
          ease: "linear",
          delay 
        }}
        className={`absolute ${horizontal ? 'top-0 h-full w-40' : 'left-0 w-full h-40'} bg-gradient-to-r from-transparent via-[#ff1e1e]/40 to-transparent z-10`}
      />
      
      {/* Real Flow Packet */}
      <motion.div
        animate={{ 
          [horizontal ? 'left' : 'top']: ['0%', '100%'],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1.2, 1.2, 0.8]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5, 
          ease: "easeInOut",
          delay 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
      >
         <div className="relative group/packet">
            <div className={`absolute inset-0 bg-[#ff1e1e] blur-md rounded-lg opacity-40 group-hover/packet:opacity-80 transition-opacity`} />
            <div className="relative bg-[#ff1e1e] p-2 rounded-lg border border-white/30 shadow-[0_0_20px_rgba(255,30,30,0.6)]">
               <PacketIcon size={14} className="text-white" />
            </div>
            
            {/* Trailing Particles */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex gap-1 group-hover/packet:gap-2 transition-all">
               <div className="w-1 h-1 bg-[#ff1e1e] rounded-full opacity-40 animate-pulse" />
               <div className="w-1 h-1 bg-[#ff1e1e] rounded-full opacity-20 animate-pulse delay-75" />
            </div>
         </div>
      </motion.div>
    </div>
  );
};

const Architecture = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-[#0a0a0a]" id="architecture">
      {/* Background HUD Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-[#ff1e1e]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-[1px] w-8 bg-[#ff1e1e]/40" />
            <span className="text-[#ff1e1e] font-bold tracking-[0.5em] uppercase text-[10px]">Transmission Architecture v4.0</span>
            <div className="h-[1px] w-8 bg-[#ff1e1e]/40" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-white leading-none mb-8 tracking-tighter"
          >
            THE HYBRID <br className="md:hidden" /> <span className="text-gradient-red drop-shadow-[0_0_20px_rgba(255,30,30,0.2)]">CORE MESH.</span>
          </motion.h2>
          
          <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
            ShieldX utilizes a <span className="text-white/70">Reverse-Proxy Zero-Knowledge</span> mesh where encryption is localized at the edge and transit is handled by blind relays.
          </p>
        </div>

        <div className="relative bg-black/20 rounded-3xl border border-white/5 p-12 lg:p-24 overflow-hidden min-h-[600px] flex items-center justify-center w-full shadow-2xl">
    

          <PacketLog />

          <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 lg:gap-8">
            
            {/* Origin -> Sending Message */}
            <Node icon={User} label="User Origin" sublabel="DEVICE_SHX_01" isActive={true} />
            
            <div className="hidden md:flex flex-grow items-center">
              <ConnectionLine delay={0} packetType="mail" />
            </div>
            
            <div className="md:hidden h-20 w-[1px]">
              <ConnectionLine horizontal={false} delay={0} packetType="mail" />
            </div>

            {/* Edge Relay -> Encryption Stage */}
            <Node icon={Database} label="Encryption Edge" sublabel="RSA_4096_GCM" isActive={true} type="server" />

            <div className="hidden md:flex flex-grow items-center">
              <ConnectionLine delay={1.2} packetType="lock" />
            </div>
            
            <div className="md:hidden h-20 w-[1px]">
              <ConnectionLine horizontal={false} delay={1.2} packetType="lock" />
            </div>

            {/* ShieldX Core -> Hardening */}
            <Node type="logo" label="ShieldX Core" sublabel="NODE_CLUSTER_Z1" isActive={true}>
               <div className="absolute -z-10 w-44 h-44 border border-[#ff1e1e]/20 rounded-full animate-spin-slow" />
               <div className="absolute -z-10 w-32 h-32 bg-[#ff1e1e]/5 blur-3xl animate-pulse" />
            </Node>

            <div className="hidden md:flex flex-grow items-center">
              <ConnectionLine delay={2.4} packetType="lock" />
            </div>
            
            <div className="md:hidden h-20 w-[1px]">
              <ConnectionLine horizontal={false} delay={2.4} packetType="lock" />
            </div>

            {/* Destination -> Secure Receipt */}
            <Node icon={User} label="Recipient" sublabel="AUTH_VERIFIED" isActive={true} />

          </div>

          {/* Decorative SVG Circuitry */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
             <defs>
                <pattern id="grid-dots" width="1" height="5" patternUnits="userSpaceOnUse">
                   <circle cx="0.5" cy="0.5" r="0.1" fill="#ff1e1e" />
                </pattern>
             </defs>
             <rect width="100" height="100" fill="url(#grid-dots)" />
             <path d="M 0 50 L 100 50" stroke="#ff1e1e" strokeWidth="0.1" strokeDasharray="1 1" />
          </svg>
        </div>

        {/* Real-Flow Technical Footer */}
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
           {[
             { label: "PROTOCOL LAYER", value: "RSA-4096 + AES-GCM", icon: Shield, desc: "Hybrid core encryption" },
             { label: "TUNNEL STATUS", value: "MUTUAL TLS 1.3", icon: Share2, desc: "Encrypted node transit" },
             { label: "NODE BACKBONE", value: "DISTRIBUTED ASYNC", icon: Database, desc: "Global cluster network" },
             { label: "THROUGHPUT", value: "< 18MS LATENCY", icon: Activity, desc: "Real-time verification" }
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#ff1e1e]/40 transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff1e1e]/5 blur-3xl translate-x-12 -translate-y-12 group-hover:bg-[#ff1e1e]/15 transition-all" />
                <div className="flex items-center gap-4 mb-5">
                   <div className="w-12 h-12 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 transition-all border border-[#ff1e1e]/20">
                    <stat.icon size={20} className="text-[#ff1e1e]" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase block mb-1">{stat.label}</span>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">{stat.value}</div>
                   </div>
                </div>
                <p className="text-[11px] text-white/30 font-medium group-hover:text-white/50 transition-colors uppercase tracking-widest">{stat.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 40s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Architecture;
