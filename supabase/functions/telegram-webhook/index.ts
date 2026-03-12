import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

// Setup the Supabase client utilizing the Service Role Key.
// This allows the Edge Function to bypass Row Level Security (RLS) entirely,
// fulfilling the requirement that service role is only used backend/server-side.
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    const update = await req.json();

    // Verify if it's a message containing a user
    if (update.message && update.message.from) {
      const user = update.message.from;
      
      // Upsert the profile using the telegram_id as the resolution key
      const { error } = await supabase
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
        });

      if (error) throw error;
      
      console.log(`Profile updated for Telegram ID: ${user.id}`);
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
