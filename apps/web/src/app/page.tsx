import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowRight, Zap, BookOpen, Activity, Settings } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch metrics
  const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
  const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  const { count: documentsCount } = await supabase.from('documents').select('*', { count: 'exact', head: true });
  const { data: recentJobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section - Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left Side - Dark */}
        <div className="bg-black text-white flex flex-col justify-center px-8 lg:px-16 py-16">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Soberania Digital
          </p>
          <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            MUNDO<br />ROBERTH
          </h1>
          <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
            Centro de comando para automação e gestão inteligente.
            Sua soberania digital em um único lugar.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/biblioteca"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white text-white text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all"
            >
              Explorar
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/configuracoes"
              className="inline-flex items-center gap-3 px-6 py-3 text-gray-400 text-sm tracking-wider uppercase hover:text-white transition-all"
            >
              Configurar
            </Link>
          </div>
        </div>

        {/* Right Side - Stats Overview */}
        <div className="bg-gray-50 flex items-center justify-center p-8 lg:p-16">
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Tarefas</p>
              <p className="text-4xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>{tasksCount || 0}</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Execuções</p>
              <p className="text-4xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>{jobsCount || 0}</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Documentos</p>
              <p className="text-4xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>{documentsCount || 0}</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Status</p>
              </div>
              <p className="text-2xl font-light mt-2" style={{ fontFamily: 'var(--font-serif)' }}>Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Acesso Rápido
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            Navegue pelas principais áreas do seu sistema de soberania digital
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/biblioteca" className="group">
              <div className="border border-gray-200 p-8 hover:border-black transition-all">
                <BookOpen size={32} className="text-gray-400 group-hover:text-black transition-colors mb-6" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Biblioteca</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Acesse todos os documentos e arquivos do reino digital
                </p>
                <div className="flex items-center gap-2 mt-6 text-sm text-gray-400 group-hover:text-black transition-colors">
                  <span className="uppercase tracking-wider">Acessar</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link href="/jobs" className="group">
              <div className="border border-gray-200 p-8 hover:border-black transition-all">
                <Activity size={32} className="text-gray-400 group-hover:text-black transition-colors mb-6" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Execuções</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Monitore todas as automações e jobs em tempo real
                </p>
                <div className="flex items-center gap-2 mt-6 text-sm text-gray-400 group-hover:text-black transition-colors">
                  <span className="uppercase tracking-wider">Acessar</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link href="/configuracoes" className="group">
              <div className="border border-gray-200 p-8 hover:border-black transition-all">
                <Settings size={32} className="text-gray-400 group-hover:text-black transition-colors mb-6" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Configurações</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Personalize o sistema e gerencie integrações
                </p>
                <div className="flex items-center gap-2 mt-6 text-sm text-gray-400 group-hover:text-black transition-colors">
                  <span className="uppercase tracking-wider">Acessar</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-20 px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                Atividade Recente
              </h2>
              <p className="text-gray-500 mt-2">Últimas execuções do sistema</p>
            </div>
            <Link
              href="/jobs"
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentJobs?.map((job, index) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 p-6 flex items-center justify-between hover:border-black transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${
                    job.status === 'completed' ? 'bg-green-500' :
                    job.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[300px]">{job.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(job.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-500 border border-gray-200 px-3 py-1">
                  {job.status}
                </span>
              </div>
            ))}
            {(!recentJobs || recentJobs.length === 0) && (
              <div className="text-center py-16 text-gray-500">
                <Zap size={32} className="mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
