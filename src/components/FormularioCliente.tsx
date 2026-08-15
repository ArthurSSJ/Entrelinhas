"use client";

import { useState } from "react";
import Icon3D from "./Icon3D";
import { apenasDigitos, clienteValido, cpfValido, type ClienteDados } from "@/lib/cliente";

/**
 * A Cakto recusa a criação de um PIX pela API sem nome, e-mail, telefone e
 * CPF do pagador — diferente do link de checkout hospedado, que pede isso lá
 * dentro. Esta tela existe só porque o PIX passou a ser gerado aqui.
 *
 * Aparece uma vez por sessão: depois que `onEnviar` é chamado, quem chama
 * guarda os dados e não pede de novo, mesmo que a pessoa compre outra coisa
 * (avançada) na sequência.
 */
export default function FormularioCliente({
  onEnviar,
}: {
  onEnviar: (cliente: ClienteDados) => void;
}) {
  const [campos, setCampos] = useState<ClienteDados>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });
  const [tocou, setTocou] = useState(false);

  const erros = {
    nome: campos.nome.trim().length < 3,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.trim()),
    telefone: apenasDigitos(campos.telefone).length < 10,
    cpf: !cpfValido(campos.cpf),
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setTocou(true);
    if (!clienteValido(campos)) return;
    onEnviar(campos);
  };

  return (
    <form onSubmit={enviar} className="card mt-5" noValidate>
      <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-[#B7A2AA] uppercase">
        <Icon3D name="escudo" size={22} className="flex-none" />
        Dados para o PIX
      </p>
      <p className="t-legenda mt-1.5">
        A Cakto exige isso para emitir a cobrança. Usado só no pagamento, não é salvo aqui.
      </p>

      <div className="mt-4 space-y-3">
        <Campo
          rotulo="Nome completo"
          valor={campos.nome}
          erro={tocou && erros.nome}
          onChange={(v) => setCampos((c) => ({ ...c, nome: v }))}
          autoComplete="name"
        />
        <Campo
          rotulo="E-mail"
          tipo="email"
          valor={campos.email}
          erro={tocou && erros.email}
          onChange={(v) => setCampos((c) => ({ ...c, email: v }))}
          autoComplete="email"
        />
        <Campo
          rotulo="Telefone (com DDD)"
          tipo="tel"
          valor={campos.telefone}
          erro={tocou && erros.telefone}
          onChange={(v) => setCampos((c) => ({ ...c, telefone: v }))}
          autoComplete="tel"
        />
        <Campo
          rotulo="CPF"
          valor={campos.cpf}
          erro={tocou && erros.cpf}
          onChange={(v) => setCampos((c) => ({ ...c, cpf: v }))}
          autoComplete="off"
        />
      </div>

      <button type="submit" className="btn btn-neon btn-lg btn-block mt-5">
        Continuar para o pagamento
      </button>
    </form>
  );
}

function Campo({
  rotulo,
  valor,
  erro,
  onChange,
  tipo = "text",
  autoComplete,
}: {
  rotulo: string;
  valor: string;
  erro: boolean;
  onChange: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="t-legenda mb-1 block">{rotulo}</span>
      <input
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro}
        className="w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-[0.9375rem] text-[#F6ECEF] outline-none focus:border-[#FF3068]/60 aria-[invalid=true]:border-[#FF5A5A]/60"
      />
    </label>
  );
}
