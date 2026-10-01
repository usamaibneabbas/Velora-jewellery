import { getFeaturedProducts, getNewProducts, getProduct, getProducts } from "@/commerce/products";
import { BrandStatement } from "@/components/home/BrandStatement";
import { BrandValues } from "@/components/home/BrandValues";
import { CraftSection } from "@/components/home/CraftSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HeroScene } from "@/components/home/HeroScene";
import { HorizontalCollection } from "@/components/home/HorizontalCollection";
import { MacroDetail } from "@/components/home/MacroDetail";
import { PackagingExperience } from "@/components/home/PackagingExperience";
import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductStory } from "@/components/home/ProductStory";
import { ShowcaseScene } from "@/components/home/ShowcaseScene";
import { asset } from "@/lib/asset";

/**
 * Homepage art direction — which product appears in which scene.
 * Change the slugs here to re-cast the story when new photography arrives.
 */
const CAST = {
  hero: "ailes-cuff",
  story: "ailes-cuff",
  macro: "etoile-cuff",
  showcase: "etoile-cuff",
  packaging: "etoile-cuff",
  finale: "etoile-cuff",
};

export default async function HomePage() {
  const [all, featured, latest] = await Promise.all([getProducts(), getFeaturedProducts(), getNewProducts()]);
  const pick = async (slug: string) => (await getProduct(slug)) ?? all[0];
  const [hero, story, macro, showcase, packaging, finale] = await Promise.all([
    pick(CAST.hero),
    pick(CAST.story),
    pick(CAST.macro),
    pick(CAST.showcase),
    pick(CAST.packaging),
    pick(CAST.finale),
  ]);
  const ailes = await pick("ailes-cuff");

  return (
    <>
      <HeroScene product={hero} />
      <ProductStory product={story} />
      <FeaturedCollection products={featured} />
      <HorizontalCollection products={latest} />
      <MacroDetail image={macro.images[0]} />
      <CraftSection images={[ailes.images[2] ?? ailes.featuredImage, macro.images[2] ?? macro.featuredImage, macro.images[1] ?? macro.featuredImage]} />
      <ShowcaseScene product={showcase} textureUrl={asset("/textures/band-bamiyan.webp")} />
      <BrandStatement />
      <ProductGrid products={all} />
      <PackagingExperience image={packaging.images[1] ?? packaging.featuredImage} />
      <BrandValues />
      <FinalCTA image={finale.images[1] ?? finale.featuredImage} />
    </>
  );
}
