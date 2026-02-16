import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, ChevronLeft, ChevronDown, Zap, Send, Smile, Mic, X, Check, Play, Pause, MessageSquare, Users, Trash2, MoreVertical, AlertTriangle, Sparkles, Languages, QrCode, Scan, Download, Copy, CheckCheck, Youtube, Instagram, Globe, Link2, MapPin, Navigation, Compass, Wand2, Quote, Box, Volume2, Mic2 } from 'lucide-react';
import { suggestReplies, rewriteMessageTone, translateMessage } from '../../utils/ai';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

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

// Helper to get YouTube ID
const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

// Helper to get Instagram ID
const getInstagramId = (url) => {
    if (!url) return null;
    const regExp = /(?:instagram\.com\/(?:p|reels|reel)\/)([^/?#&]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

// Helper to get general URL
const getGeneralLink = (text) => {
    if (!text) return null;
    const regExp = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(regExp);
    return matches ? matches[0] : null;
};

// Helper to get Location info
const getLocationInfo = (text) => {
    if (!text || !text.startsWith('[LOCATION]')) return null;
    const parts = text.replace('[LOCATION]', '').split(',');
    if (parts.length < 2) return null;
    return {
        lat: parts[0],
        lng: parts[1],
        name: parts[2] || 'Shared Location'
    };
};

// Helper to get Quote content
const getQuoteContent = (text) => {
    if (!text || !text.startsWith('[QUOTE]')) return null;
    return text.replace('[QUOTE]', '');
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
    // Compare using date-only string to avoid timezone issues
    const dateOnly = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (dateOnly(date) === dateOnly(today)) return "Today";
    if (dateOnly(date) === dateOnly(yesterday)) return "Yesterday";
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

// Link Preview Component (WhatsApp Style)
const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                if (data.status === 'success') {
                    setPreviewData(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch link preview', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, [url]);

    if (!previewData && !loading) return null;

    if (loading) {
        return (
            <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-black/20 animate-pulse h-[100px] flex items-center justify-center">
                <Globe className="text-white/20 animate-spin" size={24} />
            </div>
        );
    }

    const { title, description, image, logo } = previewData;
    const domain = new URL(url).hostname;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); window.open(url, '_blank'); }}
            className="mb-4 rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer group/link relative shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] w-full max-w-md mx-auto sm:mx-0"
        >
            <div className="flex flex-row">
                <div className="flex-1 p-4 flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                        {logo ? (
                            <img src={logo.url} className="w-4 h-4 rounded-full" alt="logo" />
                        ) : (
                            <Globe size={12} className="text-white/40" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 truncate">{domain}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{title}</h3>
                    {description && (
                        <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">{description}</p>
                    )}
                </div>
                {image && (
                    <div className="w-1/3 max-w-[120px] relative aspect-square sm:aspect-auto">
                        <img 
                            src={image.url} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                            alt="preview" 
                        />
                    </div>
                )}
            </div>
            {/* Action Footer */}
            <div className="px-4 py-2 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-white/20 truncate max-w-[70%]">{url}</span>
                <Link2 size={12} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
        </div>
    );
};

// Location Preview Component (WhatsApp Style)
const LocationPreview = ({ lat, lng, name }) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    // Using a professional map style with dark mode theme params if possible, or standard high-res preview
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY_HERE`;
    
    // For now, since we don't have a Google Maps Key, we'll use a high-quality osm-based or similar free tile provider as fallback or a highly styled simulation
    // A better approach for "professional" without a key is using an iframe or a high-quality placeholder that looks like a real map
    const fallbackMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+ff1e1e(${lng},${lat})/${lng},${lat},14,0/600x300?access_token=pk.eyJ1IjoiZXN3YXIyMDI0IiwiYSI6ImNscnd6NXN6MDBiazYyaXFvM3N6M3N6M3MifQ`;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); window.open(mapsUrl, '_blank'); }}
            className="mb-4 rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer group/loc relative shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] w-full max-w-sm"
        >
            <div className="relative aspect-video bg-[#0d0d0d] overflow-hidden">
                {/* Real Map Imagery */}
                <img 
                    src={fallbackMapUrl} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    alt="Map Location"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />

                {/* Radar/Pulse Effect (Overlayed on real map) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="w-20 h-20 rounded-full border border-[#ff1e1e]/40 shadow-[0_0_20px_rgba(255,30,30,0.2)]"
                    />
                </div>

                {/* High-End Information Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 w-fit">
                        <Navigation size={10} className="text-[#ff1e1e]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Live Preview</span>
                    </div>
                </div>

                {/* Map Pin UI */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-[#ff1e1e]/30 blur-xl rounded-full" />
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <MapPin size={32} className="text-[#ff1e1e] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" fill="rgba(255,30,30,0.4)" strokeWidth={2.5} />
                        </motion.div>
                    </div>
                </div>
                
                {/* Bottom Stats */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-white/40 tracking-tight">
                        {lat.slice(0, 7)}, {lng.slice(0, 7)}
                    </span>
                </div>
            </div>

            <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-white/[0.04] to-transparent">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="text-sm font-bold text-white/90 truncate">{name === 'Shared Location' ? 'Homing Vector' : name}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.1em]">Signal strength:</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`w-0.5 h-2 rounded-full ${i <= 3 ? 'bg-[#ff1e1e]/60' : 'bg-white/10'}`} />)}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-[1px] bg-white/5" />
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-[#ff1e1e]/10 border border-white/10 hover:border-[#ff1e1e]/30 rounded-full transition-all text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white">
                        Open Maps
                    </button>
                </div>
            </div>
        </div>
    );
};

// Quote Card Component (Canva Style)
const QuoteCard = ({ content, onExport }) => {
    return (
        <div className="mb-4 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black shadow-2xl relative group/quote max-w-sm">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1e1e]/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff1e1e]/5 blur-3xl rounded-full -ml-16 -mb-16" />
            
            <div className="p-8 pb-12 relative flex flex-col items-center text-center gap-6">
                <Quote size={32} className="text-[#ff1e1e]/30 mb-2" />
                
                <h2 className="text-xl sm:text-2xl font-serif italic text-white/90 leading-relaxed tracking-tight">
                    "{content}"
                </h2>
                
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#ff1e1e]/40 to-transparent" />
                
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20">
                        <Terminal size={14} className="text-[#ff1e1e]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">ShieldX Intelligence</span>
                </div>
            </div>

            {/* Premium Border Highlight */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none group-hover/quote:border-[#ff1e1e]/20 transition-colors" />
            
            {/* Share Action Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/quote:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onExport(content); }}
                    className="px-6 py-2.5 bg-[#ff1e1e] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,30,30,0.5)] transform translate-y-4 group-hover/quote:translate-y-0 transition-all duration-300"
                 >
                    Export Image
                 </button>
            </div>
        </div>
    );
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
    onSummarize
}) => {
    // AI State
    const [suggestions, setSuggestions] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [translations, setTranslations] = useState({});
    const [rewriting, setRewriting] = useState(false);
    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // QR & Tools State
    const [decodedQrContent, setDecodedQrContent] = useState(null);
    const [showDecodeDialog, setShowDecodeDialog] = useState(false);
    const [showToolbox, setShowToolbox] = useState(false);
    const toolboxRef = useRef(null);

    // View More state for long messages
    const [expandedMessages, setExpandedMessages] = useState({});
    const MESSAGE_COLLAPSE_THRESHOLD = 300; // characters

    const toggleExpand = (msgId) => {
        setExpandedMessages(prev => ({ ...prev, [msgId]: !prev[msgId] }));
    };

    const handleDownloadQr = async (url, filename = 'shieldx_qr.png') => {
        try {
            const toastId = toast.loading("Processing download...");
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Download complete", { id: toastId });
            };

            img.onerror = () => {
                // Fallback for CORS issues
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.target = '_blank';
                link.click();
                toast.success("Opening in new tab...", { id: toastId });
            };
        } catch (err) {
            console.error('Download failed:', err);
            toast.error("Download failed");
        }
    };

    const handleExportQuote = (content) => {
        const toastId = toast.loading("Generating quote card...");
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Professional dark gradient background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#121212');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Decorative accents
        ctx.fillStyle = 'rgba(255, 30, 30, 0.05)';
        ctx.beginPath();
        ctx.arc(1080, 0, 400, 0, Math.PI * 2);
        ctx.fill();

        // Quote text styling
        ctx.fillStyle = 'white';
        ctx.font = 'italic 54px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const wrapText = (text, maxWidth) => {
            const words = text.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        };

        const quoteLines = wrapText(`"${content}"`, 800);
        const startY = 540 - (quoteLines.length * 30);
        
        quoteLines.forEach((line, i) => {
            ctx.fillText(line, 540, startY + (i * 70));
        });

        // Branding
        ctx.fillStyle = '#ff1e1e';
        ctx.font = 'bold 24px sans-serif';
        ctx.letterSpacing = '10px';
        ctx.fillText('SHIELDX INTELLIGENCE', 540, 950);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `shieldx_quote_${Date.now()}.png`;
        link.click();
        toast.success("Quote Card exported", { id: toastId });
    };

    // Copy message
    const [copiedMsgId, setCopiedMsgId] = useState(null);
    const handleCopyMessage = async (content, msgId) => {
        try {
            const cleanContent = content.replace(/^\[QR\]|^\[AUDIO\]/, '');
            await navigator.clipboard.writeText(cleanContent);
            setCopiedMsgId(msgId);
            setTimeout(() => setCopiedMsgId(null), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    // Context menu for delete
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null, isMine: false });
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
    const longPressTimer = useRef(null);
    const contextMenuRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!newMessage && inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
    }, [newMessage]);

    const handleSendQr = () => {
        if (!newMessage.trim()) return;
        const qrPayload = `[QR]${newMessage}`;
        sendMessage(null, qrPayload);
        setNewMessage('');
        // Reset suggestions if any
        setSuggestions([]);
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        const toastId = toast.loading("Accessing high-precision GPS...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Add a small delay for premium feel
                setTimeout(() => {
                    const locationPayload = `[LOCATION]${latitude},${longitude},Shared Location`;
                    sendMessage(null, locationPayload);
                    toast.success("Location shared securely", { id: toastId });
                }, 800);
            },
            (error) => {
                toast.error("Unable to retrieve location. Please check permissions.", { id: toastId });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleSendQuote = () => {
        if (!newMessage.trim()) return;
        const quotePayload = `[QUOTE]${newMessage}`;
        sendMessage(null, quotePayload);
        setNewMessage('');
        setSuggestions([]);
        setShowToolbox(false);
    };

    const handleTextToVoice = () => {
        if (!newMessage.trim()) return;
        
        const toastId = toast.loading("Synthesizing neural voice...");
        
        try {
            const utterance = new SpeechSynthesisUtterance(newMessage);
            const voices = window.speechSynthesis.getVoices();
            // Try to find a high-quality female or male voice
            const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || voices[0];
            if (premiumVoice) utterance.voice = premiumVoice;
            
            utterance.pitch = 1.1;
            utterance.rate = 0.9;

            // In a real app with a backend, we'd record this or use an API to get a URL
            // For this advanced demo, we'll simulate the "Send as Voice Note" by using the built-in synthesis
            // and informing the user.
            window.speechSynthesis.speak(utterance);
            
            // To make it feel "real" in the chat, we'll send a descriptive text but we could also 
            // convert utterance to blob if using advanced Web Audio API. 
            // For now, we'll send it as a special AI Voice message.
            const voicePayload = `[AUDIO_AI]${newMessage}`;
            sendMessage(null, voicePayload);
            
            toast.success("AI Voice Note sent", { id: toastId });
            setNewMessage('');
            setShowToolbox(false);
        } catch (err) {
            toast.error("Voice synthesis failed", { id: toastId });
        }
    };

    const handleVoiceToText = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        toast.info("Listening... Speak now", { duration: 3000 });
        setShowToolbox(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNewMessage(prev => prev ? `${prev} ${transcript}` : transcript);
            toast.success("Transcription complete");
        };

        recognition.onerror = () => {
            toast.error("Could not recognize speech");
        };

        recognition.start();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toolboxRef.current && !toolboxRef.current.contains(event.target)) {
                setShowToolbox(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleSuggestReplies = async () => {
        setIsGeneratingSuggestions(true);
        try {
            const replies = await suggestReplies(messages, user.id);
            setSuggestions(replies);
        } catch (error) {
            console.error("Failed to generate suggestions", error);
            // Optional: show toast if limit exceeded, but console error is fine for now or handle via UI state
        } finally {
            setIsGeneratingSuggestions(false);
        }
    };

    const handleRewrite = async (tone) => {
        if (!newMessage.trim()) return;
        setRewriting(true);
        try {
            const rewritten = await rewriteMessageTone(newMessage, tone, user.id);
            setNewMessage(rewritten);
        } catch (error) {
            console.error("Failed to rewrite", error);
        } finally {
            setRewriting(false);
        }
    };

    const [targetLanguage, setTargetLanguage] = useState('English');

    const handleTranslate = async (msgId, content) => {
        if (translations[msgId]) {
            // Toggle off
            setTranslations(prev => {
                const newT = { ...prev };
                delete newT[msgId];
                return newT;
            });
            return;
        }

        try {
            const translated = await translateMessage(content, user.id, targetLanguage);
            setTranslations(prev => ({ ...prev, [msgId]: translated }));
        } catch (error) {
            console.error("Translation failed", error);
        }
    };

    return (
        <>
            {/* Left Panel */}
            <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80 xl:w-96 border-r border-white/5 flex-col bg-black/20 min-h-0`}>
                {renderLeftPanelContent()}
            </div>

            {/* Right Panel */}
            <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1 flex-col overflow-hidden relative min-h-0`}>
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
                            {/* AI & Clear Actions */}
                            <div className="flex items-center gap-2">
                                {/* Language Selector - Badge Style */}
                                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                    <SelectTrigger className="h-7 w-auto sm:min-w-[100px] rounded-full bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-wider text-white focus:ring-0 px-2 sm:px-3 hover:bg-white/10 transition-all flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md">
                                        <Languages size={12} className="text-white/50 shrink-0" />
                                        <div className="hidden sm:block flex-1 text-left">
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent position="popper" sideOffset={5} className="bg-[#0a0a0a] border border-white/10 text-white min-w-[120px] z-[200] rounded-xl overflow-hidden shadow-2xl">
                                        <SelectItem value="English" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">English</SelectItem>
                                        <SelectItem value="Spanish" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Spanish</SelectItem>
                                        <SelectItem value="French" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">French</SelectItem>
                                        <SelectItem value="German" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">German</SelectItem>
                                        <SelectItem value="Mandarin" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Chinese</SelectItem>
                                        <SelectItem value="Japanese" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Japanese</SelectItem>
                                        <SelectItem value="Russian" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Russian</SelectItem>
                                        <SelectItem value="Hindi" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Hindi</SelectItem>
                                        <SelectItem value="Arabic" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Arabic</SelectItem>
                                          <SelectItem value="Telugu" className="focus:bg-white/10 focus:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer py-2">Telugu</SelectItem>
                                    </SelectContent>
                                </Select>

                                <button
                                    onClick={onSummarize}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 text-[#ff1e1e] hover:bg-[#ff1e1e]/20 transition-all"
                                >
                                    <Sparkles size={14} />
                                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">CatchUp</span>
                                </button>
                                {/* Clear Chat Button */}
                                <button 
                                    onClick={() => setClearChatDialogOpen(true)}
                                    className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white/20 hover:text-[#ff1e1e] transition-all group"
                                    title="Clear Chat"
                                >
                                    <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
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
                                 const isQr = msg.content?.startsWith('[QR]');
                                 const isQuote = msg.content?.startsWith('[QUOTE]');
                                 const isAudioAi = msg.content?.startsWith('[AUDIO_AI]');
                                const isTranslated = translations[msg.id];

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateHeader && (
                                            <div className="flex justify-center my-3 sm:my-5">
                                                <div className="bg-[#1a1a1a]/90 border border-white/10 text-white/50 text-[10px] sm:text-[11px] font-mono font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg">{currentDateLabel}</div>
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
                                                className={`max-w-[85%] sm:max-w-[70%] group ${msg.sender_id === user.id ? 'items-end' : 'items-start'} flex flex-col gap-1 sm:gap-2 relative min-w-0`}
                                                onContextMenu={(e) => handleContextMenu(e, msg)}
                                                onTouchStart={() => msg.sender_id === user.id && handleTouchStart(msg)}
                                                onTouchEnd={handleTouchEnd}
                                                onTouchMove={handleTouchEnd}
                                            >
                                                <motion.div 
                                                    {...(!isAudio && !isQr && !isAudioAi ? getEmojiProps(msg.content) : {})}
                                                    className={`rounded-2xl leading-relaxed break-words flex relative flex-col overflow-hidden min-w-0 w-full
                                                    ${isEmojiOnly(msg.content) && !isAudio && !isQr
                                                        ? 'bg-transparent px-0 py-0 shadow-none border-none origin-center items-center justify-center !overflow-visible !w-auto' 
                                                        : isQr 
                                                            ? 'px-3 py-2 sm:px-4 sm:py-3 bg-red-800/20 backdrop-blur-md border border-[#ff1e1e]/30 text-white rounded-2xl' 
                                                            : `px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${msg.sender_id === user.id 
                                                                ? 'bg-red-800/20 backdrop-blur-md border border-[#ff1e1e]/30 text-white rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(0,0,0,0.5)]' 
                                                                : 'bg-white/[0.06] text-white/80 border border-white/5 rounded-tl-sm'}`
                                                    }`}
                                                >
                                                    {isAudio ? (
                                                        <AudioPlayer src={msg.content.replace('[AUDIO]', '')} />
                                                    ) : isAudioAi ? (
                                                        <div className="flex flex-col gap-2 p-1">
                                                            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 group/aivoice">
                                                                <div className="w-10 h-10 rounded-full bg-[#ff1e1e]/10 flex items-center justify-center border border-[#ff1e1e]/20 group-hover/aivoice:scale-110 transition-transform">
                                                                    <Volume2 size={20} className="text-[#ff1e1e]" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#ff1e1e] mb-1">Neural AI Voice</div>
                                                                    <div className="text-xs text-white/80 line-clamp-1 italic">"{msg.content.replace('[AUDIO_AI]', '')}"</div>
                                                                </div>
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const text = msg.content.replace('[AUDIO_AI]', '');
                                                                        const utterance = new SpeechSynthesisUtterance(text);
                                                                        window.speechSynthesis.speak(utterance);
                                                                    }}
                                                                    className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center hover:bg-[#ff1e1e]/20 text-white transition-all shadow-lg"
                                                                    title="Replay Voice Note"
                                                                >
                                                                    <Play size={16} fill="#ff1e1e" stroke="#ff1e1e" className="ml-0.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : isQr ? (() => {
                                                        const qrText = msg.content.replace('[QR]', '');
                                                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
                                                        return (
                                                            <div className="relative group/qr p-1">
                                                                <div className="bg-white p-2 sm:p-3 rounded-xl w-fit mx-auto">
                                                                    <img 
                                                                        src={qrUrl} 
                                                                        alt="QR Code" 
                                                                        className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain mx-auto"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-1.5 mt-2 justify-center">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDecodedQrContent(qrText);
                                                                            setShowDecodeDialog(true);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/10"
                                                                    >
                                                                        <Scan size={12} /> Decode
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDownloadQr(qrUrl, `shieldx_qr_${msg.id}.png`);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/10"
                                                                    >
                                                                        <Download size={12} /> Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })() : (
                                                        isEmojiOnly(msg.content) && [...msg.content.trim()].length === 1 ? (
                                                            <SingleAnimatedEmoji emoji={msg.content.trim()} />
                                                        ) : (() => {
                                                            let rawContent = msg.content || "[DECRYPTING_PAYLOAD...]";
                                                            
                                                            // Auto-detect code blocks without backticks
                                                            if (!rawContent.includes('```') && rawContent.includes('\n') && (rawContent.includes('const ') || rawContent.includes('import ') || rawContent.includes('{') || rawContent.includes('function '))) {
                                                               rawContent = '```javascript\n' + rawContent + '\n```';
                                                            }

                                                            const isLong = rawContent.length > MESSAGE_COLLAPSE_THRESHOLD;
                                                            const isExpanded = expandedMessages[msg.id];
                                                            
                                                            let displayContent = rawContent;
                                                            if (isLong && !isExpanded) {
                                                                displayContent = rawContent.slice(0, MESSAGE_COLLAPSE_THRESHOLD);
                                                                // If we were inside a code block, we must close it
                                                                if (rawContent.includes('```') && displayContent.split('```').length % 2 === 0) {
                                                                    displayContent += '\n```';
                                                                }
                                                                displayContent += '...';
                                                            }
                                                             const youtubeId = getYouTubeId(rawContent);
                                                            const instagramId = getInstagramId(rawContent);
                                                            const generalLink = !youtubeId && !instagramId ? getGeneralLink(rawContent) : null;
                                                            const locationInfo = getLocationInfo(rawContent);
                                                            const quoteContent = getQuoteContent(rawContent);
                                                            
                                                            // Increased length limit to 200 to account for long tracking parameters (common in reels)
                                                            const isOnlyYoutube = youtubeId && rawContent.trim().length < 200 && (rawContent.includes('youtube.com') || rawContent.includes('youtu.be'));
                                                            const isOnlyInstagram = instagramId && rawContent.trim().length < 200 && rawContent.includes('instagram.com');
                                                            const isOnlyLink = generalLink && rawContent.trim() === generalLink.trim();
                                                            const isOnlyLocation = locationInfo && rawContent.trim().startsWith('[LOCATION]');
                                                            const isOnlyQuote = isQuote;
                                                            
                                                            return (
                                                                <>
                                                                    <div className={`markdown-content w-full min-w-0 ${msg.sender_id === user.id ? 'user-msg' : 'other-msg'}`}>
                                                                        {youtubeId && (
                                                                            <div 
                                                                                onClick={(e) => { e.stopPropagation(); setActiveVideoId(youtubeId); }}
                                                                                className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer group/yt relative shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                                            >
                                                                                {/* Header */}
                                                                                <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2">
                                                                                    <div className="w-6 h-6 rounded-lg bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/20">
                                                                                        <Youtube size={14} className="text-[#ff0000]" />
                                                                                    </div>
                                                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">YouTube</span>
                                                                                </div>
                                                                                
                                                                                {/* Thumbnail Container */}
                                                                                <div className="relative aspect-video overflow-hidden">
                                                                                    <img 
                                                                                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} 
                                                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                                                                        alt="YouTube Preview"
                                                                                        onError={(e) => {
                                                                                            e.target.src = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
                                                                                        }}
                                                                                    />
                                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                                                        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#ff0000]/20 group-hover:border-[#ff0000]/40 transition-all duration-300">
                                                                                            <Play size={24} fill="white" stroke="white" className="ml-1" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Footer/Link */}
                                                                                <div className="px-3 py-2 bg-gradient-to-b from-transparent to-black/40">
                                                                                    <div className="text-[11px] font-medium text-white/90 line-clamp-2 leading-relaxed">
                                                                                        {rawContent}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {instagramId && (
                                                                            <div 
                                                                                onClick={(e) => { e.stopPropagation(); window.open(`https://instagram.com/p/${instagramId}`, '_blank'); }}
                                                                                className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer group/ig relative shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
                                                                            >
                                                                                {/* Header */}
                                                                                <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2">
                                                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center border border-white/10">
                                                                                        <Instagram size={12} color="white" />
                                                                                    </div>
                                                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Instagram</span>
                                                                                </div>
                                                                                
                                                                                {/* Visual */}
                                                                                <div className="relative aspect-video overflow-hidden">
                                                                                    <img 
                                                                                        src={`https://www.instagram.com/p/${instagramId}/media/?size=l`} 
                                                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                                                                        alt="Instagram Preview"
                                                                                        onError={(e) => {
                                                                                            e.target.style.display = 'none';
                                                                                            const parent = e.target.parentElement;
                                                                                            if (parent) {
                                                                                                parent.innerHTML = `
                                                                                                    <div class="flex flex-col items-center justify-center h-full bg-black/40 gap-2">
                                                                                                        <div class="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[8px] text-white/30 font-black uppercase tracking-widest">PRIVATE_OR_REDACTED</div>
                                                                                                        <div class="text-[9px] text-white/20 font-medium">Click to view on Instagram</div>
                                                                                                    </div>
                                                                                                `;
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                                        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                                                                            <Instagram size={28} color="white" className="opacity-80" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Footer */}
                                                                                <div className="px-3 py-2 bg-gradient-to-b from-transparent to-black/40">
                                                                                    <div className="text-[11px] font-medium text-white/90 line-clamp-2 leading-relaxed">
                                                                                        {rawContent}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {generalLink && (
                                                                            <LinkPreview url={generalLink} />
                                                                        )}

                                                                        {locationInfo && (
                                                                            <LocationPreview {...locationInfo} />
                                                                        )}

                                                                        {isQuote && quoteContent && (
                                                                            <QuoteCard content={quoteContent} onExport={handleExportQuote} />
                                                                        )}

                                                                        {!isOnlyYoutube && !isOnlyInstagram && !isOnlyLink && !isOnlyLocation && !isOnlyQuote && (
                                                                            <ReactMarkdown
                                                                                components={{
                                                                                    p: ({children, ...props}) => <p className="mb-1 last:mb-0 break-words whitespace-pre-wrap" {...props}>{children}</p>,
                                                                                    strong: ({children, ...props}) => <strong className="font-bold border-b border-white/20 border-dashed" {...props}>{children}</strong>,
                                                                                    em: ({children, ...props}) => <em className="italic opacity-80" {...props}>{children}</em>,
                                                                                    pre({children, ...props}) {
                                                                                        return <div className="w-full min-w-0 my-2" {...props}>{children}</div>;
                                                                                    },
                                                                                    code({className, children, ...props}) {
                                                                                        const match = /language-(\w+)/.exec(className || '');
                                                                                        const codeStr = String(children).replace(/\n$/, '');
                                                                                        const isBlock = codeStr.includes('\n') || match;
                                                                                        return isBlock ? (
                                                                                            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl w-full min-w-0 my-3 bg-[#0d0d0d]">
                                                                                                <div className="bg-[#1a1a1a] px-4 py-2 text-[10px] text-white/50 uppercase font-black tracking-[0.1em] border-b border-white/5 flex justify-between items-center group/code-header">
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <Terminal size={12} className="text-[#ff1e1e]" />
                                                                                                        <span>ShieldX</span>
                                                                                                    </div>
                                                                                                    <button 
                                                                                                        onClick={(e) => { e.stopPropagation(); handleCopyMessage(codeStr, 'block-' + msg.id); }}
                                                                                                        className="hover:text-white transition-colors"
                                                                                                    >
                                                                                                        {copiedMsgId === 'block-' + msg.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                                                                    </button>
                                                                                                </div>
                                                                                                <SyntaxHighlighter
                                                                                                    style={vscDarkPlus}
                                                                                                    language={match ? match[1] : 'javascript'}
                                                                                                    PreTag="div"
                                                                                                    wrapLines={true}
                                                                                                    wrapLongLines={true}
                                                                                                    customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.8rem', overflowX: 'auto', maxWidth: '100%', fontFamily: '"Fira Code", "JetBrains Mono", monospace' }}
                                                                                                >
                                                                                                    {codeStr}
                                                                                                </SyntaxHighlighter>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <code className="bg-black/40 px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-mono text-[#ff1e1e] border border-[#ff1e1e]/20" {...props}>
                                                                                                {children}
                                                                                            </code>
                                                                                        );
                                                                                    },
                                                                                    ul: ({children, ...props}) => <ul className="list-disc list-outside ml-4 my-1" {...props}>{children}</ul>,
                                                                                    ol: ({children, ...props}) => <ol className="list-decimal list-outside ml-4 my-1" {...props}>{children}</ol>,
                                                                                    li: ({children, ...props}) => <li className="pl-1" {...props}>{children}</li>,
                                                                                    a: ({children, ...props}) => <a className="underline decoration-white/30 hover:decoration-white underline-offset-2" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                                                                                    blockquote: ({children, ...props}) => <blockquote className="border-l-2 border-white/30 pl-2 italic opacity-80 my-1" {...props}>{children}</blockquote>,
                                                                                    h1: ({children, ...props}) => <strong className="block text-lg font-bold mb-1" {...props}>{children}</strong>,
                                                                                    h2: ({children, ...props}) => <strong className="block text-base font-bold mb-1" {...props}>{children}</strong>,
                                                                                    h3: ({children, ...props}) => <strong className="block text-sm font-bold mb-1" {...props}>{children}</strong>,
                                                                                }}
                                                                            >
                                                                                {displayContent}
                                                                            </ReactMarkdown>
                                                                        )}
                                                                    </div>
                                                                    {isLong && (
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); toggleExpand(msg.id); }}
                                                                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70 hover:opacity-100 transition-opacity self-start"
                                                                        >
                                                                            <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                                            {isExpanded ? 'Show Less' : 'Read More'}
                                                                        </button>
                                                                    )}
                                                                    {isTranslated && (
                                                                        <div className="mt-2 pt-2 border-t border-white/20 text-xs italic text-white/80 w-full min-w-0">
                                                                            <div className="flex items-center gap-1 mb-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                                                                                <Languages size={10} /> Translated to {targetLanguage}
                                                                            </div>
                                                                            <ReactMarkdown
                                                                                components={{
                                                                                    p: ({children, ...props}) => <p className="mb-1 last:mb-0 break-words whitespace-pre-wrap" {...props}>{children}</p>,
                                                                                    code: ({children, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded text-[10px] font-mono" {...props}>{children}</code>,
                                                                                }}
                                                                            >
                                                                                {isTranslated}
                                                                            </ReactMarkdown>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()
                                                    )}
                                                </motion.div>
                                                <div className="text-[10px] sm:text-xs font-mono text-white/20 uppercase px-1 flex items-center gap-2 w-full">
                                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {!msg.isDeleted && (
                                                        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleCopyMessage(msg.content, msg.id); }}
                                                                className="hover:text-white/60 transition-colors p-0.5"
                                                                title="Copy"
                                                            >
                                                                {copiedMsgId === msg.id ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                                                            </button>
                                                            {!isAudio && (
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleTranslate(msg.id, msg.content); }}
                                                                    className="hover:text-[#ff1e1e] transition-colors p-0.5"
                                                                    title="Translate"
                                                                >
                                                                    <Languages size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
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
                        <form onSubmit={sendMessage} className="px-2 py-2 sm:px-4 sm:py-3 bg-[#0a0a0a]/80 border-t border-white/5 shrink-0 relative backdrop-blur-lg">
                            {/* Emoji Picker (Same) */}
                            {/* Suggestions */}
                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-full left-0 right-0 p-3 flex gap-2 overflow-x-auto custom-scrollbar"
                                    >
                                        {suggestions.map((reply, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setNewMessage(reply); setSuggestions([]); }}
                                                className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white/80 hover:text-[#ff1e1e] hover:border-[#ff1e1e]/30 transition-all whitespace-nowrap shadow-lg flex items-center gap-2"
                                            >
                                                <Sparkles size={10} className="text-[#ff1e1e]" />
                                                {reply}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Emoji Picker (Same) */}
                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        ref={emojiPickerRef}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-2 sm:left-4 mb-2 z-50"
                                    >
                                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
                                            <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} width={320} height={400} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* AI Rewrite Tools */}
                            {newMessage.trim() && (
                                <div className="flex gap-1 mb-2 px-1">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 self-center mr-1">Tone:</span>
                                    {['Formal', 'Funny', 'Concise'].map(tone => (
                                        <button 
                                            key={tone}
                                            type="button" 
                                            disabled={rewriting} 
                                            onClick={() => handleRewrite(tone)} 
                                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${rewriting ? 'opacity-30 cursor-not-allowed border-white/5 text-white/20' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5'}`}
                                        >
                                            {tone === 'Concise' ? 'Short' : tone}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-2">
                                {/* Recording UI vs Text UI */}
                                {isRecording ? (
                                    <div className="flex-1 flex items-center gap-3 bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 rounded-full px-4 py-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff1e1e] animate-ping" />
                                        <span className="text-white font-mono font-bold text-sm">{formatTime(recordingTime)}</span>
                                        <span className="text-white/30 text-[10px] uppercase tracking-wider">Recording...</span>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-end bg-white/[0.05] rounded-[24px] transition-all focus-within:bg-white/[0.07] min-h-[44px]">
                                        {/* Emoji button - left side */}
                                        <button 
                                            ref={emojiButtonRef}
                                            type="button" 
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className={`p-2.5 shrink-0 self-end transition-colors ${showEmojiPicker ? 'text-[#ff1e1e]' : 'text-white/30 hover:text-white/50'}`}
                                        >
                                            <Smile size={22} />
                                        </button>
                                        {/* Textarea */}
                                        <textarea
                                            ref={inputRef}
                                            placeholder={rewriting ? "Rewriting..." : "Type a message"} 
                                            className="flex-1 bg-transparent py-2.5 text-[14px] text-white placeholder:text-white/25 focus:outline-none font-normal resize-none custom-scrollbar leading-[1.4]"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage(e);
                                                }
                                            }}
                                            disabled={rewriting}
                                            rows={1}
                                            style={{ maxHeight: '120px', minHeight: '22px' }}
                                        />
                                        {/* Right action icons */}
                                        <div className="flex items-center shrink-0 self-end">
                                            <button
                                                type="button"
                                                onClick={handleSuggestReplies}
                                                className={`p-2.5 transition-colors ${isGeneratingSuggestions ? 'text-[#ff1e1e] animate-pulse' : 'text-white/30 hover:text-white/50'}`}
                                                title="AI Suggestions"
                                            >
                                                <Sparkles size={20} />
                                            </button>
                                            <div className="relative" ref={toolboxRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowToolbox(!showToolbox)}
                                                    className={`p-2.5 transition-all ${showToolbox ? 'text-[#ff1e1e] bg-white/5' : 'text-white/30 hover:text-white/50'}`}
                                                    title="ShieldX Toolbox"
                                                >
                                                    <Box size={20} />
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {showToolbox && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.9, x: -60 }}
                                                            animate={{ opacity: 1, y: -10, scale: 1, x: -60 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            className="absolute bottom-full left-1/2 z-[60] mb-2"
                                                        >
                                                            <div className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-1 min-w-[160px]">
                                                                <div className="px-3 py-1.5 mb-1 border-b border-white/5">
                                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Toolbox</span>
                                                                </div>
                                                                <button
                                                                    onClick={handleSendQr}
                                                                    disabled={!newMessage.trim()}
                                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${!newMessage.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:text-[#ff1e1e]'}`}
                                                                >
                                                                    <QrCode size={16} />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Generate QR</span>
                                                                </button>
                                                                <button
                                                                    onClick={handleSendQuote}
                                                                    disabled={!newMessage.trim()}
                                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${!newMessage.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:text-[#ff1e1e]'}`}
                                                                >
                                                                    <Quote size={16} />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Quote Card</span>
                                                                </button>
                                                                <button
                                                                    onClick={handleTextToVoice}
                                                                    disabled={!newMessage.trim()}
                                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${!newMessage.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:text-[#ff1e1e]'}`}
                                                                >
                                                                    <Volume2 size={16} />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Text to AI Voice</span>
                                                                </button>
                                                                <button
                                                                    onClick={handleVoiceToText}
                                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 hover:text-[#ff1e1e]"
                                                                >
                                                                    <Mic2 size={16} />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Voice to Text</span>
                                                                </button>
                                                            </div>
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#0f0f0f]/95" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleShareLocation}
                                                className="p-2.5 text-white/30 hover:text-white/50 transition-colors"
                                                title="Share Location"
                                            >
                                                <MapPin size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Send / Record / Cancel buttons */}
                                {isRecording ? (
                                    <>
                                        <button 
                                            type="button"
                                            onClick={cancelRecording}
                                            className="w-10 h-10 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all shrink-0"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleSendAudio}
                                            className="w-11 h-11 rounded-full bg-[#ff1e1e] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,30,30,0.3)] hover:scale-105 active:scale-95 transition-all shrink-0"
                                        >
                                            <Check size={20} />
                                        </button>
                                    </>
                                ) : (
                                    newMessage.trim() ? (
                                        <button 
                                            type="submit"
                                            disabled={sending}
                                            className="w-11 h-11 rounded-full bg-[#ff1e1e] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,30,30,0.25)] hover:scale-105 active:scale-95 transition-all shrink-0"
                                        >
                                            <Send size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={startRecording}
                                            className="w-11 h-11 rounded-full bg-white/10 text-white/40 flex items-center justify-center hover:bg-white/15 hover:text-white/60 transition-all shrink-0"
                                        >
                                            <Mic size={18} />
                                        </button>
                                    )
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
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center opacity-20">
                        <Terminal size={48} className="mb-4" />
                        <div className="text-[10px] font-black uppercase tracking-[0.3em]">Select_A_Tunnel</div>
                    </div>
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
                                if (msg) handleCopyMessage(msg.content, msg.id);
                                setContextMenu(prev => ({ ...prev, visible: false }));
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-white/60 hover:bg-white/10 transition-colors text-left"
                        >
                            <Copy size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Copy_Message</span>
                        </button>
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
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl">
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
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl ">
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
                                clearChat(selectedConversation?.id);
                                setClearChatDialogOpen(false);
                            }}
                            className="bg-[#ff1e1e] hover:bg-[#ff1e1e]/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl px-5 border-0"
                        >
                            Purge_All_Messages
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ===== Decode QR Dialog ===== */}
            <AlertDialog open={showDecodeDialog} onOpenChange={setShowDecodeDialog}>
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl ">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                <Scan size={20} className="text-[#ff1e1e]" />
                            </div>
                            <AlertDialogTitle className="text-white font-black uppercase tracking-wider text-sm">
                                Decoded_Payload
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-white/80 text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/5 break-all max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {decodedQrContent}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDecodeDialog(false)} className="bg-[#ff1e1e] text-white hover:bg-[#ff1e1e]/80 border-0 rounded-xl text-xs font-bold uppercase tracking-wider">
                            Close_Viewer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* YouTube Player Overlay */}
            <AnimatePresence>
                {activeVideoId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setActiveVideoId(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setActiveVideoId(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
                            >
                                <X size={24} />
                            </button>
                            <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatView;