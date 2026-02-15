
import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = "text-[#ff1e1e]" }) => (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 group hover:border-[#ff1e1e]/20 hover:bg-white/[0.04] transition-all relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff1e1e]/0 via-[#ff1e1e]/5 to-[#ff1e1e]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
            <Icon size={18} className={color} />
        </div>
        <div className="min-w-0">
            <div className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest truncate">{label}</div>
            <div className="text-xs sm:text-sm font-bold text-white uppercase truncate">{value}</div>
        </div>
    </div>
);

export default StatCard;
