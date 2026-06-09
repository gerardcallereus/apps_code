import React from 'react';
import { TurnNotification } from '../types';
import { CheckCircleIcon, XCircleIcon, CogIcon } from './Icons';

interface TurnNotificationPanelProps {
    notifications: TurnNotification[];
    onDismiss: (id: string) => void;
}

const ICONS: Record<TurnNotification['type'], React.ReactNode> = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    failure: <XCircleIcon className="w-6 h-6 text-red-500" />,
    info: <CogIcon className="w-6 h-6 text-blue-500" />,
};

const BORDER_COLORS: Record<TurnNotification['type'], string> = {
    success: 'border-green-500',
    failure: 'border-red-500',
    info: 'border-blue-500',
};

const TurnNotificationPanel: React.FC<TurnNotificationPanelProps> = ({ notifications, onDismiss }) => {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 mt-6">
            {notifications.map(notif => (
                <div 
                    key={notif.id} 
                    className={`bg-white p-4 rounded-lg flex items-center justify-between border-l-4 ${BORDER_COLORS[notif.type]} shadow-lg animate-fade-in`}
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">{ICONS[notif.type]}</div>
                        <p className="text-slate-800 font-semibold">{notif.message}</p>
                    </div>
                    <button 
                        onClick={() => onDismiss(notif.id)} 
                        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 ml-4"
                        aria-label="Tancar notificació"
                    >
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TurnNotificationPanel;