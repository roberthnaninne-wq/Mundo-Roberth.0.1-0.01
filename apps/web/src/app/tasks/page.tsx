import { createClient } from '@/utils/supabase/server';
import { ListTodo, Calendar, Hash, Tag, MoreVertical } from 'lucide-react';

import TaskStatusSelect from './StatusSelect';

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Biblioteca de Tarefas</h2>
          <p className="text-zinc-500 mt-1">Governança administrativa e controle de missões</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-zinc-400">
          {tasks?.length || 0} Tarefas
        </div>
      </header>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500"><div className="flex items-center gap-2"><Hash size={14} /> ID</div></th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500"><div className="flex items-center gap-2"><Tag size={14} /> Título</div></th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500"><div className="flex items-center gap-2"><Calendar size={14} /> Prazo</div></th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Governança</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tasks?.map((task) => (
              <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 font-mono text-[10px] text-zinc-500">#{task.id.split('-')[0]}</td>
                <td className="p-4">
                  <div className="font-semibold text-sm">{task.title}</div>
                  <div className="text-xs text-zinc-500 truncate max-w-xs">{task.description}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                    task.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-primary/20 text-primary'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-zinc-400">
                  {task.due_at ? new Date(task.due_at).toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="p-4 text-xs text-zinc-500">
                   <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
                </td>
              </tr>
            ))}
            {(!tasks || tasks.length === 0) && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-zinc-500 text-sm italic">
                  Nenhuma tarefa encontrada ou acesso negado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
