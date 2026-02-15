
import React from 'react';
import { Menu, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet';
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
import NotificationPanel from './NotificationPanel';

const MobileHeader = ({ mobileSheetOpen, setMobileSheetOpen, activeTab, handleTabChange, signOut, children, user, conversations, selectedConversationId, onSelectConversation, onNavigateToMessages }) => {
    const navigate = useNavigate();

    return (
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black border-b border-white/5 z-30 shrink-0">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <Logo className="w-8 h-8" />
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-tighter">ShieldX</div>
                    <div className="text-[8px] font-mono text-[#ff1e1e]">Mesh_Active</div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <NotificationPanel 
                    user={user}
                    conversations={conversations || []}
                    onSelectConversation={onSelectConversation}
                    onNavigateToMessages={onNavigateToMessages}
                    activeTab={activeTab}
                    selectedConversationId={selectedConversationId}
                />
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                
                <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
                            <Menu size={18} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" showCloseButton={false} className="w-[85%] max-w-sm bg-[#0a0a0a] border-white/5 p-0">
                        <SheetHeader className="p-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Logo className="w-8 h-8" />
                                    <SheetTitle className="text-sm font-black text-white uppercase tracking-tight">ShieldX</SheetTitle>
                                </div>
                            </div>
                        </SheetHeader>
                        
                        {/* Mobile Nav Items */}
                        <div className="p-4 space-y-2 border-b border-white/5">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all
                                        ${activeTab === item.id 
                                            ? 'bg-[#ff1e1e] text-white shadow-[0_0_15px_rgba(255,30,30,0.3)]' 
                                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                                >
                                    <item.icon size={18} />
                                    <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile Left Panel Content */}
                        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                            {children}
                        </div>

                        {/* Sign Out */}
                        <div className="p-4 border-t border-white/5">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button 
                                        className="w-full flex items-center gap-3 p-3 rounded-xl text-white/20 hover:text-[#ff1e1e] hover:bg-[#ff1e1e]/5 transition-all"
                                    >
                                        <Lock size={18} />
                                        <span className="text-xs font-black uppercase tracking-wider">Disconnect</span>
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
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default MobileHeader;
