"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sl-black px-4">
      <div className="sl-card w-full max-w-sm rounded-2xl p-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-6 text-center text-xl font-black text-white">Painel Administrativo</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <Mail size={16} className="text-sl-red" /> E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
              placeholder="admin@shoppinglander.com"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <Lock size={16} className="text-sl-red" /> Senha
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-sl-red/10 px-3 py-2 text-sm text-sl-red">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-sl-red py-3 font-bold text-white transition hover:bg-sl-red-glow sl-red-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
