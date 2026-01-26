'use client';

import { useEffect, useState } from 'react';
import { projectApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Users,
    Lock,
    Globe2,
    MoreVertical,
    ChevronRight,
    FolderPlus
} from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', visibility: 'INTERN' });
    const { user } = useAuth();

    const isAdmin = user?.roles.includes('Admin');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        projectApi.list()
            .then(setProjects)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await projectApi.create(newProject);
            setShowModal(false);
            setNewProject({ title: '', description: '', visibility: 'INTERN' });
            loadProjects();
        } catch (err) {
            alert('Security clearance error: Could not initialize repository.');
        }
    };

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-slate-900 h-64 rounded-3xl border border-white/5"></div>)}
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight italic">Repositories</h1>
                    <p className="text-slate-500 mt-1">Operational hubs and project workspaces.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search datasets..."
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium"
                        />
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-purple-600/20 active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((p) => (
                    <div key={p._id} className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/50 transition-all group relative overflow-hidden flex flex-col font-sans">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <div className={`p-3 rounded-2xl ${p.visibility === 'INTERN' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'} border border-white/5`}>
                                {p.visibility === 'INTERN' ? <Lock className="w-5 h-5" /> : <Globe2 className="w-5 h-5" />}
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${p.visibility === 'INTERN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                {p.visibility} Level
                            </span>
                        </div>

                        <h3 className="text-2xl font-black mb-3 text-white tracking-tight group-hover:text-purple-400 transition-colors italic">{p.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">{p.description}</p>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-purple-600/20 flex items-center justify-center text-[8px] font-bold text-purple-400">
                                    +12
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group/btn">
                                Access Workspace
                                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}

                {isAdmin && projects.length === 0 && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-900/40 border-2 border-dashed border-white/5 p-8 rounded-[2rem] hover:border-purple-500/20 transition-all group flex flex-col items-center justify-center text-center font-sans h-64"
                    >
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FolderPlus className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-bold mb-1">Empty Registry</p>
                        <p className="text-[10px] text-slate-700 uppercase tracking-widest">Initialize your first workspace</p>
                    </button>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans">
                    <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-[0_0_100px_rgba(147,51,234,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>

                        <h2 className="text-3xl font-black mb-2 text-white italic">New Workspace</h2>
                        <p className="text-slate-500 text-sm mb-8 font-sans">Initialize a new secure data repository.</p>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Workspace Title</label>
                                <input
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-600 outline-none font-medium"
                                    placeholder="e.g. Project Overlord"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 font-sans">Dataset Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-600 outline-none h-32 font-medium"
                                    placeholder="Brief summary of the mission parameters..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Access Protocol</label>
                                <select
                                    value={newProject.visibility}
                                    onChange={(e) => setNewProject({ ...newProject, visibility: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-600 outline-none appearance-none cursor-pointer font-medium"
                                >
                                    <option value="INTERN" className="bg-slate-900">INTERN (Level 1 Clearance)</option>
                                    <option value="EMPLOYEE" className="bg-slate-900">EMPLOYEE (Level 2 Clearance)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl hover:bg-white/5 transition-colors font-black text-xs uppercase tracking-widest text-slate-500 italic">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-purple-600/20 hover:bg-purple-500 transition-all italic">Initialize</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
