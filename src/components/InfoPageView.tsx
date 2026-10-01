import type { InfoPage } from "@/lib/pages";
import { RevealText } from "@/components/motion/RevealText";

export function InfoPageView({ page, eyebrow }: { page: InfoPage; eyebrow: string }) {
  return (
    <section data-header="light" className="bg-ivory pb-40 pt-[calc(var(--header-h)+12vh)] text-ink">
      <div className="gutter-x mx-auto grid max-w-[1680px] gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6 opacity-50">{eyebrow}</p>
          <RevealText as="h1" className="serif-display text-headline uppercase">
            {page.title}
          </RevealText>
          <p className="mt-8 max-w-sm text-[15px] leading-relaxed opacity-75">{page.intro}</p>
        </div>
        <dl className="md:col-span-6 md:col-start-7">
          {page.sections.map((s) => (
            <div key={s.heading} className="border-t border-espresso/15 py-8">
              <dt className="font-serif text-2xl">{s.heading}</dt>
              <dd className="mt-3 max-w-lg text-sm leading-relaxed opacity-75">{s.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
