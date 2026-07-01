import { Suspense } from "react";
import { NovaSenhaForm } from "./nova-senha-form";

export default function NovaSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Carregando...
        </div>
      }
    >
      <NovaSenhaForm />
    </Suspense>
  );
}
