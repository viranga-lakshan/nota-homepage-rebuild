/**
 * Site furniture: the things that surround the homepage rather than sitting
 * inside its Dynamic Zone.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Navigation {
  logoText: string;
  items: NavItem[];
  orderButtonLabel: string;
  orderProductName: string;
  orderPrice: string;
}

export interface Footer {
  description: string;
  credit: string;
  copyright: string;
  navLinks: NavItem[];
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
