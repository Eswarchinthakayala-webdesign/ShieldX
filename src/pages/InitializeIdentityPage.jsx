import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ShieldXCrypto } from '../utils/crypto';
import supabase from '../utils/supabase';
import { toast } from 'sonner';

const InitializeIdentityPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [passphrase, setPassphrase] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('public_key')
                .eq('id', user.id)
                .single();
            
            if (data?.public_key) {
                navigate('/dashboard');
            }
            setChecking(false);
        };
        checkProfile();
    }, [user, navigate]);

    const handleInitialize = async (e) => {
        e.preventDefault();
        if (passphrase.length < 8) {
            return toast.error("Entropy Requirement: Passphrase must be at least 8 characters.");
        }

        setLoading(true);
        try {
            toast.loading("Forging Identity Shard...", { id: 'init' });
            const cryptoIdentity = await ShieldXCrypto.initializeIdentity(passphrase);

            const { error } = await supabase
                .from('profiles')
                .upsert([{
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.user_metadata?.name,
                    avatar_url: user.user_metadata?.avatar_url,
                    public_key: cryptoIdentity.publicKey,
                    encrypted_private_key: cryptoIdentity.encryptedPrivateKey,
                    salt: cryptoIdentity.salt,
                    iv: cryptoIdentity.iv,
                    is_public: true,
                    created_at: new Date()
                }]);

            if (error) throw error;

            // Trigger welcome email via EmailJS
            try {
                await emailjs.send(
                    "service_ha6wjpt",
                    "template_j1ctgph",
                    {
                        to_email: user.email,
                        to_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                        message: `Your identity shard has been forged.`,
                        public_key: cryptoIdentity.publicKey,
                        passphrase: passphrase, // Sending user's input passphrase
                    },
                    "mJ8q6uBoj9Eg_OYot"
                );
                toast.success("Identity Backup Sent via EmailJS", { id: 'email-sent' });
            } catch (emailError) {
                console.error("Failed to send welcome email:", emailError);
                toast.error("Email API Failed (Check Console)", { id: 'email-failed' });
            }

            toast.success("Identity Shard Active. Welcome to the Mesh.", { id: 'init' });
            navigate('/dashboard');
        } catch (error) {
            toast.error(`Initialization Failed: ${error.message}`, { id: 'init' });
        } finally {
            setLoading(false);
        }
    };

    if (checking) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-[#ff1e1e]/20 p-10 rounded-[2.5rem] shadow-2xl relative">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 flex items-center justify-center">
                            <ShieldAlert className="w-10 h-10 text-[#ff1e1e] animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center mb-10 space-y-2">
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Identity_Required</h1>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-4 leading-relaxed">
                            Your Google node is authenticated, but your cryptographic identity shard has not been generated. Create an encryption passphrase to forge your keys.
                        </p>
                    </div>

                    <form onSubmit={handleInitialize} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Encryption_Passphrase</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/20 group-focus-within/input:text-[#ff1e1e] transition-colors" />
                                </div>
                                <input 
                                    type="password"
                                    required
                                    className="block w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 focus:border-[#ff1e1e]/50 transition-all font-medium"
                                    placeholder="Minimum 8 characters..."
                                    value={passphrase}
                                    onChange={(e) => setPassphrase(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-start gap-4">
                            <Fingerprint size={20} className="text-[#ff1e1e] shrink-0" />
                            <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed tracking-tighter">
                                This passphrase will be used to encrypt your RSA private key locally. It is never stored on our servers. 
                                <span className="text-white"> If you lose this, you lose access to your secure messages.</span>
                            </p>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#ff1e1e] hover:bg-[#ff1e1e]/90 text-white font-black uppercase py-4 rounded-2xl tracking-[0.2em] text-xs transition-all shadow-[0_0_20px_rgba(255,30,30,0.3)] flex items-center justify-center gap-2 group/btn ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Forging..." : "Forge_Identity_Shard"}
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default InitializeIdentityPage;
