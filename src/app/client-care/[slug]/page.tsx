import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/InfoPageView";
import { CLIENT_CARE } from "@/lib/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CLIENT_CARE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/client-care/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = CLIENT_CARE[slug];
  return page ? { title: page.title, description: page.intro, alternates: { canonical: `/client-care/${slug}` } } : {};
}

export default async function ClientCarePage({ params }: PageProps<"/client-care/[slug]">) {
  const { slug } = await params;
  const page = CLIENT_CARE[slug];
  if (!page) notFound();
  return <InfoPageView page={page} eyebrow="Client Care" />;
}
