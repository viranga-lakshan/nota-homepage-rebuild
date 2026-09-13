import { getFooter, getHomepage, getNavigation } from "@/lib/cms/client";
import { Header } from "@/shared/ui/Header/Header";
import { resolveSection } from "@/sections/registry";

/**
 * Fetches Homepage, Navigation and Footer concurrently and renders whatever
 * exists. All three are allowed to come back null — an unpublished single
 * type is a normal state during content setup, not an error (see
 * client.ts) — and each is handled independently so a missing one never
 * blocks the others. Footer is fetched here even though nothing renders a
 * footer yet: Header's mobile menu overlay needs its credit line, and
 * Header has no way to fetch data itself (it is a Client Component).
 *
 * Sections are walked through the registry (sections/registry.ts): each
 * one renders if a component exists for its type, or nothing at all if it
 * does not yet. That is deliberate, not a bug — most of the seven sections
 * are still unbuilt.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [homepage, navigation, footer] = await Promise.all([
    getHomepage(),
    getNavigation(),
    getFooter(),
  ]);

  return (
    <main>
      {navigation && <Header navigation={navigation} footer={footer} />}

      {homepage ? (
        homepage.sections.map((section, index) => {
          const Component = resolveSection(section);
          return Component ? <Component key={index} section={section} /> : null;
        })
      ) : (
        <p>Homepage has no published content yet.</p>
      )}
    </main>
  );
}
