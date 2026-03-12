import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold title-gradient tracking-tight">Portal do Reino</h1>
          <p className="text-zinc-500 mt-2">Acesso restrito ao Administrador</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Email Real
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu-email@exemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            formAction={login}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            Enviar Magic Link
          </button>
        </form>

        {searchParams?.message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
            {searchParams.message}
          </div>
        )}

        {searchParams?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
            {searchParams.error}
          </div>
        )}
      </div>
    </div>
  )
}
