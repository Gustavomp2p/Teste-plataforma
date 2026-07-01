/** Mensagens amigáveis para erros do Supabase Auth (PT-BR). */
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("over_email_send_rate_limit") || lower.includes("email rate limit")) {
    return (
      "Limite de e-mails do Supabase atingido (cerca de 2 por hora no plano gratuito). " +
      "Aguarde alguns minutos, use uma conta já criada no painel Supabase, ou configure SMTP customizado."
    );
  }
  if (lower.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirme seu e-mail pelo link enviado antes de entrar.";
  }
  if (lower.includes("user already registered")) {
    return "Este e-mail já está cadastrado. Tente entrar.";
  }
  if (lower.includes("password")) {
    return "Senha inválida. Use pelo menos 8 caracteres.";
  }
  if (lower.includes("signup is disabled")) {
    return "Cadastro publico desabilitado. Peça acesso a um administrador.";
  }
  if (lower.includes("same_password") || lower.includes("weak password")) {
    return "Senha fraca. Use pelo menos 8 caracteres.";
  }

  return message;
}

export const allowPublicSignup =
  process.env.NEXT_PUBLIC_ALLOW_SIGNUP !== "false";
