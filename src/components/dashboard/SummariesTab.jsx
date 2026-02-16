import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Sparkles, Loader2, Search, ChevronLeft, MessageSquare, Trash2, AlertTriangle } from 'lucide-react'; // Added Trash2, AlertTriangle
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
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

const SummariesTab = ({ selectedSummaryId, onOpenChat }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null); // For single delete
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

    // Add keyframes for background animation
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse-glow {
                0%, 100% { opacity: 0.1; transform: scale(1); }
                50% { opacity: 0.2; transform: scale(1.1); }
            }
            @keyframes scanline {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);


    useEffect(() => {
        const fetchSummaries = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('chat_summaries')
                    .select('*, conversation:conversations(*, user_one_profile:profiles!user_one(*), user_two_profile:profiles!user_two(*))')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setSummaries(data || []);
            } catch (error) {
                console.error("Error fetching summaries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, [user]);

    // Auto-select summary if ID is provided
    useEffect(() => {
        if (selectedSummaryId && summaries.length > 0) {
            const match = summaries.find(s => s.id === selectedSummaryId);
            if (match) setSelectedSummary(match);
        }
    }, [selectedSummaryId, summaries]);

    const getConversationName = (conv) => {
        if (!conv) return "Unknown Tunnel";
        const isUserOne = conv.user_one === user.id;
        const otherProfile = isUserOne ? conv.user_two_profile : conv.user_one_profile;
        return otherProfile?.email?.split('@')[0] || "Unknown User";
    };

    const getOtherUsername = (conv) => {
        if (!conv) return '';
        const isUserOne = conv.user_one === user.id;
        const otherProfile = isUserOne ? conv.user_two_profile : conv.user_one_profile;
        const name = otherProfile?.full_name || otherProfile?.name || otherProfile?.email?.split('@')[0] || '';
        return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const getCurrentUsername = () => {
         return (user?.email?.split('@')[0] || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleNavigateToChat = (conv) => {
        if (!conv) return;
        if (onOpenChat) {
            onOpenChat(conv);
        } else {
             const me = getCurrentUsername();
            const other = getOtherUsername(conv);
            const slug = `${me}-to-${other}`;
            navigate(`/dashboard/messages/${slug}`);
        }
    };

    const handleDeleteSummary = async (id) => {
        if (!id) return;
        try {
            const { error } = await supabase.from('chat_summaries').delete().eq('id', id);
            if (error) {
                console.error("Supabase delete error:", error);
                throw error;
            }
            setSummaries(prev => prev.filter(s => s.id !== id));
            if (selectedSummary?.id === id) setSelectedSummary(null);
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete summary. Please try again.");
        }
    };

    const handleClearAllSummaries = async () => {
        try {
            const { error } = await supabase.from('chat_summaries').delete().eq('user_id', user.id);
            if (error) throw error;
            setSummaries([]);
            setSelectedSummary(null);
            setClearAllDialogOpen(false);
        } catch (error) {
            console.error("Clear all failed:", error);
        }
    };

    const cleanMarkdown = (text) => {
        if (!text) return '';
        // Remove code block wrappers and "Here is a summary" prefixes if they exist
        return text
            .replace(/^```markdown\s*/i, '')
            .replace(/^```\s*/, '')
            .replace(/```$/, '')
            .replace(/^Here's a concise.*?:\s*/i, '');
    };

    const filteredSummaries = summaries.filter(s => 
        getConversationName(s.conversation).toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary_markdown.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex w-full h-full bg-[#0a0a0a] overflow-hidden">
            {/* Left Panel: List */}
            <div className={`${selectedSummary ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 flex-col border-r border-white/5 bg-black/20 shrink-0`}>
                <div className="p-4 sm:p-6 border-b border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 flex items-center justify-center">
                                <FileText size={20} className="text-[#ff1e1e]" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em]">Intelligence_Log</div>
                                <h1 className="text-xl font-bold text-white tracking-tight">AI Summaries</h1>
                            </div>
                        </div>
                        {summaries.length > 0 && (
                            <button 
                                onClick={() => setClearAllDialogOpen(true)}
                                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-[#ff1e1e] transition-colors"
                                title="Clear All Logs"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff1e1e]/50 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                         <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#ff1e1e]" /></div>
                    ) : filteredSummaries.length === 0 ? (
                        <div className="text-center py-8 text-white/20 text-xs uppercase tracking-wider">No logs found</div>
                    ) : (
                        filteredSummaries.map((summary) => (
                            <div key={summary.id} className="relative group/item">
                                <button
                                    onClick={() => setSelectedSummary(summary)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden pr-10
                                        ${selectedSummary?.id === summary.id 
                                            ? 'bg-[#ff1e1e]/10 border-[#ff1e1e]/30' 
                                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedSummary?.id === summary.id ? 'text-[#ff1e1e]' : 'text-white/40'}`}>
                                            {getConversationName(summary.conversation)}
                                        </span>
                                        <span className="text-[9px] font-mono text-white/20">{new Date(summary.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs text-white/60 line-clamp-2 leading-relaxed opacity-80">
                                        <ReactMarkdown
                                            allowedElements={['p', 'strong', 'em', 'span', 'li', 'ul', 'ol']}
                                            unwrapDisallowed={true}
                                            components={{
                                                p: ({node, ...props}) => <span className="mr-1 inline" {...props} />,
                                                strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                                em: ({node, ...props}) => <em className="italic" {...props} />,
                                                li: ({node, ...props}) => <span className="mr-1 inline" {...props} />,
                                                ul: ({node, ...props}) => <span className="inline" {...props} />,
                                                ol: ({node, ...props}) => <span className="inline" {...props} />,
                                                h1: ({node, ...props}) => <span className="font-bold uppercase text-white/80 mr-1" {...props} />,
                                                h2: ({node, ...props}) => <span className="font-bold text-white/70 mr-1" {...props} />,
                                                h3: ({node, ...props}) => <span className="font-bold text-white/70 mr-1" {...props} />,
                                            }}
                                        >
                                            {cleanMarkdown(summary.summary_markdown)}
                                        </ReactMarkdown>
                                    </div>
                                    {selectedSummary?.id === summary.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff1e1e]" />
                                    )}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(summary); setDeleteDialogOpen(true); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/50 text-white/20 hover:text-[#ff1e1e] hover:bg-white/10 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-all z-10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Content */}
            <div className={`${!selectedSummary ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-[#050505] min-h-0 relative overflow-hidden`}>
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,30,30,0.08),transparent_50%)] pointer-events-none animate-[pulse-glow_4s_ease-in-out_infinite]" />
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #ff1e1e 1px, transparent 2px)', backgroundSize: '100% 4px' }} />
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.1]">
                     <div className="w-full h-[2px] bg-[#ff1e1e] shadow-[0_0_10px_#ff1e1e] animate-[scanline_3s_linear_infinite]" />
                </div>
                
                {selectedSummary ? (
                    <>
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40 backdrop-blur-md z-10 relative">
                             <div className="flex items-center gap-4">
                                 <button 
                                    className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-colors" 
                                    onClick={() => setSelectedSummary(null)}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div>
                                    <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Tunnel_Briefing</div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#ff1e1e]" />
                                        {getConversationName(selectedSummary.conversation)}
                                    </h2>
                                </div>
                             </div>
                             
                             <button 
                                 onClick={() => handleNavigateToChat(selectedSummary.conversation)}
                                 className="flex items-center gap-2 px-4 py-2 bg-[#ff1e1e] hover:bg-[#ff1e1e]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,30,30,0.2)]"
                             >
                                 <MessageSquare size={14} />
                                 <span className="hidden sm:inline">Open Tunnel</span>
                             </button>
                        </div>

                         {/* Markdown Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-0">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                                        <div className="transform -rotate-12 text-center">
                                            <div className="text-[80px] sm:text-[120px] font-black text-white leading-none tracking-tighter">SHIELDX</div>
                                            <div className="text-xl sm:text-4xl font-bold text-white tracking-[1em] mt-4">CLASSIFIED</div>
                                        </div>
                                    </div>
                                    
                                     {/* Custom Markdown Components */}
                                      <div className="prose prose-invert max-w-none relative z-10">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({node, ...props}) => (
                                                    <div className="border-b border-white/10 pb-2 mb-6 mt-2">
                                                        <h1 className="text-xl font-bold text-[#ff1e1e] uppercase tracking-wider" {...props} />
                                                    </div>
                                                ),
                                                h2: ({node, ...props}) => (
                                                    <h2 className="text-sm font-bold text-white uppercase tracking-widest mt-8 mb-3 flex items-center gap-2" {...props}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e]" />
                                                        {props.children}
                                                    </h2>
                                                ),
                                                h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white/90 mb-2 mt-4" {...props} />,
                                                p: ({node, ...props}) => <p className="text-sm text-white/70 leading-relaxed mb-4 font-sans" {...props} />,
                                                ul: ({node, ...props}) => <ul className="space-y-3 mb-6" {...props} />,
                                                ol: ({node, ...props}) => <ol className="space-y-3 mb-6 list-decimal list-inside text-white/70" {...props} />,
                                                li: ({node, ...props}) => (
                                                    <li className="text-sm text-white/80 leading-relaxed pl-4 border-l-2 border-white/10 hover:border-[#ff1e1e]/50 transition-colors" {...props} />
                                                ),
                                                blockquote: ({node, ...props}) => (
                                                    <blockquote className="bg-white/[0.03] border-l-2 border-[#ff1e1e] p-4 rounded-r-xl italic text-white/60 my-6 text-sm" {...props} />
                                                ),
                                                code: ({node, inline, ...props}) => (
                                                    inline 
                                                        ? <code className="bg-[#ff1e1e]/10 text-[#ff1e1e] px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase" {...props} />
                                                        : <code className="block bg-black/50 p-4 rounded-lg text-xs font-mono text-white/80 overflow-x-auto my-4 border border-white/5" {...props} />
                                                ),
                                                strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                                a: ({node, ...props}) => <a className="text-[#ff1e1e] hover:underline underline-offset-4 decoration-[#ff1e1e]/30" {...props} />,
                                            }}
                                        >
                                            {selectedSummary.summary_markdown}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono uppercase tracking-wider">
                                        <span>Generated {new Date(selectedSummary.created_at).toLocaleString()}</span>
                                        <span>{selectedSummary.message_count || '?'} Packets Analyzed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8">
                         <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-pulse">
                            <FileText size={40} className="text-white/10" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-widest mb-2">Detailed Briefing</div>
                        <div className="text-xs text-center max-w-xs opacity-50">Select an intelligence log from the left panel to execute full decryption.</div>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Summary?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50">
                            This action cannot be undone. This summary will be permanently deleted from your logs.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border border-white/10 text-white/60 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTarget && handleDeleteSummary(deleteTarget.id)} className="bg-[#ff1e1e] text-white">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
                <AlertDialogContent className="bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Clear All Summaries?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50">
                            This will delete ALL your AI summaries. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border border-white/10 text-white/60 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAllSummaries} className="bg-[#ff1e1e] text-white">Clear All</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SummariesTab;
