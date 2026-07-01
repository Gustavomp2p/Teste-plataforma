import { createBrowserClient } from "@supabase/ssr";

function sanitizeEnv(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/^\uFEFF/, "").trim();
}

export function createClient() {
  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return createBrowserClient(url, key);
}
