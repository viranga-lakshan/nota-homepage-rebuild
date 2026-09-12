import { getHomepage, getNavigation } from "@/lib/cms/client";
import { Header } from "@/shared/ui/Header/Header";
import { resolveSection } from "@/sections/registry";

/**
 * Fetches Homepage and Navigation concurrently and renders whatever exists.
 * Both are allowed to come back null — an unpublished single type is a
 * normal state during content setup, not an error (see client.ts) — and
 * each is handled independently so a missing one never blocks the other.
 *
 * Sections are walked through the registry (sections/registry.ts): each
 * one renders if a component exists for its type, or nothing at all if it
 * does not yet. That is deliberate, not a bug — most of the seven sections
 * are still unbuilt.
 */
export default async function Home() {
  const [homepage, navigation] = await Promise.all([getHomepage(), getNavigation()]);

  return (
    <main>
      {navigation && <Header navigation={navigation} />}

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
