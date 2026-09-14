import { getFooter, getHomepage, getNavigation } from "@/lib/cms/client";
import { Header } from "@/shared/ui/Header/Header";
import { Footer } from "@/shared/ui/Footer/Footer";
import { resolveSection } from "@/sections/registry";

/**
 * Fetches Homepage, Navigation and Footer concurrently and renders whatever
 * exists.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [homepage, navigation, footer] = await Promise.all([
    getHomepage(),
    getNavigation(),
    getFooter(),
  ]);

  return (
    <>
      {navigation && <Header navigation={navigation} footer={footer} />}

      <main>
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
