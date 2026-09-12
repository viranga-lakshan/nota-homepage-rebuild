import { getFooter, getHomepage, getNavigation, getOrderPopup } from "@/lib/cms/client";
import { Header } from "@/shared/ui/Header/Header";
import { Footer } from "@/shared/ui/Footer/Footer";
import { resolveSection } from "@/sections/registry";

/**
 * Fetches Homepage, Navigation, Footer and Order Popup concurrently and
 * renders whatever exists. All four are allowed to come back null — an
 * unpublished single type is a normal state during content setup, not an
 * error (see client.ts) — and each is handled independently so a missing
 * one never blocks the others. Footer and Order Popup are fetched here
 * even though Header owns their rendering: Header is a Client Component
 * and has no way to fetch data itself.
 *
 * Sections are walked through the registry (sections/registry.ts): each
 * one renders if a component exists for its type, or nothing at all if it
 * does not yet.
 */
export default async function Home() {
  const [homepage, navigation, footer, orderPopup] = await Promise.all([
    getHomepage(),
    getNavigation(),
    getFooter(),
    getOrderPopup(),
  ]);

  return (
    <>
      <main>
        {navigation && <Header navigation={navigation} footer={footer} orderPopup={orderPopup} />}

        {homepage ? (
          homepage.sections.map((section, index) => {
            const Component = resolveSection(section);
            return Component ? <Component key={index} section={section} /> : null;
          })
        ) : (
          <p>Homepage has no published content yet.</p>
        )}
      </main>

      {footer && <Footer footer={footer} />}
    </>
  );
}
