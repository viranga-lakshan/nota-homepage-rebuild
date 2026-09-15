import { getFooter, getHomepage, getNavigation, getOrderPopup } from "@/lib/cms/client";
import { Header } from "@/shared/ui/Header/Header";
import { Footer } from "@/shared/ui/Footer/Footer";
import { resolveSection } from "@/sections/registry";
import styles from "./page.module.css";

/**
 * Fetches Homepage, Navigation, Footer, and OrderPopup concurrently and renders whatever
 * exists.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [homepage, navigation, footer, orderPopup] = await Promise.all([
    getHomepage(),
    getNavigation(),
    getFooter(),
    getOrderPopup(),
  ]);

  return (
    <>
      {navigation && (
        <Header
          navigation={navigation}
          footer={footer}
          orderPopup={orderPopup}
        />
      )}

      <main className={styles.mainWrapper}>
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
