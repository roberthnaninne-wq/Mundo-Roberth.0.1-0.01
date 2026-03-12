# ROTEAMENTO DE AÇÕES (ACTION ROUTING)

## Visão Geral
O Roteamento de Ações transforma o Mundo Roberth.0.1 de um sistema passivo em um sistema ativo. A Camada Cognitiva (`process-intent`) agora atua como um decisor executivo.

## Como Funciona a Decisão
O modelo de IA (Gemini 1.5 Flash) recebe a instrução de sistema contendo uma lista de **Ações Disponíveis**. Ele deve retornar um JSON que especifica:
- `action_key`: O identificador da ação a ser tomada.
- `should_execute_action`: Um booleano que confirma a intenção de execução.
- `action_payload`: Os dados necessários para a ação (ex: título e data da tarefa ou horários do evento).

## Ação: `task_creation`
Esta é a primeira ação oficial. 
- **Trigger**: Intenções relacionadas a lembretes, tarefas ou compromissos sem hora exata.
- **Execução**: Inserção na tabela `public.tasks`.

## Ação: `event_scheduling`
Introduzida na SPRINT 6 para gestão de compromissos datados.
- **Trigger**: Intenções de reuniões, agendamentos ou eventos com data/hora.
- **Execução**: Inserção na tabela `public.calendar_events`.
- **Especialidade**: Requer parsing temporal preciso (ISO8601).
- **Idempotência**: Utilizamos o `created_from_job_id` como chave de unicidade em ambas as tabelas. Isso garante que, se o worker re-executar o mesmo Job, uma ação duplicada não será criada.

## Fallback Conversacional
Se a IA decidir que `action_key` é `none`, o sistema ignora a fase de execução e apenas envia a resposta textual (`response_text`) ao usuário, mantendo o fluxo fluido e natural.

## Detalhes Técnicos de Implementação
- **Idempotência no Postgres**: Chave `UNIQUE (created_from_job_id)`.
- **Registro de Eventos**: Cada execução de ação gera um `job_event` específico para auditoria.
- **Resultado Rico**: O campo `jobs.result` contém agora tanto a análise da IA quanto o detalhe da execução técnica.
