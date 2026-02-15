import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, ChevronLeft, Zap, Send, Smile, Mic, X, Check, Play, Pause, MessageSquare, Users, Trash2, MoreVertical, AlertTriangle } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import Logo from '../landing-page/Logo';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';

const isEmojiOnly = (text) => {
    if (!text) return false;
    // Check if text contains only emojis and whitespace
    return !/[a-zA-Z0-9]/.test(text) && /\p{Extended_Pictographic}/u.test(text) && text.length < 10;
};

const getEmojiProps = (text) => {
    if (!isEmojiOnly(text)) return {};
    return {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 400, damping: 15 }
    };
};

// ... (SingleAnimatedEmoji and getDateLabel helpers remain the same)
const SingleAnimatedEmoji = ({ emoji }) => {
    const [error, setError] = useState(false);
    const codePoint = emoji.codePointAt(0).toString(16);
    const urlGif = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codePoint}/512.gif`;

    if (error) {
        return <span className="text-4xl sm:text-6xl">{emoji}</span>;
    }

    return (
        <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center transition-all hover:scale-110 duration-300">
            <img src={urlGif} alt={emoji} width="96" height="96" onError={() => setError(true)} className="w-full h-full object-contain drop-shadow-lg" />
        </div>
    );
};

const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

// Audio Player Component with duration & progress
const AudioPlayer = ({ src }) => {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const progressRef = useRef(null);

    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setPlaying(false);
        setCurrentTime(0);
    };

    const handleProgressClick = (e) => {
        if (!progressRef.current || !audioRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audioRef.current.currentTime = percentage * duration;
        setCurrentTime(audioRef.current.currentTime);
    };

    const formatDuration = (seconds) => {
        if (!seconds || !isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-2.5 min-w-[180px] sm:min-w-[240px] p-1.5 bg-black/20 rounded-2xl border border-white/10">
            <button 
                onClick={togglePlay}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-[#ff1e1e] text-white hover:scale-110 transition-transform shadow-md"
            >
                {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div 
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                >
                    <div 
                        className="h-full bg-[#ff1e1e] rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }} 
                    />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/40 px-0.5">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>
            <audio 
                ref={audioRef} 
                src={src} 
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                className="hidden" 
            />
        </div>
    );
};

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
    conversations,
    onDiscoverNodes,
    loadingMessages,
    deleteMessage,
    clearChat,
}) => {
    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Context menu for delete
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null, isMine: false });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
    const longPressTimer = useRef(null);
    const contextMenuRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    };

    const handleSendAudio = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64Audio = reader.result;
                const audioPayload = `[AUDIO]${base64Audio}`;
                // Use contentOverride parameter to send directly
                sendMessage(null, audioPayload);
            };
        };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Close context menu on outside click
    useEffect(() => {
        const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
        if (contextMenu.visible) {
            document.addEventListener('mousedown', handleClick);
            document.addEventListener('touchstart', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [contextMenu.visible]);

    // Long press handlers for mobile
    const handleTouchStart = (msg) => {
        longPressTimer.current = setTimeout(() => {
            // Use center of screen for mobile context menu
            setDeleteTarget(msg);
            setDeleteDialogOpen(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    // Right click handler for desktop
    const handleContextMenu = (e, msg) => {
        // Only allow deleting your own messages
        if (msg.sender_id !== user.id) return;
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            messageId: msg.id,
            isMine: msg.sender_id === user.id
        });
    };

    const confirmDelete = (msg) => {
        setDeleteTarget(msg);
        setDeleteDialogOpen(true);
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    return (
        <>
            {/* Left Panel */}
            <div className={`hidden md:flex w-72 lg:w-80 xl:w-96 border-r border-white/5 flex-col bg-black/20 min-h-0 ${selectedConversation ? 'lg:flex' : ''}`}>
                {renderLeftPanelContent()}
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
                {selectedConversation ? (
                    <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl min-h-0 overflow-hidden">
                        {/* Header */}
                        <div className="p-3 sm:p-4 lg:p-6 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                             <div className="flex items-center gap-3 lg:gap-4">
                                <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"><ChevronLeft size={16} /></button>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center"><Zap className="text-[#ff1e1e]" size={16} /></div>
                                    <div className="min-w-0">
                                        <div className="text-[8px] sm:text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.2em]">Secure_Tunnel</div>
                                        <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate">{(selectedConversation.user_one === user.id ? selectedConversation.user_two_profile?.email : selectedConversation.user_one_profile?.email)?.split('@')[0]}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Clear Chat Button */}
                            <button 
                                onClick={() => setClearChatDialogOpen(true)}
                                className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white/20 hover:text-[#ff1e1e] transition-all group"
                                title="Clear Chat"
                            >
                                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div id="message-thread" className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 scroll-smooth">
                            {loadingMessages ? (
                                <div className="flex flex-1 flex-col items-center justify-center h-full">
                                    <motion.div
                                        animate={{ 
                                            rotate: 360,
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                                            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                                        }}
                                        className="mb-6"
                                    >
                                        <Logo className="w-14 h-14 drop-shadow-[0_0_15px_rgba(255,30,30,0.3)]" />
                                    </motion.div>
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]"
                                    >
                                        Decrypting_Tunnel...
                                    </motion.div>
                                </div>
                            ) : (
                            <>
                            {messages.map((msg, i) => {
                                const currentDateLabel = getDateLabel(msg.created_at);
                                const prevDateLabel = i > 0 ? getDateLabel(messages[i-1].created_at) : null;
                                const showDateHeader = currentDateLabel !== prevDateLabel;
                                const isAudio = msg.content?.startsWith('[AUDIO]');

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateHeader && (
                                            <div className="flex justify-center my-4 sm:my-6 sticky top-0 z-10 opacity-90 hover:opacity-100 transition-opacity">
                                                <div className="bg-[#1a1a1a]/80 border border-white/10 text-white/60 text-[10px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg">{currentDateLabel}</div>
                                            </div>
                                        )}
                                        <motion.div 
                                            initial={{ opacity: 0, x: msg.sender_id === user.id ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.isDeleted ? (
                                                /* Deleted message placeholder */
                                                <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col gap-1 sm:gap-2 ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                                                    <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 border border-dashed
                                                        ${msg.sender_id === user.id 
                                                            ? 'bg-white/[0.02] border-white/10 rounded-tr-none' 
                                                            : 'bg-white/[0.02] border-white/10 rounded-tl-none'
                                                        }`}
                                                    >
                                                        <span className="text-white/15 text-base">🚫</span>
                                                        <span className="text-[11px] sm:text-xs text-white/25 italic font-mono tracking-wide">
                                                            {msg.sender_id === user.id ? 'You deleted this message' : 'This message was deleted'}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] sm:text-xs font-mono text-white/10 uppercase px-1">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            ) : (
                                            <div 
                                                className={`max-w-[85%] sm:max-w-[70%] group ${msg.sender_id === user.id ? 'items-end' : 'items-start'} flex flex-col gap-1 sm:gap-2 relative`}
                                                onContextMenu={(e) => handleContextMenu(e, msg)}
                                                onTouchStart={() => msg.sender_id === user.id && handleTouchStart(msg)}
                                                onTouchEnd={handleTouchEnd}
                                                onTouchMove={handleTouchEnd}
                                            >
                                                <motion.div 
                                                    {...(!isAudio ? getEmojiProps(msg.content) : {})}
                                                    className={`rounded-2xl font-mono leading-relaxed break-all flex items-center justify-center relative
                                                    ${isEmojiOnly(msg.content) && !isAudio
                                                        ? 'bg-transparent px-0 py-0 shadow-none border-none origin-center' 
                                                        : `px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${msg.sender_id === user.id 
                                                            ? 'bg-[#ff1e1e] text-white rounded-tr-none shadow-[0_5px_15px_rgba(255,30,30,0.2)]' 
                                                            : 'bg-white/[0.05] text-white/80 border border-white/5 rounded-tl-none'}`
                                                    }`}
                                                >
                                                    {isAudio ? (
                                                        <AudioPlayer src={msg.content.replace('[AUDIO]', '')} />
                                                    ) : (
                                                        isEmojiOnly(msg.content) && [...msg.content.trim()].length === 1 ? (
                                                            <SingleAnimatedEmoji emoji={msg.content.trim()} />
                                                        ) : (
                                                            <span className={isEmojiOnly(msg.content) ? "text-4xl sm:text-6xl" : ""}>
                                                                {msg.content || "[DECRYPTING_PAYLOAD...]"}
                                                            </span>
                                                        )
                                                    )}
                                                </motion.div>
                                                <div className="text-[10px] sm:text-xs font-mono text-white/20 uppercase px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            )}
                                        </motion.div>
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                            </>
                            )}
                        </div>

                        {/* Composer */}
                        <form onSubmit={sendMessage} className="p-3 sm:p-4 lg:p-6 bg-black/40 border-t border-white/5 shrink-0 relative">
                            {/* Emoji Picker (Same) */}
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
                                            <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} width={320} height={400} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative flex items-center gap-2 sm:gap-4">
                                {/* Recording UI vs Text UI */}
                                {isRecording ? (
                                    <div className="flex-1 flex items-center gap-4 bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 rounded-xl px-4 py-3 animate-pulse">
                                        <div className="w-3 h-3 rounded-full bg-[#ff1e1e] animate-ping" />
                                        <span className="text-white font-mono font-bold">{formatTime(recordingTime)}</span>
                                        <span className="text-white/40 text-xs uppercase tracking-wider">Recording...</span>
                                    </div>
                                ) : (
                                    <div className="flex-1 relative group">
                                        <input 
                                            type="text"
                                            placeholder="Inject_Payload..."
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-20 sm:pr-24 text-sm sm:text-base text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-[#ff1e1e]/50 transition-all font-medium"
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
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {isRecording ? (
                                    <>
                                        <button 
                                            type="button"
                                            onClick={cancelRecording}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleSendAudio}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ff1e1e] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Check size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                         {newMessage.trim() ? (
                                             <button 
                                                type="submit"
                                                disabled={sending}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ff1e1e] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:scale-105 active:scale-95 transition-all shrink-0"
                                            >
                                                <Send size={16} />
                                            </button>
                                         ) : (
                                             <button 
                                                type="button"
                                                onClick={startRecording}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all shrink-0"
                                            >
                                                <Mic size={18} />
                                            </button>
                                         )}
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                ) : conversations && conversations.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-6">
                        <div className="w-20 h-20 rounded-3xl bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 flex items-center justify-center mx-auto mb-6">
                            <MessageSquare size={32} className="text-[#ff1e1e]/30" />
                        </div>
                        <div className="text-base font-black text-white/30 uppercase tracking-wider mb-2">
                            No Active Tunnels
                        </div>
                        <div className="text-[10px] text-white/15 uppercase tracking-wider leading-relaxed mb-6 max-w-[220px] text-center">
                            Connect with other nodes to start encrypted communication
                        </div>
                        <button 
                            onClick={onDiscoverNodes}
                            className="px-6 py-3 bg-[#ff1e1e] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,30,30,0.2)] flex items-center gap-2"
                        >
                            <Users size={14} />
                            Discover Nodes
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Mobile: show conversation list */}
                        <div className="md:hidden flex-1 flex flex-col overflow-y-auto min-h-0">
                            {renderLeftPanelContent()}
                        </div>
                        {/* Desktop: show Select Tunnel prompt */}
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center opacity-20">
                            <Terminal size={48} className="mb-4" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em]">Select_A_Tunnel</div>
                        </div>
                    </>
                )}
            </div>

            {/* ===== Context Menu (desktop right-click) ===== */}
            <AnimatePresence>
                {contextMenu.visible && (
                    <motion.div
                        ref={contextMenuRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed z-[9999] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden min-w-[160px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button
                            onClick={() => {
                                const msg = messages.find(m => m.id === contextMenu.messageId);
                                if (msg) confirmDelete(msg);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-[#ff1e1e] hover:bg-[#ff1e1e]/10 transition-colors text-left"
                        >
                            <Trash2 size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Delete_Message</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== Delete Message Alert Dialog ===== */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-[#ff1e1e]" />
                            </div>
                            <AlertDialogTitle className="text-white font-black uppercase tracking-wider text-sm">
                                Purge_Payload
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-white/50 text-xs leading-relaxed space-y-3">
                            <p>This message will be permanently deleted from the encrypted lattice. This action is <span className="text-[#ff1e1e] font-bold">irreversible</span>.</p>
                            <div className="bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 rounded-xl p-3 mt-2">
                                <div className="text-[9px] font-black text-[#ff1e1e]/60 uppercase tracking-widest mb-1">⚠️ Disclaimer</div>
                                <p className="text-[10px] text-white/40 leading-relaxed">
                                    The message will be removed from the server. However, the recipient may have already decrypted and read this message. ShieldX cannot guarantee removal from their local cache or device memory.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-3">
                        <AlertDialogCancel className="bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider rounded-xl px-5">
                            Abort
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) deleteMessage(deleteTarget.id);
                                setDeleteTarget(null);
                            }}
                            className="bg-[#ff1e1e] hover:bg-[#ff1e1e]/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl px-5 border-0"
                        >
                            Confirm_Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ===== Clear Chat Alert Dialog ===== */}
            <AlertDialog open={clearChatDialogOpen} onOpenChange={setClearChatDialogOpen}>
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-[#ff1e1e]" />
                            </div>
                            <AlertDialogTitle className="text-white font-black uppercase tracking-wider text-sm">
                                Purge_Tunnel_History
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-white/50 text-xs leading-relaxed space-y-3">
                            <p>All <span className="text-white font-bold">{messages.length} message{messages.length !== 1 ? 's' : ''}</span> in this tunnel will be permanently destroyed. This action is <span className="text-[#ff1e1e] font-bold">irreversible</span>.</p>
                            <div className="bg-[#ff1e1e]/5 border border-[#ff1e1e]/10 rounded-xl p-3 mt-2">
                                <div className="text-[9px] font-black text-[#ff1e1e]/60 uppercase tracking-widest mb-1">⚠️ Security Disclaimer</div>
                                <p className="text-[10px] text-white/40 leading-relaxed">
                                    All encrypted payloads will be removed from the ShieldX server. The other party will also lose access to these messages. However, previously decrypted content may remain in device memory or browser cache. ShieldX uses end-to-end encryption — once purged, these messages cannot be recovered by anyone, including ShieldX.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-3">
                        <AlertDialogCancel className="bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider rounded-xl px-5">
                            Abort
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                clearChat();
                                setClearChatDialogOpen(false);
                            }}
                            className="bg-[#ff1e1e] hover:bg-[#ff1e1e]/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl px-5 border-0"
                        >
                            Purge_All_Messages
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ChatView;
