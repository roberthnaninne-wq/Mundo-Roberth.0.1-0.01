import Link from 'next/link';
import { Home, ListTodo, Activity, ShieldCheck, LogOut, User, Calendar } from 'lucide-react';
import { logout } from '@/app/tasks/actions';
import { createClient } from '@/utils/supabase/server';

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <aside className="w-64 h-screen glass border-r border-slate-800 p-6 flex flex-col fixed left-0 top-0">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold title-gradient tracking-tight">MUNDO ROBERTH</h1>
        <p className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase mt-1">Soberania Digital 0.1</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-zinc-400 hover:text-white group">
          <Home size={20} className="group-hover:text-primary transition-colors" />
          <span className="font-medium">O Reino</span>
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-zinc-400 hover:text-white group">
          <ListTodo size={20} className="group-hover:text-secondary transition-colors" />
          <span className="font-medium">Tarefas</span>
        </Link>
        <Link href="/agenda" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-zinc-400 hover:text-white group">
          <Calendar size={20} className="group-hover:text-emerald-500 transition-colors" />
          <span className="font-medium">Agenda</span>
        </Link>
        <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-zinc-400 hover:text-white group">
          <Activity size={20} className="group-hover:text-accent transition-colors" />
          <span className="font-medium">Execuções</span>
        </Link>
      </nav>

      <div className="mt-auto space-y-4">
        {user && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Administrador</p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
            <form action={logout}>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-all">
                <LogOut size={14} /> Sair do Palácio
              </button>
            </form>
          </div>
        )}
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600">
          <ShieldCheck size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Modo Governança</span>
        </div>
      </div>
    </aside>
  );
}
