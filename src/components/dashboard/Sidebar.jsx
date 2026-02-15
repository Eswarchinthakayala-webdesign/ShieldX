
import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import Logo from '../landing-page/Logo';
import { NAV_ITEMS } from '../../constants/dashboard';

const Sidebar = ({ activeTab, handleTabChange, signOut }) => {
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex w-20 lg:w-24 bg-black border-r border-white/5 flex-col items-center py-6 lg:py-8 gap-6 lg:gap-8 z-30 shrink-0">
            <div 
                onClick={() => navigate('/')}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 flex items-center justify-center mb-2 lg:mb-4 cursor-pointer hover:bg-[#ff1e1e]/20 transition-all"
            >
                <Logo className="w-6 h-6 lg:w-7 lg:h-7" />
            </div>

            <div className="flex flex-col gap-3 lg:gap-4 flex-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group
                            ${activeTab === item.id 
                                ? 'bg-[#ff1e1e] text-white shadow-[0_0_15px_rgba(255,30,30,0.3)]' 
                                : 'text-white/20 hover:text-white/50 hover:bg-white/5'}`}
                    >
                        <item.icon size={18} />
                        <span className="text-[7px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button 
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl text-white/20 hover:text-[#ff1e1e] hover:bg-[#ff1e1e]/5 transition-all flex items-center justify-center"
                    >
                        <Lock size={18} />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Disconnect</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to terminate your session? This will purge your local decrypted keys and you will need to re-authorize to connect.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={signOut}>Disconnect</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
};

export default Sidebar;
