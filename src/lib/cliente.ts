/**
 * Dados do cliente exigidos pela Cakto para gerar um PIX nativo (API deles,
 * não o checkout hospedado). Sem isso a chamada de pagamento é recusada.
 */
export type ClienteDados = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
};

export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

/** Formato exigido pela Cakto: E.164 sem "+", ex. 5511999999999. */
export function telefoneParaE164(valor: string) {
  const digitos = apenasDigitos(valor);
  if (digitos.startsWith("55") && digitos.length >= 12) return digitos;
  return `55${digitos}`;
}

/** Dígitos verificadores do CPF. Recusa sequências repetidas (111.111.111-11 etc.). */
export function cpfValido(valor: string) {
  const cpf = apenasDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (base: string) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = digito(cpf.slice(0, 9));
  const d2 = digito(cpf.slice(0, 9) + d1);
  return cpf === cpf.slice(0, 9) + String(d1) + String(d2);
}

export function clienteValido(c: ClienteDados) {
  return (
    c.nome.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()) &&
    apenasDigitos(c.telefone).length >= 10 &&
    cpfValido(c.cpf)
  );
}
