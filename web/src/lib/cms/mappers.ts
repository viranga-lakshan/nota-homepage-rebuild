/**
 * DTO → domain. The only place Strapi's field naming is translated into the
 * app's own.
 *
 * Two things happen here that are worth knowing about:
 *
 * 1. Media URLs are made absolute. Strapi serves `/uploads/foo.jpg`; a
 *    component should never have to remember to prefix a host.
 * 2. Alt text comes from the component's own `*_alt` field, not from the
 *    media's `alternativeText`. Strapi cannot make Media Library alt text
 *    mandatory, so the schema pairs every media field with a required alt
 *    string (CLAUDE.md §7). That is what makes `Image.alt` a plain string
 *    rather than a nullable one.
 */

import { getEnv } from "@/shared/lib/env";
import type { Image, Video } from "@/domain/media";
import type { Homepage, Seo } from "@/domain/homepage";
import type { Footer, NavItem, Navigation, OrderPopup, CreditLink } from "@/domain/site";
import type {
  BoxItem,
  ColorVariant,
  DetailCard,
  PaperSlide,
  Persona,
  Section,
  SpecGroup,
} from "@/domain/sections";
import type {
  BoxItemDto,
  ColorVariantDto,
  CreditLinkDto,
  DetailCardDto,
  FooterDto,
  HomepageDto,
  NavItemDto,
  NavigationDto,
  OrderPopupDto,
  PaperSlideDto,
  PersonaDto,
  SectionDto,
  SeoDto,
  SpecGroupDto,
  StrapiMediaDto,
} from "./dto.types";

/**
 * Strapi returns root-relative URLs for locally-stored media. An already
 * absolute URL is left alone, so this keeps working if uploads later move to
 * object storage that returns full URLs.
 */
function absoluteUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${getEnv().NEXT_PUBLIC_STRAPI_MEDIA_URL}${url}`;
}

function toImage(media: StrapiMediaDto | undefined | null, alt: string): Image {
  if (!media) {
    return { url: "", alt, width: 0, height: 0 };
  }
  return {
    url: absoluteUrl(media.url),
    alt,
    width: media.width || 0,
    height: media.height || 0,
  };
}

function toVideo(media: StrapiMediaDto | undefined | null): Video {
  if (!media) {
    return { url: "", mime: "video/mp4" };
  }
  return {
    url: absoluteUrl(media.url),
    mime: media.mime || "video/mp4",
  };
}

function toNavItem(dto: NavItemDto): NavItem {
  return {
    label: dto.label ? dto.label.trim() : "",
    href: dto.href ? dto.href.trim() : "",
  };
}

function toCreditLink(dto: CreditLinkDto): CreditLink {
  return {
    label: dto.label ? dto.label.trim() : "",
    href: dto.href ? dto.href.trim() : null,
  };
}

function toSpecGroup(dto: SpecGroupDto): SpecGroup {
  return {
    title: dto.title,
    items: dto.items.map((item) => ({ label: item.label })),
  };
}

function toPersona(dto: PersonaDto): Persona {
  return { title: dto.title, body: dto.body };
}

function toPaperSlide(dto: PaperSlideDto): PaperSlide {
  return {
    headline: dto.headline,
    image: toImage(dto.image, dto.image_alt),
    calloutTitle: dto.callout_title,
    calloutBody: dto.callout_body,
  };
}

function toBoxItem(dto: BoxItemDto): BoxItem {
  return {
    title: dto.title,
    description: dto.description,
    image: toImage(dto.image, dto.image_alt),
  };
}

function toColorVariant(dto: ColorVariantDto): ColorVariant {
  return {
    name: dto.name,
    tagline: dto.tagline,
    image: toImage(dto.image, dto.image_alt),
  };
}

function toDetailCard(dto: DetailCardDto): DetailCard {
  return {
    label: dto.label ?? null,
    image: dto.image ? toImage(dto.image, dto.image_alt ?? "") : null,
    video: dto.video ? toVideo(dto.video) : null,
  };
}

export function toSeo(dto: SeoDto): Seo {
  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    // Alt is required whenever a share image is set, but the image itself is
    // optional, so the pair has to be resolved together.
    ogImage: dto.ogImage ? toImage(dto.ogImage, dto.ogImageAlt ?? "") : null,
    noIndex: dto.noIndex,
  };
}

/**
 * Returns null for a component this build does not recognise, rather than
 * throwing. An editor adding a section the frontend has not shipped yet is a
 * normal thing to happen mid-project, and it must not take the page down
 * (CLAUDE.md §5) — the renderer drops nulls and logs in development.
 */
function toSection(dto: SectionDto | { __component: string }): Section | null {
  switch (dto.__component) {
    case "sections.hero": {
      const hero = dto as Extract<SectionDto, { __component: "sections.hero" }>;
      return {
        type: "hero",
        headlineLine1: hero.headline_line1,
        headlineLine2: hero.headline_line2,
        sequenceBasePath: hero.sequence_base_path,
        sequenceFrameCount: hero.sequence_frame_count,
        mobileFallback: toImage(hero.mobile_fallback, hero.mobile_fallback_alt),
        orderLabel: hero.order_label,
        productName: hero.product_name,
        price: hero.price,
      };
    }

    case "sections.specs": {
      const specs = dto as Extract<SectionDto, { __component: "sections.specs" }>;
      return {
        type: "specs",
        eyebrow: specs.eyebrow,
        heading: specs.heading,
        penImage: toImage(specs.pen_image, specs.pen_image_alt),
        groups: specs.groups.map(toSpecGroup),
      };
    }

    case "sections.who": {
      const who = dto as Extract<SectionDto, { __component: "sections.who" }>;
      return {
        type: "who",
        manifesto: who.manifesto,
        intro: who.intro,
        whoLabel: who.who_label,
        personas: who.personas.map(toPersona),
        video: toVideo(who.video),
      };
    }

    case "sections.paper": {
      const paper = dto as Extract<SectionDto, { __component: "sections.paper" }>;
      return {
        type: "paper",
        headingLight: paper.section_heading_light,
        headingBold: paper.section_heading_bold,
        slides: paper.slides.map(toPaperSlide),
      };
    }

    case "sections.inside-box": {
      const box = dto as Extract<SectionDto, { __component: "sections.inside-box" }>;
      return {
        type: "inside-box",
        heading: box.heading,
        descriptionText: box.description_text,
        items: box.items.map(toBoxItem),
      };
    }

    case "sections.details": {
      const details = dto as Extract<SectionDto, { __component: "sections.details" }>;
      return {
        type: "details",
        cards: details.cards.map(toDetailCard),
        video: details.video ? toVideo(details.video) : null,
      };
    }

    case "sections.color-variants": {
      const colors = dto as Extract<SectionDto, { __component: "sections.color-variants" }>;
      return {
        type: "color-variants",
        colors: colors.colors.map(toColorVariant),
      };
    }

    default:
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[cms] Unknown section component "${dto.__component}" — skipping. ` +
            "Add it to src/domain/sections.ts and this mapper if it is a real section."
        );
      }
      return null;
  }
}

export function toHomepage(dto: HomepageDto): Homepage {
  return {
    seo: toSeo(dto.seo),
    sections: dto.sections
      .map(toSection)
      .filter((section): section is Section => section !== null),
  };
}

export function toNavigation(dto: NavigationDto): Navigation {
  return {
    logoText: dto.logo_text,
    items: (dto.items || []).map(toNavItem),
    orderButtonLabel: dto.order_button_label,
    orderProductName: dto.order_product_name,
    orderPrice: dto.order_price,
    mobileMenuImage: toImage(dto.mobile_menu_image, dto.mobile_menu_image_alt),
  };
}

export const DEFAULT_FOOTER: Footer = {
  description:
    "NŌTA creates tools that respect the way people think and write. Natural handwriting, quietly connected to digital structure.",
  credit: "Designed by Alice & UPROCK Studio",
  copyright: "@2026 Nōta Team",
  year: "2026",
  navLinks: [
    { label: "Specifications", href: "#specifications" },
    { label: "Who it's for", href: "#who-its-for" },
    { label: "About", href: "#about" },
    { label: "Inside the box", href: "#inside-the-box" },
  ],
  creditLinks: [
    { label: "Made in Taptop", href: "https://taptop.pro/" },
    { label: "Builded by NōtaTeam", href: null },
    { label: "Designed by Alice", href: "https://www.behance.net/alicem" },
    { label: "& UPROCK Studio", href: "https://www.uprock.ru/" },
  ],
  madeInLogo: null,
};

export function toFooter(dto: FooterDto): Footer {
  return {
    description: dto.description || DEFAULT_FOOTER.description,
    credit: dto.credit || DEFAULT_FOOTER.credit,
    copyright: dto.copyright || DEFAULT_FOOTER.copyright,
    year: dto.year || "2026",
    navLinks: dto.nav_links && Array.isArray(dto.nav_links) ? dto.nav_links.map(toNavItem) : DEFAULT_FOOTER.navLinks,
    creditLinks: dto.credit_links && Array.isArray(dto.credit_links) ? dto.credit_links.map(toCreditLink) : DEFAULT_FOOTER.creditLinks,
    madeInLogo: dto.made_in_logo ? toImage(dto.made_in_logo, "Made in Taptop") : null,
  };
}

export function toOrderPopup(dto: OrderPopupDto): OrderPopup {
  return {
    heading: dto.heading,
    subtext: dto.subtext,
    emailPlaceholder: dto.email_placeholder,
    buttonLabel: dto.button_label,
    successMessage: dto.success_message,
  };
}
