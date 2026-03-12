import { createClient } from '@/utils/supabase/server';
import { ListTodo, Activity, Clock, Terminal } from 'lucide-react';

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      job_events (
        status,
        message,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Audit de Execuções</h2>
        <p className="text-zinc-500 mt-1">Monitoramento protegido das automações (RLS Ativa)</p>
      </header>

      <div className="space-y-4">
        {jobs?.map((job) => (
          <div key={job.id} className="glass rounded-2xl p-6 hover:border-accent/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  <Activity size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">ID: {job.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      job.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-primary text-black'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mt-1 flex items-center gap-2">
                    {job.workflow_key || 'Processamento de Intenção'}
                  </h4>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 text-zinc-500 text-xs justify-end">
                  <Clock size={14} />
                  {new Date(job.created_at).toLocaleString('pt-BR')}
                </div>
                <div className="mt-2 flex gap-2 justify-end">
                  {(job.result as any)?.intent_key && (
                    <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-semibold text-accent uppercase">
                      {(job.result as any).intent_key}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Inline Events Audit */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 flex items-center gap-2">
                <Terminal size={12} /> Rastro de Eventos
              </h5>
              <div className="space-y-3">
                {job.job_events?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-4 group/item">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-zinc-700 mt-1 group-hover/item:bg-accent transition-colors"></div>
                      {idx < job.job_events.length - 1 && <div className="w-[1px] flex-1 bg-zinc-800 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-[10px] font-mono text-zinc-600 mr-2">{new Date(event.created_at).toLocaleTimeString('pt-BR')}</span>
                      <span className="text-xs font-bold text-zinc-400 border-r border-zinc-800 pr-2 mr-2 whitespace-nowrap">{event.status}</span>
                      <span className="text-xs text-zinc-500">{event.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {(!jobs || jobs.length === 0) && (
          <div className="glass p-12 rounded-2xl text-center text-zinc-500 italic">
            Nenhuma atividade no rastro de execução ou você não tem permissão.
          </div>
        )}
      </div>
    </div>
  );
}
