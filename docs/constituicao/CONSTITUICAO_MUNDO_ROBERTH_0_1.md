# CONSTITUIÇÃO DO MUNDO ROBERTH.0.1

Estas são as 10 Leis Inegociáveis que regem toda e qualquer linha de código inscrita neste repositório. O rompimento de qualquer uma destas leis exige *rollback* imediato da modificação.

## AS 10 LEIS INEGOCIÁVEIS DO MUNDO

**LEI 1**
Nunca tratar o projeto como uma simples pasta dentro do Supabase. O projeto é um ecossistema complexo (monorepo) que consome o Supabase.

**LEI 2**
Nunca usar HTML (ou front-end client-side) como fonte primária da verdade ou regras de negócios críticas. O HTML é escravo do banco de dados e APIs.

**LEI 3**
Nunca usar a chave *Service Role* no front-end ou expô-la publicamente. Ela pertence exclusivamente às Edge Functions e rotinas de Backend/DevOps.

**LEI 4**
Nunca colocar segredos (API keys externas, tokens sensíveis) hardcoded no navegador ou em variáveis de ambiente `.env.local` que possam vazar no React/Next.js (ex: `NEXT_PUBLIC_`). Usar Supabase Vault e Edge Functions como intermediários.

**LEI 5**
Nunca manipular diretamente o schema interno do Storage como se fosse API de arquivos no banco. Usar clients do Storage propriamente, armazenando metadados atados (ex: `document_id`) nas nossas tabelas públicas.

**LEI 6**
Sempre tratar o Postgres (Supabase) como A ÚNICA FONT DA VERDADE dos estados da aplicação, transações financeiras, jobs assíncronos, documentos textuais gerados por IA, análises sintemáticas e configurações governamentais do perfil.

**LEI 7**
Sempre tratar o Storage (Supabase) de forma exclusiva como a camada de objetos pesados: PDFs, Imagens, Vídeos, Áudios e Artefatos brutos.

**LEI 8**
Sempre tratar a plataforma Telegram (*MundoRoberth_bot*) como o Portal de Entrada primário das intenções. O Telegram aciona ganchos, não executa alterações diretas de estado; ele entrega a mensagem para o Backend decidir e coordenar.

**LEI 9**
Sempre preferir Jobs Assíncronos (Queue/Filas), rastreabilidade densa, relatórios de logs robustos e estados observáveis (Em Fila, Processando, Finalizado, Falha) em detrimento de requisições HTTPS pesadas e blocantes que causem *timeout* de tela.

**LEI 10**
Sempre construir sob o paradigma da arquitetura modular, expansível, segura (RLS ativado para tudo) e rigorosamente auditável pelos relatórios a cada ciclo de Sprint do Agente.
