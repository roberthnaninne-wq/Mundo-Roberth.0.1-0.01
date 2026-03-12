import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, ListTodo, Activity, Zap } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch metrics (Authenticated)
  const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
  const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  const { data: recentJobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5);
  const { data: upcomingEvents } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(3);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">O Reino Digital</h2>
        <p className="text-zinc-500 mt-1">Visão geral da soberania e automação do Mundo Roberth.0.1 (Ambiente Protegido)</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl glow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <ListTodo size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">ATIVO</span>
          </div>
          <h3 className="text-zinc-400 text-sm font-medium">Total de Tarefas</h3>
          <p className="text-3xl font-bold mt-1 tabular-nums">{tasksCount || 0}</p>
        </div>

        <div className="glass p-6 rounded-2xl glow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">FILA VIVA</span>
          </div>
          <h3 className="text-zinc-400 text-sm font-medium">Execuções (Jobs)</h3>
          <p className="text-3xl font-bold mt-1 tabular-nums">{jobsCount || 0}</p>
        </div>

        <div className="glass p-6 rounded-2xl glow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2 py-1 rounded-lg">v0.1</span>
          </div>
          <h3 className="text-zinc-400 text-sm font-medium">Status do Sistema</h3>
          <p className="text-lg font-semibold mt-1">Operacional</p>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_10px_#10b981]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Widget */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap size={20} className="text-emerald-500" />
              Próximos Compromissos
            </h3>
            <Link href="/agenda" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents?.map((event) => (
              <div key={event.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col items-center justify-center min-w-[50px] bg-emerald-500/10 rounded-lg text-emerald-500 font-bold">
                  <span className="text-[10px] uppercase">
                    {new Date(event.start_at).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                  <span className="text-lg leading-none">
                    {new Date(event.start_at).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{event.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {event.all_day ? 'Dia Todo' : new Date(event.start_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {(!upcomingEvents || upcomingEvents.length === 0) && (
              <p className="text-sm text-zinc-500 text-center py-6 italic">Nenhum compromisso pendente.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity size={20} className="text-accent" />
            Execuções Recentes
          </h3>
          <div className="space-y-4">
            {recentJobs?.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-primary'}`}></div>
                  <div>
                    <p className="text-sm font-bold truncate max-w-[200px]">{job.id}</p>
                    <p className="text-xs text-zinc-500">{new Date(job.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-right px-4 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {job.status}
                </div>
              </div>
            ))}
            {(!recentJobs || recentJobs.length === 0) && (
              <p className="text-sm text-zinc-500 text-center py-6">Nenhuma atividade recente no reino.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
