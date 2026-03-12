-- Criar a tabela base respeitando a arquitetura
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    language_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS (Proibindo leitura pública incondicional)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Usuário logado no dashboard (auth.uid) pode ler apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.user_profiles AS PERMISSIVE FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- A Edge Function usará o Service Role Key operando server-side (desviando do RLS) 
-- para fazer os UPSERTS, conforme as leis ditam que service role é apenas back-end/edge.

-- Trigger para auto-atualizar o updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
