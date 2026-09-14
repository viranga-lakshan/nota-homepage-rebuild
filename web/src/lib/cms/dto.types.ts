/**
 * Strapi's response shapes, exactly as they arrive over the wire.
 *
 * These types exist to be mapped away. Nothing outside lib/cms should import
 * them — the domain types in src/domain are what the rest of the app uses.
 *
 * Strapi v5 notes that shape everything here (CLAUDE.md §4):
 *   - responses are flat: no `data.attributes` wrapper as in v4
 *   - `documentId` is the identifier; the numeric `id` is an internal detail
 *   - components in a Dynamic Zone carry a `__component` discriminant
 */

export interface StrapiMediaDto {
  url: string;
  width: number;
  height: number;
  mime: string;
  alternativeText: string | null;
}

/** Single types return one object; `data` is null when nothing is published. */
export interface StrapiSingleResponse<T> {
  data: T | null;
}

export interface SeoDto {
  metaTitle: string;
  metaDescription: string;
  ogImage: StrapiMediaDto | null;
  ogImageAlt: string | null;
  noIndex: boolean;
}

export interface SpecItemDto {
  label: string;
}

export interface SpecGroupDto {
  title: string;
  items: SpecItemDto[];
}

export interface PersonaDto {
  title: string;
  body: string;
}

export interface PaperSlideDto {
  headline: string;
  image: StrapiMediaDto;
  image_alt: string;
  callout_title: string;
  callout_body: string;
}

export interface BoxItemDto {
  title: string;
  description: string;
  image: StrapiMediaDto;
  image_alt: string;
}

export interface ColorVariantDto {
  name: string;
  tagline: string;
  image: StrapiMediaDto;
  image_alt: string;
}

export interface DetailCardDto {
  label?: string | null;
  image?: StrapiMediaDto | null;
  image_alt?: string | null;
  video?: StrapiMediaDto | null;
}

export interface HeroSectionDto {
  __component: "sections.hero";
  headline_line1: string;
  headline_line2: string;
  sequence_base_path: string;
  sequence_frame_count: number;
  mobile_fallback: StrapiMediaDto;
  mobile_fallback_alt: string;
  order_label: string;
  product_name: string;
  price: string;
}

export interface SpecsSectionDto {
  __component: "sections.specs";
  eyebrow: string;
  heading: string;
  pen_image: StrapiMediaDto;
  pen_image_alt: string;
  groups: SpecGroupDto[];
}

export interface WhoSectionDto {
  __component: "sections.who";
  manifesto: string;
  intro: string;
  who_label: string;
  personas: PersonaDto[];
  video: StrapiMediaDto;
}

export interface PaperSectionDto {
  __component: "sections.paper";
  section_heading_light: string;
  section_heading_bold: string;
  slides: PaperSlideDto[];
}

export interface InsideBoxSectionDto {
  __component: "sections.inside-box";
  heading: string;
  description_text: string;
  items: BoxItemDto[];
}

export interface DetailsSectionDto {
  __component: "sections.details";
  cards: DetailCardDto[];
}

export interface ColorVariantsSectionDto {
  __component: "sections.color-variants";
  colors: ColorVariantDto[];
}

export type SectionDto =
  | HeroSectionDto
  | SpecsSectionDto
  | WhoSectionDto
  | PaperSectionDto
  | InsideBoxSectionDto
  | DetailsSectionDto
  | ColorVariantsSectionDto;

export interface HomepageDto {
  seo: SeoDto;
  /**
   * Typed as a wider array than SectionDto: an editor can add a component
   * this build has never heard of, and that must not be a type error here
   * any more than it is a crash at render time.
   */
  sections: Array<SectionDto | { __component: string }>;
}

export interface NavItemDto {
  label: string;
  href: string;
}

export interface NavigationDto {
  logo_text: string;
  items: NavItemDto[];
  order_button_label: string;
  order_product_name: string;
  order_price: string;
  mobile_menu_image: StrapiMediaDto;
  mobile_menu_image_alt: string;
}

export interface FooterDto {
  description: string;
  credit: string;
  copyright: string;
  nav_links: NavItemDto[];
}

export interface OrderPopupDto {
  heading: string;
  subtext: string;
  email_placeholder: string;
  button_label: string;
  success_message: string;
}
