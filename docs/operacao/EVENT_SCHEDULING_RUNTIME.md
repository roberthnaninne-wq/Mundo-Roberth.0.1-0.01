# AGENDAMENTO DE EVENTOS (EVENT SCHEDULING)

## Visão Geral
A ação `event_scheduling` permite que o Mundo Roberth.0.1 organize compromissos, reuniões e eventos datados em um calendário local. Esta ação é disparada quando a IA detecta uma intenção de agendamento com data e hora específicas.

## Inteligência Temporal
Diferente da criação de tarefas simples, o agendamento de eventos utiliza um **Contexto Temporal Dinâmico**:
1. **Injeção de Tempo**: O worker injeta o `Horário Atual` e o `Timezone` (America/Sao_Paulo) no prompt da IA.
2. **Interpretação Relativa**: A IA é instruída a converter expressões como "amanhã", "hoje às 19h" ou "próxima sexta" em strings ISO8601 exatas.
3. **Fuso Horário**: Toda a persistência é feita em `TIMESTAMPTZ` para garantir que o tempo seja absoluto.

## Tabela: `public.calendar_events`
- **Campos Principais**:
    - `title`: O nome do evento.
    - `start_at`: Início do compromisso (ISO8601).
    - `end_at`: Fim do compromisso (opcional).
    - `all_day`: Booleano para eventos sem hora marcada.

## Idempotência
Utilizamos o `created_from_job_id` como chave de unicidade. Isso garante que um mesmo Job da fila PGMQ nunca crie o mesmo evento duas vezes, tornando o sistema resiliente a retentativas de rede ou falhas do worker.

## Fluxo de Resposta
1. A IA decide pela ação `event_scheduling`.
2. O worker valida o payload e insere no banco.
3. O Telegram recebe uma confirmação com o ícone de calendário 📅 e os detalhes do agendamento.

## Limitações Atuais
- Atualmente, o calendário é apenas local.
- Não há detecção de conflitos de horário (será implementado na Sprint de Consciência Avançada).
- O encerramento automático do evento (`end_at`) é estimado pela IA se não for fornecido explicitamente.
