'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, ArrowRight, Github } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authApi.login({ email, password });
            login(data.token, data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-2xl mb-6 shadow-xl shadow-purple-600/20">
                        <span className="text-2xl font-black text-white italic">S</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back.</h1>
                    <p className="text-slate-500">Enter your credentials to access your terminal.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 font-sans">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-white text-slate-950 font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? 'Processing...' : 'Resume Session'}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <button className="w-full bg-slate-950 border border-white/10 text-slate-400 py-3 rounded-2xl text-sm font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                            <Github className="w-4 h-4" />
                            Continue with GitHub
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-slate-600 text-sm font-medium">
                    Need a clearance level?{' '}
                    <Link href="/register" className="text-purple-500 hover:text-purple-400 underline-offset-4 hover:underline transition-all">
                        Apply for access
                    </Link>
                </p>
            </div>
        </div>
    );
}
