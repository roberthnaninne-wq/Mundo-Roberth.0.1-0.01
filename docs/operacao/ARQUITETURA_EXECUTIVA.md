# ARQUITETURA EXECUTIVA DO MUNDO ROBERTH.0.1

O ecossistema é suportado e estruturado unicamente nas seguintes ferramentas, papéis e fluxogramas:

## Ponto de Contato Humano
1. **Telegram:** O canal conversacional que despacha pacotes (intenções do usuário).
2. **Dashboard Web (Next.js/React):** O visualizador. Onde o usuário pode consultar a "Biblioteca" (dados pós-processados de RAG), verificar as "Execuções" (status dos jobs na Fila) e alterar o "Palácio de Configurações". TUDO ESTREITAMENTE GOVERNADO POR RLS RESTAURANDO SEU PROFILE_ID.

## A Soberania (Backend & Dados)
1. **Supabase Postgres (DB):** Centro neurológico do Mundo. Se um dado ou configuração não está aqui, ela não existe.
2. **Supabase Auth / Policies:** O guarda da fronteira da leitura. O dashboard só lê o que o RLS permite baseado em sessão.
3. **Supabase Storage:** Galpão de armazenamento do projeto, apenas para *blobs* (imagens/pdf).
4. **Supabase Edge Functions:** O servidor esbelto. Substitui infraestruturas pesadas de NodeJS. Executam as *coordenações server-side* - ex: recebem webhook do Telegram, enviam pra fila, fazem API Call.
5. **Supabase Queue (pgmq/pg_cron):** O coração escalável. A infraestrutura de processamento pesado, IA e tarefas longas devem obrigatoriamente cair na fila.

## DevOps e Controle de Fonte
1. **GitHub:** Repositório Mestre `Mundo-Roberth.0.1`.
2. **Antigravity CLI (Agent):** O executor material, condicionado a seguir rigoroso rito metodológico de ciclos para propor qualquer modificação nestas camadas estruturais.
