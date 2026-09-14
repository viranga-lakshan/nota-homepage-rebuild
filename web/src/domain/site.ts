/**
 * Site furniture: the things that surround the homepage rather than sitting
 * inside its Dynamic Zone.
 */

import type { Image } from "./media";

export interface NavItem {
  label: string;
  href: string;
}

export interface Navigation {
  /**
   * Kept even though the rendered logo is now the inline NotaLogo
   * component, not this text — it stays the accessible name/fallback, and
   * nothing forces an editor to know that.
   */
  logoText: string;
  items: NavItem[];
  orderButtonLabel: string;
  orderProductName: string;
  orderPrice: string;
  /** Behind the order pill in the mobile menu overlay. */
  mobileMenuImage: Image;
}

export interface CreditLink {
  label: string;
  href?: string | null;
}

export interface Footer {
  description: string;
  credit: string;
  copyright: string;
  navLinks: NavItem[];
  creditLinks: CreditLink[];
  madeInLogo: Image | null;
}

export interface OrderPopup {
  heading: string;
  subtext: string;
  emailPlaceholder: string;
  buttonLabel: string;
  successMessage: string;
}

/** What the contact route sends to the CMS when a visitor signs up. */
export interface SubmissionInput {
  email: string;
  source: string;
}
