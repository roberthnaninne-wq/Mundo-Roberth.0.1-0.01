import { createClient } from '@/utils/supabase/server';
import { Search, FileText, Calendar, ExternalLink, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';

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
    <div className="animate-fadeIn">
      {/* Header */}
      <section className="bg-black text-white py-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">
            Arquivo Vivo
          </p>
          <h1 className="text-4xl lg:text-5xl font-light mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Biblioteca
          </h1>
          <p className="text-gray-400 max-w-xl">
            {count || 0} documentos coletados e estruturados.
            Pesquise, filtre e explore o conhecimento do reino.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 px-8 lg:px-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-4 focus:border-black transition-colors outline-none text-sm"
              />
            </div>
            <select className="bg-white border border-gray-200 px-4 py-4 text-gray-600 focus:border-black transition-colors outline-none text-sm min-w-[180px]">
              <option value="">Todas as Fontes</option>
              {sources?.map((source) => (
                <option key={source.id} value={source.source_key}>
                  {source.source_name}
                </option>
              ))}
            </select>
            <select className="bg-white border border-gray-200 px-4 py-4 text-gray-600 focus:border-black transition-colors outline-none text-sm min-w-[150px]">
              <option value="">Status</option>
              <option value="collected">Coletado</option>
              <option value="normalized">Normalizado</option>
              <option value="analyzed">Analisado</option>
              <option value="published">Publicado</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16 px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc) => (
                <article
                  key={doc.id}
                  className="border border-gray-200 p-8 hover:border-black transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <FileText size={24} className="text-gray-400 group-hover:text-black transition-colors" />
                    <span className={`text-xs uppercase tracking-wider px-3 py-1 ${
                      doc.document_status === 'published' ? 'bg-green-50 text-green-600 border border-green-200' :
                      doc.document_status === 'analyzed' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {doc.document_status || 'coletado'}
                    </span>
                  </div>

                  <h3 className="text-lg mb-3 group-hover:text-gray-600 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {doc.title || 'Documento sem titulo'}
                  </h3>

                  {doc.summary && (
                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                      {doc.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(doc.collected_at || doc.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {doc.external_url && (
                      <a
                        href={doc.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors"
                      >
                        <ExternalLink size={12} />
                        Fonte
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                Biblioteca Vazia
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Ainda nao ha documentos no Arquivo Vivo. Use o bot do Telegram para coletar
                informacoes e elas aparecerao aqui automaticamente.
              </p>
              <Link
                href="/configuracoes"
                className="inline-flex items-center gap-2 px-6 py-3 border border-black text-black text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all"
              >
                Configurar Bot
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {documents && documents.length > 0 && (
        <section className="py-8 px-8 lg:px-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex justify-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 text-sm bg-black text-white">
              1
            </button>
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Proximo
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
