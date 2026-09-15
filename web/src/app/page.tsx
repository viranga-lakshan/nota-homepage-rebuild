import type { Metadata } from "next";
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

/**
 * Reads the CMS SEO component and returns Next.js Metadata for the homepage.
 *
 * `noIndex` is set to true by default in Strapi (see CLAUDE.md §2 — the
 * reference design belongs to its original creators, so this rebuild must
 * not be indexed). An editor can flip it per-page in the CMS without a
 * redeploy, because the publish webhook invalidates the `homepage` cache
 * tag and the next request re-fetches.
 */
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  const seo = homepage?.seo;

  const noIndex = seo?.noIndex ?? true;

  return {
    title: seo?.title || "NŌTA — Smart Pen",
    description: seo?.description || "NŌTA creates tools that respect the way people think and write.",
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    ...(seo?.ogImage?.url && {
      openGraph: {
        images: [
          {
            url: seo.ogImage.url,
            alt: seo.ogImage.alt,
            width: seo.ogImage.width || undefined,
            height: seo.ogImage.height || undefined,
          },
        ],
      },
    }),
  };
}

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
