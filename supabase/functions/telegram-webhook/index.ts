import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

// Setup the Supabase client utilizing the Service Role Key to bypass RLS
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('MY_SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    const update = await req.json();

    // Verify if it's a message containing a user
    if (update.message && update.message.from) {
      const user = update.message.from;
      const text = update.message.text || '';
      const chatId = update.message.chat?.id;
      
      // 1. Upsert the profile using the telegram_id to get our internal UUID
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || null,
          username: user.username || null,
          language_code: user.language_code || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'telegram_id'
        })
        .select('id')
        .single();

      if (profileError) throw profileError;
      
      const userId = profile.id;

      // 2. Register the Command (Intent)
      const { data: command, error: cmdError } = await supabase
        .from('commands')
        .insert({
          user_id: userId,
          payload: update.message
        })
        .select('id')
        .single();
        
      if (cmdError) throw cmdError;

      // 3. Create the Job in pending status with chat_id for later response
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          command_id: command.id,
          status: 'pending',
          telegram_chat_id: chatId
        })
        .select('id')
        .single();
        
      if (jobError) throw jobError;

      // 4. Register the initial Job Event
      const { error: eventError } = await supabase
        .from('job_events')
        .insert({
           job_id: job.id,
           status: 'pending',
           message: 'Job received from Telegram Webhook and pending execution.'
        });
        
      if (eventError) throw eventError;
      
      // 5. Fire to the Durable Queue (PGMQ) via RPC
      // The trigger 'trigger_activate_worker_on_job_insert' via pg_net
      // will automatically wake up the consumer. No direct invoke needed!
      const { error: queueError } = await supabase.rpc('push_intent_job', {
        p_job_id: job.id
      });

      if (queueError) {
         console.error("Failed to push to pgmq:", queueError);
      }

      // 6. Notify the user via Telegram API (Immediate confirmation)
      if (chatId) {
         const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
         if (botToken) {
             const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
             await fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "Sua mensagem foi recebida e virou um Job assíncrono. Está sendo processada! ⚙️"
                })
             });
         }
      }
      
      console.log(`Command ${command.id} & Job ${job.id} registered for T-ID: ${user.id}`);
    }

    return new Response(JSON.stringify({ ok: true }), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 400,
      headers: { "Content-Type": "application/json" } 
    });
  }
});
