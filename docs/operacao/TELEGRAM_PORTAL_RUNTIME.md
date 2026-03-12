# RUNTIME DO PORTAL TELEGRAM

## O Telegram é a Fronteira
A função `telegram-webhook` é o vigia da fronteira do Mundo Roberth.0.1. Ela não resolve os problemas do usuário, ela os absorve, atrista na máquina burocrática (o BD) e delega.

## Regras de Sobrevivência do Portal
1. **Velocidade Bruta:** A função tem menos de 3 Segundos lógicos para dar parsing no JSON, inferir quem é o sujeito e dar `ok` pro Telegram, senão o Telegram julga timeout e reenvia a mensagem 5 vezes criando duplicação.
2. **Upsert Universal:** O Telegram envia um `from.id` (number). O Portal precisa mapear isso num UUID do PostgreSQL interno imediatamente (Tabela `user_profiles`). O Service Role Key é a credencial restrita que ela usa para isso. NUNCA a vazamos.
3. **Bloqueio de Span Assíncrono:** Ao invés de ficar "pensando" na resposta do bot dentro desta tela, ela apenas despacha pra tabela `jobs`.
4. **Respostas Tranquilizadoras:** A única coisa que o Portal Webhook tem permissão de disparar pro Telegram via `/sendMessage` é a confimação rápida: "Processando...". Todo o resto (resultado final, links) é papel do Job Worker no final da esteira.
