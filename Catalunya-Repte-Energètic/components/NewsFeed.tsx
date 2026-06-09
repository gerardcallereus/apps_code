import React from 'react';
import { NewsArticle, NewsCategory } from '../types';
// FIX: Added missing ScaleIcon import
// FIX: Add LightbulbIcon for Technology news category
import { BriefcaseIcon, UsersIcon, ScaleIcon, GlobeAltIcon, LightbulbIcon } from './Icons';

interface ActivityFeedProps {
    news: NewsArticle[];
    log: { message: string; turn: number; id: string }[];
}

const ICONS: Record<NewsCategory, { icon: React.ReactNode; color: string }> = {
    [NewsCategory.Economic]: { icon: <BriefcaseIcon className="w-5 h-5" />, color: "border-blue-400" },
    [NewsCategory.Political]: { icon: <ScaleIcon className="w-5 h-5" />, color: "border-purple-400" },
    [NewsCategory.Social]: { icon: <UsersIcon className="w-5 h-5" />, color: "border-yellow-400" },
    [NewsCategory.Environmental]: { icon: <GlobeAltIcon className="w-5 h-5" />, color: "border-green-400" },
    [NewsCategory.International]: { icon: <GlobeAltIcon className="w-5 h-5" />, color: "border-red-400" },
    // FIX: Add Technology to ICONS to support new category
    [NewsCategory.Technology]: { icon: <LightbulbIcon className="w-5 h-5" />, color: "border-cyan-400" },
};

const getLogStyle = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('dèficit') || lowerMessage.includes('alerta') || lowerMessage.includes('sanció') || lowerMessage.includes('bancarrota')) return 'border-red-500';
    if (lowerMessage.includes('avís')) return 'border-yellow-500';
    if (lowerMessage.includes('superàvit')) return 'border-green-500';
    if (lowerMessage.includes('esdeveniment:')) return 'border-purple-500';
    if (lowerMessage.includes('decisió presa:')) return 'border-blue-500';
    if (lowerMessage.includes("construcció")) return 'border-orange-500';
    return 'border-teal-500';
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ news, log }) => {
    const newsItems = news.map(n => ({ type: 'news', data: n, id: n.id }));
    const logItems = log.map(l => ({ type: 'log', data: l.message, id: l.id }));
    
    const combinedFeed = [...newsItems, ...logItems].sort((a, b) => b.id.localeCompare(a.id));

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg h-[32rem] flex flex-col border border-slate-200">
            <h2 className="text-xl font-bold text-teal-600 mb-4 text-center border-b border-slate-200 pb-3">Diari i Notícies</h2>
            <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                {combinedFeed.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No hi ha activitat recent.</p>
                )}
                {combinedFeed.map((item, index) => {
                    if (item.type === 'news') {
                        const article = item.data as NewsArticle;
                        const { icon, color } = ICONS[article.category];
                        return (
                            <div key={article.id} className={`bg-slate-50 p-3 rounded-lg border-l-4 ${color}`}>
                               <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                                    {icon}
                                    <span className="font-semibold">{article.category}</span>
                               </div>
                               <h3 className="font-bold text-slate-800 text-sm">{article.headline}</h3>
                               <p className="text-xs text-slate-600 mt-1">{article.content}</p>
                            </div>
                        );
                    } else { // 'log'
                        const message = item.data as string;
                        return (
                             <div key={item.id} className={`text-sm text-slate-700 border-l-4 p-2 rounded-r-md bg-slate-100/50 transition-colors duration-300 ${getLogStyle(message)} ${index === 0 ? 'font-semibold text-slate-900' : ''}`}>
                                {message}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default ActivityFeed;