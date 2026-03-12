import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

// Consumer Worker: 'process-intent' (Using OpenAI GPT)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('MY_SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI Configuration - Using OpenAI
const TIMEZONE = Deno.env.get('WORLD_TIMEZONE') || 'America/Sao_Paulo';

Deno.serve(async (req) => {
  let currentJobId: string | null = null;
  let currentMsgId: any = null;

  try {
    // Get job_id from request body (passed directly from telegram-webhook)
    const body = await req.json();
    let jobId = body.job_id;

    // If no job_id in body, try to read from queue (fallback)
    if (!jobId) {
      const { data: queueItems, error: rpcError } = await supabase.rpc('pop_intent_job_from_queue', { lock_seconds: 45 });

      if (rpcError) throw rpcError;
      if (!queueItems || queueItems.length === 0) {
        return new Response(JSON.stringify({ ok: true, msg: "No jobs to process" }), { headers: { "Content-Type": "application/json" } });
      }

      const msg = queueItems[0];
      currentJobId = msg.message.job_id;
      currentMsgId = msg.msg_id;
      jobId = currentJobId;
    }

    if (!jobId) {
      throw new Error("No job_id provided and queue is empty.");
    }

    // 2. Fetch Job & Command Details
    const { data: jobData, error: dataError } = await supabase
       .from('jobs')
       .select('telegram_chat_id, commands(payload)')
       .eq('id', jobId)
       .single();

    if (dataError) throw dataError;
    const rawMessage = (jobData.commands as any)?.payload?.text || "Mensagem sem texto";
    const chatId = jobData.telegram_chat_id;

    // 3. Mark Job as RUNNING
    await supabase.from('jobs').update({ status: 'running' }).eq('id', jobId);
    await supabase.from('job_events').insert({
        job_id: jobId,
        status: 'running',
        message: `Worker started AI analysis using OpenAI GPT.`
    });

    // --- COGNITIVE EXECUTION LAYER (OPENAI) ---
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) throw new Error("OPENAI_API_KEY not found.");

    const currentTime = new Date().toLocaleString("pt-BR", { timeZone: TIMEZONE });
    const isoNow = new Date().toISOString();

    const systemInstruction = `Você é o Núcleo Cognitivo e Executor do Mundo Roberth.0.1.
Sua missão é interpretar a intenção do usuário e decidir se deve executar uma ação local.

CONTEXTO TEMPORAL:
- Horário Atual (Brasil/SP): ${currentTime}
- ISO Now: ${isoNow}
- Timezone: ${TIMEZONE}

Importante: Interprete expressões como "amanhã", "hoje à noite", "segunda-feira" com base no Horário Atual.

AÇÕES DISPONÍVEIS:
1. 'task_creation': Para listas, deveres, lembretes simples.
2. 'event_scheduling': Para compromissos com hora marcada, reuniões ou eventos datados.

FORMATO DE RESPOSTA (JSON ESTREITO):
{
  "intent_key": "string",
  "confidence": number (0-1),
  "action_key": "task_creation" | "event_scheduling" | "none",
  "should_execute_action": boolean,
  "action_payload": {
     "title": "título curto e claro",
     "description": "detalhes extras extraídos",
     "start_at": "ISO8601 string (obrigatório para event)",
     "end_at": "ISO8601 string or null",
     "due_at": "ISO8601 string (para task)",
     "all_day": boolean
  },
  "response_text": "mensagem amigável para o usuário confirmando ou respondendo",
  "reasoning_summary": "breve explicação do porquê desta decisão"
}`;

    // Using OpenAI API
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    const aiResponse = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Usuário: "${rawMessage}"` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) throw new Error(`OpenAI Error: ${await aiResponse.text()}`);
    const aiData = await aiResponse.json();
    const aiResult = JSON.parse(aiData.choices[0].message.content);
    // -----------------------------------------------------

    // --- ACTION ROUTING ---
    let executionResult = { executed: false, detail: null };

    if (aiResult.should_execute_action) {
        if (aiResult.action_key === 'task_creation') {
            const { data: task, error: taskError } = await supabase
               .from('tasks')
               .insert({
                  created_from_job_id: jobId,
                  title: aiResult.action_payload.title || "Nova Tarefa",
                  description: aiResult.action_payload.description || "",
                  due_at: aiResult.action_payload.due_at
               })
               .select().single();

            if (taskError && taskError.code !== '23505') throw taskError;
            executionResult = { executed: true, detail: (task ? `Task: ${task.id}` : "Task already existed") as any };
        }
        else if (aiResult.action_key === 'event_scheduling') {
            const { data: event, error: eventError } = await supabase
               .from('calendar_events')
               .insert({
                  created_from_job_id: jobId,
                  title: aiResult.action_payload.title || "Novo Evento",
                  description: aiResult.action_payload.description || "",
                  start_at: aiResult.action_payload.start_at,
                  end_at: aiResult.action_payload.end_at,
                  all_day: aiResult.action_payload.all_day || false
               })
               .select().single();

            if (eventError && eventError.code !== '23505') throw eventError;
            executionResult = { executed: true, detail: (event ? `Event: ${event.id}` : "Event already existed") as any };
        }

        if (executionResult.executed) {
            await supabase.from('job_events').insert({
                job_id: jobId,
                status: 'running',
                message: `Action executed: ${aiResult.action_key}`
            });
        }
    }

    // 5. Finalize Job
    await supabase.from('jobs').update({
        status: 'completed',
        result: { ...aiResult, execution: executionResult }
    }).eq('id', jobId);

    // 6. Respond to Telegram
    if (chatId) {
        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const icon = aiResult.action_key === 'event_scheduling' ? '📅' : '✅';
        const prefix = executionResult.executed ? `${icon} *Sucesso!*` : '';
        const text = `${prefix}\n\n${aiResult.response_text}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
        });
    }

    // Archive the message if it came from queue
    if (currentMsgId) {
      await supabase.rpc('archive_intent_job', { p_msg_id: currentMsgId });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });

  } catch (err: any) {
    console.error("Worker Critical Error:", err);

    if (currentJobId) {
        try {
            await supabase.from('jobs').update({
                status: 'failed',
                result: { error: err.message, stack: err.stack }
            }).eq('id', currentJobId);

            await supabase.from('job_events').insert({
                job_id: currentJobId,
                status: 'failed',
                message: `Worker crashed: ${err.message}`
            });

            if (currentMsgId) {
                await supabase.rpc('archive_intent_job', { p_msg_id: currentMsgId });
            }
        } catch (innerErr) {
            console.error("Failed to log recovery error:", innerErr);
        }
    }

    return new Response(JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown',
        stack: err instanceof Error ? err.stack : null
    }), { status: 500 });
  }
});
