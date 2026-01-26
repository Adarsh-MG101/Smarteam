'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { Activity, Target, Award, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function UserDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardApi.user()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="bg-slate-900/50 h-32 rounded-[2rem] border border-white/5"></div>)}
            </div>
        );
    }

    const statCards = [
        { label: 'Academic Performance', value: data?.averageGrade, sub: 'Average GPA', icon: <Award className="text-purple-400" />, bg: 'bg-purple-400/10' },
        { label: 'Assigned Missions', value: data?.tasks?.length || 0, sub: 'Active Tasks', icon: <Target className="text-blue-400" />, bg: 'bg-blue-400/10' },
        { label: 'Verified Outcomes', value: data?.grades?.length || 0, sub: 'Graded Results', icon: <Activity className="text-green-400" />, bg: 'bg-green-400/10' },
    ];

    return (
        <div className="space-y-10 font-sans">
            <div className="flex flex-col md:row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Mission Control</h1>
                    <p className="text-slate-500 mt-1">Real-time status of your operational performance.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Last Sync: Just Now</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 opacity-50`}></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                                    {stat.icon}
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-700 hover:text-white transition-colors cursor-pointer" />
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-white italic">{stat.value}</p>
                                <span className="text-slate-600 text-[10px] font-bold">{stat.sub}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col font-sans">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            <h3 className="text-xl font-bold text-white">Performance Log</h3>
                        </div>
                        <button className="text-xs font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">Export Record</button>
                    </div>
                    <div className="p-0 flex-1 overflow-x-auto">
                        {data?.grades?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase text-slate-500 bg-white/5 font-black">
                                    <tr>
                                        <th className="px-8 py-4">Verification ID</th>
                                        <th className="px-8 py-4">Metric</th>
                                        <th className="px-8 py-4 text-right">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data?.grades.map((g: any, i: number) => (
                                        <tr key={i} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:animate-ping"></div>
                                                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{g.taskId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-semibold text-slate-300">Operational Task Completion</td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-white/5 text-purple-400 font-black text-lg italic shadow-inner">
                                                    {g.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 text-center opacity-40 grayscale font-sans">
                                <Activity className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest">No verified data available</p>
                                <p className="text-xs mt-1">Operational records will appear here after verification.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden group font-sans">
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-700"></div>
                    <Award className="w-12 h-12 mb-6 opacity-80" />
                    <h3 className="text-2xl font-black mb-2 italic">Excellence Level</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-8">Your current performance index is at the top 15% of the enterprise. Keep completing missions to maintain clearance.</p>
                    <button className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                        View Milestones
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
