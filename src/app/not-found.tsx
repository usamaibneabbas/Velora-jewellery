import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section data-header="dark" className="flex min-h-[100svh] flex-col items-center justify-center bg-night px-6 text-center text-ivory">
      <p className="eyebrow mb-8 text-champagne/70">404</p>
      <h1 className="serif-display text-headline uppercase">This piece is not here.</h1>
      <p className="mt-6 max-w-sm text-sm text-ivory/70">The page you were looking for may have moved, or never existed.</p>
      <div className="mt-12">
        <ButtonLink href="/" tone="light">Return to VELORA</ButtonLink>
      </div>
    </section>
  );
}
