"use client";

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      } else {
        router.push('/login?message=Conta criada! Verifique seu email ou faça login.');
        setMode('login');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-[#0a0a0b] via-[#0f0f12] to-[#0a0a0b]">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative glass w-full max-w-md p-8 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold title-gradient tracking-tight">Portal do Reino</h1>
            <p className="text-zinc-500 mt-2 text-sm">Acesso restrito ao Administrador do Mundo Roberth.0.1</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-primary text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-primary text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Registrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Email Real
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu-email@exemplo.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Senha do Palácio
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                {mode === 'login' ? 'Entrar no Reino' : 'Criar Conta'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {searchParams?.message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {searchParams.message}
          </div>
        )}

        {searchParams?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {searchParams.error}
          </div>
        )}

        <p className="text-center text-xs text-zinc-600">
          Protegido por Supabase Auth + Row Level Security
        </p>
      </div>
    </div>
  )
}
