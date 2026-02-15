
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import Logo from '../landing-page/Logo';

const IdentityUnlockOverlay = ({ decryptedPrivateKey, passphrase, setPassphrase, unlockIdentity, isUnlocking }) => {
    return (
        <AnimatePresence>
            {!decryptedPrivateKey && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-sm sm:max-w-md bg-white/[0.02] border border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff1e1e] to-transparent opacity-50" />
                        
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 flex items-center justify-center mx-auto mb-4 sm:mb-8 relative">
                                <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
                                <div className="absolute inset-0 bg-[#ff1e1e]/5 blur-xl rounded-full" />
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tighter">Identity_Access</h2>
                                <p className="text-[9px] sm:text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                                    Your private identity shard is encrypted. <br />
                                    Provide your passphrase to authorize lattice decryption.
                                </p>
                            </div>

                            <form onSubmit={unlockIdentity} className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                                <div className="relative group">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff1e1e] transition-colors" size={16} />
                                    <input 
                                        type="password"
                                        placeholder="Enter_Passphrase..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all text-center tracking-[0.2em] sm:tracking-[0.3em]"
                                        value={passphrase}
                                        onChange={(e) => setPassphrase(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isUnlocking}
                                    className="w-full bg-[#ff1e1e] text-white font-black uppercase py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,30,30,0.3)]"
                                >
                                    {isUnlocking ? "Authorizing..." : "Unlock_Identity"}
                                </button>
                            </form>

                            <div className="pt-4 sm:pt-6">
                                <p className="text-[7px] sm:text-[8px] text-white/10 font-black uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                                    Zero-Knowledge Local Authorization
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IdentityUnlockOverlay;
