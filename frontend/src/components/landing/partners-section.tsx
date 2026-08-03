import { PartnersStrip } from "@/components/landing/partners-strip";

export function PartnersSection() {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <PartnersStrip title="Parceiros institucionais" />
      </div>
    </section>
  );
}
