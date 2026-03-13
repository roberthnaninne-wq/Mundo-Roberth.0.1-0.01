"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Painel' },
  { href: '/biblioteca', label: 'Biblioteca' },
  { href: '/jobs', label: 'Execuções' },
  { href: '/configuracoes', label: 'Configurações' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <h1 className="text-xl tracking-[0.2em] uppercase font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                Mundo Roberth
              </h1>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm tracking-wider uppercase transition-all ${
                      isActive
                        ? 'text-black font-medium'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden md:inline tracking-wide">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link href="/login" className="text-sm tracking-wider uppercase text-gray-600 hover:text-black">
                  Entrar
                </Link>
              )}

              {/* Dropdown Menu */}
              {showUserMenu && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-lg animate-fadeIn">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Logado como</p>
                    <p className="text-sm text-black truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/configuracoes"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Mundo Roberth. Soberania Digital.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-400 tracking-wider uppercase">
                Versão 0.1
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
