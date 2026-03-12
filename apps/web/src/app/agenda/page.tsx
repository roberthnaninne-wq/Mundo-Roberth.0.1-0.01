import { createClient } from '@/utils/supabase/server';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .order('start_at', { ascending: true });

  // Group events by day
  const groupedEvents = events?.reduce((acc: any, event) => {
    const date = new Date(event.start_at).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Oráculo da Agenda</h2>
          <p className="text-zinc-500 mt-1">Sincronia temporal e compromissos do reino</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 flex items-center gap-2">
          <CalendarIcon size={14} className="text-emerald-500" />
          {events?.length || 0} Eventos
        </div>
      </header>

      <div className="space-y-12">
        {groupedEvents && Object.entries(groupedEvents).map(([date, dayEvents]: [string, any]) => (
          <section key={date} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 sticky top-0 py-2 bg-[#0a0a0b]/80 backdrop-blur-md z-10 border-b border-white/5">
              {date}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {dayEvents.map((event: any) => (
                <div key={event.id} className="glass rounded-2xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                  {/* Decorative background glow for time-sensitive events */}
                  {!event.all_day && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[80px] py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                        {event.all_day ? (
                          <span className="text-[10px] font-black uppercase text-emerald-500">Dia Todo</span>
                        ) : (
                          <>
                            <span className="text-lg font-bold tabular-nums">
                              {new Date(event.start_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">Início</span>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-zinc-500 mt-2 max-w-xl leading-relaxed">{event.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          {!event.all_day && event.end_at && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                              <Clock size={14} />
                              Até {new Date(event.end_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <CheckCircle2 size={14} className={event.status === 'confirmed' ? 'text-emerald-500' : 'text-zinc-600'} />
                            <span className="capitalize">{event.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-start md:items-end gap-2">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                         event.all_day ? 'bg-primary/20 text-primary' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                       }`}>
                         {event.all_day ? 'Evento' : 'Compromisso'}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {(!events || events.length === 0) && (
          <div className="glass p-20 rounded-3xl text-center">
            <div className="p-4 bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <CalendarIcon size={32} className="text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold">O futuro está limpo</h3>
            <p className="text-zinc-500 mt-2">Nenhum evento agendado no Oráculo até o momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
