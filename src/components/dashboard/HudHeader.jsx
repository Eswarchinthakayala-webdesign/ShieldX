import React from 'react';
import { Fingerprint } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const HudHeader = ({ user, conversations, onSelectConversation, onNavigateToMessages, activeTab, selectedConversationId }) => {
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];

    return (
        <header className="hidden md:flex h-16 lg:h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl px-4 lg:px-8 items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                    <div className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Node_Status</div>
                    <div className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-tighter">
                        {displayName}
                        <span className="text-white/30 font-mono ml-2 text-[10px]">@mesh_active</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                {/* Notification Bell */}
                <NotificationPanel 
                    user={user}
                    conversations={conversations || []}
                    onSelectConversation={onSelectConversation}
                    onNavigateToMessages={onNavigateToMessages}
                    activeTab={activeTab}
                    selectedConversationId={selectedConversationId}
                />

                <div className="hidden lg:flex flex-col items-end">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Lattice_Coord</div>
                    <div className="text-xs font-mono text-[#ff1e1e]">0x7F...{user?.id?.slice(-4)}</div>
                </div>
                {avatarUrl ? (
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-[#ff1e1e]/30 overflow-hidden relative group">
                        <img 
                            src={avatarUrl} 
                            alt="Node Avatar" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e1e]/20 to-transparent pointer-events-none" />
                    </div>
                ) : (
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-[#ff1e1e]/20 to-[#ff1e1e]/5 border border-[#ff1e1e]/30 flex items-center justify-center overflow-hidden relative">
                        <Fingerprint size={18} className="text-[#ff1e1e]" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default HudHeader;
