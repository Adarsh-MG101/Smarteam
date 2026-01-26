'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleName, setRoleName] = useState('Intern');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authApi.register({ name, email, password, roleName });
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 font-sans">
            {/* Left Side: Illustration/Text */}
            <div className="hidden lg:flex flex-col justify-center px-16 bg-slate-900/50 border-r border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 flex flex-wrap opacity-20">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className="w-8 h-8 border-[0.5px] border-white/5"></div>
                    ))}
                </div>

                <div className="max-w-md relative z-10 font-sans">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-10 italic">S</div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">Start your journey with Smarteam.</h2>
                    <p className="text-slate-400 text-lg mb-12">Join thousands of teams managing critical infrastructure with our advanced RBAC engine.</p>

                    <div className="space-y-6 flex flex-col font-sans">
                        <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} text="Instant role assignment" />
                        <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} text="Military-grade security" />
                        <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} text="Real-time performance metrics" />
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center px-6 py-12 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10 lg:hidden text-center">
                        <div className="inline-flex w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center font-black text-2xl mb-4 italic">S</div>
                        <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                        <h2 className="hidden lg:block text-2xl font-bold text-white mb-8">Register Identity</h2>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputGroup label="Full Name" icon={<User className="w-5 h-5" />} value={name} onChange={setName} placeholder="John Doe" />
                            <InputGroup label="Email" icon={<Mail className="w-5 h-5" />} value={email} onChange={setEmail} placeholder="john@example.com" type="email" />
                            <InputGroup label="Password" icon={<Lock className="w-5 h-5" />} value={password} onChange={setPassword} placeholder="••••••••" type="password" />

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Clearance Level</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors pointer-events-none" />
                                    <select
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="Intern" className="bg-slate-900">Intern (Level 1)</option>
                                        <option value="Employee" className="bg-slate-900">Employee (Level 2)</option>
                                    </select>

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group mt-6 bg-purple-600 text-white font-black py-4 rounded-2xl hover:bg-purple-500 transition-all shadow-2xl shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                <span className="flex items-center justify-center">
                                    {loading ? 'Creating Identity...' : 'Confirm Registration'}
                                    {!loading && <ArrowRight className="ml-2 w-4 h-4 animate-pulse" />}
                                </span>
                            </button>
                        </form>
                    </div>

                    <p className="mt-10 text-center text-slate-600 text-sm font-medium">
                        Already cleared for access?{' '}
                        <Link href="/login" className="text-purple-500 hover:underline transition-all">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-4 text-slate-300 font-medium">
            <div className="flex-shrink-0">{icon}</div>
            <span className="font-sans">{text}</span>
        </div>
    );
}

function InputGroup({ label, icon, value, onChange, placeholder, type = 'text' }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 font-sans">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors h-5 w-5 flex items-center justify-center">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium font-sans"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}
