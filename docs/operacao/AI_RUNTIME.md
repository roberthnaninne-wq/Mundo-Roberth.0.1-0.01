# RUNTIME DA CAMADA COGNITIVA (IA)

## Visão Geral
A Camada Cognitiva é o "cérebro" do Mundo Roberth.0.1. Ela não apenas responde mensagens, mas as processa intelectualmente para extrair intenções e dados estruturados.

## Arquitetura de IA
- **Provedor**: Google Gemini (Lido via API REST direta para máxima compatibilidade com Edge Functions).
- **Modelo**: `gemini-1.5-flash`.
- **Raciocínio**: Zero-shot com System Instruction para extração JSON.

## Segurança e Configuração
O sistema exige o segredo `GEMINI_API_KEY` configurado no ambiente do Supabase. NUNCA utilize chaves de teste ou as exponha no código fonte.

## Intepretação de Intenções (JSON Output)
O worker `process-intent` solicita que o modelo retorne sempre um objeto JSON com:
- `intent_key`: Chave semântica para roteamento futuro (ex: `greeting`, `task`).
- `confidence`: Score de certeza da IA sobre a classificação.
- `response_text`: A resposta polida que será enviada ao Telegram.
- `reasoning_summary`: O rastro operacional do pensamento da IA.

## Limites e Riscos
1. **Contexto**: Atualmente o worker processa mensagens isoladamente (sem histórico de conversa/memória curta).
2. **Latência**: A chamada para o Gemini adiciona entre 1 a 3 segundos no processamento assíncrono.
3. **Custo**: O uso do modelo Flash é otimizado para baixo custo, mas volumes massivos de mensagens devem ser monitorados.

## Evolução Próxima
A próxima fase envolverá o **Roteamento Dinâmico**: dependendo da `intent_key`, o sistema poderá disparar ações no banco ou invocar outros agentes especialistas.
