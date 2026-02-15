import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Globe, Lock, ShieldCheck, Cpu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Protocol', href: '/protocol', icon: Lock },
  { name: 'Architecture', href: '/architecture', icon: Cpu },
  { name: 'Docs', href: '/docs', icon: Globe },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-[#0a0a0a]/70 backdrop-blur-2xl border-b border-[#ff1e1e]/15' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <Logo className="w-10 h-10 transition-transform duration-500 group-hover:rotate-[15deg]" />
            <div className="absolute inset-0 bg-[#ff1e1e] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tighter leading-none">
              SHIELD<span className="text-[#ff1e1e]">X</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              className="px-5 py-2 text-sm font-semibold text-white/50 hover:text-white transition-all duration-300 relative group flex items-center gap-2"
            >
              <span>{link.name}</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#ff1e1e] transition-all duration-300 group-hover:w-1/2" />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button className="bg-[#ff1e1e] hover:bg-[#ff0033] text-white rounded-full px-8 py-6 font-bold text-xs uppercase tracking-[0.15em] red-glow transition-all duration-500 hover:scale-105 active:scale-95 border-none">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-white/60 hover:text-[#ff1e1e] hover:bg-[#ff1e1e]/5 font-bold text-xs uppercase tracking-widest px-6"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest px-6 whitespace-nowrap">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#ff1e1e] hover:bg-[#ff0033] text-white rounded-full px-8 py-6 font-bold text-xs uppercase tracking-[0.15em] red-glow transition-all duration-500 hover:scale-105 active:scale-95 border-none">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile / Tablet Menu (Sheet) */}
        <div className="lg:hidden flex items-center gap-4">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-[#ff1e1e]/20 w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left py-6 border-b border-white/5 mb-8">
                <SheetTitle className="flex items-center gap-3">
                  <Logo className="w-8 h-8" />
                  <span className="text-xl font-bold tracking-tighter text-white">SHIELD<span className="text-[#ff1e1e]">X</span></span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.href}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-[#ff1e1e]/10 border border-transparent hover:border-[#ff1e1e]/20 group transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 transition-colors">
                        <link.icon className="w-5 h-5 text-white/50 group-hover:text-[#ff1e1e]" />
                      </div>
                      <span className="font-bold text-white/70 group-hover:text-white">{link.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#ff1e1e] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button className="w-full bg-[#ff1e1e] hover:bg-[#ff0033] text-white py-7 rounded-2xl font-bold uppercase tracking-widest text-xs border-none">
                        Dashboard Nexus
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={signOut}
                      className="w-full bg-white/5 border-white/10 hover:bg-white/10 py-7 rounded-2xl font-bold uppercase tracking-widest text-xs text-white"
                    >
                      Terminate Session
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button className="w-full bg-[#ff1e1e] hover:bg-[#ff0033] text-white py-7 rounded-2xl font-bold uppercase tracking-widest text-xs border-none">
                        Start Securely
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 py-7 rounded-2xl font-bold uppercase tracking-widest text-xs text-white">
                        Access Console
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
