import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, ExternalLink, ShieldCheck, Mail, Activity, Globe } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="relative pt-32 pb-12 px-6 overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff1e1e]/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff1e1e]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <Logo className="w-10 h-10 group-hover:rotate-[15deg] transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none uppercase text-white">
                  SHIELD<span className="text-[#ff1e1e]">X</span>
                </span>
              </div>
            </Link>
            
            <p className="text-white/30 text-sm leading-relaxed max-w-xs font-medium">
              Next-generation hybrid encrypted messaging infrastructure. Built from the ground up for absolute privacy in a quantum-capable world.
            </p>
            
            <div className="flex gap-5">
              {[Github, Twitter, Linkedin].map((Icon, idx) => (
                <div key={idx} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#ff1e1e]/10 hover:border-[#ff1e1e]/40 group cursor-pointer transition-all duration-300">
                   <Icon size={18} className="text-white/40 group-hover:text-[#ff1e1e] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Protocol",
              links: [
                { name: "Core Architecture", path: "/architecture" },
                { name: "Hybrid Encryption", path: "/protocol" },
                { name: "Encryption Mesh", path: "/architecture" },
                { name: "Zero-Knowledge", path: "/protocol" }
              ]
            },
            {
              title: "Security",
              links: [
                { name: "Audit Reports", path: "/security" },
                { name: "Bug Bounty", path: "/security" },
                { name: "Vulnerability Disclosure", path: "/docs" },
                { name: "PQA Standards", path: "/security" }
              ]
            },
            {
              title: "Company",
              links: [
                { name: "About Secure", path: "/about" },
                { name: "System Status", path: "/about" },
                { name: "Documentation", path: "/docs" },
                { name: "Contact Infrastructure", path: "/about" }
              ]
            }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.3em] text-[#ff1e1e] flex items-center gap-2">
                 <div className="w-2 h-[1px] bg-[#ff1e1e]" />
                 {col.title}
              </h4>
              <ul className="space-y-4 text-xs font-bold text-white/30">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx} className="hover:text-white cursor-pointer transition-colors group">
                    <Link to={link.path} className="flex items-center gap-2">
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      {link.name.includes('Audit') && <ExternalLink size={10} className="text-[#ff1e1e]/40" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


      </div>
      
      {/* Background Watermark */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.02] rotate-[15deg] pointer-events-none select-none">
         <h1 className="text-[18rem] font-black tracking-tighter">SECURE</h1>
      </div>
    </footer>
  );
};

export default Footer;
