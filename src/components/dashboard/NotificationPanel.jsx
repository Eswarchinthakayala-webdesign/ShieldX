import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, X, Shield } from 'lucide-react';
import supabase from '../../utils/supabase';

const NotificationPanel = ({ 
    user, 
    conversations, 
    onSelectConversation, 
    onNavigateToMessages,
    activeTab,
    selectedConversationId
}) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [readIds, setReadIds] = useState(() => {
        try {
            const saved = localStorage.getItem(`shieldx_read_notifs_${user?.id}`);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const panelRef = useRef(null);

    // Auto-mark messages from the currently open conversation as read
    useEffect(() => {
        if (activeTab === 'messages' && selectedConversationId) {
            const idsToMark = notifications
                .filter(n => n.conversation_id === selectedConversationId && !readIds.includes(n.id))
                .map(n => n.id);
            
            if (idsToMark.length > 0) {
                setReadIds(prev => [...new Set([...prev, ...idsToMark])]);
            }
        }
    }, [activeTab, selectedConversationId, notifications]);

    // Only show unread notifications from OTHER conversations (not the one currently open)
    const unreadNotifications = notifications.filter(n => {
        const isRead = readIds.includes(n.id);
        if (isRead) return false;
        // If user is viewing this conversation right now, it's auto-read
        if (activeTab === 'messages' && n.conversation_id === selectedConversationId) return false;
        return true;
    });

    const unreadCount = unreadNotifications.length;

    // Visible notifications = only unread ones (read ones disappear like WhatsApp)
    const visibleNotifications = unreadNotifications;

    // Persist read IDs (cap at 200 to avoid localStorage bloat)
    useEffect(() => {
        if (user?.id) {
            const capped = readIds.slice(-200);
            localStorage.setItem(`shieldx_read_notifs_${user.id}`, JSON.stringify(capped));
        }
    }, [readIds, user?.id]);

    // Fetch recent messages from all conversations (not sent by current user)
    useEffect(() => {
        if (!user || !conversations || conversations.length === 0) return;

        const convIds = conversations.map(c => c.id);

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .in('conversation_id', convIds)
                .neq('sender_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            if (!error && data) {
                const enriched = data.map(msg => {
                    const conv = conversations.find(c => c.id === msg.conversation_id);
                    const isUserOne = conv?.user_one === user.id;
                    const senderProfile = isUserOne ? conv?.user_two_profile : conv?.user_one_profile;
                    return {
                        ...msg,
                        senderName: senderProfile?.full_name || senderProfile?.name || senderProfile?.email?.split('@')[0] || 'Unknown',
                        senderAvatar: senderProfile?.avatar_url,
                        conversation: conv
                    };
                });
                setNotifications(enriched);
            }
        };

        fetchNotifications();

        // Real-time subscription for new messages across all conversations
        const channels = convIds.map(convId => {
            return supabase
                .channel(`notif:${convId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${convId}`
                }, (payload) => {
                    const msg = payload.new;
                    if (msg.sender_id === user.id) return;

                    const conv = conversations.find(c => c.id === msg.conversation_id);
                    const isUserOne = conv?.user_one === user.id;
                    const senderProfile = isUserOne ? conv?.user_two_profile : conv?.user_one_profile;

                    const enrichedMsg = {
                        ...msg,
                        senderName: senderProfile?.full_name || senderProfile?.name || senderProfile?.email?.split('@')[0] || 'Unknown',
                        senderAvatar: senderProfile?.avatar_url,
                        conversation: conv
                    };

                    setNotifications(prev => {
                        const exists = prev.find(n => n.id === msg.id);
                        if (exists) return prev;
                        return [enrichedMsg, ...prev].slice(0, 30);
                    });
                })
                .subscribe();
        });

        return () => {
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, [user, conversations]);

    // Close panel on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleNotificationClick = (notif) => {
        // Mark as read — it will disappear from the list
        setReadIds(prev => [...new Set([...prev, notif.id])]);
        // Navigate to the conversation
        if (notif.conversation) {
            onNavigateToMessages();
            onSelectConversation(notif.conversation);
        }
        setIsOpen(false);
    };

    const markAllAsRead = () => {
        setReadIds(prev => [...new Set([...prev, ...notifications.map(n => n.id)])]);
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${diffDays}d`;
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/5 transition-all group"
            >
                <Bell size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#ff1e1e] rounded-full flex items-center justify-center text-[8px] font-black text-white animate-pulse shadow-[0_0_8px_rgba(255,30,30,0.5)] px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile backdrop overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="
                                fixed inset-x-3 top-16 z-50
                                md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96
                                max-h-[75vh] md:max-h-[70vh]
                                bg-[#0d0d0d] border border-white/10 rounded-2xl 
                                shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden
                            "
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Bell size={14} className="text-[#ff1e1e]" />
                                    <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">Incoming_Signals</span>
                                    {unreadCount > 0 && (
                                        <span className="bg-[#ff1e1e]/20 text-[#ff1e1e] text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-[8px] sm:text-[9px] font-bold text-white/30 hover:text-[#ff1e1e] uppercase tracking-wider transition-colors"
                                        >
                                            Mark_All_Read
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                        <X size={14} className="text-white/30" />
                                    </button>
                                </div>
                            </div>

                            {/* Notification List */}
                            <div className="overflow-y-auto max-h-[60vh] md:max-h-[55vh]">
                                {visibleNotifications.length === 0 ? (
                                    <div className="p-8 sm:p-10 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4">
                                            <Shield size={24} className="text-white/10" />
                                        </div>
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">
                                            All_Clear
                                        </div>
                                        <div className="text-[9px] text-white/10 uppercase tracking-wider">
                                            No pending signals detected
                                        </div>
                                    </div>
                                ) : (
                                    visibleNotifications.map((notif, index) => (
                                        <motion.button
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, height: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleNotificationClick(notif)}
                                            className="w-full p-3 sm:p-4 flex items-start gap-3 border-b border-white/[0.03] hover:bg-white/[0.03] active:bg-white/[0.06] transition-all text-left group bg-[#ff1e1e]/[0.02]"
                                        >
                                            {/* Avatar / Icon */}
                                            <div className="relative shrink-0">
                                                {notif.senderAvatar ? (
                                                    <img 
                                                        src={notif.senderAvatar} 
                                                        alt="" 
                                                        className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl object-cover border border-white/10" 
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center text-sm font-black text-[#ff1e1e]/60">
                                                        {notif.senderName?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff1e1e] rounded-full border-2 border-[#0d0d0d] shadow-[0_0_6px_rgba(255,30,30,0.4)]" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[11px] sm:text-[10px] font-bold uppercase tracking-tight truncate text-white">
                                                        {notif.senderName}
                                                    </span>
                                                    <span className="text-[9px] sm:text-[8px] text-white/20 font-mono uppercase shrink-0 ml-2">
                                                        {getTimeAgo(notif.created_at)}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] sm:text-[9px] uppercase tracking-wider truncate text-white/40">
                                                    🔒 Encrypted_Payload_Received
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {visibleNotifications.length > 0 && (
                                <div className="p-2 border-t border-white/5">
                                    <button 
                                        onClick={() => { onNavigateToMessages(); setIsOpen(false); }}
                                        className="w-full py-2.5 text-[9px] font-black text-white/30 hover:text-[#ff1e1e] uppercase tracking-widest transition-colors rounded-xl hover:bg-white/[0.02]"
                                    >
                                        View_All_Messages →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
