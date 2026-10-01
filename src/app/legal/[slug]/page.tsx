import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/InfoPageView";
import { LEGAL } from "@/lib/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGAL).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL[slug];
  return page ? { title: page.title, description: page.intro, alternates: { canonical: `/legal/${slug}` } } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = LEGAL[slug];
  if (!page) notFound();
  return <InfoPageView page={page} eyebrow="Legal" />;
}
