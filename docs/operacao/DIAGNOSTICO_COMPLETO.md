# DIAGNOSTICO COMPLETO - Mundo Roberth.0.1
**Data:** 2026-03-13

---

## PROBLEMA IDENTIFICADO

O bot do Telegram (@MundoRoberth_bot) **NAO RESPONDE** porque as Edge Functions estao falhando com erro **400 Bad Request**.

**Evidencia:**
```json
{
  "last_error_message": "Wrong response from the webhook: 400 Bad Request",
  "last_error_date": 1773348451
}
```

---

## CAUSA RAIZ: SECRETS NAO CONFIGURADOS

As Edge Functions precisam de **variaveis de ambiente (secrets)** que NAO estao configuradas no Supabase Dashboard:

| Secret | Status | Necessario Para |
|--------|--------|-----------------|
| `TELEGRAM_BOT_TOKEN` | NAO CONFIGURADO | Enviar respostas ao usuario |
| `OPENAI_API_KEY` | NAO CONFIGURADO | Processar intencoes com IA |
| `SUPABASE_SERVICE_ROLE_KEY` | Possivelmente OK | Operacoes no banco |

---

## COMPARACAO: DOCUMENTO vs IMPLEMENTACAO ATUAL

### O que o documento descreve (Constituicao):

1. **Portal Telegram com Slash Commands:**
   - `/start` - Apresenta o mundo
   - `/ajuda` - Mostra comandos
   - `/pesquisar <tema>` - Cria job de coleta
   - `/analisar <tema>` - Cria job analitico
   - `/status <job_id>` - Mostra estado
   - `/abrir <slug>` - Devolve link
   - `/reprocessar <job_id>` - Relanca job
   - `/config` - Atalho para web app

2. **Fila PGMQ para processamento assincrono:**
   - Job entra na fila
   - Worker consome da fila
   - Processamento em background

3. **Funcoes separadas por responsabilidade:**
   - `telegram-webhook` - Recebe e registra
   - `command-dispatcher` - Enfileira
   - `queue-consumer` - Processa
   - `result-publisher` - Publica resultados

### O que esta implementado atualmente:

1. **Processamento direto (sem slash commands estruturados):**
   - Qualquer texto e enviado para OpenAI
   - OpenAI classifica como task ou event
   - Resposta automatica gerada

2. **Chamada sincrona (sem fila):**
   - `telegram-webhook` chama `process-intent` diretamente
   - Nao usa PGMQ como recomendado

3. **Funcoes implementadas:**
   - `telegram-webhook` - OK (recebe, registra, invoca process-intent)
   - `process-intent` - OK (usa OpenAI GPT-4o-mini)
   - Falta: `command-dispatcher`, `queue-consumer`, `result-publisher`

---

## GAPS IDENTIFICADOS

| # | Gap | Prioridade | Impacto |
|---|-----|------------|---------|
| 1 | Secrets nao configurados | CRITICA | Bot nao funciona |
| 2 | Falta de slash commands | MEDIA | UX limitada |
| 3 | Processamento sincrono vs fila | BAIXA | Pode travar em tarefas pesadas |
| 4 | Falta de comandos /status, /ajuda | MEDIA | Usuario sem feedback |

---

## PLANO DE CORRECAO (ORDEM DE EXECUCAO)

### FASE 1: Resolver Erro 400 (URGENTE)

**Acao:** Configurar secrets nas Edge Functions do Supabase

1. Acessar: https://supabase.com/dashboard/project/yddgsupelmmxjpvnustg/settings/functions
2. Adicionar os seguintes secrets:

```
TELEGRAM_BOT_TOKEN = 8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI
OPENAI_API_KEY = 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
WORLD_TIMEZONE = America/Sao_Paulo
```

3. Re-deploy das Edge Functions

### FASE 2: Testar Bot

Apos configurar secrets:
1. Enviar mensagem no Telegram para @MundoRoberth_bot
2. Verificar se recebe resposta

### FASE 3: Implementar Slash Commands (Opcional)

Adicionar suporte aos comandos descritos na Constituicao:
- /start, /ajuda, /status, etc.

### FASE 4: Migrar para Fila PGMQ (Futuro)

Refatorar para usar processamento assincrono via fila conforme descrito no documento.

---

## INSTRUCOES PARA CONFIGURAR SECRETS

### Passo a Passo:

1. **Abra o Supabase Dashboard:**
   https://supabase.com/dashboard/project/yddgsupelmmxjpvnustg

2. **Va para Settings > Edge Functions:**
   https://supabase.com/dashboard/project/yddgsupelmmxjpvnustg/settings/functions

3. **Clique em "Manage Secrets"**

4. **Adicione cada secret:**
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: `8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI`

   - Name: `OPENAI_API_KEY`
   - Value: (sua chave OpenAI)

   - Name: `WORLD_TIMEZONE`
   - Value: `America/Sao_Paulo`

5. **Salve e aguarde o deploy automatico**

---

## RESUMO

| Item | Status |
|------|--------|
| Webhook configurado | OK |
| Edge Functions deployadas | OK |
| Banco de dados | OK |
| Secrets configurados | **NAO** |
| Bot respondendo | **NAO** |

**Acao necessaria:** Configurar secrets no Supabase Dashboard para o bot comecar a funcionar.
