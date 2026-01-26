'use client';

import Link from 'next/link';
import { Lock, BarChart3, FolderGit2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">Smarteam</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-slate-200 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-400/10 border border-purple-400/20 rounded-full">
            <Zap className="w-3 h-3 fill-current" />
            V4.0
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
            Manage projects with <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">absolute precision.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            The ultimate Role-Based Access Control (RBAC) platform for teams that demand
            security, transparency, and high performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-500 transition-all text-lg shadow-2xl shadow-purple-600/20"
            >
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-purple-400" />}
            title="Advanced RBAC"
            desc="Dynamic roles and permissions engine that scale as your organization grows."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-blue-400" />}
            title="Graded Performance"
            desc="Task-level analytics with automated grade point calculations for every member."
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8 text-green-400" />}
            title="Scoped Visibility"
            desc="Military-grade scoping for projects based on hierarchy and clearance levels."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold">S</div>
          <span className="text-sm font-semibold text-slate-400">© 2026 Smarteam.</span>
        </div>
        <div className="flex gap-8 text-xs text-slate-600 font-medium">
          <a href="#" className="hover:text-slate-400">Documentation</a>
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-purple-500/30 transition-all group hover:bg-white/10">
      <div className="mb-6 p-4 bg-slate-950/50 w-fit rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
