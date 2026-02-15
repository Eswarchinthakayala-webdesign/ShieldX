import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, ChevronLeft, Zap, Send, Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

const ChatView = ({
    user,
    selectedConversation,
    setSelectedConversation,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage,
    sendMessage,
    sending,
    showEmojiPicker,
    setShowEmojiPicker,
    onEmojiClick,
    emojiPickerRef,
    emojiButtonRef,
    renderLeftPanelContent,
}) => {
    return (
        <>
            {/* Left Panel - conversation list (desktop) */}
            <div className={`hidden md:flex w-72 lg:w-80 xl:w-96 border-r border-white/5 flex-col bg-black/20 min-h-0
                ${selectedConversation ? 'lg:flex' : ''}`}>
                {renderLeftPanelContent()}
            </div>

            {/* Right Panel - Chat or conversation list (mobile) */}
            <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
                {selectedConversation ? (
                    <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl min-h-0 overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-3 sm:p-4 lg:p-6 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <button 
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-3">
                                    {selectedConversation.user_one === user.id ? (
                                        selectedConversation.user_two_profile?.avatar_url ? (
                                            <img src={selectedConversation.user_two_profile.avatar_url} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-[#ff1e1e]/20" />
                                        ) : (
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                                <Zap className="text-[#ff1e1e]" size={16} />
                                            </div>
                                        )
                                    ) : (
                                        selectedConversation.user_one_profile?.avatar_url ? (
                                            <img src={selectedConversation.user_one_profile.avatar_url} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-[#ff1e1e]/20" />
                                        ) : (
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                                <Zap className="text-[#ff1e1e]" size={16} />
                                            </div>
                                        )
                                    )}
                                    <div className="min-w-0">
                                        <div className="text-[8px] sm:text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.2em]">Secure_Tunnel</div>
                                        <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">
                                            {(selectedConversation.user_one === user.id 
                                                ? (selectedConversation.user_two_profile?.full_name || selectedConversation.user_two_profile?.name || selectedConversation.user_two_profile?.email?.split('@')[0])
                                                : (selectedConversation.user_one_profile?.full_name || selectedConversation.user_one_profile?.name || selectedConversation.user_one_profile?.email?.split('@')[0])
                                            )}
                                        </div>
                                        <div className="text-[8px] text-white/40 font-mono truncate hidden sm:block">
                                            {selectedConversation.user_one === user.id ? selectedConversation.user_two_profile?.email : selectedConversation.user_one_profile?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedConversation(null)}
                                className="hidden md:block text-[10px] font-black text-white/20 uppercase hover:text-[#ff1e1e] transition-colors"
                            >
                                Close_Terminal [ESC]
                            </button>
                        </div>

                        {/* Message Thread */}
                        <div 
                            id="message-thread"
                            className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 scroll-smooth"
                        >
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: msg.sender_id === user.id ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] sm:max-w-[70%] group ${msg.sender_id === user.id ? 'items-end' : 'items-start'} flex flex-col gap-1 sm:gap-2`}>
                                        <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-mono leading-relaxed break-all
                                            ${msg.sender_id === user.id 
                                                ? 'bg-[#ff1e1e] text-white rounded-tr-none shadow-[0_5px_15px_rgba(255,30,30,0.2)]' 
                                                : 'bg-white/[0.05] text-white/80 border border-white/5 rounded-tl-none'}`}
                                        >
                                            {msg.content || "[DECRYPTING_PAYLOAD...]"}
                                        </div>
                                        <div className="text-[7px] sm:text-[8px] font-mono text-white/20 uppercase px-1">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // SHIELDX_ENCRYPTED
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                    <Terminal size={36} className="mb-4" />
                                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Encrypted_Channel_Standby</div>
                                    <div className="text-[7px] sm:text-[8px] font-bold uppercase mt-2">No packet history in this shard</div>
                                </div>
                            )}
                        </div>

                        {/* Composer */}
                        <form onSubmit={sendMessage} className="p-3 sm:p-4 lg:p-6 bg-black/40 border-t border-white/5 shrink-0 relative">
                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        ref={emojiPickerRef}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-4 sm:left-6 mb-4 z-50"
                                    >
                                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
                                            <EmojiPicker
                                                theme={Theme.DARK}
                                                onEmojiClick={onEmojiClick}
                                                width={320}
                                                height={400}
                                                lazyLoadEmojis={true}
                                                searchPlaceHolder="Search_Glyphs..."
                                                previewConfig={{ showPreview: false }}
                                                skinTonesDisabled
                                                style={{
                                                    '--epr-bg-color': '#0a0a0a',
                                                    '--epr-category-label-bg-color': '#0a0a0a',
                                                    '--epr-text-color': '#fff',
                                                    '--epr-picker-border-color': '#333',
                                                    '--epr-hover-bg-color': 'rgba(255, 30, 30, 0.1)',
                                                    backgroundColor: '#0a0a0a',
                                                    border: 'none',
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative flex items-center gap-2 sm:gap-4">
                                <div className="flex-1 relative group">
                                    <input 
                                        type="text"
                                        placeholder="Inject_Payload..."
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-20 sm:pr-24 text-xs text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all font-medium"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                                        <button 
                                            ref={emojiButtonRef}
                                            type="button" 
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors ${showEmojiPicker ? 'text-[#ff1e1e]' : 'text-white/20 hover:text-white/60'}`}
                                        >
                                            <Smile size={16} />
                                        </button>
                                        <div className="w-px h-4 bg-white/10" />
                                        <button type="button" className="p-1 text-white/10 hover:text-white/40 transition-colors cursor-default">
                                            <Lock size={12} />
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ff1e1e] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:scale-105 active:scale-95 transition-all shrink-0
                                        ${(sending || !newMessage.trim()) ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Mobile: show conversation list when no chat is selected */}
                        <div className="flex-1 flex flex-col overflow-hidden min-h-0 md:hidden">
                            {renderLeftPanelContent()}
                        </div>
                        {/* Desktop: show placeholder when no chat is selected */}
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center opacity-20">
                            <Terminal size={48} className="mb-4" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em]">Select_A_Tunnel</div>
                            <div className="text-[8px] font-bold uppercase mt-2 text-white/40">Choose a conversation from the panel to begin</div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ChatView;
