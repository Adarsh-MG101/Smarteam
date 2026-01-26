'use client';

import { useEffect, useState } from 'react';
import { taskApi, projectApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Circle,
    CheckCircle2,
    Clock,
    Calendar,
    User as UserIcon,
    ChevronRight,
    ClipboardList,
    Target
} from 'lucide-react';

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', assignedTo: '' });
    const { user } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, projectsData] = await Promise.all([
                taskApi.myTasks(),
                projectApi.list()
            ]);
            setTasks(tasksData);
            setProjects(projectsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId: string, currentStatus: string) => {
        try {
            const nextStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
            await taskApi.updateStatus(taskId, nextStatus);
            loadData();
        } catch (err) {
            alert('Operational error: Task status could not be synchronized.');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await taskApi.create({ ...newTask, assignedTo: user?.id });
            setShowCreateModal(false);
            setNewTask({ title: '', description: '', projectId: '', assignedTo: '' });
            loadData();
        } catch (err) {
            alert('Mission rejected: Unauthorized task initialization.');
        }
    };

    if (loading) return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-slate-900 h-24 rounded-2xl border border-white/5"></div>)}
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight italic">Operations</h1>
                    <p className="text-slate-500 mt-1">Manage and track your active mission parameters.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    Assign Mission
                </button>
            </div>

            <div className="space-y-4 font-sans">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between group hover:bg-white/5 transition-all gap-6">
                        <div className="flex items-center gap-6 flex-1 w-full font-sans">
                            <button
                                onClick={() => handleStatusUpdate(task._id, task.status)}
                                className={`
                  flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all
                  ${task.status === 'COMPLETED'
                                        ? 'bg-green-500/10 border-green-500/50 text-green-500'
                                        : 'bg-slate-950 border-white/10 text-slate-700 hover:border-purple-500/50 hover:text-purple-400'}
                `}
                            >
                                {task.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>

                            <div className="flex-1 font-sans">
                                <div className="flex items-center gap-3 mb-1 font-sans">
                                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 italic">{task.projectId.title}</span>
                                    {task.status === 'PENDING' && (
                                        <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold uppercase tracking-widest animate-pulse">
                                            <Clock className="w-3 h-3" />
                                            In Progress
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-xl font-bold tracking-tight transition-all italic ${task.status === 'COMPLETED' ? 'text-slate-600 line-through decoration-slate-600' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-slate-500 text-sm mt-1 line-clamp-1">{task.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 font-sans">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/5 rounded-xl">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-500 uppercase italic">
                                ME
                            </div>
                            <button className="p-2 text-slate-700 hover:text-white transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale font-sans">
                        <Target className="w-16 h-16 mb-4 text-slate-500" />
                        <p className="text-lg font-black italic">No Active Missions</p>
                        <p className="text-xs uppercase tracking-[0.2em] font-bold mt-2">Standing by for assignment...</p>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans">
                    <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
                        <h2 className="text-3xl font-black mb-2 text-white italic">Deploy Task</h2>
                        <p className="text-slate-500 text-sm mb-8">Define your operational objectives.</p>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Mission Objective</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                                    placeholder="e.g. System Audit"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Parent Repository</label>
                                <select
                                    value={newTask.projectId}
                                    onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none h-[60px] appearance-none cursor-pointer font-medium"
                                    required
                                >
                                    <option value="" className="bg-slate-900">Select Project...</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id} className="bg-slate-900">{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Strategic Details</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none h-32 font-medium"
                                    placeholder="Task parameters and expected results..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 rounded-2xl hover:bg-white/5 transition-colors font-black text-xs uppercase tracking-widest text-slate-500 italic">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all italic">Deploy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
