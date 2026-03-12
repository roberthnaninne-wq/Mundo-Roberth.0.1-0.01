# RUNTIME DO DASHBOARD WEB (TEATRO)

## Visão Geral
O Dashboard Web é a janela de observação do Mundo Roberth.0.1. Ele foi construído para fornecer uma visão clara do estado das tarefas e do rastro de execuções assíncronas.

## Escolha de Tecnologia: Next.js (App Router)
- **Por que Next.js?** Escolhido por permitir a execução de lógica no servidor (Server Components), facilitando o acesso seguro ao banco de dados sem expor chaves sensíveis ao cliente. Além disso, oferece uma estrutura robusta para autenticação e SSR que serão necessários nas futuras expansões (O Palácio).
- **TypeScript**: Tipagem estrita para evitar falhas de integração no rito.
- **Vanilla CSS (Globals)**: Para máxima flexibilidade estética e controle de performance.

## Segurança e Leitura de Dados
Implementamos o utilitário `lib/supabase-server.ts`. 
- **Estratégia**: Toda a leitura de dados ocorre via **Server-Side Rendering (SSR)**. 
- **SERVICE_ROLE**: O dashboard utiliza a `SERVICE_ROLE_KEY` (configurada via `.env.local`) exclusivamente no ambiente do servidor. Isso permite que os dados sejam lidos ignorando o RLS de usuário logado nesta fase inicial, mas sem nunca enviar essa chave para o navegador do usuário.

## Estrutura de Páginas
1. **O Reino (`/`)**: Visão geral com métricas de tarefas e execuções recentes.
2. **Tarefas (`/tasks`)**: Biblioteca completa de tarefas criadas via Telegram.
3. **Execuções (`/jobs`)**: Auditoria técnica de cada Job PGMQ, incluindo o rastro detalhado de eventos.

## Design System (Premium Theater)
- **Tema**: Dark Mode profundo (`#0a0a0b`).
- **Glassmorphism**: Sidebar e Cards utilizam efeitos de transparência e desfoque.
- **Tipografia**: 'Outfit' (Google Fonts) para um visual moderno e limpo.
- **Interatividade**: Efeitos de hover brilhantes em cards (`glow-card`).

## O que ainda não foi implementado
- **Escrita de Dados**: O dashboard é atualmente apenas de leitura. Edição e deleção de tarefas serão implementadas na Sprint de Governança.
- **Autenticação Administrativa**: O acesso é livre para quem possui a URL. O próximo ciclo de segurança envolverá Supabase Auth para restringir o acesso apenas ao Roberth.
