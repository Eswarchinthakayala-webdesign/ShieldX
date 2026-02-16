import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';

const SummaryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!id || !user) return;
            try {
                const { data, error } = await supabase
                    .from('chat_summaries')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [id, user]);

    if (loading) {
        return (
            <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2" /> Loading Summary...
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold mb-4">Summary Not Found</h2>
                <button onClick={() => navigate(-1)} className="text-[#ff1e1e] hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Chat</span>
                    </button>
                    <div className="flex items-center gap-2 bg-[#ff1e1e]/10 px-4 py-2 rounded-full border border-[#ff1e1e]/20">
                        <Sparkles size={16} className="text-[#ff1e1e]" />
                        <span className="text-xs font-bold text-[#ff1e1e] uppercase tracking-wider">AI Generated Summary</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1e1e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0 tracking-tight" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mb-3 mt-5 tracking-tight flex items-center gap-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-base font-bold text-white/90 mb-2 mt-4" {...props} />,
                                p: ({node, ...props}) => <p className="text-sm text-white/70 leading-relaxed mb-4" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-4 space-y-2 text-white/70" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-4 space-y-2 text-white/70" {...props} />,
                                li: ({node, ...props}) => <li className="text-sm leading-relaxed pl-1 marker:text-[#ff1e1e]" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-[#ff1e1e] pl-4 italic text-white/50 my-4" {...props} />,
                                code: ({node, inline, ...props}) => (
                                    inline 
                                        ? <code className="bg-[#ff1e1e]/10 text-[#ff1e1e] px-1 py-0.5 rounded text-xs font-mono" {...props} />
                                        : <code className="block bg-black/50 p-4 rounded-lg text-xs font-mono text-white/80 overflow-x-auto my-4 border border-white/5" {...props} />
                                ),
                                strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                a: ({node, ...props}) => <a className="text-[#ff1e1e] hover:underline" {...props} />,
                            }}
                        >
                            {summary.summary_markdown}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-white/40 font-mono uppercase tracking-wider">
                        <span>Generated: {new Date(summary.created_at).toLocaleString()}</span>
                        <span>Messages Processed: {summary.message_count || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
