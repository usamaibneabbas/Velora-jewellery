import { Link } from "@/components/layout/PageTransition";

/** Minimal, typographic filtering — no sidebar. Each filter is a real, indexable URL. */
export function CollectionFilter({ active, items }: { active: string; items: { slug: string; title: string; count: number }[] }) {
  return (
    <nav aria-label="Filter jewellery" className="gutter-x mx-auto max-w-[1680px] py-14 md:py-20">
      <ul className="flex flex-wrap gap-x-8 gap-y-3 border-b border-espresso/10 pb-6">
        {items.map((c) => {
          const href = c.slug === "all" ? "/shop" : `/collections/${c.slug}`;
          const current = c.slug === active;
          return (
            <li key={c.slug}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`eyebrow link-line transition-opacity duration-500 ${current ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
              >
                {c.title}
                <sup className="ml-1 text-[9px] opacity-60">{c.count}</sup>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
