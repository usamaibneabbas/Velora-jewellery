import { FOOTER_NAV } from "@/lib/site";
import { Newsletter } from "./Newsletter";
import { Link } from "./PageTransition";

export function Footer() {
  return (
    <footer data-header="dark" className="grain bg-night text-ivory">
      <div className="gutter-x relative z-[2] mx-auto max-w-[1680px] pb-10 pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold-soft">Private Access</p>
            <p className="serif-display mt-6 max-w-md text-4xl leading-tight md:text-5xl">
              Receive new releases, stories and private previews.
            </p>
            <div className="mt-10 max-w-md">
              <Newsletter />
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:col-span-7">
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-6 opacity-50">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-line text-sm opacity-80 transition-opacity hover:opacity-100">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p aria-hidden className="serif-display mt-24 select-none text-center text-[22vw] leading-[0.8] tracking-[0.06em] text-ivory/[0.06] md:mt-32">
          VELORA
        </p>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-ivory/10 pt-8 text-xs opacity-60 md:flex-row">
          <p>© {new Date().getFullYear()} VELORA. All rights reserved.</p>
          <p className="eyebrow">Objects of Quiet Distinction</p>
        </div>
      </div>
    </footer>
  );
}
