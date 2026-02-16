import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Settings,
  Search,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { ShieldXCrypto } from '../utils/crypto';
import { toast } from 'sonner';

import { summarizeChat } from '../utils/ai';
import BackgroundEffects from '../components/dashboard/BackgroundEffects';
import StatCard from '../components/dashboard/StatCard';
import Sidebar from '../components/dashboard/Sidebar';
import MobileHeader from '../components/dashboard/MobileHeader';
import IdentityUnlockOverlay from '../components/dashboard/IdentityUnlockOverlay';
import HudHeader from '../components/dashboard/HudHeader';
import ChatView from '../components/dashboard/ChatView';
import DashboardTab from '../components/dashboard/DashboardTab';
import SummariesTab from '../components/dashboard/SummariesTab';
import UsersTab from '../components/dashboard/UsersTab';
import SettingsTab from '../components/dashboard/SettingsTab';
import UsageTab from '../components/dashboard/UsageTab';

const DashboardPage = () => {
    const { tab, chatUser } = useParams();
    const navigate = useNavigate();
    const validTabs = ['stats', 'messages', 'users', 'settings', 'summaries', 'usage'];
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState(() => {
        return validTabs.includes(tab) ? tab : 'messages';
    });
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [selectedSummaryId, setSelectedSummaryId] = useState(null); // New state for auto-selecting summary
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showEmojiPicker && 
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const onEmojiClick = (emojiData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    const fetchUserData = async () => {
        if (!user) return;
        try {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .select(`
                    *,
                    user_one_profile:profiles!user_one(*),
                    user_two_profile:profiles!user_two(*)
                `)
                .or(`user_one.eq.${user.id},user_two.eq.${user.id}`);
            
            if (convError) {
                console.error('Conversation Lattice Error:', convError.message, convError.details);
            }
            setConversations(convData || []);

            const { data: reqData, error: reqError } = await supabase
                .from('chat_requests')
                .select(`
                    *,
                    sender:profiles!sender_id(*),
                    receiver:profiles!receiver_id(*)
                `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .eq('status', 'pending');
            
            if (reqError) {
                console.error('Handshake Request Error:', reqError.message, reqError.details);
            }

            setRequests({
                incoming: reqData?.filter(r => r.receiver_id === user.id) || [],
                outgoing: reqData?.filter(r => r.sender_id === user.id) || []
            });
        } catch (error) {
            console.error('Fatal Lattice Data Failure:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Real-time Message Subscription
    useEffect(() => {
        if (!selectedConversation || !decryptedPrivateKey) return;

        // Flush stale messages immediately to prevent previous chat from flashing
        setMessages([]);

        // Set loading state
        setLoadingMessages(true);

        const decryptBuffer = async (msgs) => {
            const processed = await Promise.all(msgs.map(async (msg) => {
                try {
                    const keyShard = msg.sender_id === user.id ? msg.encrypted_aes_key_sender : msg.encrypted_aes_key;
                    
                    const plaintext = await ShieldXCrypto.decryptMessage(
                        { 
                            encryptedMessage: msg.encrypted_message, 
                            encryptedAesKey: keyShard, 
                            iv: msg.iv 
                        }, 
                        decryptedPrivateKey
                    );
                    return { ...msg, content: plaintext };
                } catch (e) {
                    return { ...msg, content: "[UNRECOGNIZED_CIPHER_SHARD]" };
                }
            }));
            setMessages(processed);
            setLoadingMessages(false);
        };

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', selectedConversation.id)
                .order('created_at', { ascending: true });
            if (data) {
                await decryptBuffer(data);
            } else {
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel(`room:${selectedConversation.id}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `conversation_id=eq.${selectedConversation.id}`
            }, async (payload) => {
                const msg = payload.new;
                // ... (existing INSERT logic)
                console.log("Lattice Packet Received:", msg.id);

                setMessages(prev => {
                    const exists = prev.find(m => m.id === msg.id || (m.sender_id === msg.sender_id && m.created_at === msg.created_at));
                    if (exists) return prev;

                    const processIncoming = async () => {
                        try {
                            const keyShard = msg.sender_id === user.id ? msg.encrypted_aes_key_sender : msg.encrypted_aes_key;
                            const plaintext = await ShieldXCrypto.decryptMessage(
                                { 
                                    encryptedMessage: msg.encrypted_message, 
                                    encryptedAesKey: keyShard, 
                                    iv: msg.iv 
                                }, 
                                decryptedPrivateKey
                            );
                            
                            setMessages(current => {
                                if (current.find(m => m.id === msg.id)) return current;
                                return [...current, { ...msg, content: plaintext }];
                            });
                        } catch (e) {
                            console.error("Payload Decryption Failure:", e);
                        }
                    };
                    
                    processIncoming();
                    return prev;
                });
            })
            .on('postgres_changes', { 
                event: 'DELETE', 
                schema: 'public', 
                table: 'messages',
                filter: `conversation_id=eq.${selectedConversation.id}`
            }, (payload) => {
                const deletedId = payload.old.id;
                console.log("Lattice Packet Incinerated:", deletedId);
                setMessages(prev => prev.filter(m => m.id !== deletedId));
            })
            .subscribe((status) => {
                console.log("Tunnel Subscription Status:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedConversation, decryptedPrivateKey]);

    const unlockIdentity = async (e) => {
        e.preventDefault();
        if (!passphrase || !profile) return;
        
        setIsUnlocking(true);
        try {
            toast.loading("Resonating Identity Shard...", { id: 'unlock' });
            const privateKey = await ShieldXCrypto.decryptPrivateKey(
                profile.encrypted_private_key,
                passphrase,
                profile.salt,
                profile.iv
            );
            setDecryptedPrivateKey(privateKey);
            toast.success("Identity Verified. Lattice Decryption Active.", { id: 'unlock' });
        } catch (error) {
            toast.error("Decryption Failed: Invalid Passphrase or Corrupt Shard.", { id: 'unlock' });
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .ilike('email', `%${query}%`)
            .eq('is_public', true)
            .neq('id', user.id)
            .limit(5);
        
        setSearchResults(data || []);
    };

    const sendMessage = async (e, contentOverride = null) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const contentToSend = contentOverride !== null ? contentOverride : newMessage;

        if (!contentToSend.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const isUserOne = selectedConversation.user_one === user.id;
            const recipientProfile = isUserOne 
                ? selectedConversation.user_two_profile 
                : selectedConversation.user_one_profile;
            
            if (!recipientProfile) {
                console.error("Lattice Sync Error: Recipient profile null", selectedConversation);
                throw new Error("Target node profile not synced. Refreshing lattice...");
            }

            if (!recipientProfile.public_key) {
                throw new Error("Recipient has not initialized their Identity Shard. Message cannot be encrypted.");
            }

            const encryptedPackage = await ShieldXCrypto.encryptMessage(
                contentToSend, 
                recipientProfile.public_key
            );

            const myEncryptedAesKey = await ShieldXCrypto.mirrorAesKey(
                encryptedPackage.rawAesKey,
                profile.public_key
            );

            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: selectedConversation.id,
                    sender_id: user.id,
                    encrypted_message: encryptedPackage.encryptedMessage,
                    encrypted_aes_key: encryptedPackage.encryptedAesKey,
                    encrypted_aes_key_sender: myEncryptedAesKey,
                    iv: encryptedPackage.iv
                }]);

            if (error) throw error;
            setNewMessage('');
            setShowEmojiPicker(false); // Restore this
        } catch (error) {
            console.error('Transmission Failed:', error);
            toast.error(error.message);
        } finally {
            setSending(false);
        }
    };

    const sendRequest = async (receiverId) => {
        try {
            if (receiverId === user.id) return;

            const { data: existing } = await supabase
                .from('chat_requests')
                .select('id')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
                .maybeSingle();

            if (existing) {
                toast.error("Protocol Handshake already in progress with this node.");
                return;
            }

            const { error } = await supabase
                .from('chat_requests')
                .insert([{
                    sender_id: user.id,
                    receiver_id: receiverId,
                    status: 'pending'
                }]);

            if (error) throw error;
            toast.success("Protocol Request Injected into Lattice.");
            fetchUserData();
        } catch (error) {
            toast.error(`Handshake Failure: ${error.message}`);
        }
    };

    const updateRequestStatus = async (requestId, status) => {
        try {
            const { error } = await supabase
                .from('chat_requests')
                .update({ status })
                .eq('id', requestId);
            
            if (error) throw error;
            toast.success(`Protocol ${status === 'accepted' ? 'Authorized' : 'Terminated'}.`);
            fetchUserData();
        } catch (error) {
            toast.error(`Protocol Failure: ${error.message}`);
        }
    };

    const togglePrivacy = async () => {
        const newStatus = !profile.is_public;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_public: newStatus })
                .eq('id', user.id);
            
            if (error) throw error;
            setProfile({ ...profile, is_public: newStatus });
            toast.success(`Privacy Mask ${newStatus ? 'Lowered' : 'Engaged'}.`);
        } catch (error) {
            toast.error("Privacy Protocol Failure.");
        }
    };

    const handleSummarize = async () => {
        if (!selectedConversation || !decryptedPrivateKey) return;

        toast.loading("Intercepting & Summarizing Payload...", { id: 'summary' });
        try {
            const { data: msgsData, error: msgError } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', selectedConversation.id)
                .order('created_at', { ascending: false })
                .limit(200);

            if (msgError) throw msgError;

            // Decrypt messages for AI context
            const decryptedMsgs = await Promise.all(msgsData.reverse().map(async (msg) => {
                 try {
                    const keyShard = msg.sender_id === user.id ? msg.encrypted_aes_key_sender : msg.encrypted_aes_key;
                    const plaintext = await ShieldXCrypto.decryptMessage(
                        { 
                            encryptedMessage: msg.encrypted_message, 
                            encryptedAesKey: keyShard, 
                            iv: msg.iv 
                        }, 
                        decryptedPrivateKey
                    );
                    
                    // Add sender info for clearer summary
                    const isMe = msg.sender_id === user.id;
                    return { 
                        ...msg, 
                        content: plaintext,
                        sender_id: isMe ? 'me' : 'other'
                    };
                } catch (e) {
                    return null;
                }
            }));

            const validMsgs = decryptedMsgs.filter(m => m !== null);

            if (validMsgs.length === 0) {
                throw new Error("No decryptable messages found to summarize.");
            }

            const summaryMarkdown = await summarizeChat(validMsgs, user.id);

            const { data: summaryData, error: sumError } = await supabase
                .from('chat_summaries')
                .insert([{
                    user_id: user.id,
                    conversation_id: selectedConversation.id,
                    summary_markdown: summaryMarkdown,
                    message_count: validMsgs.length
                }])
                .select()
                .single();

            if (sumError) throw sumError;

            toast.success("Summary Generated.", { id: 'summary' });
            setSelectedSummaryId(summaryData.id);
            setActiveTab('summaries'); // Switch to summaries tab
            setMobileSheetOpen(false); // Close mobile sheet if open

        } catch (error) {
            console.error("Summary Failed:", error);
            toast.error(`Summary Protocol Failed: ${error.message}`, { id: 'summary' });
        }
    };

    // ========== DELETE MESSAGE ==========
    const handleDeleteMessage = async (messageId) => {
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', messageId);
            
            if (error) throw error;
            
            // Remove from local state immediately
            setMessages(prev => prev.filter(m => m.id !== messageId));
            toast.success('Message purged from tunnel.');
        } catch (error) {
            toast.error(`Purge failure: ${error.message}`);
        }
    };

    // ========== CLEAR CHAT ==========
    const handleClearChat = async (conversationId) => {
        if (!conversationId) return;
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('conversation_id', conversationId);
            
            if (error) throw error;
            
            // Clear local state immediately
            setMessages([]);
            toast.success('Chat history purged successfully.');
        } catch (error) {
            toast.error(`Chat purge failure: ${error.message}`);
        }
    };

    // Helper to slugify a name
    const slugify = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Helper to get the current user's display name
    const getCurrentUsername = () => {
        return slugify(
            user?.user_metadata?.full_name || 
            user?.user_metadata?.name || 
            profile?.full_name || 
            user?.email?.split('@')[0] || ''
        );
    };

    // Helper to get the other user's name from a conversation
    const getOtherUsername = (conv) => {
        if (!conv || !user) return '';
        const isUserOne = conv.user_one === user.id;
        const otherProfile = isUserOne ? conv.user_two_profile : conv.user_one_profile;
        return slugify(otherProfile?.full_name || otherProfile?.name || otherProfile?.email?.split('@')[0] || '');
    };

    // Build the chat slug: sender-to-receiver
    const getChatSlug = (conv) => {
        const me = getCurrentUsername();
        const other = getOtherUsername(conv);
        return `${me}-to-${other}`;
    };

    // Wrapper for selecting a conversation — also updates URL
    const selectConversation = (conv) => {
        setSelectedConversation(conv);
        if (conv) {
            const slug = getChatSlug(conv);
            navigate(`/dashboard/messages/${slug}`, { replace: true });
        } else {
            navigate('/dashboard/messages', { replace: true });
        }
    };

    // Auto-select conversation from URL on data load
    useEffect(() => {
        if (chatUser && conversations.length > 0 && !selectedConversation) {
            const match = conversations.find(conv => {
                const slug = getChatSlug(conv);
                return slug === chatUser.toLowerCase();
            });
            // Fallback: try matching just the receiver part (after "-to-")
            if (!match) {
                const receiverPart = chatUser.toLowerCase().split('-to-').pop();
                if (receiverPart) {
                    const fallback = conversations.find(conv => {
                        return getOtherUsername(conv) === receiverPart;
                    });
                    if (fallback) setSelectedConversation(fallback);
                }
            } else {
                setSelectedConversation(match);
            }
        }
    }, [chatUser, conversations]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setMobileSheetOpen(false);
        navigate(`/dashboard/${tabId}`, { replace: true });
        if (tabId !== 'messages') {
            setSelectedConversation(null);
        }
    };

    // ========== SHARED PANEL CONTENT ==========
    const renderLeftPanelContent = () => {
        if (activeTab === 'stats') {
            return (
                <div className="p-6 sm:p-8 text-center">
                    <Settings className="w-12 h-12 text-white/10 mx-auto mb-6" />
                    <div className="space-y-6">
                        <div className="text-left">
                            <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-4">Privacy_Optics</div>
                            <button 
                                onClick={togglePrivacy}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group
                                    ${profile?.is_public 
                                        ? 'bg-[#ff1e1e]/5 border-[#ff1e1e]/20' 
                                        : 'bg-white/5 border-white/10'}`}
                            >
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-white uppercase tracking-tight">Stealth_Mode</div>
                                    <div className="text-[8px] text-white/40 uppercase tracking-widest mt-1">
                                        {profile?.is_public ? 'Node Visible to Mesh' : 'Node Masked'}
                                    </div>
                                </div>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${profile?.is_public ? 'bg-[#ff1e1e]' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${profile?.is_public ? 'left-5' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Protocol_Firmware</div>
                            <div className="text-[10px] text-white/40 font-mono">SHIELDX_NODE_v4.2.0-STABLE</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'messages') {

            return (
                <>
                    <div className="p-4 sm:p-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff1e1e] transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Search_Tunnel..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all uppercase tracking-widest font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 space-y-2">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Active_Tunnels</span>
                            <button onClick={() => handleTabChange('users')} className="p-1.5 rounded-lg bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 text-[#ff1e1e] hover:bg-[#ff1e1e]/10 transition-all">
                                <Plus size={14} />
                            </button>
                        </div>

                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-16 sm:h-20 bg-white/[0.01] rounded-2xl border border-white/5 animate-pulse" />
                            ))
                        ) : (
                            conversations.map((conv) => {
                                const isUserOne = conv.user_one === user.id;
                                const otherProfile = isUserOne ? conv.user_two_profile : conv.user_one_profile;
                                const displayName = otherProfile?.full_name || otherProfile?.name || otherProfile?.email?.split('@')[0];
                                
                                return (
                                    <button 
                                        key={conv.id}
                                        onClick={() => { selectConversation(conv); setMobileSheetOpen(false); }}
                                        className={`w-full p-3 sm:p-4 rounded-2xl border transition-all text-left group
                                            ${selectedConversation?.id === conv.id 
                                                ? 'bg-[#ff1e1e]/5 border-[#ff1e1e]/20' 
                                                : 'bg-white/[0.02] border-transparent hover:border-[#ff1e1e]/20 hover:bg-[#ff1e1e]/5'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                {otherProfile?.avatar_url ? (
                                                    <img src={otherProfile.avatar_url} alt="" className="w-6 h-6 rounded-md object-cover border border-white/10 shrink-0" />
                                                ) : null}
                                                <div className="min-w-0 flex-1">
                                                    <div className={`text-[10px] font-bold uppercase tracking-tight truncate ${selectedConversation?.id === conv.id ? 'text-[#ff1e1e]' : 'text-white'}`}>
                                                        {displayName}
                                                    </div>
                                                    <div className="text-[8px] text-white/40 truncate hidden sm:block">
                                                        {otherProfile?.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`text-[8px] font-mono uppercase shrink-0 ml-2 ${selectedConversation?.id === conv.id ? 'text-[#ff1e1e]' : 'text-white/20'}`}>Sync_Active</span>
                                        </div>
                                        <div className="text-[10px] text-white/40 truncate uppercase tracking-tighter mt-1">
                                            Payload: [AES_256_HIDDEN]
                                        </div>
                                    </button>
                                );
                            })
                        )}

                        {conversations.length === 0 && !loading && (
                            <div className="text-center py-10 sm:py-16 px-6">
                                <div className="w-16 h-16 rounded-2xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-center justify-center mx-auto mb-5">
                                    <MessageSquare size={24} className="text-[#ff1e1e]/40" />
                                </div>
                                <div className="text-sm font-black text-white/40 uppercase tracking-wider mb-2">
                                    No Active Tunnels
                                </div>
                                <div className="text-[10px] text-white/20 uppercase tracking-wider leading-relaxed mb-6 max-w-[200px] mx-auto">
                                    Connect with other nodes to start encrypted communication
                                </div>
                                <button 
                                    onClick={() => handleTabChange('users')}
                                    className="px-5 py-2.5 bg-[#ff1e1e] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,30,30,0.2)]"
                                >
                                    Discover Nodes
                                </button>
                            </div>
                        )}
                    </div>
                </>
            );
        }
        
        if (activeTab === 'users') {
            return (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-white/5">
                        <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-4">Node_Discovery</div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff1e1e] transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Query_Email_Lattice..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all uppercase tracking-widest font-bold"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="mt-4 space-y-2">
                            {searchResults.map((res) => (
                                <div key={res.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group">
                                    <div className="text-[10px] font-bold text-white/60 truncate max-w-[150px]">{res.email}</div>
                                    <button 
                                        onClick={() => sendRequest(res.id)}
                                        className="p-1.5 rounded-lg bg-[#ff1e1e] text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(255,30,30,0.2)]"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-2 mb-3">Protocol_Requests</div>
                            <div className="space-y-2">
                                {requests.incoming.map((req) => (
                                    <div key={req.id} className="p-3 sm:p-4 rounded-xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/20 flex flex-col gap-3">
                                        <div className="text-[10px] font-bold text-white uppercase tracking-tight truncate">{req.sender.email}</div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => updateRequestStatus(req.id, 'accepted')}
                                                className="flex-1 py-2 bg-[#ff1e1e] text-white text-[9px] font-black uppercase rounded-lg hover:bg-[#ff1e1e]/90 transition-all"
                                            >
                                                Authorize
                                            </button>
                                            <button 
                                                onClick={() => updateRequestStatus(req.id, 'rejected')}
                                                className="flex-1 py-2 bg-white/5 text-white/40 text-[9px] font-black uppercase rounded-lg hover:bg-white/10 transition-all"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {requests.incoming.length === 0 && <div className="text-[9px] text-white/10 uppercase font-bold text-center py-4 tracking-widest">No pending handshakes</div>}
                            </div>
                        </div>

                        <div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-2 mb-3">Logged_Handshakes</div>
                            <div className="space-y-2">
                                {requests.outgoing.map((req) => (
                                    <div key={req.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between opacity-60">
                                        <div className="text-[10px] font-bold text-white/40">{req.receiver.email}</div>
                                        <div className="text-[8px] font-black text-[#ff1e1e] uppercase tracking-widest animate-pulse">Pending...</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // settings
        return (
            <div className="p-6 sm:p-8 text-center">
                <Settings className="w-12 h-12 text-white/10 mx-auto mb-6" />
                <div className="space-y-6">
                    <div className="text-left">
                        <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-4">Privacy_Optics</div>
                        <button 
                            onClick={togglePrivacy}
                            className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group
                                ${profile?.is_public 
                                    ? 'bg-[#ff1e1e]/5 border-[#ff1e1e]/20' 
                                    : 'bg-white/5 border-white/10'}`}
                        >
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-white uppercase tracking-tight">Stealth_Mode</div>
                                <div className="text-[8px] text-white/40 uppercase tracking-widest mt-1">
                                    {profile?.is_public ? 'Node Visible to Mesh' : 'Node Masked'}
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${profile?.is_public ? 'bg-[#ff1e1e]' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${profile?.is_public ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Protocol_Firmware</div>
                        <div className="text-[10px] text-white/40 font-mono">SHIELDX_NODE_v4.2.0-STABLE</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen bg-[#0a0a0a] flex flex-col md:flex-row overflow-hidden">
            <MobileHeader 
                mobileSheetOpen={mobileSheetOpen}
                setMobileSheetOpen={setMobileSheetOpen}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                signOut={signOut}
                user={user}
                conversations={conversations}
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={(conv) => {
                    selectConversation(conv);
                    setMobileSheetOpen(false);
                }}
                onNavigateToMessages={() => {
                    handleTabChange('messages');
                }}
            >
                {renderLeftPanelContent()}
            </MobileHeader>

            <Sidebar 
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                signOut={signOut}
                user={user}
            />

            {/* ========== MAIN INTERFACE ========== */}
            <main className="flex-1 flex flex-col relative min-h-0">
                <HudHeader 
                    user={user} 
                    conversations={conversations}
                    activeTab={activeTab}
                    selectedConversationId={selectedConversation?.id}
                    onSelectConversation={(conv) => {
                        selectConversation(conv);
                    }}
                    onNavigateToMessages={() => {
                        handleTabChange('messages');
                    }}
                />

                <div className="flex-1 flex overflow-hidden min-h-0">
                    {/* ===== MESSAGES TAB ===== */}
                    {activeTab === 'messages' && (
                        <ChatView
                            user={user}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={selectConversation}
                            messages={messages}
                            onSummarize={handleSummarize}
                            messagesEndRef={messagesEndRef}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            sendMessage={sendMessage}
                            sending={sending}
                            showEmojiPicker={showEmojiPicker}
                            setShowEmojiPicker={setShowEmojiPicker}
                            onEmojiClick={onEmojiClick}
                            emojiPickerRef={emojiPickerRef}
                            emojiButtonRef={emojiButtonRef}
                            renderLeftPanelContent={renderLeftPanelContent}
                            conversations={conversations}
                            onDiscoverNodes={() => handleTabChange('users')}
                            loadingMessages={loadingMessages}
                            deleteMessage={handleDeleteMessage}
                            clearChat={handleClearChat}
                        />
                    )}

                    {/* ===== DASHBOARD TAB ===== */}
                    {activeTab === 'stats' && (
                        <DashboardTab 
                            renderLeftPanelContent={renderLeftPanelContent} 
                            activeConnections={conversations.length}
                        />
                    )}

                    {/* ===== USERS TAB ===== */}
                    {activeTab === 'users' && (
                        <UsersTab
                            searchQuery={searchQuery}
                            handleSearch={handleSearch}
                            searchResults={searchResults}
                            sendRequest={sendRequest}
                            requests={requests}
                            updateRequestStatus={updateRequestStatus}
                        />
                    )}

                    {/* ===== SETTINGS TAB ===== */}
                    {activeTab === 'settings' && (
                        <SettingsTab
                            profile={profile}
                            user={user}
                            togglePrivacy={togglePrivacy}
                            signOut={signOut}
                        />
                    )}

                    {/* ===== SUMMARIES TAB ===== */}
                    {activeTab === 'summaries' && (
                        <SummariesTab 
                            selectedSummaryId={selectedSummaryId} 
                            onOpenChat={(conv) => {
                                setSelectedConversation(conv);
                                setActiveTab('messages');
                            }}
                        />
                    )}

                    {/* ===== USAGE TAB ===== */}
                    {activeTab === 'usage' && (
                        <UsageTab />
                    )}
                </div>
            </main>

            <IdentityUnlockOverlay
                decryptedPrivateKey={decryptedPrivateKey}
                passphrase={passphrase}
                setPassphrase={setPassphrase}
                unlockIdentity={unlockIdentity}
                isUnlocking={isUnlocking}
            />

            <style>{`
                .animate-spin-slow {
                    animation: spin 30s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* TACTICAL SCROLLBAR */
                ::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 30, 30, 0.15);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 30, 30, 0.3);
                }
                
                .overflow-y-auto {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 30, 30, 0.2) transparent;
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
