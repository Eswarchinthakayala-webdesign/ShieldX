import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, MessageSquare, Globe, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import supabase from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';

const UsageTab = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('today'); // 'today', 'daily', 'monthly', 'yearly'
    const [stats, setStats] = useState({ total: 0, renames: 0, translations: 0, summaries: 0, monthly: 0 });
    const MONTHLY_LIMIT = 200;

    useEffect(() => {
        const fetchLogs = async () => {
            if (!user) return;
            try {
                // Fetch all logs for client-side aggregation
                const { data: logsData, error: logsError } = await supabase
                    .from('ai_usage_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true });

                if (logsError) throw logsError;

                // Fetch aggregate usage
                const { data: usageData, error: usageError } = await supabase
                    .from('user_ai_usage')
                    .select('request_count')
                    .eq('user_id', user.id)
                    .single();

                if (usageError && usageError.code !== 'PGRST116') {
                    console.error("Error fetching aggregate usage:", usageError);
                }

                setLogs(logsData || []);
                calculateStats(logsData || [], usageData?.request_count || 0);
            } catch (error) {
                console.error("Error fetching usage logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [user]);

    const calculateStats = (data, monthlyUsage) => {
        const counts = { total: data.length, renames: 0, translations: 0, summaries: 0, monthly: monthlyUsage };
        
        data.forEach(log => {
            // Count Aggregates
            if (log.operation_type === 'rewrite') counts.renames++;
            if (log.operation_type === 'translate') counts.translations++;
            if (log.operation_type === 'summarize') counts.summaries++;
        });
        setStats(counts);
    };

    const processChartData = () => {
        const now = new Date();
        const groupedData = {};
        
        // Helper to format date keys
        const formatDateKey = (date, p) => {
            const d = new Date(date);
            if (p === 'today') return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }); // 1 PM, 2 PM...
            if (p === 'daily') return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            if (p === 'monthly') return `Week ${Math.ceil(d.getDate() / 7)}`;
            if (p === 'yearly') return d.toLocaleDateString('en-US', { month: 'short' });
            return d.toLocaleDateString();
        };

        // Determine range and fill empty slots
        const fillEmptySlots = () => {
            const slots = [];
            if (period === 'today') {
                // Last 24 hours or just current day from 00:00? Let's do current day hours 0-23
                for (let i = 0; i < 24; i++) {
                    const d = new Date();
                    d.setHours(i, 0, 0, 0);
                    // Only show up to current hour? Or full day? Full day is cleaner for chart.
                    slots.push(d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
                }
            } else if (period === 'daily') {
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(now.getDate() - i);
                    slots.push(formatDateKey(d, 'daily'));
                }
            } else if (period === 'monthly') {
                for (let i = 0; i < 4; i++) {
                     slots.push(`Week ${i + 1}`);
                }
            } else if (period === 'yearly') {
                for (let i = 11; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(now.getMonth() - i);
                    slots.push(formatDateKey(d, 'yearly'));
                }
            }
            return slots;
        };

        const slots = fillEmptySlots();
        slots.forEach(slot => {
            groupedData[slot] = { name: slot, usage: 0, summary: 0, translate: 0, other: 0 };
        });

        // Filter and aggregate logs
        logs.forEach(log => {
            const logDate = new Date(log.created_at);
            let include = false;
            let key = '';

            if (period === 'today') {
                // Same day check
                if (logDate.getDate() === now.getDate() && 
                    logDate.getMonth() === now.getMonth() && 
                    logDate.getFullYear() === now.getFullYear()) {
                    include = true;
                    key = formatDateKey(logDate, 'today');
                }
            } else if (period === 'daily') {
                // Last 7 days
                const diffTime = Math.abs(now - logDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays <= 7) {
                    include = true;
                    key = formatDateKey(logDate, 'daily');
                }
            } else if (period === 'monthly') {
                // Current month only
                if (logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()) {
                    include = true;
                    key = `Week ${Math.ceil(logDate.getDate() / 7)}`;
                }
            } else if (period === 'yearly') {
                 // Last 12 months
                 const oneYearAgo = new Date();
                 oneYearAgo.setFullYear(now.getFullYear() - 1);
                 if (logDate >= oneYearAgo) {
                     include = true;
                     key = formatDateKey(logDate, 'yearly');
                 }
            }

            if (include && groupedData[key]) {
                groupedData[key].usage++;
                if (log.operation_type === 'summarize') groupedData[key].summary++;
                else if (log.operation_type === 'translate') groupedData[key].translate++;
                else groupedData[key].other++;
            }
        });

        return Object.values(groupedData);
    };

    const chartData = processChartData();

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-xl shadow-2xl">
                    <p className="text-white font-bold mb-2">{label}</p>
                    <div className="space-y-1 text-xs">
                        <p className="text-[#ff1e1e]">Total: {payload[0].value}</p>
                         <p className="text-white/60">Summaries: {payload[0].payload.summary}</p>
                         <p className="text-white/60">Translations: {payload[0].payload.translate}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full bg-[#050505] overflow-y-auto p-4 sm:p-8 relative custom-scrollbar">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-[10px] font-black text-[#ff1e1e] uppercase tracking-[0.3em] mb-1">System_Metrics</div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">AI Consumption Log</h1>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                        {['today', 'daily', 'monthly', 'yearly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${period === p ? 'bg-[#ff1e1e] text-white shadow-lg shadow-[#ff1e1e]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                {p === 'today' ? 'Today' : p === 'daily' ? '7 Days' : p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={Activity} 
                        label="Monthly Usage" 
                        value={stats.monthly} 
                        total={stats.total} 
                        color="#ff1e1e" 
                        limit={MONTHLY_LIMIT} 
                    />
                    <StatCard icon={MessageSquare} label="Summaries" value={stats.summaries} color="#3b82f6" />
                    <StatCard icon={Globe} label="Translations" value={stats.translations} color="#10b981" />
                    <StatCard icon={Sparkles} label="Enhancements" value={stats.renames} color="#8b5cf6" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Usage Line Chart */}
                    <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1e1e]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ff1e1e]/10 transition-colors duration-500" />
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                            <Zap size={14} className="text-[#ff1e1e]" />
                            Total Usage Trend
                        </h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff20" 
                                        tick={{fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace'}} 
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                        padding={{ left: 20, right: 20 }}
                                    />
                                    <YAxis 
                                        stroke="#ffffff20" 
                                        tick={{fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace'}} 
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff1e1e', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="usage" 
                                        stroke="#ff1e1e" 
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#ff1e1e', stroke: 'white', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Breakdown Charts */}
                    {/* Summaries Chart */}
                    <ChartCard title="Summaries" icon={MessageSquare} color="#3b82f6" data={chartData} dataKey="summary" />
                    
                    {/* Translations Chart */}
                    <ChartCard title="Translations" icon={Globe} color="#10b981" data={chartData} dataKey="translate" />

                    {/* Enhancements Chart */}
                    <ChartCard title="Enhancements" icon={Sparkles} color="#8b5cf6" data={chartData} dataKey="other" className="lg:col-span-2" />
                </div>
            </div>
        </div>
    );
};

const ChartCard = ({ title, icon: Icon, color, data, dataKey, className = "" }) => (
    <div className={`bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 transition-opacity duration-500 group-hover:opacity-40" style={{ backgroundColor: color }} />
        <h2 className="text-xs font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Icon size={12} style={{ color: color }} />
            {title}
        </h2>
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#ffffff20" 
                        tick={{fill: '#ffffff40', fontSize: 9, fontFamily: 'monospace'}} 
                        tickLine={false}
                        axisLine={false}
                        minTickGap={20}
                        padding={{ left: 10, right: 10 }}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#ffffff60', fontSize: '10px', marginBottom: '4px' }}
                        cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke={color} 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: color, stroke: 'white', strokeWidth: 1.5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, color, limit, total }) => {
    const percentage = limit ? Math.min((value / limit) * 100, 100) : 0;
    
    return (
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex justify-between items-start mb-2">
                <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">{label}</p>
                    <h3 className="text-3xl font-black text-white">
                        {value}
                        {limit && <span className="text-lg text-white/20 font-medium ml-1">/ {limit}</span>}
                    </h3>
                </div>
                <div className={`p-2.5 rounded-xl bg-[${color}]/10 border border-[${color}]/20 text-[${color}]`}>
                    <Icon size={18} style={{ color: color }} />
                </div>
            </div>
            
            {limit && (
                <div className="relative z-10 mt-2">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] text-white/40 font-mono">
                            {percentage.toFixed(1)}% Used
                        </span>
                        {total && <span className="text-[10px] text-white/20 font-mono">Lifetime: {total}</span>}
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                                width: `${percentage}%`,
                                backgroundColor: percentage > 90 ? '#ff1e1e' : color 
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsageTab;
