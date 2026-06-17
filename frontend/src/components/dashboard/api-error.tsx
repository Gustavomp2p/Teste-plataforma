export function ApiErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="font-semibold text-red-800">Não foi possível carregar os dados</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-red-600">{message}</p>
      <p className="mx-auto mt-4 max-w-md text-xs text-red-500">
        Verifique se a API está rodando em <code>API_URL</code> (padrão{" "}
        <code>http://localhost:8000</code>).
      </p>
    </div>
  );
}
