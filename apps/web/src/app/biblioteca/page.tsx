import { createClient } from '@/utils/supabase/server';
import { BookOpen, Search, Filter, FileText, Calendar, Tag, ExternalLink, Download } from 'lucide-react';

export default async function BibliotecaPage() {
  const supabase = await createClient();

  // Fetch documents from database
  const { data: documents, count } = await supabase
    .from('documents')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch sources for filters
  const { data: sources } = await supabase
    .from('sources')
    .select('id, source_name, source_key')
    .eq('is_active', true);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="text-primary" />
            Biblioteca do Reino
          </h2>
          <p className="text-zinc-500 mt-1">
            {count || 0} documentos coletados e estruturados no Arquivo Vivo
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
            <Filter size={16} />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar documentos por titulo, conteudo ou tags..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 focus:outline-none focus:border-primary transition-all min-w-[180px]">
            <option value="">Todas as Fontes</option>
            {sources?.map((source) => (
              <option key={source.id} value={source.source_key}>
                {source.source_name}
              </option>
            ))}
          </select>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 focus:outline-none focus:border-primary transition-all min-w-[150px]">
            <option value="">Status</option>
            <option value="collected">Coletado</option>
            <option value="normalized">Normalizado</option>
            <option value="analyzed">Analisado</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="glass rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <FileText size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                  doc.document_status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                  doc.document_status === 'analyzed' ? 'bg-primary/10 text-primary' :
                  'bg-white/5 text-zinc-400'
                }`}>
                  {doc.document_status || 'collected'}
                </span>
              </div>

              <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {doc.title || 'Documento sem titulo'}
              </h3>

              {doc.summary && (
                <p className="text-sm text-zinc-500 line-clamp-3 mb-4">
                  {doc.summary}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-zinc-600 mt-auto pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(doc.collected_at || doc.created_at).toLocaleDateString('pt-BR')}
                </span>
                {doc.external_url && (
                  <a
                    href={doc.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={12} />
                    Fonte
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <BookOpen size={32} className="text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-400 mb-2">Biblioteca Vazia</h3>
          <p className="text-zinc-600 max-w-md mx-auto">
            Ainda nao ha documentos no Arquivo Vivo. Use o bot do Telegram para coletar
            informacoes e elas aparecerao aqui automaticamente.
          </p>
        </div>
      )}

      {/* Pagination placeholder */}
      {documents && documents.length > 0 && (
        <div className="flex justify-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-colors">
            Anterior
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white">1</button>
          <button className="px-4 py-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-colors">
            2
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-colors">
            Proximo
          </button>
        </div>
      )}
    </div>
  );
}
