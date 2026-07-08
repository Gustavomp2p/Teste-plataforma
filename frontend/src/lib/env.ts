export function sanitizeEnv(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/^\uFEFF/, "").trim();
}

export function getSupabaseEnv() {
  return {
    url: sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    key: sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  };
}
