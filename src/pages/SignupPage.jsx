import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Chrome, ShieldCheck, Fingerprint, ArrowRight } from 'lucide-react';
import Logo from '../components/landing-page/Logo';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SignupPage = () => {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignup = async () => {
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
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <Link to="/" className="inline-block group">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 group-hover:border-[#ff1e1e]/40 transition-all duration-500 group-hover:scale-110">
                            <Logo className="w-10 h-10" />
                        </div>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter ">Lattice_Initialization</h1>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest px-4">Join the mesh via Google_Node attestation</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative group overflow-hidden">
                    {/* Security Badge */}
                    <div className="absolute top-6 right-6 opacity-10">
                        <ShieldCheck size={40} className="text-[#ff1e1e]" />
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 rounded-3xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20">
                                    <Fingerprint className="text-[#ff1e1e]" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Biometric_Handshake</h3>
                                    <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter mt-1">One-click node verification</p>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-wider">
                                We utilize Google's authentication lattice to verify your baseline identity. Once authenticated, you will generate your own zero-knowledge keys for message encryption.
                            </p>
                        </div>

                        <button 
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full bg-[#ff1e1e] hover:bg-[#ff1e1e]/90 text-white font-black uppercase py-5 rounded-2xl tracking-[0.2em] text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,30,30,0.3)] flex items-center justify-center gap-3 group/btn"
                        >
                            <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
                            {loading ? "Initializing..." : "Register Google Node"}
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex justify-center gap-8 filter grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                             <div className="h-4 w-px bg-white/10" />
                             <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Encrypted_Sync</span>
                             <div className="h-4 w-px bg-white/10" />
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-white/30 text-[10px] font-black uppercase tracking-widest">
                    Already recognized by the lattice? <Link to="/login" className="text-[#ff1e1e] hover:underline decoration-2 underline-offset-4">Resume_Session</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignupPage;
