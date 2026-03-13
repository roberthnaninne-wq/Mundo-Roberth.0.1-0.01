"use client";

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

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
        setError(error.message);
        setLoading(false);
        return;
      }
      setError('Verifique seu email para confirmar o cadastro');
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 lg:px-20 py-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <h1 className="text-2xl tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Mundo Roberth
          </h1>
          <p className="text-sm text-gray-500 tracking-wider uppercase mb-12">
            Soberania Digital
          </p>

          {/* Mode Tabs */}
          <div className="flex gap-8 mb-10 border-b border-gray-200">
            <button
              onClick={() => setMode('login')}
              className={`pb-4 text-sm tracking-wider uppercase transition-all ${
                mode === 'login'
                  ? 'text-black border-b-2 border-black -mb-[2px]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`pb-4 text-sm tracking-wider uppercase transition-all ${
                mode === 'register'
                  ? 'text-black border-b-2 border-black -mb-[2px]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Registrar
            </button>
          </div>

          {/* Error/Success Message */}
          {(error || searchParams?.error || searchParams?.message) && (
            <div className={`mb-6 p-4 border ${
              searchParams?.message ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
            } text-sm`}>
              {error || searchParams?.error || searchParams?.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 focus:border-black transition-colors outline-none text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="********"
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 focus:border-black transition-colors outline-none text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-sm text-gray-500 mt-8">
              Esqueceu a senha?{' '}
              <button className="text-black hover:underline">
                Recuperar acesso
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Dark Background */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-black text-white p-16">
        <div className="max-w-lg text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8">
            Centro de Comando
          </p>
          <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Sua soberania digital<br />em um único lugar
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Gerencie suas automações, documentos e integrações
            com elegância e eficiência.
          </p>
        </div>
      </div>
    </div>
  );
}
