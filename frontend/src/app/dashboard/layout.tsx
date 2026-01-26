'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    ShieldAlert,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    Bell
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Initializing Session...</p>
            </div>
        );
    }

    const isAdmin = user.roles.includes('Admin');

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Projects', href: '/dashboard/projects', icon: <FolderKanban className="w-5 h-5" /> },
        { name: 'My Tasks', href: '/dashboard/tasks', icon: <CheckSquare className="w-5 h-5" /> },
        ...(isAdmin ? [
            { name: 'Admin Hub', href: '/dashboard/admin', icon: <ShieldAlert className="w-5 h-5 text-purple-400" /> }
        ] : [])
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Mobile Header */}
            <div className="lg:hidden h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">S</div>
                    <span className="font-bold">Smarteam</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 px-6 py-8 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">S</div>
                    <div>
                        <span className="text-xl font-bold block tracking-tight">Smarteam</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enterprise OS</span>
                    </div>
                </div>

                <nav className="space-y-2 flex flex-col font-sans">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-semibold
                ${pathname === item.href
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-10 left-6 right-6 font-sans">
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-72 min-h-screen">
                <header className="hidden lg:flex h-20 border-b border-white/5 px-10 items-center justify-between sticky top-0 bg-slate-950/50 backdrop-blur-xl z-30">
                    <div>
                        <h2 className="text-lg font-bold text-white">{navItems.find(i => i.href === pathname)?.name || 'Dashboard'}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_green]"></span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Status: Live Data</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-slate-950"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-white/5"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-white leading-none mb-1">{user.name}</p>
                                <p className="text-[10px] text-purple-400 font-black uppercase tracking-tighter leading-none">{user.roles[0]}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center font-bold text-white ring-2 ring-purple-500/20 ring-offset-2 ring-offset-slate-950">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10 font-sans">
                    {children}
                </div>
            </main>
        </div>
    );
}
