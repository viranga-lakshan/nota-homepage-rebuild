/**
 * The domain model — framework-free types describing the site's content.
 *
 * Nothing in here imports React, Next, or Strapi. Components and the CMS
 * adapter both depend on these types; they do not depend on each other.
 */

export type { Image, Video } from "./media";
export type { Seo, Homepage } from "./homepage";
export type { NavItem, Navigation, Footer, OrderPopup, SubmissionInput } from "./site";
export type {
  SpecItem,
  SpecGroup,
  Persona,
  PaperSlide,
  BoxItem,
  ColorVariant,
  DetailCard,
  HeroSection,
  SpecsSection,
  WhoSection,
  PaperSection,
  InsideBoxSection,
  DetailsSection,
  ColorVariantsSection,
  Section,
  SectionType,
} from "./sections";
