import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Chrome, Shield, ArrowRight } from 'lucide-react';
import Logo from '../components/landing-page/Logo';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            toast.error(`OAuth Failure: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#ff1e1e] selection:text-white">
            {/* TACTICAL BACKGROUND SYSTEM */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[800px]">
                    <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#ff1e1e]/10 rounded-full" 
                    />
                </div>

                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#ff1e1e]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#ff1e1e]/5 rounded-full blur-[150px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <Link to="/" className="inline-block group">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 group-hover:border-[#ff1e1e]/40 transition-all duration-500 group-hover:scale-110">
                            <Logo className="w-10 h-10" />
                        </div>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter ">Access_Protocol</h1>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Identify yourself via Google Node</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#ff1e1e]/40" />
                    <div className="absolute top-0 left-0 h-8 w-[1px] bg-[#ff1e1e]/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-[#ff1e1e]/40" />
                    <div className="absolute bottom-0 right-0 h-8 w-[1px] bg-[#ff1e1e]/40" />

                    <div className="space-y-8">
                        <div className="p-6 rounded-2xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex flex-col items-center gap-4 text-center">
                            <Shield className="w-12 h-12 text-[#ff1e1e] animate-pulse" />
                            <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">
                                ShieldX uses Google OAuth for rapid node synchronization. Your cryptographic identity will be forged separately upon entry.
                            </p>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className={`w-full bg-white hover:bg-white/90 text-black font-black uppercase py-5 rounded-2xl tracking-[0.1em] text-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Chrome size={20} className="text-[#ff1e1e]" />
                            {loading ? "Initializing..." : "Authorize with Google"}
                        </button>

                        <p className="text-center text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                            End-to-End Encrypted Session Link
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-white/30 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    By accessing the mesh, you agree to the <br />
                    <span className="text-[#ff1e1e]">ShieldX Zero-Knowledge Protocol</span>
                </p>
            </motion.div>

            {/* Scanning Line Effect */}
            <motion.div 
                animate={{ y: ["-100%", "1000%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-transparent via-[#ff1e1e]/5 to-transparent pointer-events-none opacity-20"
            />
        </div>
    );
};

export default LoginPage;
