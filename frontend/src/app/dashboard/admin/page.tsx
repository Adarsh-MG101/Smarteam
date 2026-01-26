'use client';

import { useEffect, useState } from 'react';
import { dashboardApi, taskApi } from '@/lib/api';
import {
    Users,
    Trophy,
    BarChart4,
    Layout,
    UserCheck,
    AlertCircle,
    TrendingUp,
    Cpu,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [reviewGrade, setReviewGrade] = useState('A');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        dashboardApi.admin()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleReview = async () => {
        try {
            await taskApi.review({ taskId: selectedTask._id, grade: reviewGrade });
            setShowReviewModal(false);
            loadData();
        } catch (err) {
            alert('Review failed: Could not synchronize grading data.');
        }
    };

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-slate-900 h-32 rounded-3xl border border-white/5"></div>)}
        </div>
    );

    return (
        <div className="space-y-10 font-sans">
            <div className="flex flex-col md:row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight italic">Enterprise Hub</h1>
                    <p className="text-slate-500 mt-1">Cross-departmental analytics and performance oversight.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Admin Authorization: Active</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatSummary label="Aggregated Load" value={data?.stats?.totalTasks} icon={<Cpu className="text-slate-400" />} />
                <StatSummary label="Verified Success" value={data?.stats?.completedTasks} icon={<UserCheck className="text-green-500" />} trend="Positive" />
                <StatSummary label="Pending Sync" value={data?.stats?.pendingTasks} icon={<AlertCircle className="text-yellow-500" />} />
                <StatSummary label="Personnel" value={data?.users?.length} icon={<Users className="text-purple-400" />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Leaderboard */}
                <div className="xl:col-span-3 bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col font-sans">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-xl font-bold text-white italic">Elite Personnel</h3>
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Global Ranking</p>
                    </div>
                    <div className="p-0 flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Rank</th>
                                    <th className="px-8 py-4">Identity</th>
                                    <th className="px-8 py-4">Index</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data?.leaderboard.map((user: any, i: number) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-6">
                                            <span className={`text-sm font-black italic ${i < 3 ? 'text-purple-400' : 'text-slate-700'}`}>0{i + 1}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4 font-sans">
                                                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center font-black text-purple-400 italic">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-none mb-1">{user.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user.roles.join(' / ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 font-sans">
                                                <div className="flex-1 h-1.5 w-24 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(parseFloat(user.averageGrade) / 4) * 100}%` }}></div>
                                                </div>
                                                <span className="text-sm font-black text-white italic">{user.averageGrade}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Management */}
                <div className="xl:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col font-sans">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white italic">Operational Directory</h3>
                    </div>
                    <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
                        {data?.users.map((user: any) => (
                            <div key={user._id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-purple-500/30 transition-all group">
                                <div className="flex items-center gap-4 font-sans">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 uppercase font-black text-purple-400 group-hover:scale-110 transition-transform italic">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="font-sans">
                                        <p className="font-bold text-white text-sm">{user.name}</p>
                                        <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-800 transition-transform group-hover:translate-x-1 group-hover:text-purple-500" />
                            </div>
                        ))}
                    </div>
                    <div className="p-6 mt-auto">
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-all">Download Personnel Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatSummary({ label, value, icon, trend }: any) {
    return (
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                    {icon}
                </div>
                {trend && <TrendingUp className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-4xl font-black text-white italic">{value}</p>
        </div>
    );
}
