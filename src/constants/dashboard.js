import { 
    Activity, 
    MessageSquare, 
    Users, 
    Settings,
    FileText,
    Zap
} from 'lucide-react';

export const NAV_ITEMS = [
    { id: 'stats', icon: Activity, label: 'Stats' },
    { id: 'messages', icon: MessageSquare, label: 'Mesh' },
    { id: 'summaries', icon: FileText, label: 'Intel' },
    { id: 'users', icon: Users, label: 'Nodes' },
    { id: 'usage', icon: Zap, label: 'System' },
    { id: 'settings', icon: Settings, label: 'Optics' }
];
