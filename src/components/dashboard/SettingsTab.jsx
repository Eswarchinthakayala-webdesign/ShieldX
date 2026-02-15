import React from 'react';
import { Settings, Eye, Lock, Shield } from 'lucide-react';
import supabase from '../../utils/supabase';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import BackgroundEffects from './BackgroundEffects';

const SettingsTab = ({ profile, user, togglePrivacy, signOut }) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {/* Contextual Background - Fixed behind content */}
            <BackgroundEffects />
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20">
                            <Settings size={16} className="text-[#ff1e1e]" />
                        </div>
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">System_Optics</h2>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Privacy Controls */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 relative overflow-hidden group/card hover:border-[#ff1e1e]/20 transition-all duration-500">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff1e1e] to-transparent opacity-0 group-hover/card:opacity-50 transition-opacity" />
                            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#ff1e1e]/30 group-hover/card:border-[#ff1e1e] transition-colors" />
                            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#ff1e1e]/30 group-hover/card:border-[#ff1e1e] transition-colors" />
                            
                            <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 bg-[#ff1e1e] rounded-full animate-pulse" />
                                Privacy_Optics
                            </div>
                            
                            <button 
                                onClick={togglePrivacy}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group/btn relative overflow-hidden
                                    ${profile?.is_public 
                                        ? 'bg-[#ff1e1e]/5 border-[#ff1e1e]/20 hover:bg-[#ff1e1e]/10' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <div className="text-left flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${profile?.is_public ? 'bg-[#ff1e1e]/20 text-[#ff1e1e]' : 'bg-white/10 text-white/30'}`}>
                                        <Eye size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-white uppercase tracking-tight">Stealth_Mode</div>
                                        <div className="text-[8px] text-white/40 uppercase tracking-widest mt-1">
                                            {profile?.is_public ? 'Node Visible to Mesh' : 'Node Masked'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${profile?.is_public ? 'bg-[#ff1e1e]' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${profile?.is_public ? 'left-7' : 'left-1'}`} />
                                </div>
                            </button>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ff1e1e]/5 blur-[60px] rounded-full pointer-events-none group-hover/card:bg-[#ff1e1e]/10 transition-all duration-700" />
                        </div>

                        {/* Protocol Info */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:border-white/10 transition-all">
                            <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em]">Protocol_Firmware</div>
                            
                            <div className="space-y-3">
                                {[
                                    { label: "Version", value: "SHIELDX_NODE_v4.2.0-STABLE" },
                                    { label: "Cipher_Suite", value: "RSA-OAEP + AES-256-GCM" },
                                    { label: "Architecture", value: "ZERO_KNOWLEDGE_E2E" }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col group/item hover:bg-white/[0.04] transition-all">
                                        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 group-hover/item:text-[#ff1e1e]/50 transition-colors">{item.label}</div>
                                        <div className="text-xs font-bold text-white font-mono">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Node Identity */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:border-white/10 transition-all">
                            <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em]">Node_Identity</div>
                            
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.04] transition-all">
                                    {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                                        <div className="w-10 h-10 rounded-lg border border-white/10 overflow-hidden relative group">
                                            <img 
                                                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 font-black text-xs">
                                            {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Operator</div>
                                        <div className="text-[10px] font-bold text-white/80 font-mono truncate">
                                            {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Email_Address</div>
                                    <div className="text-[10px] font-bold text-white/60 font-mono truncate">{user?.email}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Node_ID</div>
                                    <div className="text-[10px] font-bold text-white/60 font-mono truncate tracking-wider">{user?.id}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Visibility</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${profile?.is_public ? 'text-[#ff1e1e]' : 'text-white/30'}`}>
                                        {profile?.is_public ? 'PUBLIC_NODE' : 'STEALTH_MODE'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-black/40 backdrop-blur-md border border-[#ff1e1e]/10 rounded-3xl p-6 space-y-4">
                            <div className="text-[10px] font-black text-[#ff1e1e]/60 uppercase tracking-[0.3em]">Danger_Zone</div>
                            
                            <div className="space-y-4">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button 
                                            className="w-full p-4 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 flex items-center gap-4 hover:bg-[#ff1e1e]/10 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 flex items-center justify-center group-hover:bg-[#ff1e1e]/20 group-hover:scale-110 transition-all">
                                                <Lock size={18} className="text-[#ff1e1e]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[10px] font-bold text-white uppercase tracking-tight">Disconnect_Node</div>
                                                <div className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">Terminate session & purge local keys</div>
                                            </div>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Disconnect</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to terminate your session? This will purge your local decrypted keys and you will need to re-authorize to connect.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={signOut}>Disconnect</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>



            
                                <div className="p-3 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-start gap-3">
                                    <Shield size={12} className="text-[#ff1e1e]/50 mt-0.5 shrink-0" />
                                    <p className="text-[7px] text-white/30 uppercase leading-relaxed font-bold">
                                        Disconnecting will destroy your local decrypted key cache. You will need your passphrase to reconnect.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
