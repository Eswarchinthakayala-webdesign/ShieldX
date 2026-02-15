import React from 'react';
import { Search, Plus, Zap, Send, Shield, Globe, Users, Fingerprint } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';

const UsersTab = ({
    searchQuery,
    handleSearch,
    searchResults,
    sendRequest,
    requests,
    updateRequestStatus,
}) => {
    return (
        <div className="flex-1 overflow-y-auto min-h-0 relative">
            <BackgroundEffects />
            <div className="p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20">
                            <Users size={16} className="text-[#ff1e1e]" />
                        </div>
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Node_Discovery</h2>
                    </div>

                    {/* Discovery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                        {/* Search & Results */}
                        <section className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-4 sm:p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#ff1e1e]/10 to-transparent rounded-bl-3xl opacity-50" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-4">Search_Lattice</div>
                                <div className="relative group/input">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#ff1e1e] transition-colors" size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Query_Email_Lattice..."
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all uppercase tracking-widest font-bold"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                
                                {searchResults.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {searchResults.map((res) => {
                                            const displayName = res.full_name || res.name || res.email.split('@')[0];
                                            return (
                                                <div key={res.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:border-[#ff1e1e]/20 hover:bg-white/[0.05] transition-all cursor-pointer">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {res.avatar_url ? (
                                                            <img src={res.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#ff1e1e]/20 shrink-0" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                                                <Fingerprint size={14} className="text-[#ff1e1e]" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="text-[10px] font-bold text-white uppercase tracking-tight truncate group-hover:text-[#ff1e1e] transition-colors">
                                                                {displayName}
                                                            </div>
                                                            <div className="text-[8px] text-white/40 truncate">{res.email}</div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => sendRequest(res.id)}
                                                        className="p-2 ml-3 rounded-lg bg-[#ff1e1e] text-white hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,30,30,0.3)] shrink-0"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Protocol Requests - Stacked Layout */}
                        <div className="flex flex-col gap-8">
                            {/* Incoming Requests */}
                            <section className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap size={14} className="text-[#ff1e1e]" />
                                    <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Incoming_Handshakes</h3>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-4 space-y-3 min-h-[140px] relative overflow-hidden">
                                    {requests.incoming.map((req) => {
                                        const displayName = req.sender.full_name || req.sender.name || req.sender.email.split('@')[0];
                                        return (
                                            <div key={req.id} className="p-3 sm:p-4 rounded-2xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 flex flex-col gap-3 group hover:bg-[#ff1e1e]/10 transition-all">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {req.sender.avatar_url ? (
                                                        <img src={req.sender.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#ff1e1e]/20 shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                            <Globe size={14} className="text-[#ff1e1e]" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[10px] font-bold text-white uppercase tracking-tight truncate">{displayName}</div>
                                                        <div className="text-[8px] text-white/40 truncate">{req.sender.email}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => updateRequestStatus(req.id, 'accepted')}
                                                        className="flex-1 py-2.5 bg-[#ff1e1e] text-white text-[9px] font-black uppercase rounded-xl hover:bg-[#ff1e1e]/90 hover:shadow-[0_0_15px_rgba(255,30,30,0.3)] transition-all"
                                                    >
                                                        Authorize
                                                    </button>
                                                    <button 
                                                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                                                        className="flex-1 py-2.5 bg-white/5 text-white/40 text-[9px] font-black uppercase rounded-xl hover:bg-white/10 hover:text-white transition-all"
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {requests.incoming.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 opacity-30 h-full">
                                            <Shield size={24} className="mb-2" />
                                            <div className="text-[8px] font-bold uppercase tracking-widest">No pending handshakes</div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Outgoing Requests */}
                            <section className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Send size={14} className="text-white/20" />
                                    <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Logged_Handshakes</h3>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-4 space-y-3 min-h-[140px] relative overflow-hidden">
                                    {requests.outgoing.map((req) => {
                                         const displayName = req.receiver.full_name || req.receiver.name || req.receiver.email.split('@')[0];
                                         return (
                                            <div key={req.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {req.receiver.avatar_url ? (
                                                        <img src={req.receiver.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                            <Globe size={14} className="text-white/30" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[10px] font-bold text-white/60 truncate group-hover:text-white transition-colors">{displayName}</div>
                                                        <div className="text-[8px] text-white/30 truncate">{req.receiver.email}</div>
                                                    </div>
                                                </div>
                                                <div className="text-[8px] font-black text-[#ff1e1e] uppercase tracking-widest animate-pulse shrink-0 ml-2">Pending...</div>
                                            </div>
                                         );
                                    })}
                                    {requests.outgoing.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 opacity-30 h-full">
                                            <Send size={24} className="mb-2" />
                                            <div className="text-[8px] font-bold uppercase tracking-widest">No outgoing requests</div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersTab;
