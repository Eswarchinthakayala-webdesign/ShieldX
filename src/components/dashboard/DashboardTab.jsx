import React, { useState, useRef, useEffect } from 'react';
import { Lock, Activity, Zap, Users, Globe } from 'lucide-react';
import StatCard from './StatCard';
import Logo from '../landing-page/Logo';

const DashboardTab = ({ renderLeftPanelContent, activeConnections = 0 }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [latency, setLatency] = useState(12);
    const [packetLoss, setPacketLoss] = useState(0.001);
    const gridRef = useRef(null);

    // Simulate Network Telemetry
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                const noise = Math.random() > 0.5 ? 2 : -2;
                const newVal = prev + noise;
                return Math.min(Math.max(newVal, 8), 45); // Clamp between 8ms and 45ms
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPacketLoss(prev => {
                const noise = (Math.random() - 0.5) * 0.0005;
                const newVal = prev + noise;
                return Number(Math.min(Math.max(newVal, 0.0001), 0.005).toFixed(4));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left: Settings/Privacy Panel (desktop) */}
            <div className="hidden md:flex w-72 lg:w-80 xl:w-96 border-r border-white/5 flex-col bg-black/20 min-h-0">
                {renderLeftPanelContent()}
            </div>

            {/* Right: Stats Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-0">
                <section>
                    <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <Zap size={16} className="text-[#ff1e1e]" />
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">System_Telemetry</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <StatCard label="Cipher_Strength" value="RSA_4096_GCM" icon={Lock} />
                        <StatCard label="Tunnel_Latency" value={`${latency}ms`} icon={Activity} />
                        <StatCard label="Relay_Nodes" value={`${activeConnections}_ACTIVE`} icon={Globe} />
                        <StatCard label="Packet_Loss" value={`${packetLoss}%`} icon={Zap} />
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <Users size={16} className="text-[#ff1e1e]" />
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Node_Grid</h2>
                    </div>
                    <div 
                        ref={gridRef}
                        onMouseMove={handleMouseMove}
                        className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 relative overflow-hidden group min-h-[300px] cursor-crosshair"
                    >
                        {/* Interactive Spotlight Grid */}
                        <div 
                            className="absolute inset-0 bg-[linear-gradient(to_right,#ff1e1e20_1px,transparent_1px),linear-gradient(to_bottom,#ff1e1e20_1px,transparent_1px)] bg-[size:24px_24px]"
                            style={{
                                maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                                WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
                            }}
                        />
                        
                        {/* Faint Base Grid (Always visible) */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" pointerEvents="none" />
                        
                        {/* Active Nodes Simulation */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute w-2 h-2 bg-[#ff1e1e] rounded-full animate-pulse shadow-[0_0_10px_#ff1e1e]"
                                    style={{
                                        top: `${Math.random() * 80 + 10}%`,
                                        left: `${Math.random() * 80 + 10}%`,
                                        opacity: Math.random() * 0.5 + 0.3,
                                        animationDelay: `${Math.random() * 2}s`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Central Hub Status */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center py-12 pointer-events-none">
                            {/* Animated Rings Container */}
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                {/* Outer Ring */}
                                <div className="absolute inset-0 border border-[#ff1e1e]/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                {/* Middle Dashed Ring */}
                                <div className="absolute inset-2 border border-dashed border-[#ff1e1e]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                {/* Inner Pulse */}
                                <div className="absolute inset-0 bg-[#ff1e1e] blur-[40px] opacity-20 rounded-full animate-pulse" />
                                
                                {/* Logo in Center */}
                                <Logo className="w-16 h-16 text-[#ff1e1e] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(255,30,30,0.5)]" />
                            </div>
                            
                            <div className="mt-8 text-center space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e1e] animate-pulse" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Lattice_Synchronized</h3>
                                </div>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                    Global Mesh Integrity: 99.9%
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardTab;
